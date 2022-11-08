import { collect } from "src/ImmutableCollection";
import { studentsClasses } from "./data";

describe("collection/ImmutableCollection/listings", () => {
  it("should return return values that are in the odd indexes", () => {
    const collection = collect([1, 2, 3, 4, 5, 6, 7]).oddIndexes();

    expect(collection.all()).toEqual([2, 4, 6]);
  });

  it("should return return values that are in the even indexes", () => {
    const collection = collect([1, 2, 3, 4, 5, 6, 7]).evenIndexes();

    expect(collection.all()).toEqual([1, 3, 5, 7]);
  });

  it("should return return values that are in the given indexes", () => {
    const collection = collect([1, 2, 3, 4, 5, 6, 7]).onlyIndexes(0, 2, 4);

    expect(collection.all()).toEqual([1, 3, 5]);
  });

  it("should return return values that are not in the given indexes", () => {
    const collection = collect([1, 2, 3, 4, 5, 6, 7]).exceptIndexes(0, 2, 4);

    expect(collection.all()).toEqual([2, 4, 6, 7]);
  });

  it("should return even values", () => {
    const collection = collect([1, 2, 3, 4, 5, 6, 7]).even();

    expect(collection.all()).toEqual([2, 4, 6]);
  });
  it("should return even values of the given key", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Mohamed", age: 25 },
      { name: "Ali", age: 30 },
    ]).even("age");

    expect(collection.all()).toEqual([
      { name: "Ahmed", age: 20 },
      { name: "Ali", age: 30 },
    ]);
  });

  it("should return odd values", () => {
    const collection = collect([1, 2, 3, 4, 5, 6, 7]).odd();

    expect(collection.all()).toEqual([1, 3, 5, 7]);
  });

  it("should return odd values of the given key", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Mohamed", age: 25 },
      { name: "Ali", age: 30 },
    ]).odd("age");

    expect(collection.all()).toEqual([{ name: "Mohamed", age: 25 }]);
  });

  it("should return unique values", () => {
    const collection = collect([
      1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7,
    ]).unique();

    expect(collection.all()).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("should return unique values of the given key", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Mohamed", age: 25 },
      { name: "Ali", age: 30 },
      { name: "Ahmed", age: 20 },
      { name: "Mohamed", age: 25 },
      { name: "Ali", age: 30 },
    ]).unique("age");

    expect(collection.all()).toEqual([20, 25, 30]);
  });

  it("should return unique lists of the given key to return first matched value of each type", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Mohamed", age: 25 },
      { name: "Ali", age: 30 },
      { name: "Ahmed", age: 20 },
      { name: "Mohamed", age: 25 },
      { name: "Ali", age: 30 },
    ]).uniqueList("age");

    expect(collection.all()).toEqual([
      { name: "Ahmed", age: 20 },
      { name: "Mohamed", age: 25 },
      { name: "Ali", age: 30 },
    ]);
  });

  it("should reverse the collection using reverse method", () => {
    const collection = collect([1, 2, 3, 4, 5]).reverse();

    expect(collection.all()).toEqual([5, 4, 3, 2, 1]);
  });

  it("should reverse the collection using flip method", () => {
    const collection = collect([1, 2, 3, 4, 5]).flip();

    expect(collection.all()).toEqual([5, 4, 3, 2, 1]);
  });

  it("should return a copy of the collection using clone", () => {
    const collection = collect([1, 2, 3, 4, 5]).clone();

    expect(collection.all()).toEqual([1, 2, 3, 4, 5]);
  });

  it("should return a copy of the collection using copy", () => {
    const collection = collect([1, 2, 3, 4, 5]).copy();

    expect(collection.all()).toEqual([1, 2, 3, 4, 5]);
  });

  it("should group by the data by the given key", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Mohamed", age: 25 },
      { name: "Ali", age: 30 },
      { name: "Hasan", age: 30 },
    ]).groupBy("age");

    expect(collection.all()).toEqual([
      {
        age: 20,
        items: [{ name: "Ahmed", age: 20 }],
      },
      {
        age: 25,
        items: [{ name: "Mohamed", age: 25 }],
      },
      {
        age: 30,
        items: [
          { name: "Ali", age: 30 },
          { name: "Hasan", age: 30 },
        ],
      },
    ]);
  });

  it("It should pluck the given key and return a new collection with the plucked values", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Mohamed", age: 25 },
      { name: "Ali", age: 30 },
      { name: "Hasan", age: 30 },
    ]).pluck("name");

    expect(collection.all()).toEqual(["Ahmed", "Mohamed", "Ali", "Hasan"]);
  });

  it("It should pluck the given keys and return a new collection with the plucked values", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Mohamed", age: 25 },
      { name: "Ali", age: 30 },
      { name: "Hasan", age: 30 },
    ]).pluck(["name", "age"]);

    expect(collection.all()).toEqual([
      { name: "Ahmed", age: 20 },
      { name: "Mohamed", age: 25 },
      { name: "Ali", age: 30 },
      { name: "Hasan", age: 30 },
    ]);
  });

  it("should create a new collection from the given key from the given element index", () => {
    const collection = collect([
      {
        id: 1,
        data: ["Hasan", "Ali", "Mohamed"],
      },
      {
        id: 2,
        data: ["Ahmed", "Sayed", "Khaled"],
      },
      {
        id: 3,
        data: ["Hassan", "Zohdy", "Hassan"],
      },
    ]).collectFromKey(2, "data");

    expect(collection.all()).toEqual(["Hassan", "Zohdy", "Hassan"]);
  });

  it("should collect all values from the given key from each element", () => {
    const collection = collect([
      {
        id: 1,
        data: ["Hasan", "Ali", "Mohamed"],
      },
      {
        id: 2,
        data: ["Ahmed", "Sayed", "Khaled"],
      },
      {
        id: 3,
        data: ["Hassan", "Zohdy", "Hassan"],
      },
    ]).collectFrom("data");

    expect(collection.all()).toEqual([
      "Hasan",
      "Ali",
      "Mohamed",
      "Ahmed",
      "Sayed",
      "Khaled",
      "Hassan",
      "Zohdy",
      "Hassan",
    ]);
  });

  it("should create a new collection from the given key which can combine the index and the key as well in one argument", () => {
    const collection = collect([
      {
        id: 1,
        data: ["Hasan", "Ali", "Mohamed"],
      },
      {
        id: 2,
        data: ["Ahmed", "Sayed", "Khaled"],
      },
      {
        id: 3,
        data: ["Hassan", "Zohdy", "Hassan"],
      },
    ]).collectFromKey("2.data");

    expect(collection.all()).toEqual(["Hassan", "Zohdy", "Hassan"]);
  });

  it("should select only the given keys from each element in the array", () => {
    const collection = collect([
      { name: "Ahmed", age: 20, job: "Developer" },
      { name: "Mohamed", age: 25, job: "Designer" },
      { name: "Ali", age: 30, job: "Manager" },
      { name: "Hasan", age: 30, job: "Manager" },
    ]).select("name", "age");

    expect(collection.all()).toEqual([
      { name: "Ahmed", age: 20 },
      { name: "Mohamed", age: 25 },
      { name: "Ali", age: 30 },
      { name: "Hasan", age: 30 },
    ]);
  });

  it("should group by the data by the given key and set the list as key", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Mohamed", age: 25 },
      { name: "Ali", age: 30 },
      { name: "Hasan", age: 30 },
    ]).groupBy("age", "data");

    expect(collection.all()).toEqual([
      {
        age: 20,
        data: [{ name: "Ahmed", age: 20 }],
      },
      {
        age: 25,
        data: [{ name: "Mohamed", age: 25 }],
      },
      {
        age: 30,
        data: [
          { name: "Ali", age: 30 },
          { name: "Hasan", age: 30 },
        ],
      },
    ]);
  });

  it("should group by multiple keys", () => {
    const collection = collect(studentsClasses).groupBy(["class", "grade"]);

    expect(collection.all()).toEqual([
      {
        class: "A",
        grade: 1,
        items: [
          {
            id: 1,
            class: "A",
            grade: 1,
          },
        ],
      },
      {
        class: "B",
        grade: 2,
        items: [
          {
            id: 2,
            class: "B",
            grade: 2,
          },
          {
            id: 4,
            class: "B",
            grade: 2,
          },
          {
            id: 5,
            class: "B",
            grade: 2,
          },
        ],
      },
      {
        class: "A",
        grade: 3,
        items: [
          {
            id: 3,
            class: "A",
            grade: 3,
          },
        ],
      },
      {
        class: "C",
        grade: 5,
        items: [
          {
            id: 6,
            class: "C",
            grade: 5,
          },
        ],
      },
    ]);
  });

  it("should chunk the collection into the given number of groups", () => {
    const collection = collect([1, 2, 3, 4, 5, 6, 7, 8]).chunk(4, false);

    expect(collection.all()).toEqual([
      [1, 2, 3, 4],
      [5, 6, 7, 8],
    ]);
  });

  it("should chunk the collection into given number of groups and return each chunk in a collection", () => {
    const collection = collect([1, 2, 3, 4, 5, 6, 7, 8]).chunk(4);

    expect(collection.all()).toEqual([
      collect([1, 2, 3, 4]),
      collect([5, 6, 7, 8]),
    ]);
  });

  it("should return the array list from the collection using toArray", () => {
    const collection = collect([1, 2, 3, 4, 5, 6, 7, 8]).toArray();

    expect(collection).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it("should return the array list from the collection using all", () => {
    const collection = collect([1, 2, 3, 4, 5, 6, 7, 8]).all();

    expect(collection).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it("should return the array list using toArray but to map over the values", () => {
    const collection = collect([1, 2, 3, 4, 5, 6, 7, 8]).toArray(
      value => value * 2,
    );

    expect(collection).toEqual([2, 4, 6, 8, 10, 12, 14, 16]);
  });
});
