---
name: mongez-collection-pagination
description: |
  How to paginate, chunk, skip, and take items from an `ImmutableCollection` — `take`, `limit`, `takeLast`, `takeUntil`, `takeWhile`, `skip`, `skipTo`, `skipLast`, `skipUntil`, `skipLastUntil`, `skipLastWhile`, `skipWhile`, `slice`, `splice`, `chunk`, `random`, `shuffle` — plus the `(page-1)*perPage` recipe and the fact that there's no built-in `paginate` with totals.
  TRIGGER when: code calls `c.take`, `c.limit`, `c.takeLast`, `c.takeUntil`, `c.takeWhile`, `c.skip`, `c.skipTo`, `c.skipLast`, `c.skipUntil`, `c.skipLastUntil`, `c.skipLastWhile`, `c.skipWhile`, `c.slice`, `c.splice`, `c.chunk`, `c.random`, or `c.shuffle` on an `ImmutableCollection`; user asks "how do I paginate a collection", "how to take the first N / last N / page N", "how to batch into chunks of 100", "how to grab a random sample / shuffle".
  SKIP: page metadata (total / hasNext / totalPages) — not built-in, manually compute from `.length`; chunk a plain array without a wrapper — use `chunk` from `mongez-reinforcements-arrays`; sorting before pagination — chain `sortBy` from `mongez-collection-sort-group` first.
---

# Pagination & Slicing

## When to use

- Implementing page-by-page navigation over a local collection.
- Breaking a large array into equal-sized batches for processing.
- Taking the first N or last N results after sorting or filtering.
- Skipping an offset before taking a window.

## How to use

### `take` / `limit` — first N items

```ts
collect(items).take(10);    // first 10
collect(items).limit(10);   // alias
```

### `takeLast` — last N items

```ts
collect(items).takeLast(5); // last 5
```

### `skip` — drop first N items

```ts
collect(items).skip(20);    // everything after the first 20
```

### `skipLast` — drop last N items

```ts
collect(items).skipLast(3); // everything except the last 3
```

### Combining `skip` + `take` for offset pagination

```ts
// Page 1 (first 10)
collect(items).skip(0).take(10);

// Page 2 (items 11–20)
collect(items).skip(10).take(10);

// Generic helper
function page<T>(c: ImmutableCollection<T>, pageNum: number, perPage: number) {
  return c.skip((pageNum - 1) * perPage).take(perPage);
}

page(collect(allOrders), 3, 25).all(); // 25 items from page 3
```

### `chunk` — split into equal-sized sub-collections

Returns a collection of collections (or a collection of plain arrays when `returnAsCollection` is `false`).

```ts
const pages = collect(items).chunk(100);
// ImmutableCollection<ImmutableCollection<Item>>

pages.forEach(batch => processBatch(batch.all()));

// As plain arrays
const rawChunks = collect(items).chunk(100, false);
// ImmutableCollection<Item[]>
```

`chunk` size determines how many items go in each bucket. The last bucket may contain fewer items if the total is not evenly divisible.

### `slice` — arbitrary range

Mirrors `Array.prototype.slice` semantics (start inclusive, end exclusive, negative indices supported):

```ts
collect(items).slice(5, 15);   // items at index 5 through 14
collect(items).slice(-3);      // last 3 items
```

### `splice` — copy with items removed (non-mutating)

Works like `Array.prototype.splice` but returns a new collection rather than modifying in place:

```ts
collect(items).splice(2, 3);  // remove 3 items starting at index 2
```

### `skipUntil` / `takeUntil` — predicate-based boundary

```ts
// Skip until the predicate first returns true (keep from that item onward)
collect(events).skipUntil(e => e.type === "start");

// Take until the predicate first returns true (drop from that item onward)
collect(events).takeUntil(e => e.type === "end");
```

### `skipLast` + `skipLastUntil` — trim the tail

```ts
collect(items).skipLast(2);
// All items except the last 2.

collect(items).skipLastUntil(item => item.id === targetId);
// All items up to (but not including) the first one matching the predicate.
```

## Key details / Pitfalls

- All slicing methods are **non-mutating** and return new collections.
- `skip(n)` internally uses `Array.prototype.slice(n)`, so `skip(0)` returns a full shallow copy.
- `chunk` with `returnAsCollection = true` (default) wraps each bucket in its own `ImmutableCollection` so you can keep chaining on each batch. Pass `false` if you only need the raw arrays.
- There is **no built-in `paginate` method** that carries total/page metadata. The recommended pattern is the `skip`/`take` combination shown above plus manual total tracking:

```ts
const all = collect(rawData).where("active", true);
const total = all.length;
const currentPage = all.skip((page - 1) * perPage).take(perPage);
```

- `skipUntil` and `takeUntil` use `findIndex` internally, so they stop at the **first** item that satisfies the predicate. If no item matches, `skipUntil` returns an empty collection and `takeUntil` returns a full copy.
- Negative indices in `slice` follow native JS semantics: `slice(-5)` gives the last 5 items.
