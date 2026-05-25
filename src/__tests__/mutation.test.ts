import { describe, expect, it } from "vitest";
import { collect } from "../ImmutableCollection";

// This file documents the non-mutating behavior of every method on
// ImmutableCollection. The class previously had mutation leaks via
// `sort`, `reverse`, `shift`, `pop`, and `sortByDesc` — these have been
// fixed so every method either returns a new collection or leaves the
// underlying array untouched.

describe("non-mutating insert/push/unshift", () => {
  it("push returns a new collection and leaves the source unchanged", () => {
    const a = collect([1, 2, 3]);
    const b = a.push(4, 5);
    expect(a.all()).toEqual([1, 2, 3]);
    expect(b.all()).toEqual([1, 2, 3, 4, 5]);
    expect(a).not.toBe(b);
  });

  it("append is an alias for push", () => {
    expect(collect([1, 2]).append(3).all()).toEqual([1, 2, 3]);
  });

  it("unshift returns a new collection and leaves the source unchanged", () => {
    const a = collect([3, 4, 5]);
    const b = a.unshift(1, 2);
    expect(a.all()).toEqual([3, 4, 5]);
    expect(b.all()).toEqual([1, 2, 3, 4, 5]);
  });

  it("prepend is an alias for unshift", () => {
    expect(collect([2, 3]).prepend(1).all()).toEqual([1, 2, 3]);
  });

  it("pushUnique skips items that already exist", () => {
    const a = collect([1, 2, 3]);
    const b = a.pushUnique(2, 4, 1, 5);
    expect(a.all()).toEqual([1, 2, 3]);
    expect(b.all()).toEqual([1, 2, 3, 4, 5]);
  });

  it("prependUnique / unshiftUnique skip items that already exist", () => {
    // New items are prepended in argument order; existing items are skipped.
    expect(collect([3, 4]).prependUnique(1, 2, 3).all()).toEqual([1, 2, 3, 4]);
    // (Only 2 is new; 3 and 4 already exist and are skipped.)
    expect(collect([3, 4]).unshiftUnique(2, 3, 4).all()).toEqual([2, 3, 4]);
  });

  it("merge / concat append the given arrays (does NOT mutate)", () => {
    const a = collect([1, 2]);
    const b = a.merge([3, 4], [5]);
    expect(a.all()).toEqual([1, 2]);
    expect(b.all()).toEqual([1, 2, 3, 4, 5]);
    expect(a.concat([3, 4]).all()).toEqual([1, 2, 3, 4]);
  });
});

describe("delete / remove (non-mutating where the API permits)", () => {
  it("delete(index) returns a new collection without the element at that index", () => {
    const a = collect([1, 2, 3, 4]);
    const b = a.delete(1);
    expect(a.all()).toEqual([1, 2, 3, 4]);
    expect(b.all()).toEqual([1, 3, 4]);
  });

  it("unset(...indexes) removes multiple indexes at once", () => {
    expect(
      collect([10, 20, 30, 40, 50]).unset(0, 2, 4).all(),
    ).toEqual([20, 40]);
  });

  it("remove(value) drops the first item strictly equal to the given value", () => {
    expect(collect([1, 2, 3, 2, 1]).remove(2).all()).toEqual([1, 3, 2, 1]);
  });

  it("remove(value) on a non-matching value returns the unchanged collection", () => {
    // `findIndex` returns -1, then unset(-1) filters nothing.
    const a = collect([1, 2, 3]);
    const b = a.remove(999);
    expect(b.all()).toEqual([1, 2, 3]);
  });
});

