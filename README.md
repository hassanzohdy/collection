# @mongez/collection

> A chainable, immutable-by-default array wrapper. Filter with operators, group, sort, paginate, pluck, math — ~100 helpers over a single shared array reference, callable in a fluent pipeline.

`@mongez/collection` is the Laravel-collection-style sibling of [`@mongez/reinforcements`](https://github.com/hassanzohdy/reinforcements). Reinforcements gives you standalone array helpers (`pluck`, `groupBy`, `sum`, ...) — Collection wraps those (and adds operator-based `where`) into a fluent class so you can chain.

```ts
import { collect } from "@mongez/collection";

const topCustomers = collect(orders)
  .where("status", "paid")
  .where("total", ">", 100)
  .groupBy("customerId")
  .map(g => ({ customerId: g.customerId, spent: collect(g.items).sum("total") }))
  .sortByDesc("spent")
  .take(10)
  .all();
```

## Install

```sh
yarn add @mongez/collection
# deps: @mongez/reinforcements, @mongez/supportive-is
```

## A 30-second tour

```ts
import { collect } from "@mongez/collection";

// 1. Build a collection.
const users = collect([
  { id: 1, name: "Ada", age: 20, active: true },
  { id: 2, name: "Bob", age: 25, active: false },
  { id: 3, name: "Cid", age: 30, active: true },
]);

// 2. Filter with operators.
const adults = users.where("age", ">=", 18);
const active = users.where("active", true);
const named  = users.where("name", "in", ["Ada", "Cid"]);

// 3. Reshape.
const byAge = users.sortBy("age");
const byAgeDesc = users.sortByDesc("age");
const grouped = users.groupBy("active");
const [yes, no] = users.partition(u => u.active);

// 4. Project.
const emails = users.pluck("email");
const minimal = users.select("id", "name");

// 5. Aggregate.
users.sum("age");          // 75
users.average("age");      // 25
users.count(u => u.active); // 2
users.countBy("active");    // { true: 2, false: 1 }
```

## What's in the box

| Group | Methods |
|---|---|
| Construction | `collect(items)`, `ImmutableCollection`, `collect.create(length, val?)`, `collect.fromIterator(iterable)` |
| Reads | `first`, `last`, `at`, `get`, `value`, `valueAt`, `lastValue`, `find`, `firstWhere`, `lastWhere`, `equals`, `length`, `isEmpty` |
| Filter | `filter`, `where`, `firstWhere`, `whereIn`, `whereBetween`, `whereNot`, `whereNull`, `whereNotNull`, `whereEmpty`, `whereNotEmpty`, `whereExists`, `reject`, `except`, `not` |
| Insert | `push`, `append`, `pushUnique`, `unshift`, `prepend`, `prependUnique`, `merge`, `concat` |
| Remove | `delete`, `unset`, `remove`, `shift` *(mutates)*, `pop` *(mutates)* |
| Reshape | `map`, `flatMap`, `flat`, `chunk`, `groupBy`, `partition`, `unique`, `uniqueList`, `pluck`, `select`, `collectFrom`, `collectFromKey` |
| Reorder | `sortBy(key)`, `sortBy({...})`, `sortByDesc(key)` *(mutates)*, `sort()` *(mutates)*, `reverse()` *(mutates)*, `swap`, `move`, `reorder` |
| Subset | `take`, `limit`, `takeLast`, `takeUntil`, `skip`, `skipLast`, `skipUntil`, `skipLastUntil`, `slice`, `splice` |
| Math | `min`, `max`, `sum`, `average`, `median`, `count`, `countValue`, `countBy`, `plus`, `minus`, `multiply`, `divide`, `modulus`, `increment`, `decrement`, `double`, `half`, `even`, `odd`, `evenIndexes`, `oddIndexes` |
| Strings | `appendString`, `prependString`, `replaceString`, `replaceAllString`, `removeString`, `removeAllString`, `trim`, `string`, `number`, `boolean` |
| Random | `random`, `random(n)`, `shuffle` |
| Iteration | `forEach`, `each`, `tap`, `keys`, `values`, `entries`, `[Symbol.iterator]` |
| Convert | `toArray`, `all`, `toJson`, `toString`, `join`, `implode` |

See [`skills/`](./skills) for one card per cluster, or [`llms-full.txt`](./llms-full.txt) for everything in one file.

## Collection vs `@mongez/reinforcements`' array helpers

This is the most common confusion. Both packages can solve the same problems.

| Reach for `@mongez/reinforcements`' array helpers when… | Reach for `@mongez/collection` when… |
|---|---|
| You need **one** transformation on an array | You need to chain **3+** operations |
| You're optimizing — no wrapper allocation per call | You don't care about per-call allocation |
| The transformation is pipeline-style: `sum(pluck(orders, "total"))` | The transformation is conditional, interleaves `tap`, or partitions |
| You want a Lodash-style functional surface | You want a Laravel-collection-style fluent surface |
| Tree-shaking matters (you import single utilities) | You're OK with the whole class in the bundle |
| You want operator-based filtering | (Collection's `where("age", ">", 25)` has no equivalent in reinforcements) |

Internally, collection **delegates to reinforcements** for many primitives (`min`, `max`, `sum`, `unique`, `pluck`, `groupBy`, `countBy`, `chunk`, `even`, `odd`, `shuffle`, `pushUnique`, `unshiftUnique`). So `collect(arr).min(key)` is exactly `min(arr, key)` from reinforcements.

If you only need one or two helpers, prefer reinforcements. If you want a pipeline with `where(...)`, prefer collection.

## Mutation reference (the #1 thing to know)

Despite the name `ImmutableCollection`, **four methods mutate the underlying array**:

| Method | Mutates? | Workaround |
|---|---|---|
| `sort(cb?)` | Yes (Array.prototype leak) | `c.clone().sort(...)` |
| `reverse()` / `flip()` | Yes | `c.clone().reverse()` |
| `sortByDesc(key)` | Yes | `c.clone().sortByDesc(...)` |
| `shift()` | Yes (returns the removed item) | `c.skip(1)` |
| `pop()` | Yes (returns the removed item) | `c.skipLast(1)` |

Everything else (`map`, `filter`, `where`, `push`, `unshift`, `delete`, `unset`, `set`, `replace`, `slice`, `splice`, `merge`, `concat`, `sortBy(key)`, `sortBy({...})`, `groupBy`, `partition`, `pluck`, `select`, `chunk`, `take`, `skip`, `random`, `shuffle`, ...) returns a NEW collection and leaves the source untouched.

See [`skills/mutation.md`](./skills/mutation.md) for the full table.

## `where(...)` — the operator engine

```ts
collect(users).where("active", true);
collect(users).where("age", ">", 25);
collect(users).where("age", "between", [20, 30]);
collect(users).where("name", "like", "ada");           // case-insensitive substring
collect(users).where("name", "starts with", "A");
collect(users).where("name", "in", ["Ada", "Bob"]);
collect(users).where("name", /^A/);                     // RegExp as value
collect(users).where("nickname", "exists");
collect(users).where("age", "is", "number");
collect(users).where("payload", "instanceof", MyClass);
```

50+ operators across equality, comparison, substring, regex, set membership, range, null/undefined/empty/exists, type/instance checks. The full list lives in [`skills/where.md`](./skills/where.md).

## Pluck, group, partition

```ts
collect(users).pluck("name");
//  ["Ada", "Bob", "Cid"]

collect(students).groupBy("class");
//  [
//    { class: "A", items: [...] },
//    { class: "B", items: [...] },
//  ]

const [active, inactive] = collect(users).partition(u => u.active);
//  active.length + inactive.length === users.length
```

## Pagination & slicing

```ts
collect(items).take(10);              // first 10
collect(items).takeLast(5);           // last 5
collect(items).skip(20).take(10);     // page 3 (zero-indexed)
collect(items).chunk(100);            // [collection, collection, ...]

function paginate<T>(c: ImmutableCollection<T>, page: number, perPage: number) {
  return c.skip((page - 1) * perPage).take(perPage);
}
```

## Item-level math

```ts
collect([1, 2, 3]).plus(10);                 // [11, 12, 13]
collect([10, 20]).multiply(3);                // [30, 60]

// On keyed values:
collect([{ age: 20 }, { age: 30 }]).plus("age", 5);
//  [{ age: 25 }, { age: 35 }]

// Aggregates accept dot-notation:
collect(orders).sum("total.price");
collect(orders).max("total.price");
```

> The keyed math/string forms mutate the source items via reinforcements' `set`. Clone first if you need the input preserved.

## Iteration

A collection IS an `Iterable`. Spread, destructure, `for-of`, and `Array.from` all work:

```ts
const c = collect([1, 2, 3]);
for (const n of c) console.log(n);
[...c];                          // [1, 2, 3]
Array.from(c);                   // [1, 2, 3]
```

## Custom items with a `.get(key)` method

If your items expose `get(key)`, the collection uses it for keyed lookups — handy for model classes or any record type that already has a getter.

```ts
class User {
  constructor(private data: Record<string, any>) {}
  get(key: string) { return this.data[key]; }
}

const users = collect([new User({ name: "Ada", age: 20 })]);
users.where("name", "Ada").first(); // works — uses .get("name")
```

## TypeScript

- `ImmutableCollection<T>` is fully generic.
- `collect<T>(...)` carries `T` through transforms (`map<U>` lets you change it).
- `where(...)` signatures cover the 3 overloads; values are typed as `any` because the operator table accepts ad-hoc shapes.

## Related packages

| Package | Purpose |
|---|---|
| [`@mongez/reinforcements`](https://github.com/hassanzohdy/reinforcements) | Standalone array/object/string utilities. Collection delegates to it. |
| [`@mongez/supportive-is`](https://github.com/hassanzohdy/supportive-is) | Type/empty checks. Powers `whereEmpty`. |
| [`@mongez/atom`](https://github.com/hassanzohdy/mongez-atom) | Reactive state primitive. `atomCollection` is the reactive-array equivalent. |
| [`@mongez/events`](https://github.com/hassanzohdy/events) | Event bus used by `@mongez/atom`. |

## License

MIT
