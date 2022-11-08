import { collect } from "src/ImmutableCollection";

describe("collection/ImmutableCollection/math", () => {
  it("should return min value of the collection", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.min()).toBe(1);
  });

  it("should return min value of the given key of the collection", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Mohamed", age: 25 },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.min("age")).toBe(20);
  });

  it("should return max value of the collection", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.max()).toBe(5);
  });

  it("should return max value of the given key of the collection", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Mohamed", age: 25 },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.max("age")).toBe(30);
  });

  it("should sum the total amount of the collection items", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.sum()).toBe(15);
  });

  it("should sum the total amount of the given key of the collection items", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Mohamed", age: 25 },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.sum("age")).toBe(75);
  });

  it("should return the average of the collection items", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.average()).toBe(3);
  });

  it("should return the average of the given key of the collection items", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Mohamed", age: 25 },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.average("age")).toBe(25);
  });

  it("should return the median of the collection items", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.median()).toBe(3);
  });

  it("should return the median of the given key of the collection items", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Mohamed", age: 25 },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.median("age")).toBe(25);
  });

  it("should plus the given value to the collection items", () => {
    const collection = collect([1, 2, 3, 4, 5]).plus(1);

    expect(collection.all()).toEqual([2, 3, 4, 5, 6]);
  });

  it("should plus the given value to the given key of the collection items", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Mohamed", age: 25 },
      { name: "Ali", age: 30 },
    ]).plus("age", 1);

    expect(collection.all()).toEqual([
      { name: "Ahmed", age: 21 },
      { name: "Mohamed", age: 26 },
      { name: "Ali", age: 31 },
    ]);
  });

  it("should increment each item in the collection by one", () => {
    const collection = collect([1, 2, 3, 4, 5]).increment();

    expect(collection.all()).toEqual([2, 3, 4, 5, 6]);
  });

  it("should increment the given key of each item in the collection by the given value", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Mohamed", age: 25 },
      { name: "Ali", age: 30 },
    ]).increment("age");

    expect(collection.all()).toEqual([
      { name: "Ahmed", age: 21 },
      { name: "Mohamed", age: 26 },
      { name: "Ali", age: 31 },
    ]);
  });

  it("should minus the given value to the collection items", () => {
    const collection = collect([1, 2, 3, 4, 5]).minus(1);

    expect(collection.all()).toEqual([0, 1, 2, 3, 4]);
  });

  it("should minus the given value to the given key of the collection items", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Mohamed", age: 25 },
      { name: "Ali", age: 30 },
    ]).minus("age", 1);

    expect(collection.all()).toEqual([
      { name: "Ahmed", age: 19 },
      { name: "Mohamed", age: 24 },
      { name: "Ali", age: 29 },
    ]);
  });

  it("should decrement each item in the collection by one", () => {
    const collection = collect([1, 2, 3, 4, 5]).decrement();

    expect(collection.all()).toEqual([0, 1, 2, 3, 4]);
  });

  it("should decrement the given key of each item in the collection by the given value", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Mohamed", age: 25 },
      { name: "Ali", age: 30 },
    ]).decrement("age");

    expect(collection.all()).toEqual([
      { name: "Ahmed", age: 19 },
      { name: "Mohamed", age: 24 },
      { name: "Ali", age: 29 },
    ]);
  });

  it("should multiply the given value to the collection items", () => {
    const collection = collect([1, 2, 3, 4, 5]).multiply(2);

    expect(collection.all()).toEqual([2, 4, 6, 8, 10]);
  });

  it("should double the collection items", () => {
    const collection = collect([1, 2, 3, 4, 5]).double();

    expect(collection.all()).toEqual([2, 4, 6, 8, 10]);
  });

  it("should double the given key value", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Mohamed", age: 25 },
      { name: "Ali", age: 30 },
    ]).double("age");

    expect(collection.all()).toEqual([
      { name: "Ahmed", age: 40 },
      { name: "Mohamed", age: 50 },
      { name: "Ali", age: 60 },
    ]);
  });

  it("should multiply the given value to the given key of the collection items", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Mohamed", age: 25 },
      { name: "Ali", age: 30 },
    ]).multiply("age", 2);

    expect(collection.all()).toEqual([
      { name: "Ahmed", age: 40 },
      { name: "Mohamed", age: 50 },
      { name: "Ali", age: 60 },
    ]);
  });

  it("should get the reminder value of each element in the array", () => {
    const collection = collect([1, 2, 3, 4, 5]).modulus(2);

    expect(collection.all()).toEqual([1, 0, 1, 0, 1]);
  });

  it("should get the reminder value of the given key of each element in the array", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Mohamed", age: 25 },
      { name: "Ali", age: 33 },
    ]).modulus("age", 2);

    expect(collection.all()).toEqual([
      { name: "Ahmed", age: 0 },
      { name: "Mohamed", age: 1 },
      { name: "Ali", age: 1 },
    ]);
  });

  it("should not reminder by zero and throw an error", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(() => collection.modulus(0)).toThrowError(
      "Cannot have a modulus of zero",
    );
  });

  it("should divide the given value to the collection items", () => {
    const collection = collect([1, 2, 3, 4, 5]).divide(2);

    expect(collection.all()).toEqual([0.5, 1, 1.5, 2, 2.5]);
  });

  it("should divide the given value to the given key of the collection items", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Mohamed", age: 25 },
      { name: "Ali", age: 30 },
    ]).divide("age", 2);

    expect(collection.all()).toEqual([
      { name: "Ahmed", age: 10 },
      { name: "Mohamed", age: 12.5 },
      { name: "Ali", age: 15 },
    ]);
  });

  it("should not divide by zero and throw an error", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(() => collection.divide(0)).toThrowError("Cannot divide by zero");
  });

  it("should not divide by zero and throw an error", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Mohamed", age: 25 },
      { name: "Ali", age: 30 },
    ]);

    expect(() => collection.divide("age", 0)).toThrowError(
      "Cannot divide by zero",
    );
  });

  it("should divide the given value to the collection items by 2", () => {
    const collection = collect([1, 2, 3, 4, 5]).half();

    expect(collection.all()).toEqual([0.5, 1, 1.5, 2, 2.5]);
  });

  it("should count the occurrences of values for the given key", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Mohamed", age: 25 },
      { name: "Ali", age: 30 },
      { name: "Naser" },
    ]);

    expect(collection.count("age")).toEqual(3);
  });

  it("should count the values in the array", () => {
    const collection = collect([1, 2, 3, 4, 5, 2]);

    expect(collection.countValue(2)).toEqual(2);
  });

  it("should count the occurrences of values for the given key", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Ahmed", age: 25 },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.countBy("name")).toEqual({
      Ahmed: 2,
      Ali: 1,
    });
  });
});
