---
name: mongez-collection-overview
description: |
  What @mongez/collection is, the ImmutableCollection model, when to prefer it over plain arrays or @mongez/reinforcements, and how chainable operator-based filtering works.
---

# @mongez/collection — Overview

A fluent, chainable wrapper for arrays. Filter, sort, group, aggregate, paginate — top-to-bottom, no intermediate variables, no Lodash-style standalone calls. The collection is **immutable by default** (every reshape returns a new collection) and a **native `Iterable`** (spread, destructure, `for-of` all work without `.all()`).

## Highlighted features

<div class="mongez-highlights">

<div class="mongez-highlight" data-accent="ice">
  <svg class="mongez-highlight-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
  <h3>Chainable top-to-bottom</h3>
  <p>Read a pipeline as a recipe — <code>.where().groupBy().map().sortByDesc().take()</code>. No temp vars, no nested calls.</p>
</div>

<div class="mongez-highlight" data-accent="ice">
  <svg class="mongez-highlight-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
  <h3>Operator-based filtering</h3>
  <p><code>.where("total", "&gt;", 100)</code>, <code>.where("status", "in", ["paid","shipped"])</code>, <code>.where("notes", "empty")</code> — readable as SQL.</p>
</div>

<div class="mongez-highlight" data-accent="fire">
  <svg class="mongez-highlight-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
  <h3>Immutable by default</h3>
  <p><code>sort</code>, <code>reverse</code>, <code>shift</code>, <code>pop</code> all leave the original untouched — they clone, then return.</p>
</div>

<div class="mongez-highlight" data-accent="fire">
  <svg class="mongez-highlight-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7h18M3 12h18M3 17h12"/></svg>
  <h3><code>groupBy</code> + aggregate</h3>
  <p><code>.groupBy("customerId")</code> hands you buckets; chain <code>.sum</code> / <code>.avg</code> / <code>.max</code> / <code>.count</code> on each one.</p>
</div>

<div class="mongez-highlight" data-accent="bolt">
  <svg class="mongez-highlight-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
  <h3>Native <code>Iterable</code></h3>
  <p>Spread, destructure, <code>for-of</code>, <code>Array.from</code> all work without calling <code>.all()</code>.</p>
</div>

<div class="mongez-highlight" data-accent="bolt">
  <svg class="mongez-highlight-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
  <h3>Dot-notation keys</h3>
  <p>Every keyed helper accepts paths: <code>.sum("total.price")</code>, <code>.sortBy("address.city")</code>, <code>.pluck("user.email")</code>.</p>
</div>

</div>

## Install

```sh
npm install @mongez/collection
# or: yarn add @mongez/collection
# or: pnpm add @mongez/collection
```

Runtime deps: `@mongez/reinforcements` and `@mongez/supportive-is`.

## Quick peek

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

Operator-based filtering, group-and-aggregate, sorted top-N — one chain reading top-to-bottom.

## Construction patterns

```ts
import { collect, ImmutableCollection } from "@mongez/collection";

collect([1, 2, 3]);                            // from an array
collect(otherCollection);                       // from another collection
ImmutableCollection.create(5, i => ({ slot: i })); // N items via callback
collect.create(5, 0);                          // [0, 0, 0, 0, 0]
collect.fromIterator(new Set([1, 2, 3]));      // from any iterable
```

## Key pitfalls

- **`toArray()` / `all()` return the live underlying array.** Use `[...c]` or `Array.from(c)` if you need a defensive copy.
- **`shift()` and `pop()` do NOT mutate** — they're item readers. Use `c.skip(1)` / `c.skipLast(1)` to drop.
- **Items with `.get(key)` methods are honoured automatically** — model classes work without adapters.

## Where to go next

- **[Construction](../construction/)**, **[Built-ins](../builtins/)** — creating collections
- **[Querying](../querying/)**, **[Where](../where/)**, **[Sort & group](../sort-group/)**, **[Pagination](../pagination/)**
- **[Math](../math/)**, **[Math aggregation](../math-aggregation/)**
- **[Transforming](../transforming/)**, **[Mutation](../mutation/)**, **[Strings](../strings/)**
- **[Recipes](../recipes/)** — common compositions
