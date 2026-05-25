import { describe, expect, it } from "vitest";
import { collect } from "../ImmutableCollection";

describe("take / limit (head)", () => {
  it("take(n) returns the first n items as a new collection", () => {
    expect(collect([1, 2, 3, 4, 5]).take(3).all()).toEqual([1, 2, 3]);
  });

  it("limit is an alias for take", () => {
    expect(collect([1, 2, 3, 4, 5]).limit(2).all()).toEqual([1, 2]);
  });

  it("take(0) returns an empty collection", () => {
    expect(collect([1, 2, 3]).take(0).all()).toEqual([]);
  });

  it("take(n) where n exceeds length returns all items", () => {
    expect(collect([1, 2, 3]).take(100).all()).toEqual([1, 2, 3]);
  });
});

describe("takeLast / takeUntil / takeWhile (tail / boundary)", () => {
  it("takeLast(n) returns the last n items", () => {
    expect(collect([1, 2, 3, 4, 5]).takeLast(2).all()).toEqual([4, 5]);
  });

  it("takeUntil stops at the first match (exclusive)", () => {
    expect(
      collect([1, 2, 3, 4, 5])
        .takeUntil(n => n === 4)
        .all(),
    ).toEqual([1, 2, 3]);
  });

  it("takeWhile is filter — keeps everything matching the predicate", () => {
    expect(
      collect([1, 2, 3, 4, 5])
        .takeWhile(n => n < 4)
        .all(),
    ).toEqual([1, 2, 3]);
  });
});

describe("skip / skipTo / skipLast / skipUntil / skipLastUntil", () => {
  it("skip(n) drops the first n items", () => {
    expect(collect([1, 2, 3, 4, 5]).skip(2).all()).toEqual([3, 4, 5]);
  });

  it("skipTo is an alias for skip", () => {
    expect(collect([1, 2, 3, 4, 5]).skipTo(3).all()).toEqual([4, 5]);
  });

  it("skipLast(n) drops the last n items", () => {
    expect(collect([1, 2, 3, 4, 5]).skipLast(2).all()).toEqual([1, 2, 3]);
  });

  it("skipUntil starts from the first match (inclusive)", () => {
    expect(
      collect([1, 2, 3, 4, 5])
        .skipUntil(n => n === 3)
        .all(),
    ).toEqual([3, 4, 5]);
  });

  it("skipLastUntil keeps items before the first match", () => {
    expect(
      collect([1, 2, 3, 4, 5])
        .skipLastUntil(n => n === 3)
        .all(),
    ).toEqual([1, 2]);
  });

  it("skipLastWhile drops a trailing run of matching items", () => {
    expect(
      collect([1, 2, 3, 4, 5])
        .skipLastWhile(n => n > 3)
        .all(),
    ).toEqual([1, 2, 3]);
  });
});

describe("slice / splice", () => {
  it("slice(start, end) returns a new collection without mutating", () => {
    const a = collect([1, 2, 3, 4, 5]);
    const b = a.slice(1, 4);
    expect(b.all()).toEqual([2, 3, 4]);
    expect(a.all()).toEqual([1, 2, 3, 4, 5]); // unchanged
  });

  it("slice(start) reads to the end", () => {
    expect(collect([1, 2, 3, 4, 5]).slice(3).all()).toEqual([4, 5]);
  });

  it("slice with negative indexes counts from the end", () => {
    expect(collect([1, 2, 3, 4, 5]).slice(-2).all()).toEqual([4, 5]);
  });

  it("splice(start, deleteCount) returns a new collection with elements removed (non-mutating)", () => {
    const a = collect([1, 2, 3, 4, 5]);
    const b = a.splice(1, 2);
    expect(b.all()).toEqual([1, 4, 5]);
    expect(a.all()).toEqual([1, 2, 3, 4, 5]); // unchanged
  });

  it("splice(start, deleteCount, ...inserts) supports the full signature", () => {
    expect(collect([1, 2, 3]).splice(1, 1, 99, 100).all()).toEqual([
      1, 99, 100, 3,
    ]);
  });
});

describe("chunk", () => {
  it("chunk(size) wraps each chunk in a sub-collection by default", () => {
    const c = collect([1, 2, 3, 4, 5]).chunk(2);
    expect(c.length).toBe(3);
    expect(c.at(0).all()).toEqual([1, 2]);
    expect(c.at(1).all()).toEqual([3, 4]);
    expect(c.at(2).all()).toEqual([5]);
  });

  it("chunk(size, false) returns plain arrays", () => {
    const c = collect([1, 2, 3, 4]).chunk(2, false);
    expect(c.all()).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  it("chunk on an array smaller than size returns a single chunk", () => {
    const c = collect([1, 2]).chunk(5, false);
    expect(c.all()).toEqual([[1, 2]]);
  });

  it("chunk preserves order across chunks", () => {
    const c = collect([1, 2, 3, 4, 5, 6]).chunk(3, false);
    expect(c.all()).toEqual([
      [1, 2, 3],
      [4, 5, 6],
    ]);
  });
});

describe("random / shuffle", () => {
  it("random() returns a single item from the collection", () => {
    const c = collect([1, 2, 3, 4, 5]);
    const value = c.random();
    expect([1, 2, 3, 4, 5]).toContain(value);
  });

  it("random(n) returns n items as a collection", () => {
    const c = collect([1, 2, 3, 4, 5]).random(3);
    expect(c.length).toBe(3);
  });

  it("shuffle returns a new collection (order may differ)", () => {
    // We don't seed Math.random, but for a long-enough array the chance
    // of getting the exact same order is vanishingly small. To avoid a
    // flaky test, we only assert length and content equality (as a set).
    const source = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const shuffled = collect(source).shuffle().all();
    expect(shuffled).toHaveLength(source.length);
    expect([...shuffled].sort((a, b) => a - b)).toEqual(source);
  });
});
