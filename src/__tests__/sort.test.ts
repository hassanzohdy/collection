import { describe, expect, it } from "vitest";
import { collect } from "../ImmutableCollection";

describe("sort / sortBy / sortByDesc", () => {
  it("sort() uses Array.prototype.sort (default order — lexicographic on strings)", () => {
    expect(collect([3, 1, 2]).sort().all()).toEqual([1, 2, 3]);
    expect(collect(["b", "a", "c"]).sort().all()).toEqual(["a", "b", "c"]);
  });

  it("sort accepts a comparator", () => {
    expect(
      collect([1, 2, 3])
        .sort((a, b) => b - a)
        .all(),
    ).toEqual([3, 2, 1]);
  });

  it("sortBy(key) sorts ascending by a dot-notation path", () => {
    const c = collect([
      { id: 1, age: 30 },
      { id: 2, age: 10 },
      { id: 3, age: 20 },
    ]);
    expect(
      c
        .sortBy("age")
        .all()
        .map(o => o.id),
    ).toEqual([2, 3, 1]);
  });

  it("sortByDesc(key) sorts descending by a key", () => {
    const c = collect([
      { id: 1, age: 30 },
      { id: 2, age: 10 },
      { id: 3, age: 20 },
    ]);
    expect(
      c
        .sortByDesc("age")
        .all()
        .map(o => o.id),
    ).toEqual([1, 3, 2]);
  });

  it("sortBy({ key1: 'asc', key2: 'desc' }) does multi-key sort", () => {
    const c = collect([
      { id: 1, group: "A", age: 30 },
      { id: 2, group: "B", age: 20 },
      { id: 3, group: "A", age: 20 },
      { id: 4, group: "B", age: 10 },
    ]);
    const out = c
      .sortBy({ group: "asc", age: "desc" })
      .all()
      .map(o => o.id);
    // Group A first, then within each group descending by age.
    expect(out).toEqual([1, 3, 2, 4]);
  });

  it("sortBy with no items in either order yields an empty collection", () => {
    expect(collect([]).sortBy("anything").all()).toEqual([]);
  });

  // KNOWN STABILITY HAZARD: the older V8 engines used to ship an unstable
  // sort (pre-Node 12). The collection delegates to Array.prototype.sort
  // which is stable since ES2019, but the comparator returns 0 for equal
  // keys — meaning input order is preserved within a tie. We test the
  // happy path here. (Older Node versions would fail this.)
  it("sortBy preserves input order within ties (stable sort, ES2019+)", () => {
    const c = collect([
      { id: 1, key: "a" },
      { id: 2, key: "a" },
      { id: 3, key: "a" },
    ]);
    expect(
      c
        .sortBy("key")
        .all()
        .map(o => o.id),
    ).toEqual([1, 2, 3]);
  });
});
