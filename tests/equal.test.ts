import { ImmutableCollection, collect } from "src/ImmutableCollection";

describe("collection/ImmutableCollection/equal", () => {
  it("should return a Collection instance", () => {
    expect(collect([])).toBeInstanceOf(ImmutableCollection);
  });

  it("should equal to the given array", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.equals([1, 2, 3, 4, 5])).toBeTruthy();
  });

  it("should equal to the given collection", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.equals(collect([1, 2, 3, 4, 5]))).toBeTruthy();
  });
});
