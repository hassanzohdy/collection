import { collect } from "src/ImmutableCollection";

describe("collection/ImmutableCollection/deleteByIndex", () => {
  it("should delete the element of the given index", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.delete(0).equals([2, 3, 4, 5])).toBeTruthy();
  });

  it("should delete the given indexes from the collection", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.unset(0, 2, 4).equals([2, 4])).toBeTruthy();
  });
});
