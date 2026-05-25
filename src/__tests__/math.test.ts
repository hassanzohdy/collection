import { describe, expect, it } from "vitest";
import { collect } from "../ImmutableCollection";

describe("aggregates — min / max / sum / average / median", () => {
  it("min / max / sum / average / median on a numeric array", () => {
    const c = collect([1, 2, 3, 4, 5]);
    expect(c.min()).toBe(1);
    expect(c.max()).toBe(5);
    expect(c.sum()).toBe(15);
    expect(c.average()).toBe(3);
    expect(c.median()).toBe(3);
  });

  it("avg is an alias for average", () => {
    expect(collect([2, 4, 6]).avg()).toBe(4);
  });

  it("aggregates accept a dot-notation key for object items", () => {
    const c = collect([
      { age: 20 },
      { age: 30 },
      { age: 40 },
    ]);
    expect(c.min("age")).toBe(20);
    expect(c.max("age")).toBe(40);
    expect(c.sum("age")).toBe(90);
    expect(c.average("age")).toBe(30);
    expect(c.median("age")).toBe(30);
  });

  it("median of an even-length array returns the mean of the two middle values", () => {
    expect(collect([1, 2, 3, 4]).median()).toBe(2.5);
  });

  // KNOWN QUIRK: reinforcements' `min` / `max` return 0 for empty arrays
  // rather than throwing or returning -Infinity / +Infinity. We pin the
  // current behavior so callers aren't surprised by it.
  it("min / max on an empty collection return 0 (a reinforcements convention)", () => {
    expect(collect([]).min()).toBe(0);
    expect(collect([]).max()).toBe(0);
  });

  // Collection wraps reinforcements' min/max to compute the true minimum for
  // non-empty arrays (reinforcements seeds at 0, which made all-positive
  // arrays return 0). Empty arrays still return 0 to preserve compatibility.
  it("min returns the true minimum even when all values are positive", () => {
    expect(collect([5, 10, 15]).min()).toBe(5);
    expect(collect([10, 20, 30]).max()).toBe(30);
  });

  it("sum / average treat empty input as 0", () => {
    expect(collect([]).sum()).toBe(0);
    // average of empty is NaN (0/0). Pin behavior.
    expect(Number.isNaN(collect([]).average())).toBe(true);
  });
});

describe("plus / minus / multiply / divide / modulus", () => {
  it("plus(amount) adds to each primitive", () => {
    expect(collect([1, 2, 3]).plus(10).all()).toEqual([11, 12, 13]);
  });

  it("plus(key, amount) adds to a keyed value, leaving siblings alone", () => {
    expect(
      collect([
        { id: 1, age: 20 },
        { id: 2, age: 30 },
      ])
        .plus("age", 5)
        .all(),
    ).toEqual([
      { id: 1, age: 25 },
      { id: 2, age: 35 },
    ]);
  });

  it("increment adds 1 to each primitive (or to a keyed value)", () => {
    expect(collect([1, 2]).increment().all()).toEqual([2, 3]);
    expect(
      collect([{ age: 20 }])
        .increment("age")
        .all(),
    ).toEqual([{ age: 21 }]);
  });

  it("minus(amount) subtracts from each primitive", () => {
    expect(collect([10, 20]).minus(5).all()).toEqual([5, 15]);
  });

  it("decrement subtracts 1 (or 1 from a keyed value)", () => {
    expect(collect([2, 3]).decrement().all()).toEqual([1, 2]);
  });

  it("multiply / double multiply by an amount or by 2", () => {
    expect(collect([1, 2, 3]).multiply(3).all()).toEqual([3, 6, 9]);
    expect(collect([1, 2, 3]).double().all()).toEqual([2, 4, 6]);
  });

  it("divide / half divide by an amount or by 2", () => {
    expect(collect([10, 20, 30]).divide(2).all()).toEqual([5, 10, 15]);
    expect(collect([10, 20]).half().all()).toEqual([5, 10]);
  });

  it("divide throws on a zero divisor (primitives or keyed)", () => {
    expect(() => collect([1, 2]).divide(0)).toThrow(/divide by zero/);
    expect(() => collect([{ v: 1 }]).divide("v", 0)).toThrow(/divide by zero/);
  });

  it("modulus computes the remainder", () => {
    expect(collect([5, 6, 7]).modulus(3).all()).toEqual([2, 0, 1]);
  });

  it("modulus throws on a zero divisor", () => {
    expect(() => collect([1]).modulus(0)).toThrow(/modulus of zero/);
  });

  // Keyed math/string forms used to mutate the source objects via
  // reinforcements' `set`. After the fix each item is cloned before `set`,
  // so the input objects are now untouched.
  it("plus(key, amount) does NOT mutate the input objects", () => {
    const src = [{ age: 20 }, { age: 30 }];
    const out = collect(src).plus("age", 1).all();
    expect(src).toEqual([{ age: 20 }, { age: 30 }]);
    expect(out).toEqual([{ age: 21 }, { age: 31 }]);
  });
});

describe("even / odd parity helpers", () => {
  it("even / odd filter numbers by parity", () => {
    expect(collect([1, 2, 3, 4, 5]).even().all()).toEqual([2, 4]);
    expect(collect([1, 2, 3, 4, 5]).odd().all()).toEqual([1, 3, 5]);
  });

  it("even(key) / odd(key) test the parity of a keyed numeric value", () => {
    const data = [
      { id: 1, age: 20 },
      { id: 2, age: 25 },
      { id: 3, age: 30 },
    ];
    expect(
      collect(data)
        .even("age")
        .all()
        .map(o => o.id),
    ).toEqual([1, 3]);
    expect(
      collect(data)
        .odd("age")
        .all()
        .map(o => o.id),
    ).toEqual([2]);
  });

  it("evenIndexes / oddIndexes return items at even / odd POSITIONS (not values)", () => {
    expect(collect(["a", "b", "c", "d", "e"]).evenIndexes().all()).toEqual([
      "a",
      "c",
      "e",
    ]); // positions 0, 2, 4
    expect(collect(["a", "b", "c", "d", "e"]).oddIndexes().all()).toEqual([
      "b",
      "d",
    ]); // positions 1, 3
  });
});

describe("count / countValue / countBy", () => {
  it("count(key) counts items where the key path resolves to a truthy value", () => {
    const data = [
      { id: 1, name: "Ada" },
      { id: 2 },
      { id: 3, name: "Cid" },
    ];
    expect(collect(data).count("name")).toBe(2);
  });

  it("count(callback) counts items where the callback returns true", () => {
    expect(collect([1, 2, 3, 4]).count(n => n > 2)).toBe(2);
  });

  it("countValue counts how many times a value appears", () => {
    expect(collect([1, 2, 1, 3, 1]).countValue(1)).toBe(3);
    expect(collect(["a", "b", "a"]).countValue("a")).toBe(2);
    expect(collect([1, 2, 3]).countValue(99)).toBe(0);
  });

  it("countBy(key) tallies values per unique key", () => {
    expect(
      collect([
        { name: "Ada" },
        { name: "Bob" },
        { name: "Ada" },
      ]).countBy("name"),
    ).toEqual({ Ada: 2, Bob: 1 });
  });
});
