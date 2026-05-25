import { describe, expect, it, vi } from "vitest";
import { collect, ImmutableCollection } from "../ImmutableCollection";

describe("tap", () => {
  it("invokes the callback with the collection and returns the SAME collection", () => {
    const c = collect([1, 2, 3]);
    const cb = vi.fn();
    const out = c.tap(cb);
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith(c);
    expect(out).toBe(c); // identity preserved for chaining
  });

  it("plays nicely in the middle of a chain", () => {
    const seen: number[] = [];
    const result = collect([1, 2, 3])
      .map(n => n * 2)
      .tap(c => seen.push(c.length))
      .filter(n => n > 2)
      .all();
    expect(result).toEqual([4, 6]);
    expect(seen).toEqual([3]); // length captured mid-chain
  });
});

describe("for-of iteration", () => {
  it("Symbol.iterator yields each item in order", () => {
    const seen: number[] = [];
    for (const n of collect([10, 20, 30])) {
      seen.push(n);
    }
    expect(seen).toEqual([10, 20, 30]);
  });

  it("the iterator finishes on an empty collection (no items)", () => {
    let count = 0;
    for (const _ of collect([])) count++;
    expect(count).toBe(0);
  });

  it("a collection can be spread back into an array", () => {
    expect([...collect([1, 2, 3])]).toEqual([1, 2, 3]);
  });

  it("the collection is itself an Iterable<T>", () => {
    const c = collect([1, 2, 3]);
    // Array.from accepts any iterable.
    expect(Array.from(c)).toEqual([1, 2, 3]);
  });
});

describe("ImmutableCollection identity", () => {
  it("the collect() factory creates ImmutableCollection instances", () => {
    expect(collect([])).toBeInstanceOf(ImmutableCollection);
  });

  it("class methods return ImmutableCollection instances (not plain arrays)", () => {
    expect(collect([1, 2]).map(n => n + 1)).toBeInstanceOf(ImmutableCollection);
    expect(collect([1, 2]).filter(n => n > 0)).toBeInstanceOf(
      ImmutableCollection,
    );
    expect(collect([1, 2]).push(3)).toBeInstanceOf(ImmutableCollection);
  });
});
