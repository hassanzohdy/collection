---
name: mongez-collection-overview
description: Explains what @mongez/collection is, when to prefer it over plain arrays or @mongez/reinforcements, and how the immutability model works.
when_to_use: Use when deciding whether to introduce the package, when onboarding new contributors, or when a chain of 3+ array operations is being written.
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

`ImmutableCollection` is **immutable by default**: every method that reshapes the data returns a **new** collection and leaves the original unchanged. There are exactly five exceptions that mutate the underlying array:

| Method | Safe alternative |
|---|---|
| `sort(cb?)` | `c.clone().sort(...)` |
| `reverse()` / `flip()` | `c.clone().reverse()` |
| `sortByDesc(key)` | `c.clone().sortByDesc(key)` |
| `shift()` | returns first item without removing; use `c.skip(1)` to drop it |
| `pop()` | returns last item without removing; use `c.skipLast(1)` to drop it |

Note: the source code shows `sort`, `reverse`, and `sortByDesc` all internally spread to a new array before sorting, so they do **not** mutate the stored items in the current implementation — but the README documents them as mutating as a safety note. Rely on `.clone()` before any of these if you need to be certain.

### Item `.get(key)` support

If your items expose a `get(key)` method (model classes, custom record types), the collection uses it for all keyed lookups (`where`, `pluck`, `groupBy`, `sum`, etc.) automatically — no adapter required.

### TypeScript generics

`collect<T>()` and `ImmutableCollection<T>` are fully generic. `map<U>` lets you change the item type mid-pipeline. `where(...)` values are typed `any` because the operator table handles ad-hoc shapes.

### Dot-notation keys

All keyed helpers (`sum`, `max`, `pluck`, `where`, `sortBy`, ...) accept dot-notation paths for nested properties: `"total.price"`, `"address.city"`.
