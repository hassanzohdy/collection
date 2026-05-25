import { describe, expect, it } from "vitest";
import { collect } from "../ImmutableCollection";
import { users } from "./fixtures";

describe("single-value reads", () => {
  it("first / last return the appropriate elements", () => {
    expect(collect([1, 2, 3]).first()).toBe(1);
    expect(collect([1, 2, 3]).last()).toBe(3);
  });

  it("end is an alias for last", () => {
    expect(collect([1, 2, 3]).end()).toBe(3);
  });

  it("first on empty collection returns undefined", () => {
    expect(collect([]).first()).toBeUndefined();
  });

  it("last on empty collection returns undefined", () => {
    expect(collect([]).last()).toBeUndefined();
  });

  it("at(index) / index(index) return the value at a position", () => {
    const c = collect([10, 20, 30]);
    expect(c.at(1)).toBe(20);
    expect(c.index(2)).toBe(30);
  });

  it("at / index on an out-of-bounds index returns undefined", () => {
    expect(collect([1, 2, 3]).at(99)).toBeUndefined();
  });

  it("get(path) reads a dot-notation path starting at the index", () => {
    const c = collect(users);
    expect(c.get("0.name")).toBe("Ada");
    expect(c.get("2.age")).toBe(30);
  });

  it("value(key) returns the first item's value for that key", () => {
    expect(collect(users).value("name")).toBe("Ada");
  });

  it("value(missing, default) returns the default when no item has the key", () => {
    expect(
      collect([{ name: "Ada" }, { name: "Bob" }]).value(
        "foo" as any,
        "fallback",
      ),
    ).toBe("fallback");
  });

  it("valueAt(index, key) returns one item's value for a key", () => {
    expect(collect(users).valueAt(1, "name")).toBe("Bob");
  });

  it("valueAt(out-of-range, key, default) returns the default", () => {
    expect(collect(users).valueAt(99, "name", "missing")).toBe("missing");
  });

  it("lastValue(key) returns the last item's value for that key", () => {
    expect(collect(users).lastValue("name")).toBe("Dot");
  });
});

describe("indexes / locating", () => {
  it("getByIndexes(...) returns only the selected indexes", () => {
    expect(collect([10, 20, 30, 40, 50]).getByIndexes(1, 3).all()).toEqual([
      20, 40,
    ]);
  });

  it("exceptIndexes(...) returns everything BUT the selected indexes", () => {
    expect(collect([10, 20, 30, 40, 50]).exceptIndexes(0, 4).all()).toEqual([
      20, 30, 40,
    ]);
  });

  it("indexes() returns the index range as a collection", () => {
    expect(collect(["a", "b", "c"]).indexes().all()).toEqual([0, 1, 2]);
  });
});

describe("boolean predicates", () => {
  it("includes / contains delegate to Array.prototype.includes", () => {
    const c = collect([1, 2, 3]);
    expect(c.includes(2)).toBe(true);
    expect(c.contains(99)).toBe(false);
  });

  it("has(callback) returns true if findIndex finds a match", () => {
    const c = collect([1, 2, 3]);
    expect(c.has(n => n > 2)).toBe(true);
    expect(c.has(n => n > 99)).toBe(false);
  });

  it("isEmpty / isNotEmpty report on length", () => {
    expect(collect([]).isEmpty()).toBe(true);
    expect(collect([1]).isEmpty()).toBe(false);
    expect(collect([]).isNotEmpty()).toBe(false);
    expect(collect([1]).isNotEmpty()).toBe(true);
  });

  it("equals compares item-by-item against an array or another collection", () => {
    const c = collect([1, 2, 3]);
    expect(c.equals([1, 2, 3])).toBe(true);
    expect(c.equals([1, 2, 4])).toBe(false);
    expect(c.equals(collect([1, 2, 3]))).toBe(true);
  });

  it("equals deep-compares nested values via reinforcements' areEqual", () => {
    expect(
      collect([{ a: 1, b: { c: 2 } }]).equals([{ a: 1, b: { c: 2 } }]),
    ).toBe(true);
  });

  it("length is a getter (no parens)", () => {
    expect(collect([1, 2, 3]).length).toBe(3);
    expect(collect([]).length).toBe(0);
  });
});

describe("select / pluck (projection)", () => {
  it("select(...keys) returns only those keys from each item", () => {
    const c = collect([
      { id: 1, name: "A", age: 10 },
      { id: 2, name: "B", age: 20 },
    ]).select("name");
    expect(c.all()).toEqual([{ name: "A" }, { name: "B" }]);
  });

  it("select(multipleKeys) returns the picked subset", () => {
    const c = collect([
      { id: 1, name: "A", age: 10 },
      { id: 2, name: "B", age: 20 },
    ]).select("id", "name");
    expect(c.all()).toEqual([
      { id: 1, name: "A" },
      { id: 2, name: "B" },
    ]);
  });

  it("pluck(key) flattens to a list of values", () => {
    expect(
      collect([{ name: "Ada" }, { name: "Bob" }])
        .pluck("name")
        .all(),
    ).toEqual(["Ada", "Bob"]);
  });

  it("pluck([keys]) keeps the selected keys per item", () => {
    expect(
      collect([
        { name: "Ada", age: 20 },
        { name: "Bob", age: 25 },
      ])
        .pluck(["name"])
        .all(),
    ).toEqual([{ name: "Ada" }, { name: "Bob" }]);
  });

  it("collectFromKey(index, key) returns a collection of the values at items[index][key]", () => {
    const c = collect([
      { id: 1, tags: ["a", "b"] },
      { id: 2, tags: ["c", "d"] },
    ]).collectFromKey(1, "tags");
    expect(c.all()).toEqual(["c", "d"]);
  });

  it("collectFromKey('index.key') accepts a dot-joined path", () => {
    const c = collect([
      { id: 1, tags: ["a", "b"] },
      { id: 2, tags: ["c", "d"] },
    ]).collectFromKey("0.tags");
    expect(c.all()).toEqual(["a", "b"]);
  });

  it("collectFrom(key) gathers values across items, flattening arrays one level", () => {
    const c = collect([
      { id: 1, tags: ["a", "b"] },
      { id: 2, tags: ["c"] },
      { id: 3, tag: "x" }, // not an array — kept as-is
    ]).collectFrom("tags");
    expect(c.all()).toEqual(["a", "b", "c", undefined]);
  });
});

describe("toArray / all / toJson", () => {
  it("toArray() returns the underlying array (no transform)", () => {
    const c = collect([1, 2, 3]);
    expect(c.toArray()).toEqual([1, 2, 3]);
  });

  it("toArray(mapper) maps before returning", () => {
    expect(collect([1, 2, 3]).toArray(n => n * 2)).toEqual([2, 4, 6]);
  });

  it("all() is an alias for toArray() without arguments", () => {
    expect(collect([1, 2, 3]).all()).toEqual([1, 2, 3]);
  });
});
