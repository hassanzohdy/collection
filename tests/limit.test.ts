import { collect } from "src/ImmutableCollection";

describe("collection/ImmutableCollection/limit", () => {
  it("should take the first 2 items using skip", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.take(2).equals([1, 2])).toBeTruthy();
  });

  it("should take the first 2 items using limit", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.limit(2).equals([1, 2])).toBeTruthy();
  });

  it("should take the last 2 items", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.takeLast(2).equals([4, 5])).toBeTruthy();
  });

  it("should take items until matches the given callback", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(
      collection.takeUntil(item => item === 3).equals([1, 2]),
    ).toBeTruthy();
  });

  it("should take items while matches the given callback", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.takeWhile(item => item < 3).equals([1, 2])).toBeTruthy();
  });

  it("should skip the given number of items using skip", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.skip(2).equals([3, 4, 5])).toBeTruthy();
  });

  it("should skip the given number of items using skipTo", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.skipTo(3).all()).toEqual([4, 5]);
  });

  it("should skip last the given number of items", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.skipLast(2).equals([1, 2, 3])).toBeTruthy();
  });

  it("should skip items until matches the given callback", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(
      collection.skipUntil(item => item === 3).equals([3, 4, 5]),
    ).toBeTruthy();
  });

  it("should skip last items until matches the given callback", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.skipLastUntil(item => item === 3).all()).toEqual([1, 2]);
  });

  it("should skip items while matches the given callback", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(
      collection.skipWhile(item => item < 3).equals([3, 4, 5]),
    ).toBeTruthy();
  });

  it("should slice the collection", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.slice(1, 3).equals([2, 3])).toBeTruthy();
  });

  it("should slice the collection from the given start index", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.slice(3).equals([4, 5])).toBeTruthy();
  });

  it("should slice the collection to the given end index", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.slice(0, 3).equals([1, 2, 3])).toBeTruthy();
  });

  it("should splice the collection", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.splice(1, 2).all()).toEqual([1, 4, 5]);
  });
});
