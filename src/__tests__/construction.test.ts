import { describe, expect, it } from "vitest";
import { ImmutableCollection, collect } from "../ImmutableCollection";

describe("construction", () => {
  it("collect() returns an ImmutableCollection instance", () => {
    expect(collect([])).toBeInstanceOf(ImmutableCollection);
    expect(collect([1, 2, 3])).toBeInstanceOf(ImmutableCollection);
  });

  it("defaults to an empty collection when no input is given", () => {
    expect(collect().all()).toEqual([]);
    expect(collect().length).toBe(0);
    expect(new ImmutableCollection().all()).toEqual([]);
  });

  it("clones the input array — mutating the source does not affect the collection", () => {
    const source = [1, 2, 3];
    const c = collect(source);
    source.push(99);
    expect(c.all()).toEqual([1, 2, 3]);
  });

  it("clones items from another collection passed to the constructor", () => {
    const a = collect([1, 2, 3]);
    const b = collect(a);
    expect(b.all()).toEqual([1, 2, 3]);
    expect(b.equals(a)).toBe(true);
  });

  it("throws when given a non-array, non-collection input", () => {
    // @ts-expect-error — intentionally bad input
    expect(() => new ImmutableCollection("not an array")).toThrow(
      /Invalid items type/,
    );
    // @ts-expect-error — intentionally bad input
    expect(() => new ImmutableCollection({ a: 1 })).toThrow();
  });

  it("ImmutableCollection.fromIterator builds from an Iterable", () => {
    const set = new Set([1, 2, 3]);
    expect(ImmutableCollection.fromIterator(set).all()).toEqual([1, 2, 3]);

    // arrays are iterables
    expect(ImmutableCollection.fromIterator([4, 5, 6]).all()).toEqual([
      4, 5, 6,
    ]);

    // .values() iterator
    expect(ImmutableCollection.fromIterator([7, 8, 9].values()).all()).toEqual([
      7, 8, 9,
    ]);
  });

  it("ImmutableCollection.create(length) makes a sparse-default collection", () => {
    const c = ImmutableCollection.create(3);
    expect(c.length).toBe(3);
    expect(c.all()).toEqual([undefined, undefined, undefined]);
  });

  it("ImmutableCollection.create(length, value) repeats the value", () => {
    expect(ImmutableCollection.create(3, 7).all()).toEqual([7, 7, 7]);
  });

  it("ImmutableCollection.create(length, fn) calls fn with the index", () => {
    expect(ImmutableCollection.create(4, i => i * 2).all()).toEqual([
      0, 2, 4, 6,
    ]);
  });

  it("collect.create / collect.fromIterator delegate to the static methods", () => {
    expect(collect.create(2, 0).all()).toEqual([0, 0]);
    expect(collect.fromIterator([1, 2]).all()).toEqual([1, 2]);
  });

  it("constructor with an empty array preserves length 0", () => {
    const c = collect<number>([]);
    expect(c.length).toBe(0);
    expect(c.isEmpty()).toBe(true);
  });
});
