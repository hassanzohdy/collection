import ImmutableCollection, { collect } from "src/ImmutableCollection";

describe("collection/ImmutableCollection/create", () => {
  it("should create collection from iterators", () => {
    const array = [1, 2, 3];

    expect(ImmutableCollection.fromIterator(array.values())).toEqual(
      collect(array),
    );
    expect(ImmutableCollection.fromIterator(array)).toEqual(collect(array));
  });

  it("should create a new collection with the given length", () => {
    expect(ImmutableCollection.create(3)).toEqual(
      collect([undefined, undefined, undefined]),
    );

    expect(ImmutableCollection.create(3).length).toEqual(3);
  });

  it("should create a new collection with the given length and initial value", () => {
    expect(ImmutableCollection.create(3, 1)).toEqual(collect([1, 1, 1]));
    expect(ImmutableCollection.create(3, 1).length).toEqual(3);
  });
  it("should create a new collection with the given length and initial value based on the index", () => {
    expect(ImmutableCollection.create(3, index => index)).toEqual(
      collect([0, 1, 2]),
    );
    expect(ImmutableCollection.create(3, index => index).all()).toEqual([
      0, 1, 2,
    ]);
  });
});
