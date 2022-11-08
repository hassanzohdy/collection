import { collect } from "src/ImmutableCollection";

describe("collection/ImmutableCollection/random", () => {
  it("should return a random item from the collection", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.random()).toBeGreaterThanOrEqual(1);
    expect(collection.random()).toBeLessThanOrEqual(5);
  });

  it("should return multiple random values based on the given number", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.random(2).length).toEqual(2);
  });

  it("should shuffle the collection", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.shuffle()).not.toEqual([1, 2, 3, 4, 5]);
  });
});
