import { collect } from "src/ImmutableCollection";

describe("collection/ImmutableCollection/merge", () => {
  it("should merge with the given array", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(
      collection
        .merge([6, 7, 8, 9, 10])
        .equals([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    ).toBeTruthy();
  });

  it("should concat the given array to the collection", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(
      collection
        .concat([6, 7, 8, 9, 10])
        .equals([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    ).toBeTruthy();
  });
});
