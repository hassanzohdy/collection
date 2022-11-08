import { collect } from "src/ImmutableCollection";

describe("collection/ImmutableCollection/sorting", () => {
  it("should sort the collection", () => {
    const collection = collect([5, 3, 1, 2, 4]);

    expect(collection.sort().all()).toEqual([1, 2, 3, 4, 5]);
  });

  it("should sort the collection with a custom callback", () => {
    const collection = collect([5, 3, 1, 2, 4]);

    expect(
      collection
        .sort((a, b) => {
          if (a > b) {
            return -1;
          }

          if (a < b) {
            return 1;
          }

          return 0;
        })
        .all(),
    ).toEqual([5, 4, 3, 2, 1]);
  });

  it("should sort the collection by the given key in asc order", () => {
    const collection = collect([
      { name: "Jane", age: 25 },
      { name: "Jack", age: 30 },
      { name: "John", age: 20 },
    ]);

    expect(collection.sortBy("age").all()).toEqual([
      { name: "John", age: 20 },
      { name: "Jane", age: 25 },
      { name: "Jack", age: 30 },
    ]);
  });

  it("should sort the collection by the given key in desc order", () => {
    const collection = collect([
      { name: "Jane", age: 25 },
      { name: "Jack", age: 30 },
      { name: "John", age: 20 },
    ]);

    expect(collection.sortByDesc("age").all()).toEqual([
      { name: "Jack", age: 30 },
      { name: "Jane", age: 25 },
      { name: "John", age: 20 },
    ]);
  });

  it("should sort the collection by the given list of keys", () => {
    const collection = collect([
      { name: "Jane", age: 25 },
      { name: "Jack", age: 30 },
      { name: "Ali", age: 20 },
      { name: "Hasan", age: 20 },
      { name: "Hasan", age: 19 },
    ]);

    expect(
      collection
        .sortBy({
          age: "asc",
          name: "asc",
        })
        .all(),
    ).toEqual([
      { name: "Hasan", age: 19 },
      { name: "Ali", age: 20 },
      { name: "Hasan", age: 20 },
      { name: "Jane", age: 25 },
      { name: "Jack", age: 30 },
    ]);
  });
});
