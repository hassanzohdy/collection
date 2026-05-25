---
name: mongez-collection-transforming
description: How to reshape, project, and restructure collection items using map, pluck, groupBy, unique, flatten, partition, and related methods.
when_to_use: Use when converting collection items to a new shape, extracting a column of values, grouping by a key, removing duplicates, or splitting into sub-collections.
---

# Transforming a Collection

## When to use

- Mapping items to a new shape or type.
- Extracting a single field from every item (column projection).
- Grouping items by a field value into buckets.
- Removing duplicates from a collection.
- Flattening nested arrays.
- Splitting a collection into two based on a predicate.

## How to use

### `map` — project to a new shape

Returns a new collection of the mapped values. The generic type changes when you supply an explicit type parameter.

```ts
const names = collect(users).map(u => u.name);
// ImmutableCollection<string>

const dtos = collect(users).map<UserDTO>(u => ({ id: u.id, label: u.name }));
```

### `pluck` — extract a single field (or subset of fields)

```ts
// Single field → flat array of values
collect(users).pluck("name");        // ["Ada", "Bob", "Cid"]
collect(orders).pluck("total.price"); // dot-notation works

// Array of fields → array of objects with only those keys
collect(users).pluck(["id", "name"]);
// [{ id: 1, name: "Ada" }, ...]
```

### `select` — keep only specific keys on each item

```ts
collect(users).select("id", "name", "email");
// Each item is reduced to just those three keys.
```

### `groupBy` — bucket items by a field value

Returns a collection of group objects. Each group has the grouping key(s) as properties plus an `items` array containing the members.

```ts
collect(users).groupBy("role");
// [
//   { role: "admin", items: [...] },
//   { role: "user",  items: [...] },
// ]

// Multiple keys
collect(orders).groupBy(["year", "month"]);
// [
//   { year: 2024, month: 1, items: [...] },
//   ...
// ]
```

To operate on the sub-arrays as collections, wrap them:

```ts
collect(users)
  .groupBy("department")
  .map(g => ({
    department: g.department,
    headcount: g.items.length,
    avgAge: collect(g.items).average("age"),
  }));
```

### `unique` — deduplicate by identity or key

```ts
collect([1, 2, 2, 3]).unique();           // [1, 2, 3]
collect(users).unique("email");           // first per unique email
```

### `uniqueList` — keep first occurrence per key value (preserves order)

Like `unique(key)` but explicitly documented as "first encountered wins":

```ts
collect(products).uniqueList("sku");
```

### `flat` / `flatMap` — flatten nested arrays

```ts
collect([[1, 2], [3, 4]]).flat();      // [1, 2, 3, 4]
collect([[1, [2, [3]]]]).flat(2);      // [1, 2, 3]

collect(users).flatMap(u => u.tags);  // all tags from all users in one list
```

### `collectFrom` — hoist a nested array field up

Iterates items, pulls the value at `key`, and if it is an array, spreads it into the result collection. Useful for flattening one level of nested collections.

```ts
collect(orders).collectFrom("lineItems");
// All line items from all orders in a single flat collection.
```

### `partition` — split into two collections

Returns a tuple `[matching, notMatching]`:

```ts
const [active, inactive] = collect(users).partition(u => u.active);
// active.length + inactive.length === users.length
```

### `select` columns then chain

```ts
collect(users)
  .where("active", true)
  .select("id", "name")
  .sortBy("name")
  .all();
```

## Key details / Pitfalls

- All transform methods return a **new collection**; the original is untouched.
- `groupBy` uses `@mongez/reinforcements`' `groupBy` internally and always names the sub-array property `"items"`.
- `pluck` with a string key delegates to reinforcements' `pluck` — it uses `get(item, key)` so dot-notation paths work.
- `map<NewType>` changes the TypeScript generic type; downstream chained methods will reflect the new type.
- `collectFrom(key)` spreads array values but pushes scalar values as-is — useful only when the nested property is reliably an array.
- Keyed string operations (`appendString`, `prependString`, `replaceString`, etc.) use `cloneForSet` internally to shallow-clone plain objects before mutating the key, so the original items are not modified. However, class instances and nested objects are passed through by reference.
