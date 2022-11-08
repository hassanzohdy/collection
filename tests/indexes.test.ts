import { collect } from "src/ImmutableCollection";

describe("collection/ImmutableCollection/indexes", () => {
  it("should return the items length", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.length).toBe(5);
  });

  it("should return the indexes of the collection items", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.indexes().all()).toEqual([0, 1, 2, 3, 4]);
  });

  it("should return the keys (indexes) as list of strings of the collection items", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.keys().all()).toEqual([0, 1, 2, 3, 4]);
  });

  it("should return last index of the collection", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.lastIndex()).toBe(4);
  });

  it("should return the value at the given index using at", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.at(2)).toBe(3);
  });

  it("should return the value at the given index using index", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.index(2)).toBe(3);
  });
});
