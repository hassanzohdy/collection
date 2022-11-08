import { collect } from "src/ImmutableCollection";

describe("collection/ImmutableCollection/iteration", () => {
  it("should loop over the collection using for-of", () => {
    const collection = collect([1, 2, 3, 4, 5, 6, 7]);

    for (const value of collection) {
      expect(typeof value).toBe("number");
    }
  });
});
