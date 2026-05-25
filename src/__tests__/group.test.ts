import { describe, expect, it } from "vitest";
import { collect } from "../ImmutableCollection";
import { students } from "./fixtures";

describe("groupBy", () => {
  it("groupBy(key) buckets items by the value at that key", () => {
    const c = collect(students).groupBy("class");
    // Underlying call returns an array of `{ <key>: value, items: [...] }`
    // (the third arg to reinforcements' groupBy is `"items"`).
    expect(c.length).toBe(3);
    const A = c.firstWhere("class", "A") as any;
    expect(A.items.map((s: any) => s.id)).toEqual([1, 3]);
  });

  it("groupBy([keys]) creates one bucket per unique key-tuple", () => {
    const c = collect(students).groupBy(["class", "grade"]);
    // (A,1), (B,2), (A,3), (C,5) — 4 buckets.
    expect(c.length).toBe(4);
    const ab2 = c.first() as any;
    expect(ab2.class).toBe("A");
    expect(ab2.grade).toBe(1);
  });

  it("groupBy on an empty collection returns an empty collection", () => {
    expect(collect([]).groupBy("anything").all()).toEqual([]);
  });
});

describe("partition", () => {
  it("returns [matches, rest] tuples of collections", () => {
    const [evens, odds] = collect([1, 2, 3, 4, 5]).partition(
      n => n % 2 === 0,
    );
    expect(evens.all()).toEqual([2, 4]);
    expect(odds.all()).toEqual([1, 3, 5]);
  });

  it("when no items match, the first collection is empty", () => {
    const [yes, no] = collect([1, 2, 3]).partition(n => n > 99);
    expect(yes.all()).toEqual([]);
    expect(no.all()).toEqual([1, 2, 3]);
  });

  it("when every item matches, the second collection is empty", () => {
    const [yes, no] = collect([1, 2, 3]).partition(n => n > 0);
    expect(yes.all()).toEqual([1, 2, 3]);
    expect(no.all()).toEqual([]);
  });

  it("empty input → two empty collections", () => {
    const [yes, no] = collect<number>([]).partition(() => true);
    expect(yes.all()).toEqual([]);
    expect(no.all()).toEqual([]);
  });
});

describe("unique / uniqueList", () => {
  it("unique() dedupes primitives", () => {
    expect(collect([1, 2, 1, 3, 2, 3]).unique().all()).toEqual([1, 2, 3]);
  });

  it("unique(key) plucks the keyed value into a flat list (delegated to reinforcements)", () => {
    // Note: `unique(arr, key)` in reinforcements returns the VALUES at the
    // key, not the deduped objects. Pinned behavior.
    const c = collect([
      { name: "Ada", age: 20 },
      { name: "Bob", age: 20 },
      { name: "Cid", age: 25 },
    ]).unique("age");
    expect(c.all()).toEqual([20, 25]);
  });

  it("uniqueList(key) returns the first OBJECT for each unique key value", () => {
    const c = collect([
      { id: 1, name: "Ada" },
      { id: 2, name: "Ada" },
      { id: 3, name: "Bob" },
    ]).uniqueList("name");
    expect(c.all()).toEqual([
      { id: 1, name: "Ada" },
      { id: 3, name: "Bob" },
    ]);
  });

  it("unique on an empty collection returns an empty collection", () => {
    expect(collect([]).unique().all()).toEqual([]);
  });

  it("unique on all-distinct input preserves all items in order", () => {
    expect(collect([3, 1, 2]).unique().all()).toEqual([3, 1, 2]);
  });
});
