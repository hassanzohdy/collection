---
name: mongez-collection-mutation
description: |
  Definitive matrix of which `ImmutableCollection` methods mutate in place — `sort`, `reverse` / `flip`, `sortByDesc`, `shift`, `pop` — versus which return a new collection. Covers `clone` / `copy` workarounds and the `toArray()` / `all()` live-reference hazard.
  TRIGGER when: code calls `c.sort`, `c.reverse`, `c.flip`, `c.sortByDesc`, `c.shift`, `c.pop`, `c.clone`, or `c.copy` on an `ImmutableCollection`; user asks "is sort/reverse/shift/pop safe", "why is my original collection changing", "do I need to clone before sorting", "which methods mutate in @mongez/collection", "is toArray a copy"; debugging an unexpected mutation bug on a shared collection.
  SKIP: non-mutating sort by key (`sortBy(key)` and `sortBy({...})`) — use `mongez-collection-sort-group`; insert / remove / replace operations that always return new — use `mongez-collection-overview` for the global picture; understanding what `@mongez/reinforcements` does on its own — that package has no wrapper to mutate.
---

# Mutation reference

**The reference for which methods are safe to call on a shared collection.** `ImmutableCollection` is non-mutating: every reshape returns a NEW collection and leaves the source untouched. The remaining footgun is `toArray()` / `all()`, which return the live underlying array reference.

## TL;DR

- Every reshape (`map`, `filter`, `push`, `unshift`, `set`, `replace`, `delete`, `unset`, `merge`, `concat`, `slice`, `splice`, `sort`, `sortBy`, `sortByDesc`, `reverse`, `flip`, `move`, `swap`, `reorder`, ...) returns a NEW collection. The originals are untouched.
- `shift()` and `pop()` return the first/last ITEM but do NOT remove it — they are non-destructive reads (use `skip(1)` / `skipLast(1)` if you also need to drop the item from a downstream collection).
- `toArray()` / `all()` return the LIVE array reference; mutating the returned array mutates the collection. Use `[...c]` or `Array.from(c)` for a defensive copy.

## Method matrix

### Always returns a NEW collection (source untouched)

| Group | Methods |
|---|---|
| Transform | `map`, `filter`, `reject`, `except`, `not`, `takeWhile`, `removeAll`, `skipWhile`, `rejectFirst`, `exceptFirst`, `rejectLast`, `exceptLast` |
| Insert | `push`, `append`, `pushUnique`, `unshift`, `prepend`, `prependUnique`, `unshiftUnique` |
| Replace at index | `set`, `update`, `replace`, `replaceAll`, `swap`, `move`, `reorder` |
| Remove | `delete`, `unset`, `remove`, `whereNot`, `whereNotEmpty`, etc. (all `where*` variants) |
| Subset | `take`, `limit`, `takeLast`, `takeUntil`, `skip`, `skipTo`, `skipLast`, `skipUntil`, `skipLastUntil`, `skipLastWhile`, `slice`, `splice`, `chunk` |
| Reshape | `sort`, `sortBy(key)`, `sortBy({...})`, `sortByDesc(key)`, `reverse`, `flip`, `groupBy`, `partition` (returns `[matches, rest]`), `unique`, `uniqueList`, `pluck`, `select`, `collectFrom`, `collectFromKey` |
| Math/strings/cast | `plus`, `minus`, `multiply`, `divide`, `modulus`, `increment`, `decrement`, `double`, `half`, `even`, `odd`, `evenIndexes`, `oddIndexes`, `appendString`, `prependString`, `concatString`, `replaceString`, `replaceAllString`, `removeString`, `removeAllString`, `trim`, `string`, `number`, `boolean` |
| Merge | `merge`, `concat` |
| Clone | `clone`, `copy` |
| Index reads | `getByIndexes`, `exceptIndexes`, `keys`, `values`, `entries`, `indexes` |

> `sort`, `reverse`/`flip`, and `sortByDesc` all clone `this.items` internally before delegating to `Array.prototype.sort`/`reverse`, so the source array is never reordered. Earlier versions of this package mutated in place; that was fixed (see `CHANGELOG.md` → "Unreleased").

### Returns a single item without removing it

| Method | Returns | Notes |
|---|---|---|
| `shift()` | First item (or `undefined`) | Despite the name, does NOT remove. Use `c.skip(1)` if you also want the rest. |
| `pop()` | Last item (or `undefined`) | Despite the name, does NOT remove. Use `c.skipLast(1)` if you also want the rest. |

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

The constructor takes a defensive copy of the input, and every reshape — including `sort`, `reverse`/`flip`, and `sortByDesc` — clones `this.items` before delegating to the native `Array.prototype` method. The source collection is never reordered.

`shift()` / `pop()` deliberately do not remove the returned item, so they are also safe to call on a shared collection. If you want a queue-drain pattern, build your own loop with `skip(1)` to advance, or use a plain mutable array.

## Examples

### Sharing a collection across two pipelines

```ts
const all = collect(users);

const sortedByAge = all.sort((a, b) => a.age - b.age);
// `all` is still in the original order — sort() does not mutate.
```

### Sorting a parameter

```ts
function topThree(c: ImmutableCollection<User>) {
  return c.sort((a, b) => b.score - a.score).take(3);
  //         ^^^ safe — c is not modified
}
```

### Live-array hazard via `toArray()` / `all()`

```ts
const c = collect([1, 2, 3]);
const arr = c.all();
arr.push(99);             // mutates the collection too — same reference
c.length;                 // 4

// FIX — defensive copy:
const arr2 = [...c];      // independent
```
