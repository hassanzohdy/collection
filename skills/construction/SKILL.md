---
name: mongez-collection-construction
description: |
  How to create an `ImmutableCollection` using `collect()`, `new ImmutableCollection()`, `collect.create()`, and `collect.fromIterator()` — including iterable inputs (Set, Map, generator) and seeded-length factories.
  TRIGGER when: code imports `collect`, `ImmutableCollection`, `collect.create`, `collect.fromIterator`, or `ImmutableCollection.fromIterator` / `ImmutableCollection.create` from `@mongez/collection`; user asks "how do I create a collection", "how to wrap an array / Set / Map / generator", "how to seed N items", "how to make a collection from an iterable"; `import { collect, ImmutableCollection } from "@mongez/collection"`.
  SKIP: operating on an already-built collection (filter / map / sort / aggregate) — use the operation-specific skills (`mongez-collection-querying`, `mongez-collection-transforming`, etc.); `@mongez/reinforcements` standalone helpers — use `mongez-reinforcements-arrays` for one-shot helpers without a wrapper.
---

# Construction

## Factories

```ts
import { collect, ImmutableCollection } from "@mongez/collection";

// Most common: a function call.
const c = collect([1, 2, 3]);

// Or directly:
const c2 = new ImmutableCollection([1, 2, 3]);
```

Both produce `ImmutableCollection<T>`. The `collect` function additionally exposes static helpers on itself:

```ts
collect.create(3, 0);           // [0, 0, 0]
collect.fromIterator(set);      // collection from any Iterable
```

## Signatures

```ts
collect<T>(items?: T[] | ImmutableCollection<T>): ImmutableCollection<T>

class ImmutableCollection<T> {
  constructor(items?: T[] | ImmutableCollection<T>)

  static fromIterator<T>(iterable: Iterable<any>): ImmutableCollection<T>
  static create<T>(length: number, initialValue?: T | ((index: number) => T)): ImmutableCollection<T>
}
```

## Behaviors worth knowing

- The constructor **clones the input array** (`this.items = [...items]`), so mutating the source after construction does not leak in. Initial items are independent.
- Passing another `ImmutableCollection` clones its items via the same constructor path — no shared reference.
- Passing anything that is not an array or an `ImmutableCollection` throws `Invalid items type`. This is helpful: a typo like `collect({ x: 1 })` fails loudly.
- Calling `collect()` with no argument is `collect([])` — a fresh empty collection.

## `create(length, initialValue)`

Three forms:

```ts
collect.create(3);               // [undefined, undefined, undefined]
collect.create(3, 0);            // [0, 0, 0]
collect.create(3, i => i * 10);  // [0, 10, 20]
```

When `initialValue` is a function, it's called with the index — useful for synthetic test data.

## `fromIterator(iterable)`

Works with any `Iterable`. Arrays, Sets, Maps (note: Maps iterate as `[key, value]` tuples), generators, custom iterables.

```ts
const set = new Set([1, 2, 3]);
collect.fromIterator(set).all();     // [1, 2, 3]

function* gen() { yield 1; yield 2; }
collect.fromIterator(gen()).all();   // [1, 2]
```

## Iteration back out

A collection is itself iterable. Spread, `for-of`, and `Array.from` all work:

```ts
const c = collect([1, 2, 3]);
for (const n of c) console.log(n);
[...c];                              // [1, 2, 3]
Array.from(c);                       // [1, 2, 3]
```
