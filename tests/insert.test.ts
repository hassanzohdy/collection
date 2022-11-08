import { collect } from "src/ImmutableCollection";

describe("collection/ImmutableCollection/insert", () => {
  it("should add the given value to beginning of the collection using prepend", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.prepend(0).equals([0, 1, 2, 3, 4, 5])).toBeTruthy();
  });
  it("should add the given value to beginning of the collection using unshift", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.unshift(0).equals([0, 1, 2, 3, 4, 5])).toBeTruthy();
  });

  it("should add the given value to end of the collection using append", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.append(6).equals([1, 2, 3, 4, 5, 6])).toBeTruthy();
  });

  it("should add the given value to end of the collection using push", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.push(6).equals([1, 2, 3, 4, 5, 6])).toBeTruthy();
  });

  it("should add the only the unique values to the beginning of the collection using pushUnique", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.prependUnique(6, 4, 5, 1).all()).toEqual([
      6, 1, 2, 3, 4, 5,
    ]);
  });

  it("should add the only the unique values to the end of the collection using pushUnique", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(
      collection.pushUnique(6, 4, 5, 1).equals([1, 2, 3, 4, 5, 6]),
    ).toBeTruthy();
  });
});
