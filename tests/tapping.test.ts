import { collect } from "src/ImmutableCollection";

describe("collection/ImmutableCollection/operations", () => {
  it("should perform the given callback over each element in the collection", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    const spy = jest.fn();

    collection.forEach(spy);

    expect(spy).toHaveBeenCalledTimes(5);
  });
  it("should perform the given callback over each element in the collection using each method", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    const spy = jest.fn();

    collection.each(spy);

    expect(spy).toHaveBeenCalledTimes(5);
  });

  it("Tap over the collection and do something with it", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    const spy = jest.fn();

    collection.tap(spy);

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
