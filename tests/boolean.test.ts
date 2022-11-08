import { collect } from "src/ImmutableCollection";

describe("collection/ImmutableCollection/boolean", () => {
  it("should check if the array contains the given value using includes method", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.includes(1)).toBeTruthy();
  });

  it("should check if the array contains the given value using contains method", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.contains(1)).toBeTruthy();
  });

  it("should check if the array contains the given value using callback", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.has(item => item === 1)).toBeTruthy();
  });

  it("should check if array is empty", () => {
    expect(collect([]).isEmpty()).toBeTruthy();

    expect(collect([1, 2, 3, 4, 5]).isEmpty()).toBeFalsy();
  });

  it("should check if array is not empty", () => {
    expect(collect([]).isNotEmpty()).toBeFalsy();

    expect(collect([1, 2, 3, 4, 5]).isNotEmpty()).toBeTruthy();
  });
});
