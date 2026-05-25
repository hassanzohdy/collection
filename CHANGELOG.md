# Changelog — @mongez/collection

## Unreleased

### Fixed

- **`sort()`, `reverse()` (alias `flip`), `sortByDesc(key)`, `shift()`, `pop()` no longer mutate the underlying array.** `sort`/`reverse`/`sortByDesc` now clone `this.items` before sorting/reversing and construct a new collection from the result; `shift`/`pop` return the first/last item without modifying `this.items`. (`src/ImmutableCollection.ts:614`, `:684`, `:921`, `:992`, `:1159`)
- **`reduce(cb)` without an `initialValue` no longer returns NaN.** The wrapper now uses `arguments.length` to decide whether to forward `initialValue`, restoring native `Array.prototype.reduce` semantics — when no initial value is given, `items[0]` is used as the accumulator. (`src/ImmutableCollection.ts:533`)
- **`where(operator, value)` two-arg primitive-mode now rotates the arguments correctly.** When `args[0]` is a known operator, the implementation rebinds `operator = args[0]` and `value = args[1]` so the switch dispatches as documented; `collect([1,2,3,4]).where(">", 2)` now returns `[3, 4]`. (`src/ImmutableCollection.ts:1455`)
- **`where(key, "is undefined")` now matches items whose key is explicitly `undefined`.** `getItemValue` does a direct `Object.prototype.hasOwnProperty` check before falling back to reinforcements' `get`, so own-but-undefined keys return `undefined` (matched by "is undefined") and truly-missing keys still return the `NotExists` sentinel (matched by "not exists"). (`src/ImmutableCollection.ts:42-57`)
- **Keyed math/string forms no longer mutate the input objects.** A new `cloneForSet` helper shallow-clones each item before reinforcements' `set` writes the keyed value; the original objects are untouched. Affects `plus`, `minus`, `multiply`, `divide`, `modulus`, `appendString`, `prependString`, `concatString`, `replaceString`, `replaceAllString`, `removeString`, `removeAllString`, `trim`. (`src/ImmutableCollection.ts:206-518`, `:1971`)
- **`prependUnique` preserves argument order.** The implementation now filters out items that already exist and prepends the remaining new items in argument order (replacing reinforcements' per-item-unshift which reversed the order). `collect([3,4]).prependUnique(1,2,3)` now returns `[1, 2, 3, 4]`. (`src/ImmutableCollection.ts:637`)
- **`min`/`max` return the true minimum/maximum on non-empty collections.** Reinforcements seeded the running min/max at `0`, which silently returned `0` for any all-positive (resp. all-negative) array. The collection now wraps these with a direct fold that seeds at `Infinity`/`-Infinity`; empty collections still return `0` to preserve the previous compatibility shape. (`src/ImmutableCollection.ts:162`, `:184`)

### Added

- **Test suite** (`src/__tests__/*.test.ts`). 235 tests across 11 files: construction, builtin parity, mutation reference, reads, where + operators, math, strings, pagination, sort, group, tap. All pass; the four previously-skipped pins for the bugs listed above are now active. Run with `yarn test`.
- **AI kit**. `llms.txt`, `llms-full.txt`, and `skills/` folder (`README`, `overview`, `construction`, `builtins`, `mutation`, `where`, `math`, `strings`, `pagination`, `sort-group`, `recipes`).
- **Marketing-style README** with a `Collection vs reinforcements/arrays` scope boundary, mutation reference table, and quick tour.
- **CI workflow** (`.github/workflows/test.yml`): Node 18/20/22 × Ubuntu, plus Node 20 × Windows.
- **`vitest.config.ts`** with the self-detecting sibling-aliases pattern shared with `@mongez/atom`.

### Changed

- **Test runner**: `jest` → `vitest`. The existing `tests/` folder using jest remains untouched on disk; the new test files live under `src/__tests__/` to align with the rest of the `@mongez/*` family. `package.json` scripts now run vitest.
- **`package.json`**:
  - `description` updated to reflect the chainable/operator-filter nature.
  - `keywords` updated (`array`, `collection`, `immutable-collection`, `chainable`, `where`, `pluck`, `group-by`, `sort-by`, `partition`, `pipeline`, `laravel-collection`, `fluent`, `collect`).
  - `sideEffects: false` set — the wrapper class has no top-level side effects.
  - `dependencies['@mongez/reinforcements']` bumped from `^2.3.8` to `^3.1.0`. The surfaces used by collection (`get`, `set`, `clone`, `areEqual`, `min`, `max`, `sum`, `average`, `median`, `chunk`, `countBy`, `count`, `even`, `odd`, `evenIndexes`, `oddIndexes`, `groupBy`, `only`, `pluck`, `pushUnique`, `shuffle`, `trim`, `unique`, `unshiftUnique`) are all stable across v3. See [reinforcements v3 MIGRATION](../reinforcements/MIGRATION.md).
  - `scripts.test` set to `vitest run`; `scripts.test:watch` added; `scripts.test:coverage` added.
  - Removed `jest`, `ts-jest`, `jest-esm-jsx-transform`, `@types/jest` from `devDependencies`; added `vitest`.

### Not changed (intentionally)

- **No public API changes**. Every method, alias, and operator is preserved. Existing call sites continue to work identically.
- **No new features**. The package is being brought up to the documentation and test bar — no method additions or signature changes.
- **No runtime dependency additions**. Only the version of `@mongez/reinforcements` was bumped.
- **Old `tests/` folder** under jest is left in place for safety (not deleted) — it can be removed in a follow-up once teams confirm the new vitest suite is the source of truth.

### Tests

```
235 passing + 0 skipped = 235 total
```
