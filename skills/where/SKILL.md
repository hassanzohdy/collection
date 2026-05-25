---
name: mongez-collection-where
description: Full reference for the where() operator-based filter and all its shorthand helpers (whereIn, whereNull, whereBetween, etc.).
when_to_use: Use when the user is filtering a collection with where(), a comparison operator string, or any whereXxx shorthand method.
---

# `where(...)` — operator-based filtering

`where(...)` is the workhorse filter. It supports three argument shapes and ~50 operators.

## Signatures

```ts
// 1. Equality on a keyed value:
c.where(key: string, value: any): ImmutableCollection<T>

// 2. Operator on a keyed value:
c.where(key: string, operator: ComparisonOperator, value: any): ImmutableCollection<T>

// 3. (Documented but currently broken — see "Known issues") Operator on primitive items:
c.where(operator: ComparisonOperator, value: any): ImmutableCollection<T>
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

- **`getItemValue(item, key)`** prefers `item.get(key)` when it exists (lets you pass model classes), otherwise dot-notation `get(item, key)`.
- **Comparing arrays / objects** uses `areEqual` from `@mongez/reinforcements`, which is a deep equality check.
- **Date comparison** (`Date` instance vs `Date` instance) uses `+itemValue === +value` (numeric time).
- **Empty** uses `@mongez/supportive-is`' `isEmpty` — true for `null`, `undefined`, `""`, `[]`, `{}`, etc.

## Known issues

- **`where(operator, value)` two-arg primitive path is broken**. `where(">", 2)` sets `isPrimitive = true` but does not rotate the args — so the switch receives the value where it expects the operator. Pinned to a skipped test. Workaround: use `.filter(n => n > 2)` directly.
- **`where(key, "is undefined")` does NOT match items whose key is explicitly `undefined`**. The internal `getItemValue` uses the `NotExists` sentinel as the default and the upstream `get()` collapses own-undefined to "missing", so the comparison sees `NotExists`, not `undefined`. Use `where(key, "not exists")` instead.
