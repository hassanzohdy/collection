# Changelog — @mongez/collection

## [1.4.0] — 2026-08-17

Security release, with one behaviour change consumers should read (regex metacharacters in string patterns are now matched literally).

### Security

- **ReDoS via user-supplied patterns in `where(key, "like" | "not like", value)`** (`src/ImmutableCollection.ts:1541`, `:1548`). The comparison value was compiled straight into a `RegExp`, so a value coming from a search box — the overwhelmingly common source for a `like` filter — was an attacker-supplied regex. A pattern such as `(a+)+$` against a long non-matching string makes the match time grow exponentially and pins the thread; on a Node consumer that is the whole process. The value is now passed through `escapeRegex()` before compilation, so it can only ever describe a literal substring. Values already given as a `RegExp` are still used as-is — an explicit `RegExp` is a deliberate act by the caller, not untrusted input.
- **ReDoS in `replaceAllString` / `removeAllString`** (`src/ImmutableCollection.ts:466`, `:503`). Same class of bug: the `string` argument was compiled into a global `RegExp` unescaped. Both now escape it.

### Changed

- **Regex metacharacters in string patterns are matched literally.** Consequence of the fix above, and the only visible behaviour change in this release. `where("name", "like", "a.c")` previously matched `abc` (the `.` acted as "any character") and now matches only the literal `a.c`; `replaceAllString("$1", "x")` previously behaved as a capture-group reference and now replaces the two characters `$1`. If you were relying on pattern syntax, pass a real `RegExp` instead of a string — that path is unchanged.

## [1.3.5] — 2026-05-27

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

### Tests

```
235 passing + 0 skipped = 235 total
```
