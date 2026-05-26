---
name: mongez-collection-overview
description: |
  Explains what `@mongez/collection` is, when to prefer it over plain arrays or `@mongez/reinforcements`, and how the `ImmutableCollection` immutability model works.
  TRIGGER when: code imports `collect` or `ImmutableCollection` from `@mongez/collection`; user asks "what is @mongez/collection", "should I use collect or reinforcements", "how does the immutability work", "when do I reach for a fluent chain"; file is about to wrap an array in `collect(...)` or chain 3+ array ops.
  SKIP: deep dives into a specific method group — use `mongez-collection-querying` / `mongez-collection-math` / `mongez-collection-sort-group` / `mongez-collection-pagination` / `mongez-collection-transforming` / `mongez-collection-strings` / `mongez-collection-mutation` instead; `@mongez/reinforcements` has lighter array helpers (`chunk`, `unique`, `sum`, etc.) — point users to `mongez-reinforcements-arrays` for those; React state / atoms — use `@mongez/atom`'s `atomCollection`.
---

# @mongez/collection — Overview

## When to use

Reach for `@mongez/collection` when:

- You need to **chain 3 or more** array operations in a readable pipeline.
- You need **operator-based filtering** (`where("age", ">", 25)`) — plain arrays and `@mongez/reinforcements` have no equivalent.
- You want a Laravel Collection-style fluent API over an array.
- The array is processed conditionally, uses `tap` for side-effects, or is partitioned mid-pipeline.

Prefer `@mongez/reinforcements` (standalone helpers) instead when:

- You only need one or two helpers — no wrapper allocation per call.
- Tree-shaking matters and you can import single utilities.
- You are composing in a functional / Lodash style (`sum(pluck(arr, "total"))`).

Prefer a plain `Array` when performance is critical and no fluent chaining is needed.

## How to use

```ts
import { collect } from "@mongez/collection";
import { ImmutableCollection } from "@mongez/collection"; // class import

// From an array
const c = collect([1, 2, 3]);

// From another collection
const c2 = collect(c);

// Create N items (index callback or fixed value)
const slots = ImmutableCollection.create(5, i => ({ slot: i }));
collect.create(5, 0); // [0, 0, 0, 0, 0]

// From any iterable (Set, Map entries, generator)
collect.fromIterator(new Set([1, 2, 3]));
ImmutableCollection.fromIterator(someGenerator());

// Terminate: .all() / .toArray() unwrap to a plain array
const arr = collect([1, 2, 3]).map(x => x * 2).all(); // [2, 4, 6]
```

A collection is also a native `Iterable`, so spread, destructuring, `for-of`, and `Array.from` all work directly without calling `.all()`.

```ts
const c = collect([1, 2, 3]);
[...c];           // [1, 2, 3]
Array.from(c);    // [1, 2, 3]
for (const n of c) console.log(n);
```

## Key details / Pitfalls

### Immutability model

`ImmutableCollection` is **immutable by default**: every method that reshapes the data returns a **new** collection and leaves the original unchanged. The two `Array.prototype`-style item readers are non-destructive:

| Method | Behavior |
|---|---|
| `sort(cb?)` | Clones internally; returns a new sorted collection. Original is untouched. |
| `reverse()` / `flip()` | Clones internally; returns a new reversed collection. |
| `sortByDesc(key)` | Clones internally; returns a new collection sorted descending. |
| `shift()` | Returns the first item **without removing** it. Use `c.skip(1)` to drop it. |
| `pop()` | Returns the last item **without removing** it. Use `c.skipLast(1)` to drop it. |

The one remaining sharp edge is `toArray()` / `all()`, which return the live underlying array (see [`builtins`](../builtins/SKILL.md)). Use `[...c]` or `Array.from(c)` if you need a defensive copy.

### Item `.get(key)` support

If your items expose a `get(key)` method (model classes, custom record types), the collection uses it for all keyed lookups (`where`, `pluck`, `groupBy`, `sum`, etc.) automatically — no adapter required.

### TypeScript generics

`collect<T>()` and `ImmutableCollection<T>` are fully generic. `map<U>` lets you change the item type mid-pipeline. `where(...)` values are typed `any` because the operator table handles ad-hoc shapes.

### Dot-notation keys

All keyed helpers (`sum`, `max`, `pluck`, `where`, `sortBy`, ...) accept dot-notation paths for nested properties: `"total.price"`, `"address.city"`.
