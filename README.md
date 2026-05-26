<div align="center">

# @mongez/collection

**A chainable, immutable-by-default array wrapper. ~100 helpers — operator-based `where(...)`, `groupBy`, `sortBy`, `partition`, `chunk`, `pluck`, math, strings — over a single fluent pipeline.**

[![npm](https://img.shields.io/npm/v/@mongez/collection.svg)](https://www.npmjs.com/package/@mongez/collection)
[![license](https://img.shields.io/npm/l/@mongez/collection.svg)](LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@mongez/collection.svg)](https://bundlephobia.com/package/@mongez/collection)
[![downloads](https://img.shields.io/npm/dw/@mongez/collection.svg)](https://www.npmjs.com/package/@mongez/collection)

</div>

---

## Why @mongez/collection?

Plain `Array.prototype` gives you `map`/`filter`/`reduce` and not much else — every aggregate, every group-by, every paginate is a re-implementation. Lodash adds those helpers but stays standalone-functional: chaining means wrapping with `_.chain(...)` and unwrapping with `.value()`. Ramda doubles down on point-free composition with curried, data-last functions — powerful, but unfamiliar to most TypeScript teams. Laravel Collections are the model for the fluent style, but they live in PHP. `@mongez/collection` is the smallest fluent layer that brings Laravel's API to TypeScript: `collect(...)` returns a class you keep chaining on, every method (except five intentional in-place ones) returns a fresh collection, `where("age", ">", 25)` reads like SQL, and ~100 helpers — `pluck`, `groupBy`, `partition`, `chunk`, `sortBy`, `uniqueList`, `sum`, `average`, `median`, `countBy` — sit on the same wrapper so you never break the chain to reach for a utility.

```ts
import { collect } from "@mongez/collection";

const topSpenders = collect(orders)
  .where("status", "paid")
  .where("total", ">", 100)
  .groupBy("customerId")
  .map(bucket => ({
    customerId: bucket.customerId,
    spent: collect(bucket.items).sum("total"),
  }))
  .sortByDesc("spent")
  .take(10)
  .all();
```

---

## Features

| Feature | Description |
|---|---|
| **Fluent chain** | Every transform returns a new `ImmutableCollection<T>` — keep chaining instead of nesting calls. |
| **Operator `where(...)`** | 50+ operators: `=`, `>`, `like`, `between`, `in`, `regex`, `exists`, `empty`, `null`, `is`, `instanceof`. No equivalent in Lodash or Ramda. |
| **Dot-notation paths** | Every keyed helper (`pluck`, `sortBy`, `sum`, `where`, `groupBy`, ...) accepts `"total.price"` or `"address.city"` for nested reads. |
| **Group / partition / dedupe** | `groupBy(key)`, `partition(cb)`, `unique(key?)`, `uniqueList(key)` — bucket-then-aggregate pipelines without leaving the chain. |
| **Math aggregates** | `sum`, `min`, `max`, `average`, `avg`, `median`, `count`, `countValue`, `countBy` — all accept an optional dot-path key. |
| **Per-item arithmetic** | `plus`, `minus`, `multiply`, `divide`, `modulus`, `increment`, `decrement`, `double`, `half` — apply scalar or keyed bumps across every item. |
| **String transforms** | `appendString`, `prependString`, `replaceString`, `removeString`, `trim`, plus type casts (`string()`, `number()`, `boolean()`). |
| **Pagination & chunking** | `take`, `limit`, `takeLast`, `skip`, `skipLast`, `slice`, `splice`, `chunk(size)`, `random(n?)`, `shuffle`. |
| **Sort / reorder** | `sortBy(key)`, multi-key `sortBy({...})`, `sortByDesc`, `swap`, `move`, `reorder`. |
| **`Iterable` native** | A collection IS an iterable — spread, `for-of`, and `Array.from` work without `.all()`. |
| **Model-class friendly** | If an item has a `.get(key)` method, every keyed helper uses it — drop in domain models with no adapter. |
| **TypeScript-first** | Generics carry through `map<U>`, `filter`, `where`. `ComparisonOperator` is a literal union of every supported operator. |

---

## Installation

```sh
npm install @mongez/collection
```

```sh
yarn add @mongez/collection
```

```sh
pnpm add @mongez/collection
```

Runtime dependencies: [`@mongez/reinforcements`](https://github.com/hassanzohdy/reinforcements) (array/object utilities the collection delegates to) and [`@mongez/supportive-is`](https://github.com/hassanzohdy/supportive-is) (powers `whereEmpty` and the `empty` operator).

---

## Quick start

```ts
import { collect } from "@mongez/collection";

const users = collect([
  { id: 1, name: "Ada", age: 20, active: true,  role: "admin" },
  { id: 2, name: "Bob", age: 25, active: false, role: "user"  },
  { id: 3, name: "Cid", age: 30, active: true,  role: "user"  },
]);

// 1. Filter with operators.
users.where("age", ">=", 18);                 // all three
users.where("active", true);                   // Ada + Cid
users.where("name", "in", ["Ada", "Cid"]);    // Ada + Cid

// 2. Reshape.
users.sortBy("age");                           // ascending
users.sortByDesc("age");                       // descending
users.groupBy("role");                         // [{role: "admin", items: [...]}, ...]
const [active, inactive] = users.partition(u => u.active);

// 3. Project.
users.pluck("name");                           // ["Ada", "Bob", "Cid"]
users.select("id", "name");                    // [{id, name}, ...]

// 4. Aggregate.
users.sum("age");                              // 75
users.average("age");                          // 25
users.count(u => u.active);                    // 2
users.countBy("role");                         // { admin: 1, user: 2 }

// 5. Unwrap when you actually need an array.
users.where("active", true).pluck("name").all(); // ["Ada", "Cid"]
```

A collection is itself iterable — `[...users]` and `for (const u of users)` work without `.all()`.

---

## Construction

```ts
import { collect, ImmutableCollection } from "@mongez/collection";

collect([1, 2, 3]);                           // factory — most common
new ImmutableCollection([1, 2, 3]);           // class form (same result)
collect();                                    // empty collection

collect.create(3);                            // [undefined, undefined, undefined]
collect.create(3, 0);                         // [0, 0, 0]
collect.create(3, i => i * 10);               // [0, 10, 20]

collect.fromIterator(new Set([1, 2, 3]));     // from any Iterable
collect.fromIterator(new Map([["a", 1]]));    // [["a", 1]]
function* gen() { yield 1; yield 2; }
collect.fromIterator(gen());                  // [1, 2]
```

The constructor takes a defensive copy of the input array, so mutating the source after construction does not leak into the collection. Passing anything other than an array or another collection throws `Invalid items type` — a typo like `collect({ x: 1 })` fails loudly at construction time.

---

## Querying with `where(...)`

`where(...)` is the workhorse filter. Three call shapes, ~50 operators.

```ts
// Implicit equality: where(key, value)
collect(users).where("active", true);

// Operator form: where(key, operator, value)
collect(users).where("age", ">", 25);
collect(users).where("age", "between", [20, 30]);
collect(users).where("name", "like", "ada");          // case-insensitive substring
collect(users).where("name", "starts with", "A");
collect(users).where("name", "in", ["Ada", "Bob"]);
collect(users).where("status", "!in", ["banned"]);
collect(users).where("name", "regex", /^A/);
collect(users).where("name", /^A/);                    // RegExp value also works
collect(users).where("nickname", "exists");
collect(users).where("nickname", "is null");
collect(users).where("config", "is not empty");
collect(users).where("age", "is", "number");           // typeof check
collect(users).where("payload", "instanceof", User);

// Primitive form on flat arrays: where(operator, value)
collect([1, 2, 3, 4]).where(">", 2);                   // [3, 4]
```

### Operator catalogue

| Category | Operators |
|---|---|
| Equality | `=`, `equals`, `!=`, `not`, `not equals` |
| Comparison | `>` / `gt`, `>=` / `gte`, `<` / `lt`, `<=` / `lte` |
| Substring (case-insensitive) | `like` / `%`, `not like` / `!%` |
| Substring (case-sensitive) | `contains`, `not contains` / `!contains` |
| Regex | `regex` (or pass a `RegExp` as the value) |
| Boundary | `starts with`, `not starts with`, `ends with`, `not ends with` |
| Set membership | `in`, `not in` / `!in` |
| Range (inclusive) | `between` / `<>`, `not between` / `!between` / `!<>` |
| Null | `null` / `is null`, `is not null` / `!null` |
| Undefined | `undefined` / `is undefined`, `is not undefined` / `!undefined` |
| Existence | `exists`, `not exists` / `!exists` |
| Boolean | `true` / `is true`, `false` / `is false`, `!true`, `!false` |
| typeof | `is` / `typeof`, `is not` / `!is` / `not typeof` |
| instanceof | `instanceof` / `is a`, `not instanceof` / `!instanceof` |
| Empty | `empty` / `is empty`, `not empty` / `is not empty` / `!empty` |

### Shorthand helpers

The most common operators have dedicated methods that read more naturally:

```ts
c.whereIn("status", ["active", "pending"]);
c.whereNot("status", "banned");
c.whereBetween("age", [20, 30]);
c.whereNotBetween("score", [0, 50]);
c.whereNull("deletedAt");
c.whereNotNull("email");
c.whereUndefined("nickname");
c.whereNotUndefined("nickname");
c.whereEmpty("tags");
c.whereNotEmpty("tags");          // alias: c.heavy("tags")
c.whereExists("metadata");
c.whereNotExists("legacyId");
```

### `firstWhere` / `lastWhere`

Same signature as `where`, but returns the single matched item instead of a collection:

```ts
const admin = c.firstWhere("role", "admin");
const newest = c.lastWhere("status", "active");
const over25 = c.firstWhere("age", ">", 25);
```

> Chained `where` calls are AND logic — each narrows the previous result. For OR logic, either union two `where` results with `merge` or drop down to a `filter` callback.

> If an item exposes `.get(key)`, every keyed helper (`where`, `pluck`, `groupBy`, `sum`, `sortBy`, ...) uses it instead of property access. Plain objects fall back to dot-notation reads via `@mongez/reinforcements`' `get`.

---

## Math and aggregates

All aggregate reducers accept an optional dot-notation key for objects-of-records:

```ts
collect([10, 20, 30]).sum();                         // 60
collect([{ price: 10 }, { price: 20 }]).sum("price"); // 30
collect([{ total: { price: 10 } }]).sum("total.price"); // 10

collect([3, 1, 4, 1, 5]).min();                      // 1
collect([3, 1, 4, 1, 5]).max();                      // 5
collect([3, 1, 4, 1, 5]).average();                  // 2.8
collect([3, 1, 4, 1, 5]).avg();                      // alias
collect([3, 1, 4, 1, 5]).median();                   // 3
```

Counting comes in three flavours:

```ts
collect(users).count("email");                       // # users where email is truthy
collect(users).count(u => u.active);                 // # active users
collect([1, 2, 1, 1, 3]).countValue(1);              // 3
collect(users).countBy("role");                      // { admin: 2, user: 5 }
```

Per-item arithmetic returns a new collection with the value applied to each element (or to the keyed value of each object):

```ts
collect([1, 2, 3]).plus(10);                         // [11, 12, 13]
collect([10, 20]).multiply(3);                       // [30, 60]
collect([9, 6]).divide(3);                           // [3, 2]
collect([10, 7]).modulus(3);                         // [1, 1]

collect([{ age: 20 }, { age: 30 }]).plus("age", 5);
// [{ age: 25 }, { age: 35 }]

collect(items).multiply("price", 1.2);               // 20% markup
collect(items).increment("views");                    // views + 1 on each item
collect(items).decrement("stock");                    // stock - 1 on each item
collect(items).double("price");                       // *2
collect(items).half("discount");                      // /2
```

Parity filters split by even/odd value or by index position:

```ts
collect([1, 2, 3, 4]).even();                        // [2, 4]
collect([1, 2, 3, 4]).odd();                         // [1, 3]
collect(["a", "b", "c", "d"]).evenIndexes();         // ["a", "c"] (positions 0, 2)
collect(["a", "b", "c", "d"]).oddIndexes();          // ["b", "d"] (positions 1, 3)
```

> `min` and `max` on an empty collection return `0` for backward compatibility with `@mongez/reinforcements`. On a non-empty collection they find the true minimum/maximum (an all-positive array no longer collapses to `0`). `average` of an empty collection is `NaN`.

> `divide` and `modulus` throw `Error("Cannot divide by zero")` / `Error("Cannot have a modulus of zero")` when the divisor is `0`. Guard before the call if zero divisors are possible.

> Keyed arithmetic on plain object items shallow-clones each item before applying the change, so the original collection's source objects are not mutated. Class instances and nested object references are still shared — clone deeply if you need full isolation.

---

## String transforms

Two flavours of every transform — applied to each item, or to a keyed value on each item:

```ts
collect(["Ada", "Bob"]).appendString("!");           // ["Ada!", "Bob!"]
collect([{ name: "Ada" }]).appendString("!", "name"); // [{ name: "Ada!" }]

collect(["Ada"]).prependString("Hi, ");              // ["Hi, Ada"]
collect(["abc"]).replaceString("b", "X");            // ["aXc"]
collect(["ababa"]).replaceAllString("a", "X");       // ["XbXbX"]
collect(["ababa"]).removeString("b");                // ["aaba"]
collect(["##a##"]).trim("#");                        // ["a"]
collect(["  hi  "]).trim();                          // ["hi"]
```

Type casts apply `String`/`Number`/`Boolean` to each item:

```ts
collect([1, null, "x"]).string();                    // ["1", "null", "x"]
collect(["1", "abc", ""]).number();                  // [1, NaN, 0]
collect([0, 1, "", "x"]).boolean();                  // [false, true, false, true]
```

> `replaceAllString` always promotes the search string to `new RegExp(s, "g")`. If you want a literal global replace with a regex you already have, use `replaceString(/yourRegex/g, ...)` instead.

> The keyed-form string transforms use the same shallow-clone-then-set strategy as the math operations, so the source objects are not mutated for plain object items.

---

## Mutation reference

`ImmutableCollection` returns a new collection from every transform: `map`, `filter`, `where`, `push`, `unshift`, `delete`, `unset`, `set`, `replace`, `slice`, `splice`, `merge`, `concat`, `sortBy(key)`, `sortBy({...})`, `groupBy`, `partition`, `pluck`, `select`, `chunk`, `take`, `skip`, `random`, `shuffle`, `swap`, `move`, `reorder`, and the rest. The source is never reordered or mutated.

There are still three methods to be careful about:

| Method | Behaviour | Notes |
|---|---|---|
| `shift()` | Returns the FIRST item — does NOT remove it from the collection. | Use `c.skip(1)` for the non-destructive "drop the first" variant. |
| `pop()` | Returns the LAST item — does NOT remove it from the collection. | Use `c.skipLast(1)` for "drop the last". |
| `toArray()` / `all()` | Returns the LIVE underlying array reference. | Mutating the result mutates the collection. Use `[...c]` or `Array.from(c)` for a copy. |

The remaining read-style methods (`first`, `last`, `at`, `find`, `firstWhere`, `value`, `valueAt`, `lastValue`, `includes`, `every`, `some`, `equals`, `length`, `indexOf`, `findIndex`, `count`, `countBy`, `min`, `max`, `sum`, `average`, `median`, `toJson`, `join`, `implode`, `toString`, `reduce`, `reduceRight`) return a scalar without touching the array.

> `forEach`, `each`, and `tap` return `this` so you can chain after a side-effect — they do not return a new collection.

---

## Transforming and projecting

```ts
// Reshape every item.
collect(users).map(u => ({ id: u.id, label: u.name }));

// Project a single column.
collect(users).pluck("name");                        // ["Ada", "Bob", "Cid"]
collect(orders).pluck("total.price");                // dot-notation works
collect(users).pluck(["id", "name"]);                // [{id, name}, ...]

// Keep only specific keys per item.
collect(users).select("id", "name", "email");

// Group by a key (one or several).
collect(students).groupBy("class");
// [{ class: "A", items: [...] }, { class: "B", items: [...] }]

collect(orders).groupBy(["year", "month"]);
// [{ year: 2024, month: 1, items: [...] }, ...]

// Bucket-then-aggregate.
collect(users)
  .groupBy("department")
  .map(g => ({
    department: g.department,
    headcount: g.items.length,
    avgAge: collect(g.items).average("age"),
  }));

// Two pipelines in one pass.
const [active, inactive] = collect(users).partition(u => u.active);

// Dedupe — value flavour vs object flavour.
collect([1, 2, 2, 3]).unique();                      // [1, 2, 3]
collect(users).unique("email");                      // ["a@x", "b@x", ...] (VALUES)
collect(users).uniqueList("email");                  // first user per unique email (OBJECTS)

// Hoist a nested array field up one level.
collect(orders).collectFrom("lineItems");
// all line items from all orders flattened into one collection
```

> `unique("key")` returns the VALUES at that key. `uniqueList("key")` returns the OBJECTS (one per unique key value). They look similar but produce different shapes — pick deliberately.

> `groupBy` always names the bucket field `"items"` — the result is `ImmutableCollection<{ [key]: any; items: T[] }>`. The `items` are plain arrays; wrap them with `collect(...)` to keep chaining.

---

## Pagination and slicing

```ts
collect(items).take(10);                             // first 10
collect(items).limit(10);                            // alias
collect(items).takeLast(5);                          // last 5

collect(items).skip(20);                             // drop first 20
collect(items).skipLast(3);                          // drop last 3

// Predicate boundaries.
collect(events).takeUntil(e => e.type === "end");    // up to (exclusive) first match
collect(events).skipUntil(e => e.type === "start");  // from (inclusive) first match

// Offset pagination.
function page<T>(c: ImmutableCollection<T>, n: number, perPage: number) {
  return c.skip((n - 1) * perPage).take(perPage);
}
page(collect(allOrders), 3, 25).all();               // page 3 of 25

// Chunk into equal-sized batches.
collect(items).chunk(100);                           // ImmutableCollection<ImmutableCollection<T>>
collect(items).chunk(100, false);                    // ImmutableCollection<T[]> (plain arrays)

// Native slice / splice — non-mutating.
collect(items).slice(5, 15);                         // index 5..14
collect(items).slice(-3);                            // last 3
collect(items).splice(2, 3);                         // copy without 3 items starting at index 2

// Random sampling.
collect(items).random();                             // one random item
collect(items).random(5);                            // five random items (collection)
collect(items).shuffle();                            // shuffled copy
```

> There is no built-in `paginate(page, perPage)` that emits `{ data, total, hasNext }` metadata. Compose it from `length` + `skip().take()` — see the [Server-style pagination response](#server-style-pagination-response) recipe below.

---

## Sort, reorder, group

```ts
// Key-based sort (clones internally — source preserved).
collect(users).sortBy("age");                        // ascending
collect(users).sortByDesc("createdAt");              // descending

// Multi-key sort with explicit direction per field.
collect(users).sortBy({ group: "asc", age: "desc" });

// Comparator-based.
collect([3, 1, 2]).sort((a, b) => a - b);            // [1, 2, 3]
collect([1, 2, 3]).reverse();                        // [3, 2, 1]
collect([1, 2, 3]).flip();                           // alias for reverse

// Position-level reorder.
collect([1, 2, 3, 4, 5]).swap(0, 4);                 // [5, 2, 3, 4, 1]
collect([1, 2, 3, 4, 5]).move(0, 4);                 // [2, 3, 4, 5, 1]
collect([1, 2, 3]).reorder({ 0: 2, 1: 1, 2: 0 });    // [3, 2, 1]
```

> `Array.prototype.sort` is stable in Node 12+, so equal items preserve insertion order across `sortBy(key)` and `sortBy({...})`.

> For OR-style filters, lean on `merge` to union the results of two `where` pipelines, then dedupe with `uniqueList(key)` if items are objects with a natural identity key.

---

## Built-in `Array.prototype` parity

Every method that has a matching `Array.prototype` is wrapped — but always returns a new collection (for transforms) or a scalar (for reads), never the underlying array:

```ts
collect([1, 2, 3]).map(n => n * 2);                  // [2, 4, 6]
collect([1, 2, 3]).filter(n => n > 1);               // [2, 3]
collect([1, [2, 3], [4]]).flat();                    // [1, 2, 3, 4]
collect([1, 2, 3]).flatMap(n => [n, n + 100]);       // [1, 101, 2, 102, 3, 103]

collect([1, 2, 3, 4]).reduce((acc, n) => acc + n, 0); // 10
collect([1, 2, 3]).find(n => n > 1);                 // 2
collect([1, 2, 3]).every(n => n > 0);                // true
collect([1, 2, 3]).some(n => n === 2);               // true
collect([1, 2, 3]).join("-");                        // "1-2-3"
collect(["a", "b"]).implode(",");                    // "a,b" (alias for join)

// Identity helpers (return the same collection).
collect([1, 2, 3]).forEach(n => console.log(n));     // returns self
collect([1, 2, 3]).each(n => console.log(n));        // alias
collect([1, 2, 3]).tap(c => console.log(c.length));  // side-effect, returns self

// Iterator interop.
const c = collect([1, 2, 3]);
for (const n of c) console.log(n);                    // for-of
[...c];                                               // [1, 2, 3]
Array.from(c);                                        // [1, 2, 3]
```

> `removeAll` is NOT a remove operation — it's an alias for `filter` that KEEPS matching items. Use `reject` (or `except` / `skipWhile`) for the inverse predicate filter.

---

## Recipes

### Top-N highest-spending customers

Reach for this when you need a leaderboard from raw transactional data — `where` narrows, `sortByDesc` orders, `take` caps, `pluck` projects.

```ts
import { collect } from "@mongez/collection";

const topTen = collect(orders)
  .where("status", "paid")
  .where("createdAt", ">=", startOfMonth)
  .sortByDesc("total")
  .take(10)
  .pluck("customerId")
  .all();
```

### Aggregate orders by month and sum totals

Reach for this when you need a chart series — bucket by a grouping key, then collapse each bucket to a single row with `map`.

```ts
import { collect } from "@mongez/collection";

const monthlyRevenue = collect(orders)
  .where("status", "paid")
  .map(o => ({
    ...o,
    yearMonth: o.createdAt.toISOString().slice(0, 7), // "2026-05"
  }))
  .groupBy("yearMonth")
  .map(bucket => ({
    month: bucket.yearMonth,
    orders: bucket.items.length,
    revenue: collect(bucket.items).sum("total"),
    avgTicket: collect(bucket.items).average("total"),
  }))
  .sortBy("month")
  .all();

// [{ month: "2026-01", orders: 42, revenue: 12_400, avgTicket: 295.24 }, ...]
```

### Partition tasks for two parallel pipelines

Reach for this when one input feeds two separate downstream flows — `partition` runs the test once and returns both sides, no double traversal.

```ts
import { collect } from "@mongez/collection";

const [pending, completed] = collect(tasks).partition(t => t.status === "open");

pending
  .where("priority", "high")
  .sortBy("dueAt")
  .forEach(notify);

completed
  .sortByDesc("completedAt")
  .take(20)
  .forEach(addToActivityFeed);
```

### Server-style pagination response

Reach for this when the client expects `{ data, total, totalPages, hasNext, hasPrev }` from a filtered list — compose it from `length` and `skip().take()`.

```ts
import { collect, ImmutableCollection } from "@mongez/collection";

function paginate<T>(c: ImmutableCollection<T>, page = 1, perPage = 25) {
  const total = c.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);

  return {
    data: c.skip((safePage - 1) * perPage).take(perPage).all(),
    page: safePage,
    perPage,
    total,
    totalPages,
    hasNext: safePage < totalPages,
    hasPrev: safePage > 1,
  };
}

const filtered = collect(allOrders).where("status", "paid").sortByDesc("total");
const response = paginate(filtered, 3, 25);
```

### Dedupe registrations by email, keep first occurrence

Reach for this when an import contains duplicate emails and you want the first row per email (typically the oldest signup). `uniqueList` preserves the object; `unique` would just return the email strings.

```ts
import { collect } from "@mongez/collection";

const canonical = collect(rawRegistrations)
  .sortBy("createdAt")          // earliest first
  .uniqueList("email")          // first object per unique email
  .select("id", "email", "name")
  .all();
```

### Build an O(1) lookup index by primary key

Reach for this when you need to resolve items by ID inside a hot render loop — paying once for a `reduce` is cheaper than scanning the list on every lookup.

```ts
import { collect } from "@mongez/collection";

const usersById = collect(users).reduce<Record<number, User>>(
  (acc, u) => {
    acc[u.id] = u;
    return acc;
  },
  {},
);

usersById[42];                  // O(1) — no scan
```

### Apply a markup, then keep only items above a threshold

Reach for this when an ETL step needs to mutate a numeric field and immediately filter on the new value — chain `multiply` into a follow-up `where` without unwrapping.

```ts
import { collect } from "@mongez/collection";

const premium = collect(products)
  .multiply("price", 1.2)                    // 20% markup
  .where("price", ">=", 100)                 // only the high-end
  .sortByDesc("price")
  .select("id", "name", "price")
  .all();
```

### Batch upload a large list in chunks

Reach for this when an upstream API caps payload size — `chunk(size, false)` returns plain arrays so you can `await` per batch without re-wrapping.

```ts
import { collect } from "@mongez/collection";

async function uploadAll<T>(items: T[], batchSize = 100) {
  const batches = collect(items).chunk(batchSize, false);
  for (const batch of batches) {
    await uploadBatch(batch);                // batch is T[]
  }
}
```

### Drain a queue intentionally with `shift`

Reach for this when you genuinely want to consume the collection as you process it. `shift` returns the first item without mutating the source, so pair it with `skip(1)` to advance the queue.

```ts
import { collect } from "@mongez/collection";

let queue = collect(jobs);
while (queue.length > 0) {
  const job = queue.shift();                 // peek the head
  queue = queue.skip(1);                     // advance
  await process(job);
}
```

### Tap mid-chain for logging without breaking the pipeline

Reach for this when you want to log an intermediate count, inspect a sample, or notify a side-channel without unwrapping the chain.

```ts
import { collect } from "@mongez/collection";

const products = collect(events)
  .where("type", "click")
  .tap(c => console.log(`click events: ${c.length}`))
  .where("payload.target", "starts with", "/products/")
  .tap(c => console.log(`product clicks: ${c.length}`))
  .map(e => e.payload.target)
  .all();
```

---

## TypeScript

`ImmutableCollection<T>` is fully generic. `collect<T>(...)` carries `T` through transforms; `map<U>` lets you change the item type mid-pipeline.

```ts
import {
  collect,
  ImmutableCollection,
  Operators,
  type ComparisonOperator,
  type GenericObject,
} from "@mongez/collection";

type Order = { id: string; total: number; status: "paid" | "pending" };

const c: ImmutableCollection<Order> = collect<Order>(orders);

const ids: ImmutableCollection<string> = c
  .where("status", "paid")
  .pluck("id");                              // T narrows via the pluck overload
```

`Operators` is the runtime tuple of every operator string the switch handles; `ComparisonOperator` is the literal union derived from it. Use them when building generic helpers around `where`.

> `where(...)` values are typed as `any` because the operator table accepts ad-hoc shapes (numbers, strings, dates, regexps, class constructors). For stronger guarantees, wrap a domain-specific filter in a typed adapter at the call site.

---

## Related packages

| Package | Use when you need |
|---|---|
| [`@mongez/reinforcements`](https://github.com/hassanzohdy/reinforcements) | Standalone, tree-shakeable array/object/string utilities. The collection class delegates to it for many primitives. Prefer it when you only need one or two helpers without a fluent chain. |
| [`@mongez/supportive-is`](https://github.com/hassanzohdy/supportive-is) | Type and emptiness checks. Powers `whereEmpty` and the `empty` / `is empty` operators. |
| [`@mongez/atom`](https://github.com/hassanzohdy/mongez-atom) | Reactive state primitive. `atomCollection` is the reactive-array equivalent for React/framework-agnostic apps. |
| [`@mongez/events`](https://github.com/hassanzohdy/events) | Cross-feature pub/sub. Useful for broadcasting collection changes. |

---

## Further reading

- [`llms.txt`](./llms.txt) — concise, structured index of every API surface for tool-assisted development.
- [`llms-full.txt`](./llms-full.txt) — exhaustive single-file API reference.
- [`skills/`](./skills) — per-topic deep-dives (construction, where, math, mutation, recipes, sort/group, transforming, pagination, strings).
- [`CHANGELOG.md`](./CHANGELOG.md) — release notes and the full list of recently-fixed quirks.

---

## License

MIT
