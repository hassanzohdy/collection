---
description: "Use @mongez/collection to turn an array or iterable into an ImmutableCollection and compose immutable, chainable operations: filter records with where, reshape them with map/pluck/select, sort or group them, then take a page or aggregate a result. Start with collect(items), keep the returned collection in a pipeline, and call all() only at the boundary. The package covers collection operations, not HTTP fetching, React state, database queries, or schema validation; use the appropriate application layer for those concerns."
---

# @mongez/collection

`ImmutableCollection` gives arrays a fluent API while returning a new collection
from reshape operations. It accepts arrays and other iterables through `collect`.

## The 80% path

```ts
import { collect } from "@mongez/collection";

const visibleNames = collect(users)
  .where("active", true)
  .sortBy("name")
  .pluck("name")
  .take(20)
  .all();
```

1. Create the collection with `collect(items)`; see [Construction](./construction/SKILL.md).
2. Filter records with [Querying](./querying/SKILL.md), or use the complete [`where`](./where/SKILL.md) operator reference.
3. Reshape fields or nested values with [Transforming](./transforming/SKILL.md).
4. Order, bucket, partition, or deduplicate with [Sort, group, and unique](./sort-group/SKILL.md).
5. Limit a result or divide it into batches with [Pagination and slicing](./pagination/SKILL.md).
6. Finish with `all()` (or iterate the collection); see [Built-ins and conversion](./builtins/SKILL.md). `all()` exposes the backing array, so use `[...collection]` when a defensive copy is needed.

## Topics

- [Overview](./overview/SKILL.md) — package model, boundaries, and chaining.
- [Construction](./construction/SKILL.md) — `collect`, iterables, and factories.
- [Querying](./querying/SKILL.md) and [`where`](./where/SKILL.md) — predicates, lookup, and operators.
- [Transforming](./transforming/SKILL.md) — projection, flattening, and partitions.
- [Sort, group, and unique](./sort-group/SKILL.md) — ordering, buckets, and deduplication.
- [Pagination and slicing](./pagination/SKILL.md) — take, skip, slice, chunk, random, and shuffle.
- [Math](./math/SKILL.md) or [Math aggregation](./math-aggregation/SKILL.md) — totals, counts, arithmetic, and parity.
- [Strings](./strings/SKILL.md) — per-item string changes and casts.
- [Mutation reference](./mutation/SKILL.md) — immutability and live-array caveats.
- [Recipes](./recipes/SKILL.md) — composed application patterns.

## Not this package →

- Need HTTP requests, interceptors, or transport errors? Use `@mongez/http`.
- Need application or React state? Use `@mongez/atom` or `@mongez/react-atom`.
- Need database querying or persistence? Use your server data layer, such as `@mongez/cascade`.
- Need standalone object, array, or string helpers without a chainable wrapper? Use `@mongez/reinforcements`.
