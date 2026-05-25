import { describe, expect, it, vi } from "vitest";
import { collect } from "../ImmutableCollection";

// These tests cover the methods that delegate to Array.prototype semantics
// (map, filter, reduce, etc.) — including which ones MUTATE vs return a new
// collection.

describe("array-builtin parity", () => {
  it("map returns a new collection (does NOT mutate the source)", () => {
    const a = collect([1, 2, 3]);
    const b = a.map(n => n * 2);
    expect(b.all()).toEqual([2, 4, 6]);
    expect(a.all()).toEqual([1, 2, 3]); // unchanged
    expect(a).not.toBe(b);
  });

  it("map can change the element type via generic parameter", () => {
    const c = collect([1, 2, 3]).map<string>(n => `#${n}`);
    expect(c.all()).toEqual(["#1", "#2", "#3"]);
  });

  it("filter keeps matching items and returns a new collection", () => {
    const c = collect([1, 2, 3, 4, 5]).filter(n => n % 2 === 0);
    expect(c.all()).toEqual([2, 4]);
  });

  it("takeWhile and removeAll are aliases of filter", () => {
    const c = collect([1, 2, 3, 4, 5]);
    expect(c.takeWhile(n => n < 4).all()).toEqual([1, 2, 3]);
    expect(c.removeAll(n => n > 2).all()).toEqual([3, 4, 5]);
  });

  it("reduce delegates to Array.prototype.reduce", () => {
    expect(collect([1, 2, 3, 4]).reduce((acc, n) => acc + n, 0)).toBe(10);
  });

  it("reduce with no initial value uses the first item as the accumulator", () => {
    expect(
      collect([1, 2, 3, 4]).reduce((acc: number, n: number) => acc + n),
    ).toBe(10);
  });

  it("reduceRight walks right-to-left", () => {
    const order: number[] = [];
    collect([1, 2, 3]).reduceRight((acc: any, n: any) => {
      order.push(n);
      return acc;
    }, null);
    expect(order).toEqual([3, 2, 1]);
  });

  it("forEach iterates over every item and returns the collection (for chaining)", () => {
    const seen: number[] = [];
    const c = collect([10, 20, 30]);
    const out = c.forEach(n => seen.push(n));
    expect(seen).toEqual([10, 20, 30]);
    expect(out).toBe(c);
  });

  it("each is an alias for forEach", () => {
    const spy = vi.fn();
    collect([1, 2, 3]).each(spy);
    expect(spy).toHaveBeenCalledTimes(3);
  });

  it("every / some delegate to Array.prototype", () => {
    const c = collect([2, 4, 6]);
    expect(c.every(n => n % 2 === 0)).toBe(true);
    expect(c.every(n => n > 2)).toBe(false);
    expect(c.some(n => n > 5)).toBe(true);
    expect(c.some(n => n > 100)).toBe(false);
  });

  it("find returns the first matching item or undefined", () => {
    expect(collect([1, 2, 3]).find(n => n > 1)).toBe(2);
    expect(collect([1, 2, 3]).find(n => n > 99)).toBeUndefined();
  });

  it("findIndex / indexOf / lastIndexOf return the correct positions", () => {
    expect(collect([1, 2, 3, 2, 1]).findIndex(n => n === 2)).toBe(1);
    expect(collect([1, 2, 3, 2, 1]).indexOf(2)).toBe(1);
    expect(collect([1, 2, 3, 2, 1]).lastIndexOf(2)).toBe(3);
    expect(collect([1, 2, 3]).indexOf(99)).toBe(-1);
  });

  it("lastIndexOf with a fromIndex narrows the search", () => {
    const c = collect([1, 2, 3, 2, 1]);
    expect(c.lastIndexOf(2, 2)).toBe(1);
  });

  it("lastIndex returns length - 1 (and -1 for an empty collection)", () => {
    expect(collect([1, 2, 3]).lastIndex()).toBe(2);
    expect(collect([]).lastIndex()).toBe(-1);
  });

  it("flat() flattens one level by default", () => {
    expect(
      collect<any>([1, [2, 3], [4, [5, 6]]])
        .flat()
        .all(),
    ).toEqual([1, 2, 3, 4, [5, 6]]);
  });

  it("flat(depth) flattens deeper", () => {
    expect(
      collect<any>([1, [2, [3, [4]]]])
        .flat(3)
        .all(),
    ).toEqual([1, 2, 3, 4]);
  });

  it("flatMap maps then flattens one level", () => {
    expect(
      collect([1, 2, 3])
        .flatMap(n => [n, n * 10])
        .all(),
    ).toEqual([1, 10, 2, 20, 3, 30]);
  });

  it("join produces a delimited string (implode is an alias)", () => {
    const c = collect([1, 2, 3]);
    expect(c.join("-")).toBe("1-2-3");
    expect(c.implode(",")).toBe("1,2,3");
    expect(c.join()).toBe("1,2,3"); // default comma
  });

  it("keys, values, entries each return a collection", () => {
    const c = collect(["a", "b", "c"]);
    expect(c.keys().all()).toEqual([0, 1, 2]);
    expect(c.values().all()).toEqual(["a", "b", "c"]);
    expect(c.entries().all()).toEqual([
      [0, "a"],
      [1, "b"],
      [2, "c"],
    ]);
  });

  it("indexes() returns the index list as a collection", () => {
    expect(collect(["a", "b", "c"]).indexes().all()).toEqual([0, 1, 2]);
  });

  it("for-of iterates using the underlying array's iterator", () => {
    const c = collect([1, 2, 3]);
    const seen: number[] = [];
    for (const n of c) seen.push(n);
    expect(seen).toEqual([1, 2, 3]);
  });

  it("toString produces the same string as Array.prototype.toString", () => {
    expect(collect([1, 2, 3]).toString()).toBe("1,2,3");
  });

  it("toJson stringifies the items", () => {
    expect(collect([1, 2, 3]).toJson()).toBe("[1,2,3]");
    expect(collect([{ a: 1 }]).toJson()).toBe('[{"a":1}]');
  });
});
