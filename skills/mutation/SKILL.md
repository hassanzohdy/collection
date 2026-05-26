---
name: mongez-collection-mutation
description: |
  Definitive matrix of which `ImmutableCollection` methods mutate in place — `sort`, `reverse` / `flip`, `sortByDesc`, `shift`, `pop` — versus which return a new collection. Covers `clone` / `copy` workarounds and the `toArray()` / `all()` live-reference hazard.
  TRIGGER when: code calls `c.sort`, `c.reverse`, `c.flip`, `c.sortByDesc`, `c.shift`, `c.pop`, `c.clone`, or `c.copy` on an `ImmutableCollection`; user asks "is sort/reverse/shift/pop safe", "why is my original collection changing", "do I need to clone before sorting", "which methods mutate in @mongez/collection", "is toArray a copy"; debugging an unexpected mutation bug on a shared collection.
  SKIP: non-mutating sort by key (`sortBy(key)` and `sortBy({...})`) — use `mongez-collection-sort-group`; insert / remove / replace operations that always return new — use `mongez-collection-overview` for the global picture; understanding what `@mongez/reinforcements` does on its own — that package has no wrapper to mutate.
---

# Mutation reference

**The most important file in this package's docs.** Despite the name `ImmutableCollection`, four methods MUTATE the underlying array. If you don't know which ones, you'll write subtle bugs.

## TL;DR

- Most operations (`map`, `filter`, `push`, `unshift`, `set`, `replace`, `delete`, `unset`, `merge`, `concat`, `slice`, `splice`, `sortBy`, `move`, `swap`, `reorder`, ...) return a NEW collection.
- **`sort()`, `reverse()` (alias `flip`), `shift()`, `pop()` mutate**. `sortByDesc(key)` also mutates (the per-key `sortBy` clones first, but `sortByDesc` doesn't).
- If you need to keep the original, call `.clone()` first, then apply the mutating method.

## Method matrix

### Always returns a NEW collection

| Group | Methods |
|---|---|
| Transform | `map`, `filter`, `reject`, `except`, `not`, `takeWhile`, `removeAll`, `skipWhile`, `rejectFirst`, `exceptFirst`, `rejectLast`, `exceptLast` |
| Insert | `push`, `append`, `pushUnique`, `unshift`, `prepend`, `prependUnique`, `unshiftUnique` |
| Replace at index | `set`, `update`, `replace`, `replaceAll`, `swap`, `move`, `reorder` |
| Remove | `delete`, `unset`, `remove`, `whereNot`, `whereNotEmpty`, etc. (all `where*` variants) |
| Subset | `take`, `limit`, `takeLast`, `takeUntil`, `skip`, `skipTo`, `skipLast`, `skipUntil`, `skipLastUntil`, `skipLastWhile`, `slice`, `splice`, `chunk` |
| Reshape | `sortBy(key)`, `sortBy({...})`, `groupBy`, `partition` (returns `[matches, rest]`), `unique`, `uniqueList`, `pluck`, `select`, `collectFrom`, `collectFromKey` |
| Math/strings/cast | `plus`, `minus`, `multiply`, `divide`, `modulus`, `increment`, `decrement`, `double`, `half`, `even`, `odd`, `evenIndexes`, `oddIndexes`, `appendString`, `prependString`, `concatString`, `replaceString`, `replaceAllString`, `removeString`, `removeAllString`, `trim`, `string`, `number`, `boolean` |
| Merge | `merge`, `concat` |
| Clone | `clone`, `copy` |
| Index reads | `getByIndexes`, `exceptIndexes`, `keys`, `values`, `entries`, `indexes` |

### MUTATES the underlying array

| Method | What happens | Workaround |
|---|---|---|
| `sort()` | Delegates to `Array.prototype.sort` on `this.items` directly. The source is reordered in place AND the returned collection wraps the same now-sorted array. | `c.clone().sort()` |
| `reverse()` / `flip()` | Same as `sort` — uses `Array.prototype.reverse`. | `c.clone().reverse()` |
| `sortByDesc(key)` | Comparator-based, but called on `this.items` (no `[...this.items]` clone). | `c.clone().sortByDesc(...)` |
| `shift()` | Pops the first item and returns it. Returns the ITEM (not a collection). | `c.skip(1)` for non-destructive variant |
| `pop()` | Pops the last item and returns it. Returns the ITEM (not a collection). | `c.skipLast(1)` for non-destructive variant |

### Reads/inspects (no mutation, returns a non-collection value)

| Method | Returns |
|---|---|
| `first`, `last`, `end`, `index`, `at` | One item (or `undefined`) |
| `find`, `firstWhere`, `lastWhere`, `value`, `valueAt`, `lastValue`, `get` | One value |
| `includes`, `contains`, `has`, `isEmpty`, `isNotEmpty`, `every`, `some`, `equals` | `boolean` |
| `indexOf`, `lastIndexOf`, `findIndex`, `lastIndex`, `count`, `countValue` | `number` |
| `countBy` | `Record<string, number>` |
| `min`, `max`, `sum`, `average`, `avg`, `median` | `number` |
| `toArray`, `all` | The underlying array (a reference, not a copy) |
| `toString`, `toJson`, `join`, `implode` | A string |
| `reduce`, `reduceRight` | Whatever the reducer returns |

> **Watch out**: `toArray()` / `all()` return the LIVE array reference. Mutating it mutates the collection. Use `[...c]` or `Array.from(c)` if you want a copy.

### Identity / chaining (returns `this`)

| Method | Notes |
|---|---|
| `forEach`, `each` | Returns the same collection — chain after `each(spy)` |
| `tap` | Same — runs a side-effect with the collection, then returns `this` |

## Why the "Immutable" name

The constructor takes a defensive copy of the input. Most operations build a fresh array. But the four hot-path mutators (`sort`, `reverse`, `shift`, `pop`) call the underlying `Array.prototype` methods directly on `this.items` — and those methods mutate-and-return-same-reference. The wrapper does not work around this, so the source array is reordered.

This pre-dates the modern toolkit and is preserved for backward compatibility. The fix is straightforward (clone before delegating to the prototype method) but would be a behavior change for anyone relying on the current semantics.

If you author a pipeline, lean on `sortBy(key)` (which clones), not `sort()`. And avoid `shift()`/`pop()` when you mean "drop one and continue chaining"; use `skip(1)` / `skipLast(1)` instead.

## Examples — what bites people

### Sharing a collection across two pipelines

```ts
const all = collect(users);

const sortedByAge = all.sort((a, b) => a.age - b.age);
// `all` is also now sorted-by-age. Probably not what you wanted.

// FIX:
const sortedByAge2 = all.clone().sort((a, b) => a.age - b.age);
```

### Draining the queue

```ts
const queue = collect(jobs);

while (queue.length > 0) {
  const job = queue.shift();          // OK — mutating queue is intentional
  await process(job);
}
```

`shift()` and `pop()` are useful when you actually want to consume the collection. The hazard is using them where you expected a non-mutating "drop one" operation.

### Sorting a parameter

```ts
function topThree(c: ImmutableCollection<User>) {
  return c.sort((a, b) => b.score - a.score).take(3);
  //         ^^^ mutates the caller's `c`
}

// FIX — clone at the boundary:
function topThree(c: ImmutableCollection<User>) {
  return c.clone().sort((a, b) => b.score - a.score).take(3);
}
```
