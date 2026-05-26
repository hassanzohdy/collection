---
name: mongez-collection-recipes
description: |
  Idiomatic multi-method pipelines for `@mongez/collection` — top-N (`where` + `sortByDesc` + `take` + `pluck`), pagination (`skip` + `take`), bucket-then-aggregate (`groupBy` + `map` + `sum`), partition for dual pipelines, dedupe-and-project (`uniqueList` + `pluck`), `tap` for side-effects mid-chain, safe sort via `clone`, chunk-based batch processing, Map → collection conversion, lookup index via `reduce`, and intentional queue draining via `shift`.
  TRIGGER when: user asks "show me a worked example with @mongez/collection", "how do I do top-10 customers", "how to compute totals per group", "how to safely sort without mutating", "how to batch upload in chunks", "how to convert a Map into a collection", "how to drain a queue"; user wants a full chained pipeline rather than a single method.
  SKIP: single-method lookup — use the focused skill (`mongez-collection-where`, `mongez-collection-math`, `mongez-collection-sort-group`, `mongez-collection-pagination`, `mongez-collection-transforming`, `mongez-collection-mutation`, etc.); standalone array helpers — use `mongez-reinforcements-arrays` (no wrapper, no chain); React state — use `@mongez/atom`'s `atomCollection`.
---

# Recipes

Cross-feature compositions and idiomatic chains.

## Top-N

```ts
// Top 10 highest-spending customers
collect(orders)
  .where("status", "paid")
  .sortByDesc("total")
  .take(10)
  .pluck("customerId")
  .all();
```

## Paginate

```ts
function paginate<T>(c: ImmutableCollection<T>, page: number, perPage: number) {
  return c.skip((page - 1) * perPage).take(perPage);
}
```

## Active + recent

```ts
const recentActive = collect(users)
  .where("active", true)
  .where("lastSeenAt", ">", Date.now() - 7 * 86400_000)
  .sortByDesc("lastSeenAt");
```

## Bucket then aggregate

```ts
// Total spend per customer
collect(orders)
  .groupBy("customer")
  .map(bucket => ({
    customer: bucket.customer,
    total: collect(bucket.items).sum("amount"),
  }))
  .sortByDesc("total");
```

## Partition for two pipelines

```ts
const [pending, completed] = collect(tasks).partition(t => t.status === "open");

console.log(`Pending: ${pending.length}`);
console.log(`Done:    ${completed.length}`);

// Different downstream pipelines per bucket:
pending.where("priority", "high").forEach(notify);
completed.sortByDesc("completedAt").take(10).forEach(showInActivity);
```

## Dedupe by key, then project

```ts
// Pick the first registration per email, then just the IDs:
collect(registrations)
  .uniqueList("email")
  .pluck("id")
  .all();
```

## Side-effect during a chain (`tap`)

```ts
collect(events)
  .where("type", "click")
  .tap(c => console.log(`Click events: ${c.length}`))
  .where("payload.target", "starts with", "/products/")
  .map(e => e.payload.target);
```

## Safe sort (avoid the mutation hazard)

```ts
function sortedCopy<T>(c: ImmutableCollection<T>, comparator: (a: T, b: T) => number) {
  return c.clone().sort(comparator);
}
```

For key-based sorts you don't need `clone()` — `sortBy(key)` clones internally:

```ts
function byAge<T>(c: ImmutableCollection<T>) {
  return c.sortBy("age");          // safe — source preserved
}
```

## Chunk for batch processing

```ts
async function uploadInBatches<T>(items: ImmutableCollection<T>, batchSize = 100) {
  const batches = items.chunk(batchSize, false);
  for (const batch of batches) {
    await uploadBatch(batch);
  }
}
```

## Replace pieces of a list, immutably

```ts
const updated = users.set(
  users.findIndex(u => u.id === id),
  { ...users.at(idx), name: "Renamed" },
);
```

For shorthand:

```ts
// Bulk-replace by predicate:
const updated = collect(users).map(u => u.id === id ? { ...u, name: "Renamed" } : u);
```

## Convert a Map to a collection

```ts
import { collect } from "@mongez/collection";

const m = new Map([
  ["a", 1],
  ["b", 2],
]);

// As tuples
collect.fromIterator(m).all();                                 // [["a", 1], ["b", 2]]

// As objects
collect.fromIterator(m).map(([key, value]) => ({ key, value }));
```

## Build a lookup index

```ts
const byId = collect(users).reduce<Record<number, User>>(
  (acc, u) => ({ ...acc, [u.id]: u }),
  {},
);

byId[42];  // O(1) lookup
```

## Drain a queue (intentional mutation)

```ts
const queue = collect(jobs);
while (queue.length > 0) {
  const job = queue.shift();      // mutates queue in place — what we want here
  await process(job);
}
```
