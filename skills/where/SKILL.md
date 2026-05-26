---
name: mongez-collection-where
description: |
  Full reference for the `where(...)` operator-based filter (50+ operators: `=`, `>`, `like`, `between`, `in`, `is`, `instanceof`, `exists`, `empty`, `null`, `regex`, ...) plus shorthand helpers (`whereIn`, `whereNot`, `whereBetween`, `whereNotBetween`, `whereEmpty`, `whereNotEmpty`, `heavy`, `whereNull`, `whereNotNull`, `whereUndefined`, `whereNotUndefined`, `whereExists`, `whereNotExists`) and `firstWhere` / `lastWhere`. Documents the broken primitive-mode and `is undefined` quirks plus the `Operators` constant.
  TRIGGER when: code calls `c.where`, `c.whereIn`, `c.whereNot`, `c.whereBetween`, `c.whereNotBetween`, `c.whereEmpty`, `c.whereNotEmpty`, `c.heavy`, `c.whereNull`, `c.whereNotNull`, `c.whereUndefined`, `c.whereNotUndefined`, `c.whereExists`, `c.whereNotExists`, `c.firstWhere`, `c.lastWhere`, or imports `Operators` / `ComparisonOperator` from `@mongez/collection`; user asks "how do I filter by `>` / `like` / `between` / `in` / `null`", "what operators does where support", "how to use a RegExp with where", "is `where(key, 'is undefined')` broken".
  SKIP: predicate-callback filtering (`filter`, `reject`, `except`, `not`) — use `mongez-collection-querying` or `mongez-collection-builtins`; aggregations or projections downstream of a filter — chain into `mongez-collection-math` or `mongez-collection-transforming`; `@mongez/reinforcements` has NO `where(...)` operator engine — recommend this skill over `mongez-reinforcements-arrays` when the user needs operator filtering.
---

# `where(...)` — operator-based filtering

`where(...)` is the workhorse filter. It supports three argument shapes and ~50 operators.

## Signatures

```ts
// 1. Equality on a keyed value:
c.where(key: string, value: any): ImmutableCollection<T>

// 2. Operator on a keyed value:
c.where(key: string, operator: ComparisonOperator, value: any): ImmutableCollection<T>

// 3. Operator on primitive items (key omitted):
c.where(operator: ComparisonOperator, value: any): ImmutableCollection<T>
// e.g. collect([1, 2, 3, 4]).where(">", 2) → [3, 4]
```

The wrapper looks at `args.length` and at whether the first arg is a known operator (`Operators` is a constant `as const` tuple of every string the switch handles).

## Operators

| Group | Aliases |
|---|---|
| Equals | `=`, `equals` |
| Not equals | `!=`, `not`, `not equals` |
| Greater than | `>`, `gt` |
| Greater than or equal | `>=`, `gte` |
| Less than | `<`, `lt` |
| Less than or equal | `<=`, `lte` |
| Substring (case-insensitive) | `like`, `%` |
| Not substring | `not like`, `!%` |
| Regex test | `regex` (and: passing a `RegExp` as the value with no operator) |
| Set membership | `in` |
| Not in set | `not in`, `!in` |
| Range (inclusive) | `between`, `<>` |
| Not range | `not between`, `!between`, `!<>` |
| Substring (case-sensitive on `.includes`) | `contains` |
| Not contains | `not contains`, `!contains` |
| Starts with | `starts with` |
| Not starts with | `not starts with`, `!starts with` |
| Ends with | `ends with` |
| Not ends with | `not ends with`, `!ends with` |
| Is null | `null`, `is null` |
| Not null | `is not null`, `!null` |
| Is undefined | `undefined`, `is undefined` |
| Not undefined | `is not undefined`, `!undefined` |
| Exists | `exists` |
| Not exists | `not exists`, `!exists` |
| Is true | `true`, `is true` |
| Not true | `!true`, `is not true` |
| Is false | `false`, `is false` |
| Not false | `!false`, `is not false` |
| typeof | `is`, `typeof` |
| Not typeof | `is not`, `!is`, `not typeof` |
| instanceof | `instanceof`, `is a` |
| Not instanceof | `not instanceof`, `!instanceof`, `is not a`, `!is a` |
| Empty (via `@mongez/supportive-is`' `isEmpty`) | `empty`, `is empty` |
| Not empty | `not empty`, `is not empty`, `!empty` |

## Examples

```ts
// Equality
collect(users).where("active", true);

// Comparison
collect(users).where("age", ">", 25);
collect(users).where("age", "between", [20, 30]);

// String matching
collect(users).where("name", "like", "ada");          // case-insensitive substring
collect(users).where("name", "starts with", "A");
collect(users).where("name", "regex", /^A/);
collect(users).where("name", /^A/);                    // RegExp as value also works

// Set membership
collect(users).where("name", "in", ["Ada", "Bob"]);
collect(users).where("status", "!in", ["banned"]);

// Existence / null / undefined
collect(users).where("nickname", "exists");
collect(users).where("nickname", "is null");

// Type checks
collect(values).where("age", "is", "number");
collect(values).where("payload", "instanceof", ImmutableCollection);
```

## Shorthand helpers

For common operators, there are dedicated methods that read more naturally:

| Helper | Equivalent `where` call |
|---|---|
| `whereIn(key, values)` / `whereIn(values)` | `where(key, "in", values)` |
| `whereNot(key, value)` / `whereNot(value)` | `where(key, "!=", value)` |
| `whereBetween(key, [min, max])` | `where(key, "between", [min, max])` |
| `whereNotBetween(key, [min, max])` | `where(key, "not between", [min, max])` |
| `whereEmpty(key?)` | `where(key, "is empty")` (or applied to items directly when `key` is omitted) |
| `whereNotEmpty(key?)` / `heavy(key?)` | `where(key, "is not empty")` |
| `whereNull(key?)` | `where(key, "is null")` |
| `whereNotNull(key?)` | `where(key, "is not null")` |
| `whereUndefined(key?)` | `where(key, "is undefined")` |
| `whereNotUndefined(key?)` | `where(key, "is not undefined")` |
| `whereExists(key)` | `where(key, "exists")` |
| `whereNotExists(key)` | `where(key, "not exists")` |

## `firstWhere` / `lastWhere`

```ts
c.firstWhere(key, value): T | undefined
c.firstWhere(key, operator, value): T | undefined
c.lastWhere(key, value): T | undefined
c.lastWhere(key, operator, value): T | undefined
```

Equivalent to `c.where(...).first()` / `c.where(...).last()`.

## Behaviors worth knowing

- **`getItemValue(item, key)`** prefers `item.get(key)` when it exists (lets you pass model classes), otherwise checks for a direct own property on the item, then falls back to dot-notation `get(item, key)`.
- **Comparing arrays / objects** uses `areEqual` from `@mongez/reinforcements`, which is a deep equality check.
- **Date comparison** (`Date` instance vs `Date` instance) uses `+itemValue === +value` (numeric time).
- **Empty** uses `@mongez/supportive-is`' `isEmpty` — true for `null`, `undefined`, `""`, `[]`, `{}`, etc.
- **`is undefined` vs `not exists`**: own-but-explicitly-`undefined` keys match `where(key, "is undefined")`; truly-missing keys (key absent on the object) match `where(key, "not exists")`. The two are distinguishable thanks to an own-property check in `getItemValue` before falling back to the dotted `get()` helper.
