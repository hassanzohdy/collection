---
name: mongez-collection-recipes
description: |
  Idiomatic multi-method pipelines for `@mongez/collection` — top-N (`where` + `sortByDesc` + `take` + `pluck`), pagination (`skip` + `take`), bucket-then-aggregate (`groupBy` + `map` + `sum`), partition for dual pipelines, dedupe-and-project (`uniqueList` + `pluck`), `tap` for side-effects mid-chain, safe sort via `clone`, chunk-based batch processing, Map → collection conversion, lookup index via `reduce`, and intentional queue draining via `shift`.
  TRIGGER when: user asks "show me a worked example with @mongez/collection", "how do I do top-10 customers", "how to compute totals per group", "how to safely sort without mutating", "how to batch upload in chunks", "how to convert a Map into a collection", "how to drain a queue"; user wants a full chained pipeline rather than a single method.
  SKIP: single-method lookup — use the focused skill (`mongez-collection-where`, `mongez-collection-math`, `mongez-collection-sort-group`, `mongez-collection-pagination`, `mongez-collection-transforming`, `mongez-collection-mutation`, etc.); standalone array helpers — use `mongez-reinforcements-arrays` (no wrapper, no chain); React state — use `@mongez/atom`'s `atomCollection`.
---

# Recipes

Cross-feature compositions and idiomatic chains. Each recipe is shaped around what you're trying to *do*; the chained methods follow from the goal.

## Top 10 highest-spending customers

A dashboard widget showing the top customers by total spend, scoped to paid orders only.

```ts
collect(orders)
  .where("status", "paid")
  .sortByDesc("total")
  .take(10)
  .pluck("customerId")
  .all();
```

`pluck` is the lazy alternative to a `.map(o => o.customerId)` — same result, less ceremony.

## Page through a long list

The list page is rendering page 3 of 20-per-page results. One small helper keeps the call sites clean.

```ts
function paginate<T>(c: ImmutableCollection<T>, page: number, perPage: number) {
  return c.skip((page - 1) * perPage).take(perPage);
}

paginate(collect(products), 3, 20);
```

For server-side pagination, see also `mongez-collection-pagination` for the `paginate` method that returns metadata alongside the items.

## Find active users seen in the last week

You're filtering for "currently engaged" users — both flagged active and seen recently — and showing the most recent first.

```ts
const recentActive = collect(users)
  .where("active", true)
  .where("lastSeenAt", ">", Date.now() - 7 * 86400_000)
  .sortByDesc("lastSeenAt");
```

Multiple `where` calls AND together. For OR semantics use a single `filter` with a function predicate.

## Total spend per customer

You're producing a report: one row per customer, sorted by their total spend across all paid orders.

```ts
collect(orders)
  .groupBy("customer")
  .map(bucket => ({
    customer: bucket.customer,
    total: collect(bucket.items).sum("amount"),
  }))
  .sortByDesc("total");
```

`groupBy` returns one bucket per distinct key with the matching items inside. `sum("amount")` sums a numeric field across the bucket.

## Split tasks into pending and completed, then route each elsewhere

One source list, two downstream pipelines — instead of running two filters with overlapping work, partition once.

```ts
const [pending, completed] = collect(tasks).partition(t => t.status === "open");

console.log(`Pending: ${pending.length}`);
console.log(`Done:    ${completed.length}`);

pending.where("priority", "high").forEach(notify);
completed.sortByDesc("completedAt").take(10).forEach(showInActivity);
```

`partition` walks the list exactly once. The result is a destructurable tuple of two collections.

## Pick one entry per email, then keep just the IDs

A signup-registrations table where users may have registered multiple times under the same email. You want the first registration per email, projected down to just the IDs.

```ts
collect(registrations)
  .uniqueList("email")
  .pluck("id")
  .all();
```

`uniqueList` keeps the *first* item for each unique key, in source order. For "keep the most recent" semantics, sort by date descending before `uniqueList`.

## Log an intermediate count without breaking the chain

You're debugging a long filter pipeline and want to see how many items survive a particular `where`. `tap` runs a side effect and passes the collection through unchanged.

```ts
collect(events)
  .where("type", "click")
  .tap(c => console.log(`Click events: ${c.length}`))
  .where("payload.target", "starts with", "/products/")
  .map(e => e.payload.target);
```

Useful inline-instrumentation that drops in and out without restructuring the pipeline.

## Sort a list without mutating the original

All sort variants (`sort`, `sortBy`, `sortByDesc`) clone internally, so the source collection is never reordered. Safe to use even when something else holds a reference.

```ts
function sortedCopy<T>(c: ImmutableCollection<T>, comparator: (a: T, b: T) => number) {
  return c.sort(comparator);       // source `c` is untouched
}

function byAge<T>(c: ImmutableCollection<T>) {
  return c.sortBy("age");          // source preserved
}
```

Compared to `Array.prototype.sort` (which mutates), this lets you sort defensively without first cloning.

## Upload a list in batches of 100

You're shipping thousands of records to an API that rate-limits per request. Split into batches, await each one in sequence.

```ts
async function uploadInBatches<T>(items: ImmutableCollection<T>, batchSize = 100) {
  const batches = items.chunk(batchSize, false);
  for (const batch of batches) {
    await uploadBatch(batch);
  }
}
```

For parallel batch uploads with bounded concurrency, see `pMap` from `@mongez/reinforcements`.

## Rename a user without mutating the list

You have a list of users and want to update one of them by id — keeping the others untouched and the result a new immutable collection.

```ts
const idx = users.findIndex(u => u.id === id);
const updated = users.set(idx, { ...users.at(idx), name: "Renamed" });
```

Or the bulk-by-predicate form:

```ts
const updated = collect(users).map(u =>
  u.id === id ? { ...u, name: "Renamed" } : u,
);
```

Both produce a new collection; the original is untouched.

## Chain over a Map's entries

You have a `Map` and want collection-style chaining over its entries.

```ts
import { collect } from "@mongez/collection";

const m = new Map([
  ["a", 1],
  ["b", 2],
]);

// As tuples
collect.fromIterator(m).all();          // [["a", 1], ["b", 2]]

// As objects
collect.fromIterator(m).map(([key, value]) => ({ key, value }));
```

`fromIterator` accepts any iterable — Maps, Sets, generator functions, async generators (in their sync-iterable form).

## Build an `id → user` lookup table

Hot path needs O(1) lookups by id. Reduce the list into an index once and keep it around.

```ts
const byId = collect(users).reduce<Record<number, User>>(
  (acc, u) => ({ ...acc, [u.id]: u }),
  {},
);

byId[42];     // O(1) lookup
```

For frequent updates, switch to a `Map<number, User>` — the spread-into-accumulator pattern shown here is cheap to *build* once but expensive to mutate.

## Drain a queue one item at a time

`shift()` and `pop()` on a collection return the first/last item *without* removing it (collections are immutable). A naive `while (queue.length > 0)` loop would spin forever — you need to advance the collection or drop the wrapper.

```ts
let queue = collect(jobs);
while (queue.length > 0) {
  const job = queue.shift();        // read the head…
  queue = queue.skip(1);            // …then advance the collection
  await process(job);
}
```

Simpler for true queue semantics — drop the wrapper:

```ts
const queue2 = [...collect(jobs)];
while (queue2.length > 0) {
  const job = queue2.shift();       // native Array.shift() mutates queue2 in place
  await process(job);
}
```

Native arrays are the better fit when you genuinely want destructive `shift`. Collections shine when the workload is functional — filter / sort / pluck / group — not mutate-and-drain.
