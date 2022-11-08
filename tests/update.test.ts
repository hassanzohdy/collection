import { collect } from "src/ImmutableCollection";

describe("collection/ImmutableCollection/update", () => {
  it("should update the value of the given index with a new value using update", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.update(0, 10).equals([10, 2, 3, 4, 5])).toBeTruthy();
  });

  it("should update the value of the given index with a new value using set", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.set(4, 10).equals([1, 2, 3, 4, 10])).toBeTruthy();
  });

  it("should replace the given old value with the new value", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.replace(1, 10).equals([10, 2, 3, 4, 5])).toBeTruthy();
  });

  it("should replace all the old values with the given value", () => {
    const collection = collect([1, 2, 1, 3, 4, 1, 5]);

    expect(
      collection.replaceAll(1, 10).equals([10, 2, 10, 3, 4, 10, 5]),
    ).toBeTruthy();
  });
});
