---
name: mongez-collection-math-aggregation
description: How to compute sum, average, min, max, median, count, and per-item arithmetic transforms on a collection.
when_to_use: Use when computing aggregate statistics over a collection or when applying arithmetic to every item or a specific field of every item.
---

# Math & Aggregation

## When to use

- Summing, averaging, finding min/max, or computing medians over a list of numbers or object fields.
- Counting items that satisfy a condition, or counting how many times each value appears.
- Applying arithmetic (+, -, *, /) to every item or to a named field of every item.

## How to use

### Aggregate reducers

All four accept an optional `key` string (dot-notation supported) to operate on a field rather than the item itself.

```ts
const nums = collect([10, 20, 30]);
nums.sum();        // 60
nums.average();    // 20
nums.avg();        // 20 (alias)
nums.min();        // 10
nums.max();        // 30
nums.median();     // 20

const orders = collect([
  { total: { price: 100 } },
  { total: { price: 200 } },
]);
orders.sum("total.price");     // 300
orders.average("total.price"); // 150
orders.min("total.price");     // 100
orders.max("total.price");     // 200
```

### `count` — conditional count

```ts
collect(users).count(u => u.active);   // number of active users
collect(users).count("active");        // same, using a key string
```

### `countValue` — exact value occurrences

```ts
collect(["a", "b", "a", "c"]).countValue("a"); // 2
```

### `countBy` — frequency map per key value

```ts
collect(users).countBy("role");
// { admin: 3, user: 12, guest: 1 }
```

### Per-item arithmetic — `plus`, `minus`, `multiply`, `divide`, `modulus`

Two overloads each:

1. **Primitive items** — single `amount` argument.
2. **Keyed field** — `(key, amount)` arguments; returns a new collection with that field updated on each item.

```ts
// Primitive
collect([1, 2, 3]).plus(10);       // [11, 12, 13]
collect([10, 20]).multiply(3);     // [30, 60]
collect([9, 6]).divide(3);         // [3, 2]
collect([10, 7]).modulus(3);       // [1, 1]

// Keyed field
collect([{ age: 20 }, { age: 30 }]).plus("age", 5);
// [{ age: 25 }, { age: 35 }]

collect(items).multiply("price", 1.2);  // apply 20% markup
```

### `increment` / `decrement` — shorthand ±1

```ts
collect([1, 2, 3]).increment();         // [2, 3, 4]
collect(items).increment("views");      // views + 1 on each item
collect(items).decrement("stock");      // stock - 1 on each item
```

### `double` / `half` — shorthand ×2 and ÷2

```ts
collect([5, 10]).double();              // [10, 20]
collect([10, 20]).half();               // [5, 10]
collect(items).double("price");
collect(items).half("discount");
```

### `even` / `odd` — filter by numeric value parity

```ts
collect([1, 2, 3, 4]).even();           // [2, 4]
collect([1, 2, 3, 4]).odd();            // [1, 3]

collect(items).even("score");           // items where score is even
```

### `evenIndexes` / `oddIndexes` — filter by position parity

```ts
collect(["a","b","c","d"]).evenIndexes(); // ["a","c"] (indexes 0, 2)
collect(["a","b","c","d"]).oddIndexes();  // ["b","d"] (indexes 1, 3)
```

## Key details / Pitfalls

- `min` / `max` on an **empty** collection return `0` (matching `@mongez/reinforcements` convention). On a **non-empty** collection they find the true minimum/maximum, so a collection of all-positive numbers will not incorrectly return `0` for `max`.
- `sum`, `average`, and `median` delegate directly to `@mongez/reinforcements`' helpers.
- **Keyed arithmetic mutates item objects.** `plus("age", 5)` shallow-clones plain objects via `cloneForSet` before calling `set(clone, key, value)`, so the original plain-object items in the source collection are safe. However, if items are class instances or have nested object references, those nested references are shared — clone the collection first if deep immutability is required.
- `divide` and `modulus` throw `Error("Cannot divide by zero")` when the divisor is `0`.
- All per-item math methods return a new collection — they do not mutate `this.items`.
