import { collect } from "src/ImmutableCollection";

describe("collection/ImmutableCollection/reordering", () => {
  it("should swap between two indexes", () => {
    const collection = collect([1, 2, 3, 4, 5]).swap(0, 4);

    expect(collection.all()).toEqual([5, 2, 3, 4, 1]);
  });

  it("should move the given index into the given position", () => {
    const collection = collect([1, 2, 3, 4, 5, 6, 7]).move(2, 4);

    expect(collection.all()).toEqual([1, 2, 4, 5, 3, 6, 7]);
  });

  it("should reorder the indexes based on the given indexes object map", () => {
    const collection = collect([1, 2, 3, 4, 5, 6, 7]).reorder({
      0: 3,
      1: 4,
      2: 5,
      3: 6,
      4: 0,
      5: 1,
      6: 2,
    });

    expect(collection.all()).toEqual([5, 6, 7, 1, 2, 3, 4]);
  });
});
