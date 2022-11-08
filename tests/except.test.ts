import { collect } from "src/ImmutableCollection";

describe("collection/ImmutableCollection/filtering", () => {
  it("should reject first matched item with the given callback using rejectFirst", () => {
    const collection = collect([1, 2, 3, 4, 5, 3, 5]);

    expect(collection.rejectFirst(item => item === 3).all()).toEqual([
      1, 2, 4, 5, 3, 5,
    ]);
  });

  it("should reject first matched item with the given callback using exceptFirst", () => {
    const collection = collect([1, 2, 3, 4, 5, 3, 5]);

    expect(collection.exceptFirst(item => item === 3).all()).toEqual([
      1, 2, 4, 5, 3, 5,
    ]);
  });

  it('should reject last matched item with the given callback using "exceptLast"', () => {
    const collection = collect([1, 2, 3, 4, 5, 3, 5]);

    expect(collection.exceptLast(item => item === 3).all()).toEqual([
      1, 2, 3, 4, 5, 5,
    ]);
  });

  it('should reject last matched item with the given callback using "rejectLast"', () => {
    const collection = collect([1, 2, 3, 4, 5, 3, 5]);

    expect(collection.rejectLast(item => item === 3).all()).toEqual([
      1, 2, 3, 4, 5, 5,
    ]);
  });

  it("should reject all matched items with the given callback using reject", () => {
    const collection = collect([1, 2, 3, 4, 5, 3, 5]);

    expect(collection.reject(item => item === 3).all()).toEqual([
      1, 2, 4, 5, 5,
    ]);
  });

  it("should reject all matched items with the given callback using except", () => {
    const collection = collect([1, 2, 3, 4, 5, 3, 5]);

    expect(collection.except(item => item === 3).all()).toEqual([
      1, 2, 4, 5, 5,
    ]);
  });

  it("should return all items that its value does not match the given value using not method", () => {
    const collection = collect([1, 2, 3, 4, 5, 3, 5]);

    expect(collection.not(3).all()).toEqual([1, 2, 4, 5, 5]);
  });
});
