---
name: mongez-collection-builtins
description: |
  `Array.prototype` parity methods on `ImmutableCollection` — `map`, `filter`, `flat`, `flatMap`, `reduce`, `reduceRight`, `find`, `findIndex`, `indexOf`, `lastIndexOf`, `includes`, `contains`, `every`, `some`, `join`, `implode`, `forEach`, `each`, `keys`, `values`, `entries`, `indexes`, `toArray`, `all`, `toJson`, `toString`, `takeWhile`, `removeAll`. Documents the `reduce(cb)` NaN pitfall and the live-array `toArray()` reference quirk.
  TRIGGER when: code calls any of `c.map`, `c.filter`, `c.flat`, `c.flatMap`, `c.reduce`, `c.reduceRight`, `c.find`, `c.findIndex`, `c.indexOf`, `c.lastIndexOf`, `c.includes`, `c.contains`, `c.every`, `c.some`, `c.join`, `c.implode`, `c.forEach`, `c.each`, `c.keys`, `c.values`, `c.entries`, `c.indexes`, `c.toArray`, `c.all`, `c.toJson`, `c.toString`, `c.takeWhile`, `c.removeAll` on an `ImmutableCollection`; user asks "how do I map / filter / reduce a collection", "why is reduce returning NaN", "how do I unwrap to a plain array", "is toArray a copy"; file iterates / spreads / `Array.from`s a collection.
  SKIP: operator-based filtering (`where(...)`) — use `mongez-collection-where` or `mongez-collection-querying`; aggregate math (`sum`/`avg`/`min`/`max`) — use `mongez-collection-math`; `pluck` / `select` / `groupBy` / `partition` — use `mongez-collection-transforming` or `mongez-collection-sort-group`; standalone array helpers without `@mongez/collection` — use `mongez-reinforcements-arrays` instead.
---

# Array-prototype parity

Every method that has a matching `Array.prototype` is documented here. They all delegate to the underlying array and produce a new collection (for transforms) or a scalar value (for reads).

## Transforms (return a new collection)

```ts
c.map<U>(cb: (item: T, index: number) => U): ImmutableCollection<U>
c.filter(cb: (item: T, index: number) => boolean): ImmutableCollection<T>
c.flat(depth?: number): ImmutableCollection<any>
c.flatMap(cb: (item: T, index: number) => any): ImmutableCollection<any>
c.takeWhile(cb): ImmutableCollection<T>          // alias for filter
c.removeAll(cb): ImmutableCollection<T>          // alias for filter (confusing name)
```

```ts
collect([1, 2, 3]).map(n => n * 2);                       // [2, 4, 6]
collect([1, 2, 3]).filter(n => n > 1);                    // [2, 3]
collect([1, [2, 3], [4]]).flat();                         // [1, 2, 3, 4]
collect([1, 2, 3]).flatMap(n => [n, n + 100]);            // [1, 101, 2, 102, 3, 103]
```

> `removeAll` is **not** a remove operation — it's a filter that KEEPS the matching items. Despite the name, it's the same as `filter`. Use `reject(...)` for the inverse.

## Reads (return a scalar)

```ts
c.reduce<Acc>(cb, initialValue?): Acc
c.reduceRight(cb, initialValue?): any
c.find(cb): T | undefined
c.findIndex(cb): number
c.indexOf(item, fromIndex?): number
c.lastIndexOf(item, fromIndex?): number
c.includes(item): boolean
c.contains(item): boolean           // alias
c.every(cb): boolean
c.some(cb): boolean
c.join(separator?): string
c.implode(separator?): string       // alias
```

```ts
collect([1, 2, 3, 4]).reduce((acc, n) => acc + n, 0);     // 10
collect([1, 2, 3, 4]).reduce((acc, n) => acc + n);        // 10 — also works
collect([1, 2, 3]).find(n => n > 1);                      // 2
collect([1, 2, 3]).every(n => n > 0);                     // true
collect([1, 2, 3]).join("-");                             // "1-2-3"
```

`reduce(cb)` (no `initialValue`) preserves native `Array.prototype.reduce` semantics — the wrapper uses `arguments.length` to decide whether to forward `initialValue`, so `items[0]` is used as the accumulator when none is supplied. Calling `reduce` on an empty collection with no initial value still throws `TypeError`, matching the native behavior.

## Iteration / shape

```ts
c.forEach(cb): this           // executes cb for each item, returns the collection
c.each(cb): this              // alias for forEach
c.keys(): ImmutableCollection<number>     // [0, 1, 2, ...]
c.values(): ImmutableCollection<T>
c.entries(): ImmutableCollection<[number, T]>
c.indexes(): ImmutableCollection<number>  // same as keys()
c.length: number                          // getter
```

```ts
collect(["a", "b", "c"]).keys().all();    // [0, 1, 2]
collect(["a", "b", "c"]).entries().all(); // [[0, "a"], [1, "b"], [2, "c"]]
```

## for-of / spread / Array.from

A collection IS an Iterable.

```ts
const c = collect([1, 2, 3]);
for (const n of c) /* ... */;
[...c];                  // [1, 2, 3]
Array.from(c);           // [1, 2, 3]
```

## Conversion

```ts
c.toArray(): T[]                     // returns the live reference (mutating it mutates the collection)
c.toArray(mapper): U[]               // maps before returning
c.all(): T[]                         // alias for toArray()
c.toString(): string                 // Array.prototype.toString semantics
c.toJson(): string                   // JSON.stringify(items)
c.join(sep?): string
```
