---
name: mongez-collection-sort-group
description: |
  How to sort, group, partition, deduplicate, and reorder items in an `ImmutableCollection` — `sort`, `sortBy`, `sortByDesc`, `groupBy`, `partition`, `unique`, `uniqueList`, `swap`, `move`, `reorder`, `reverse`, `flip`. Covers stability, multi-key `sortBy({...})`, the `unique` vs `uniqueList` shape difference, and which sort variants mutate.
  TRIGGER when: code calls `c.sort`, `c.sortBy`, `c.sortByDesc`, `c.groupBy`, `c.partition`, `c.unique`, `c.uniqueList`, `c.swap`, `c.move`, `c.reorder`, `c.reverse`, or `c.flip` on an `ImmutableCollection`; user asks "how do I sort by a field / multiple keys", "ascending vs descending", "how to group by role / category", "how to split active vs inactive", "how to dedupe by email", "how to swap two positions / reorder a list".
  SKIP: mutation safety details for `sort` / `reverse` / `sortByDesc` — use `mongez-collection-mutation` for the in-depth matrix; column projection after grouping — see `mongez-collection-transforming` for `pluck` / `select`; standalone `groupBy` / `unique` without a wrapper — use `mongez-reinforcements-arrays` (lighter helpers); shuffle / random — see `mongez-collection-pagination`.
---

# Sort / group / partition / unique

## Sort

```ts
c.sort(cb?): ImmutableCollection<T>                      // Array.prototype.sort
c.sortBy(key: string): ImmutableCollection<T>            // ascending by key (dot-notation OK)
c.sortBy({ [key]: "asc" | "desc" }): ImmutableCollection<T>  // multi-key
c.sortByDesc(key: string): ImmutableCollection<T>        // descending by key
```

> **Mutation hazard**: `sort()`, `sortByDesc(key)`, `reverse()` mutate the underlying array. `sortBy(key)` and `sortBy({...})` clone first and are safe. See [`mutation.md`](./mutation.md).

```ts
collect([3, 1, 2]).sort();
//  [1, 2, 3]

collect(users).sortBy("age");
//  ascending by user.age

collect(users).sortByDesc("createdAt");
//  newest first

collect(users).sortBy({ group: "asc", age: "desc" });
//  group A first; within each group oldest first
```

### Stability

`Array.prototype.sort` is stable in ES2019+ (Node 12+). The comparators in `sortBy` return `0` for equal keys, so input order is preserved within a tie.

## Group

```ts
c.groupBy(key: string | string[]): ImmutableCollection<{ [key]: any; items: T[] }>
```

Returns a collection where each item is an object with the grouping key value(s) plus an `items` array. For multi-key grouping, every key from the array appears on each bucket:

```ts
collect(students).groupBy("class");
//  [
//    { class: "A", items: [...studentsInA] },
//    { class: "B", items: [...studentsInB] },
//  ]

collect(students).groupBy(["class", "grade"]);
//  [
//    { class: "A", grade: 1, items: [{...}] },
//    { class: "B", grade: 2, items: [{...}, {...}] },
//    ...
//  ]
```

Internally delegates to reinforcements' `groupBy(items, keys, "items")` — the third arg names the bucket field.

## Partition

```ts
c.partition(cb): [ImmutableCollection<T>, ImmutableCollection<T>]
```

Splits into two collections in one pass — items where `cb` returns truthy, then the rest.

```ts
const [active, inactive] = collect(users).partition(u => u.active);

active.length + inactive.length === users.length;   // always true
```

## Unique

```ts
c.unique(key?: string): ImmutableCollection
c.uniqueList(key: string): ImmutableCollection<T>     // first object per unique key value
```

> **Important behavior difference**: `unique("key")` returns the VALUES at the key (a flat list of the unique values), not deduped objects. `uniqueList("key")` returns the OBJECTS (one per unique key value).

```ts
collect([
  { name: "Ada", age: 20 },
  { name: "Bob", age: 20 },
  { name: "Cid", age: 25 },
]).unique("age");
//  [20, 25]   — values, not objects

collect([
  { id: 1, name: "Ada" },
  { id: 2, name: "Ada" },
  { id: 3, name: "Bob" },
]).uniqueList("name");
//  [
//    { id: 1, name: "Ada" },
//    { id: 3, name: "Bob" },
//  ]
```

For primitive arrays, `unique()` is unambiguous:

```ts
collect([1, 2, 1, 3, 2]).unique();    // [1, 2, 3]
```

## Reorder helpers

```ts
c.swap(i, j): ImmutableCollection<T>             // exchange two indices
c.move(from, to): ImmutableCollection<T>         // splice-style reposition
c.reorder({ [oldIndex]: newIndex }): ImmutableCollection<T>   // map of old→new positions
c.reverse(): ImmutableCollection<T>              // MUTATES! Clone first.
c.flip(): ImmutableCollection<T>                 // alias for reverse — also mutates
```

```ts
collect([1, 2, 3, 4, 5]).swap(0, 4);
//  [5, 2, 3, 4, 1]

collect([1, 2, 3, 4, 5]).move(0, 4);
//  [2, 3, 4, 5, 1]

collect([1, 2, 3]).reorder({ 0: 2, 1: 1, 2: 0 });
//  [3, 2, 1]
```
