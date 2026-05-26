---
name: mongez-collection-math
description: |
  Aggregate reducers (`sum`, `min`, `max`, `average`, `avg`, `median`), per-element arithmetic (`plus`, `minus`, `multiply`, `divide`, `modulus`, `increment`, `decrement`, `double`, `half`), parity filters (`even`, `odd`, `evenIndexes`, `oddIndexes`), and counting (`count`, `countValue`, `countBy`). Covers the reinforcements quirks (`min`/`max`-of-empty = 0, `average`-of-empty = NaN, divide-by-zero throws) and the keyed-form source-mutation gotcha.
  TRIGGER when: code calls `c.sum`, `c.min`, `c.max`, `c.average`, `c.avg`, `c.median`, `c.plus`, `c.minus`, `c.multiply`, `c.divide`, `c.modulus`, `c.increment`, `c.decrement`, `c.double`, `c.half`, `c.even`, `c.odd`, `c.evenIndexes`, `c.oddIndexes`, `c.count`, `c.countValue`, or `c.countBy` on an `ImmutableCollection`; user asks "how do I sum / average / total / max / min on a collection field", "why does min return 0", "how to bump every item by 1", "why does divide throw".
  SKIP: math without a fluent chain or operator filter — use `mongez-reinforcements-arrays` (lighter `sum` / `min` / `max` / `average` / `median` / `count` / `countBy`); the higher-level "when to use which math method" tutorial — use `mongez-collection-math-aggregation`; aggregation downstream of `groupBy` — see `mongez-collection-transforming` or `mongez-collection-recipes`.
---

# Math, parity, and counting

All aggregates accept an optional dot-notation key for objects-of-records.

## Aggregates

```ts
c.min(key?): number
c.max(key?): number
c.sum(key?): number
c.average(key?): number
c.avg(key?): number       // alias
c.median(key?): number
```

```ts
collect([1, 2, 3, 4, 5]).sum();                          // 15
collect([{ price: 10 }, { price: 20 }]).sum("price");    // 30
collect([{ total: { price: 10 } }]).sum("total.price");  // 10 — dot notation
```

### Reinforcements' quirks

- `min` / `max` on an empty collection return **`0`**, not `Infinity` / `-Infinity` or `undefined`. (See [`reinforcements min.ts` on GitHub](https://github.com/hassanzohdy/reinforcements/blob/main/src/array/min.ts) — the seed value is `0`.)
- `min` of an all-positive array whose true min is > 0 also returns `0`, because the implementation only updates when `minValue === 0 || value < minValue`. Pinned as a skipped test.
- `average` of an empty collection is `NaN` (`0 / 0`).
- `NaN` values are skipped silently in `min`, `max`, `sum`, `average`, `median`.

## Per-element arithmetic

All of these return a NEW collection with the value applied to each element (or to a keyed value).

```ts
c.plus(amount)             // primitives
c.plus(key, amount)        // keyed
c.minus(amount) / minus(key, amount)
c.multiply(amount) / multiply(key, amount)
c.divide(amount) / divide(key, amount)
c.modulus(amount) / modulus(key, amount)

c.increment(key?)          // +1
c.decrement(key?)          // -1
c.double(key?)             // *2
c.half(key?)               // /2
```

```ts
collect([10, 20]).plus(5);                       // [15, 25]
collect([{ age: 20 }, { age: 30 }]).plus("age", 1);
//  [{ age: 21 }, { age: 31 }]
```

### Gotcha — mutation of input objects

The keyed forms (`plus("key", amount)`, `minus("key", ...)`, etc.) use `set(item, key, ...)` from reinforcements, which **mutates the source object**. So:

```ts
const src = [{ age: 20 }];
collect(src).plus("age", 1);
src;  // [{ age: 21 }]  — the original was mutated
```

If you need to keep the input immutable, clone it before wrapping: `collect(src.map(o => ({...o})))`.

### Division / modulus by zero

`divide` / `modulus` throw a `RangeError`-shaped `Error` when the divisor is zero. The error message is `"Cannot divide by zero"` / `"Cannot have a modulus of zero"`.

## Parity

```ts
c.even(key?)             // values that are even (or whose keyed value is even)
c.odd(key?)              // values that are odd
c.evenIndexes()          // items at indices 0, 2, 4, ... (not based on value!)
c.oddIndexes()           // items at indices 1, 3, 5, ...
```

```ts
collect([1, 2, 3, 4, 5]).even();           // [2, 4]
collect([1, 2, 3, 4, 5]).evenIndexes();    // [1, 3, 5]  — positions 0, 2, 4
```

## Counting

```ts
c.count(keyOrCallback): number       // # items where key resolves truthy, or where callback returns true
c.countValue(value): number          // # items strictly equal to value
c.countBy(key): Record<string, number>  // tally of unique key values
```

```ts
collect(users).count("email");                    // # users with an email
collect(users).count(u => u.active);              // # active users
collect([1, 2, 1, 1, 3]).countValue(1);           // 3
collect(users).countBy("role");                   // { admin: 2, user: 5 }
```
