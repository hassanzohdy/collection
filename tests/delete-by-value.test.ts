import { collect } from "src/ImmutableCollection";

describe("collection/ImmutableCollection/deleteByValue", () => {
  it("should delete first matched value with the callback from the collection", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(
      collection.remove(value => value === 1).equals([2, 3, 4, 5]),
    ).toBeTruthy();
  });

  it("should return the first value from the collection and remove it as well", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.shift()).toEqual(1);

    expect(collection.equals([2, 3, 4, 5])).toBeTruthy();
  });

  it("should return the last value from the collection and remove it as well", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.pop()).toEqual(5);

    expect(collection.equals([1, 2, 3, 4])).toBeTruthy();
  });
});