describe("non-mutating shift / pop / sort / reverse / sortByDesc", () => {
  // These previously leaked Array.prototype mutation through `this.items`
  // and have been fixed to leave the underlying array untouched.

  it("shift returns the first item without mutating the source", () => {
    const a = collect([1, 2, 3]);
    const first = a.shift();
    expect(first).toBe(1);
    expect(a.all()).toEqual([1, 2, 3]); // source unchanged
  });

  it("pop returns the last item without mutating the source", () => {
    const a = collect([1, 2, 3]);
    const last = a.pop();
    expect(last).toBe(3);
    expect(a.all()).toEqual([1, 2, 3]); // source unchanged
  });

  it("sort() returns a new sorted collection and does NOT mutate the source", () => {
    const a = collect([3, 1, 2]);
    const b = a.sort();
    expect(b.all()).toEqual([1, 2, 3]);
    expect(a.all()).toEqual([3, 1, 2]); // source unchanged
  });

  it("reverse() returns a new reversed collection and does NOT mutate the source", () => {
    const a = collect([1, 2, 3]);
    const b = a.reverse();
    expect(b.all()).toEqual([3, 2, 1]);
    expect(a.all()).toEqual([1, 2, 3]); // source unchanged
  });

  it("flip() is an alias for reverse() — also non-mutating", () => {
    const a = collect([1, 2, 3]);
    const b = a.flip();
    expect(b.all()).toEqual([3, 2, 1]);
    expect(a.all()).toEqual([1, 2, 3]); // source unchanged
  });

  it("sortByDesc(key) returns a new collection and does NOT mutate the source", () => {
    const a = collect([
      { id: 1, age: 30 },
      { id: 2, age: 10 },
      { id: 3, age: 20 },
    ]);
    const b = a.sortByDesc("age");
    expect(b.all().map(u => u.id)).toEqual([1, 3, 2]);
    expect(a.all().map(u => u.id)).toEqual([1, 2, 3]); // source unchanged
  });
});

describe("set / update / replace (non-mutating)", () => {
  it("set(index, value) overwrites at index and returns a new collection", () => {
    const a = collect([1, 2, 3]);
    const b = a.set(1, 99);
    expect(a.all()).toEqual([1, 2, 3]);
    expect(b.all()).toEqual([1, 99, 3]);
  });

  it("update is an alias for set", () => {
    expect(collect([1, 2, 3]).update(0, 0).all()).toEqual([0, 2, 3]);
  });

  it("replace(old, new) swaps the first occurrence", () => {
    expect(collect([1, 2, 1, 2]).replace(1, 9).all()).toEqual([9, 2, 1, 2]);
  });

  it("replace on a missing value returns the same items", () => {
    expect(collect([1, 2, 3]).replace(99, 0).all()).toEqual([1, 2, 3]);
  });

  it("replaceAll swaps every occurrence", () => {
    expect(collect([1, 2, 1, 2]).replaceAll(1, 9).all()).toEqual([9, 2, 9, 2]);
  });

  it("swap exchanges two indexes (non-mutating)", () => {
    const a = collect([10, 20, 30]);
    const b = a.swap(0, 2);
    expect(a.all()).toEqual([10, 20, 30]);
    expect(b.all()).toEqual([30, 20, 10]);
  });

  it("move(from, to) repositions one element (non-mutating)", () => {
    const b = collect([1, 2, 3, 4, 5]).move(0, 4);
    expect(b.all()).toEqual([2, 3, 4, 5, 1]);
  });

  it("reorder({oldIndex: newIndex}) writes items to their new positions", () => {
    // Each oldIndex maps to a newIndex; unmapped slots keep their original
    // value, then mapped slots overwrite.
    const b = collect([1, 2, 3, 4, 5]).reorder({
      0: 4,
      1: 3,
      2: 2,
      3: 1,
      4: 0,
    });
    expect(b.all()).toEqual([5, 4, 3, 2, 1]);
  });
});

describe("clone / copy", () => {
  it("clone returns a new collection with the same items", () => {
    const a = collect([1, 2, 3]);
    const b = a.clone();
    expect(a).not.toBe(b);
    expect(b.all()).toEqual([1, 2, 3]);
  });

  it("copy is an alias for clone", () => {
    expect(collect([1, 2]).copy().all()).toEqual([1, 2]);
  });

  it("the clone holds its own array reference, distinct from the source", () => {
    const a = collect([1, 2, 3]);
    const b = a.clone();
    // The two collections back different arrays — mutating one's `.items`
    // directly would not bleed into the other.
    expect(a.all()).not.toBe(b.all());
    expect(b.all()).toEqual([1, 2, 3]);
  });
});
