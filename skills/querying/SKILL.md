---
name: mongez-collection-querying
description: How to filter and look up items in a collection using where, filter, find, first, last, and the full operator table.
when_to_use: Use when writing any keyed or operator-based filter on a collection, or when looking up a single matching item.
---

# Querying a Collection

## When to use

- Filtering a collection by a field value, comparison, pattern, or type check.
- Finding the first or last item that matches a condition.
- Checking existence, null/undefined status, set membership, or range.

## How to use

### `where` — operator engine

Three call signatures:

```ts
// 1. Key + value (implicit "=" equality)
c.where("active", true);

// 2. Key + operator + value
c.where("age", ">", 18);
c.where("name", "like", "ada");       // case-insensitive substring
c.where("name", "starts with", "A");
c.where("name", "ends with", "a");
c.where("role", "in", ["admin", "mod"]);
c.where("age", "between", [20, 30]);  // inclusive
c.where("score", "between", [0, 100]);

// 3. Operator only (no key — tests the item itself for primitives)
c.where(">=", 18);                    // items that are numbers >= 18
```

#### RegExp shorthand

Pass a `RegExp` as the value and the key check becomes a regex test:

```ts
c.where("name", /^A/);
```

#### Existence vs null vs undefined

| Operator | Matches |
|---|---|
| `"exists"` / `"not exists"` | key is present / absent on the item object |
| `"null"` / `"is null"` | value is strictly `null` |
| `"undefined"` / `"is undefined"` | value is strictly `undefined` |
| `"empty"` / `"is empty"` | value is empty (via `@mongez/supportive-is`) |

```ts
c.where("nickname", "exists");
c.where("deletedAt", "is null");
c.where("config", "is not empty");
```

#### Type checks

```ts
c.where("age", "is", "number");            // typeof itemValue === "number"
c.where("handler", "instanceof", MyClass); // itemValue instanceof MyClass
c.where("flag", "is true");
c.where("flag", "is false");
```

### Convenience `where*` shorthand methods

```ts
c.whereIn("status", ["active", "pending"]);
c.whereBetween("age", [20, 30]);
c.whereNotBetween("score", [0, 50]);
c.whereNot("status", "banned");
c.whereNull("deletedAt");
c.whereNotNull("email");
c.whereEmpty("tags");
c.whereNotEmpty("tags");
c.whereExists("metadata");
c.whereNotExists("legacyId");
```

### `filter` — callback-based

```ts
c.filter(item => item.score > 90 && item.verified);
```

### `reject` / `except`

Returns items for which the callback returns `false` (inverse of `filter`):

```ts
c.reject(item => item.banned);
c.except(item => item.role === "guest"); // alias
```

### `not` — exclude a specific primitive value

```ts
collect([1, 2, 3, null]).not(null); // [1, 2, 3]
```

### `find` — single item by callback

```ts
const user = c.find(u => u.id === 42); // returns item or undefined
```

### `first` / `last`

```ts
c.first(); // first item or undefined
c.last();  // last item or undefined
```

### `firstWhere` / `lastWhere`

Same signature as `where`, but returns the single matched item instead of a collection:

```ts
const admin = c.firstWhere("role", "admin");
const newest = c.lastWhere("status", "active");
const over25 = c.firstWhere("age", ">", 25);
```

## Key details / Pitfalls

- `where` always returns a **new collection** — it never mutates. Chain as many as needed.
- All operators are **string literals** defined in `src/types.ts`. Passing an unrecognised operator returns an empty collection (falls through to `default: return false`).
- Chained `where` calls are **AND** logic — each narrows the previous result. For OR logic, use `filter` with `||` or union two `where` results.
- Keys support **dot notation**: `c.where("address.city", "London")`.
- If items have a `.get(key)` method it is used for all keyed lookups — collection integrates seamlessly with model classes.
- `whereIn` with a single array argument (no key) tests the item itself: `c.whereIn([1, 2, 3])` keeps primitive items whose value is in the list.
