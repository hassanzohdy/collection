import ImmutableCollection, { collect } from "src/ImmutableCollection";

describe("collection/ImmutableCollection/filtration", () => {
  it("should filter the collection using where method", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Ahmed", age: 25 },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.where("name", "Ahmed").all()).toEqual([
      { name: "Ahmed", age: 20 },
      { name: "Ahmed", age: 25 },
    ]);
  });

  it("should filter data where key is greater than the given number", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Ahmed", age: 25 },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.where("age", ">", 25).all()).toEqual([
      { name: "Ali", age: 30 },
    ]);
    expect(collection.where("age", "gt", 25).all()).toEqual([
      { name: "Ali", age: 30 },
    ]);
  });

  it("should filter data where key is greater than or equal to the given number", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Ahmed", age: 25 },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.where("age", ">=", 25).all()).toEqual([
      { name: "Ahmed", age: 25 },
      { name: "Ali", age: 30 },
    ]);
    expect(collection.where("age", "gte", 25).all()).toEqual([
      { name: "Ahmed", age: 25 },
      { name: "Ali", age: 30 },
    ]);
  });

  it("should filter data where key is less than the given number", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Ahmed", age: 25 },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.where("age", "<", 25).all()).toEqual([
      { name: "Ahmed", age: 20 },
    ]);
    expect(collection.where("age", "lt", 25).all()).toEqual([
      { name: "Ahmed", age: 20 },
    ]);
  });

  it("should filter data where key is less than or equal to the given number", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Ahmed", age: 25 },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.where("age", "<=", 25).all()).toEqual([
      { name: "Ahmed", age: 20 },
      { name: "Ahmed", age: 25 },
    ]);
    expect(collection.where("age", "lte", 25).all()).toEqual([
      { name: "Ahmed", age: 20 },
      { name: "Ahmed", age: 25 },
    ]);
  });

  it("should filter data where key is equal to the given number", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Ahmed", age: 25 },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.where("age", 25).all()).toEqual([
      { name: "Ahmed", age: 25 },
    ]);

    expect(collection.where("age", "=", 25).all()).toEqual([
      { name: "Ahmed", age: 25 },
    ]);

    expect(collection.where("age", "equals", 25).all()).toEqual([
      { name: "Ahmed", age: 25 },
    ]);
  });

  it("should equal to the array or object", () => {
    const collection = collect([
      { name: "Ahmed", age: 20, numbers: [1, 2], address: { city: "Cairo" } },
      { name: "Ahmed", age: 25, numbers: [1, 3] },
      { name: "Ali", age: 30, numbers: [1, 2] },
    ]);

    expect(collection.where("numbers", [1, 2]).all()).toEqual([
      { name: "Ahmed", age: 20, numbers: [1, 2], address: { city: "Cairo" } },
      { name: "Ali", age: 30, numbers: [1, 2] },
    ]);

    expect(collection.where("address", { city: "Cairo" }).all()).toEqual([
      { name: "Ahmed", age: 20, numbers: [1, 2], address: { city: "Cairo" } },
    ]);
  });

  it("should filter data where key is not equal to the given number", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Ahmed", age: 25 },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.where("age", "!=", 25).all()).toEqual([
      { name: "Ahmed", age: 20 },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.where("age", "not", 25).all()).toEqual([
      { name: "Ahmed", age: 20 },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.where("age", "not equals", 25).all()).toEqual([
      { name: "Ahmed", age: 20 },
      { name: "Ali", age: 30 },
    ]);
  });

  it("should not equal to the array or object", () => {
    const collection = collect([
      { name: "Ahmed", age: 20, numbers: [1, 2], address: { city: "Cairo" } },
      { name: "Ahmed", age: 25, numbers: [1, 3] },
      { name: "Ali", age: 30, numbers: [1, 2] },
    ]);

    expect(collection.where("numbers", "!=", [1, 2]).all()).toEqual([
      { name: "Ahmed", age: 25, numbers: [1, 3] },
    ]);

    expect(collection.where("address", "!=", { city: "Cairo" }).all()).toEqual([
      { name: "Ahmed", age: 25, numbers: [1, 3] },
      { name: "Ali", age: 30, numbers: [1, 2] },
    ]);
  });

  it("should filter data that are like to the given string", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Ahmed", age: 25 },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.where("name", "like", "ahm").all()).toEqual([
      { name: "Ahmed", age: 20 },
      { name: "Ahmed", age: 25 },
    ]);

    expect(collection.where("name", "%", "ahm").all()).toEqual([
      { name: "Ahmed", age: 20 },
      { name: "Ahmed", age: 25 },
    ]);
  });

  it("should filter data that are not like to the given string", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Ahmed", age: 25 },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.where("name", "not like", "ahm").all()).toEqual([
      { name: "Ali", age: 30 },
    ]);

    expect(collection.where("name", "!%", "ahm").all()).toEqual([
      { name: "Ali", age: 30 },
    ]);
  });

  it("should filter data that matches the given regular expression", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Ahmed", age: 25 },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.where("name", "regex", /Ahm/).all()).toEqual([
      { name: "Ahmed", age: 20 },
      { name: "Ahmed", age: 25 },
    ]);

    expect(collection.where("name", /Ahm/).all()).toEqual([
      { name: "Ahmed", age: 20 },
      { name: "Ahmed", age: 25 },
    ]);
  });

  it("it should filter data that is included in the given array", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Ahmed", age: 25 },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.where("name", "in", ["Ahmed", "Ali"]).all()).toEqual([
      { name: "Ahmed", age: 20 },
      { name: "Ahmed", age: 25 },
      { name: "Ali", age: 30 },
    ]);
  });

  it("it should filter data that is not included in the given array", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Ahmed", age: 25 },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.where("name", "not in", ["Ahmed", "Ali"]).all()).toEqual(
      [],
    );

    expect(collection.where("name", "!in", ["Ahmed", "Ali"]).all()).toEqual([]);
  });

  it("should filter data between the given two values", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Ahmed", age: 25 },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.where("age", "between", [20, 25]).all()).toEqual([
      { name: "Ahmed", age: 20 },
      { name: "Ahmed", age: 25 },
    ]);

    expect(collection.where("age", "<>", [20, 25]).all()).toEqual([
      { name: "Ahmed", age: 20 },
      { name: "Ahmed", age: 25 },
    ]);

    expect(collection.whereBetween("age", [20, 25]).all()).toEqual([
      { name: "Ahmed", age: 20 },
      { name: "Ahmed", age: 25 },
    ]);
  });

  it("should filter data not between the given two values", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Ahmed", age: 25 },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.where("age", "not between", [20, 25]).all()).toEqual([
      { name: "Ali", age: 30 },
    ]);

    expect(collection.where("age", "!between", [20, 25]).all()).toEqual([
      { name: "Ali", age: 30 },
    ]);

    expect(collection.where("age", "!<>", [20, 25]).all()).toEqual([
      { name: "Ali", age: 30 },
    ]);

    expect(collection.whereNotBetween("age", [20, 25]).all()).toEqual([
      { name: "Ali", age: 30 },
    ]);
  });

  it("should filter data that its type is the same as the given type", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Ahmed", age: "25" },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.where("age", "is", "number").all()).toEqual([
      { name: "Ahmed", age: 20 },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.where("age", "typeof", "number").all()).toEqual([
      { name: "Ahmed", age: 20 },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.where("age", "is", "string").all()).toEqual([
      { name: "Ahmed", age: "25" },
    ]);
  });

  it("should filter data that its type is not the same as the given type", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Ahmed", age: "25" },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.where("age", "is not", "number").all()).toEqual([
      { name: "Ahmed", age: "25" },
    ]);
    expect(collection.where("age", "!is", "number").all()).toEqual([
      { name: "Ahmed", age: "25" },
    ]);

    expect(collection.where("age", "not typeof", "number").all()).toEqual([
      { name: "Ahmed", age: "25" },
    ]);
  });

  it("should filter data that the given key should be an instance of the given constructor", () => {
    const collection = collect([
      { name: "Ahmed", age: 20, numbers: collect([1, 2, 3]) },
      { name: "Ahmed", age: "25" },
      { name: "Ali", age: 30 },
    ]);

    expect(
      collection.where("numbers", "is a", ImmutableCollection).all(),
    ).toEqual([{ name: "Ahmed", age: 20, numbers: collect([1, 2, 3]) }]);

    expect(
      collection.where("numbers", "instanceof", ImmutableCollection).all(),
    ).toEqual([{ name: "Ahmed", age: 20, numbers: collect([1, 2, 3]) }]);
  });

  it("should filter data that the given key should not be an instance of the given constructor", () => {
    const collection = collect([
      { name: "Ahmed", age: 20, numbers: collect([1, 2, 3]) },
      { name: "Ahmed", age: "25" },
      { name: "Ali", age: 30 },
    ]);

    expect(
      collection.where("numbers", "is not a", ImmutableCollection).all(),
    ).toEqual([
      { name: "Ahmed", age: "25" },
      { name: "Ali", age: 30 },
    ]);

    expect(
      collection.where("numbers", "not instanceof", ImmutableCollection).all(),
    ).toEqual([
      { name: "Ahmed", age: "25" },
      { name: "Ali", age: 30 },
    ]);

    expect(
      collection.where("numbers", "!is a", ImmutableCollection).all(),
    ).toEqual([
      { name: "Ahmed", age: "25" },
      { name: "Ali", age: 30 },
    ]);

    expect(
      collection.where("numbers", "!instanceof", ImmutableCollection).all(),
    ).toEqual([
      { name: "Ahmed", age: "25" },
      { name: "Ali", age: 30 },
    ]);
  });

  it("should filter data that the given key exists", () => {
    const collection = collect([
      { name: "Ahmed", age: 20, numbers: collect([1, 2, 3]) },
      { name: "Ahmed", age: "25" },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.where("numbers", "exists").all()).toEqual([
      { name: "Ahmed", age: 20, numbers: collect([1, 2, 3]) },
    ]);

    expect(collection.whereExists("numbers").all()).toEqual([
      { name: "Ahmed", age: 20, numbers: collect([1, 2, 3]) },
    ]);
  });

  it("should filter data that the given key does not exist", () => {
    const collection = collect([
      { name: "Ahmed", age: 20, numbers: collect([1, 2, 3]) },
      { name: "Ahmed", age: "25" },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.where("numbers", "!exists").all()).toEqual([
      { name: "Ahmed", age: "25" },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.where("numbers", "not exists").all()).toEqual([
      { name: "Ahmed", age: "25" },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.whereNotExists("numbers").all()).toEqual([
      { name: "Ahmed", age: "25" },
      { name: "Ali", age: 30 },
    ]);
  });

  it("should filter data that the key contains the given value", () => {
    const collection = collect([
      { name: "Ahmed", age: 20, numbers: [1, 2, 3] },
      { name: "Ahmed", age: "25" },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.where("name", "contains", "Al").all()).toEqual([
      { name: "Ali", age: 30 },
    ]);

    expect(collection.where("name", "contains", "Ahm").all()).toEqual([
      { name: "Ahmed", age: 20, numbers: [1, 2, 3] },
      { name: "Ahmed", age: "25" },
    ]);
  });

  it("should filter data that the key does not contain the given value", () => {
    const collection = collect([
      { name: "Ahmed", age: 20, numbers: [1, 2, 3] },
      { name: "Ahmed", age: "25", numbers: [2, 3, 4] },
      { name: "Ali", age: 30, numbers: [5, 6] },
    ]);

    expect(collection.where("numbers", "not contains", 5).all()).toEqual([
      { name: "Ahmed", age: 20, numbers: [1, 2, 3] },
      { name: "Ahmed", age: "25", numbers: [2, 3, 4] },
    ]);

    expect(collection.where("name", "not contains", "Al").all()).toEqual([
      { name: "Ahmed", age: 20, numbers: [1, 2, 3] },
      { name: "Ahmed", age: "25", numbers: [2, 3, 4] },
    ]);

    expect(collection.where("name", "!contains", "Ahm").all()).toEqual([
      { name: "Ali", age: 30, numbers: [5, 6] },
    ]);
  });

  it("should filter data that the given key starts with the given string", () => {
    const collection = collect([
      { name: "Ahmed", age: 20, numbers: [1, 2, 3] },
      { name: "Ahmed", age: "25", numbers: [2, 3, 4] },
      { name: "Ali", age: 30, numbers: [5, 6] },
    ]);

    expect(collection.where("name", "starts with", "Ah").all()).toEqual([
      { name: "Ahmed", age: 20, numbers: [1, 2, 3] },
      { name: "Ahmed", age: "25", numbers: [2, 3, 4] },
    ]);

    expect(collection.where("name", "starts with", "Al").all()).toEqual([
      { name: "Ali", age: 30, numbers: [5, 6] },
    ]);
  });

  it("should filter data that the given key does not start with the given string", () => {
    const collection = collect([
      { name: "Ahmed", age: 20, numbers: [1, 2, 3] },
      { name: "Ahmed", age: "25", numbers: [2, 3, 4] },
      { name: "Ali", age: 30, numbers: [5, 6] },
    ]);

    expect(collection.where("name", "not starts with", "Ah").all()).toEqual([
      { name: "Ali", age: 30, numbers: [5, 6] },
    ]);

    expect(collection.where("name", "!starts with", "Al").all()).toEqual([
      { name: "Ahmed", age: 20, numbers: [1, 2, 3] },
      { name: "Ahmed", age: "25", numbers: [2, 3, 4] },
    ]);
  });

  it("should filter data that the given key ends with the given string", () => {
    const collection = collect([
      { name: "Ahmed", age: 20, numbers: [1, 2, 3] },
      { name: "Ahmed", age: "25", numbers: [2, 3, 4] },
      { name: "Ali", age: 30, numbers: [5, 6] },
    ]);

    expect(collection.where("name", "ends with", "med").all()).toEqual([
      { name: "Ahmed", age: 20, numbers: [1, 2, 3] },
      { name: "Ahmed", age: "25", numbers: [2, 3, 4] },
    ]);

    expect(collection.where("name", "ends with", "li").all()).toEqual([
      { name: "Ali", age: 30, numbers: [5, 6] },
    ]);
  });

  it("should filter data that the given key does not end with the given string", () => {
    const collection = collect([
      { name: "Ahmed", age: 20, numbers: [1, 2, 3] },
      { name: "Ahmed", age: "25", numbers: [2, 3, 4] },
      { name: "Ali", age: 30, numbers: [5, 6] },
    ]);

    expect(collection.where("name", "not ends with", "med").all()).toEqual([
      { name: "Ali", age: 30, numbers: [5, 6] },
    ]);

    expect(collection.where("name", "!ends with", "li").all()).toEqual([
      { name: "Ahmed", age: 20, numbers: [1, 2, 3] },
      { name: "Ahmed", age: "25", numbers: [2, 3, 4] },
    ]);
  });

  it("should filter data that is not empty", () => {
    const collection = collect([
      { name: "Ahmed", age: 20, numbers: [1, 2, 3] },
      { name: "Ahmed", age: "25", numbers: [2, 3, 4] },
      { name: "Ali", age: 30, numbers: [5, 6] },
      { name: "Ali", age: 30, numbers: [] },
    ]);

    expect(collection.where("numbers", "is not empty").all()).toEqual([
      { name: "Ahmed", age: 20, numbers: [1, 2, 3] },
      { name: "Ahmed", age: "25", numbers: [2, 3, 4] },
      { name: "Ali", age: 30, numbers: [5, 6] },
    ]);

    expect(collection.where("numbers", "!empty").all()).toEqual([
      { name: "Ahmed", age: 20, numbers: [1, 2, 3] },
      { name: "Ahmed", age: "25", numbers: [2, 3, 4] },
      { name: "Ali", age: 30, numbers: [5, 6] },
    ]);

    expect(collection.whereNotEmpty("numbers").all()).toEqual([
      { name: "Ahmed", age: 20, numbers: [1, 2, 3] },
      { name: "Ahmed", age: "25", numbers: [2, 3, 4] },
      { name: "Ali", age: 30, numbers: [5, 6] },
    ]);
  });

  it("should filter data that is empty", () => {
    const collection = collect([
      { name: "Ahmed", age: 20, numbers: [1, 2, 3] },
      { name: "Ahmed", age: "25", numbers: [2, 3, 4] },
      { name: "Ali", age: 30, numbers: [5, 6] },
      { name: "Ali", age: 30, numbers: [] },
    ]);

    expect(collection.where("numbers", "is empty").all()).toEqual([
      { name: "Ali", age: 30, numbers: [] },
    ]);

    expect(collection.where("numbers", "empty").all()).toEqual([
      { name: "Ali", age: 30, numbers: [] },
    ]);

    expect(collection.whereEmpty("numbers").all()).toEqual([
      { name: "Ali", age: 30, numbers: [] },
    ]);
  });

  it('should filter data that the given key is "null"', () => {
    const collection = collect([
      { name: "Ahmed", age: 20, numbers: [1, 2, 3] },
      { name: "Ahmed", age: "25", numbers: [2, 3, 4] },
      { name: "Ali", age: 30, numbers: [5, 6] },
      { name: "Ali", age: 30, numbers: [] },
      { name: "Ali", age: null, numbers: [] },
    ]);

    expect(collection.where("age", null).all()).toEqual([
      { name: "Ali", age: null, numbers: [] },
    ]);

    expect(collection.where("age", "null").all()).toEqual([
      { name: "Ali", age: null, numbers: [] },
    ]);

    expect(collection.where("age", "is null").all()).toEqual([
      { name: "Ali", age: null, numbers: [] },
    ]);

    expect(collection.whereNull("age").all()).toEqual([
      { name: "Ali", age: null, numbers: [] },
    ]);
  });

  it('should filter data that the given key is not "null"', () => {
    const collection = collect([
      { name: "Ahmed", age: 20, numbers: [1, 2, 3] },
      { name: "Ahmed", age: "25", numbers: [2, 3, 4] },
      { name: "Ali", age: 30, numbers: [5, 6] },
      { name: "Ali", age: 30, numbers: [] },
      { name: "Ali", age: null, numbers: [] },
    ]);

    expect(collection.where("age", "is not null").all()).toEqual([
      { name: "Ahmed", age: 20, numbers: [1, 2, 3] },
      { name: "Ahmed", age: "25", numbers: [2, 3, 4] },
      { name: "Ali", age: 30, numbers: [5, 6] },
      { name: "Ali", age: 30, numbers: [] },
    ]);

    expect(collection.where("age", "!null").all()).toEqual([
      { name: "Ahmed", age: 20, numbers: [1, 2, 3] },
      { name: "Ahmed", age: "25", numbers: [2, 3, 4] },
      { name: "Ali", age: 30, numbers: [5, 6] },
      { name: "Ali", age: 30, numbers: [] },
    ]);

    expect(collection.where("age", "is not null").all()).toEqual([
      { name: "Ahmed", age: 20, numbers: [1, 2, 3] },
      { name: "Ahmed", age: "25", numbers: [2, 3, 4] },
      { name: "Ali", age: 30, numbers: [5, 6] },
      { name: "Ali", age: 30, numbers: [] },
    ]);

    expect(collection.whereNotNull("age").all()).toEqual([
      { name: "Ahmed", age: 20, numbers: [1, 2, 3] },
      { name: "Ahmed", age: "25", numbers: [2, 3, 4] },
      { name: "Ali", age: 30, numbers: [5, 6] },
      { name: "Ali", age: 30, numbers: [] },
    ]);
  });

  it("should filter data where the given key is true", () => {
    const collection = collect([
      { name: "Ahmed", age: 20, numbers: [1, 2, 3], is_admin: true },
      { name: "Ahmed", age: "25", numbers: [2, 3, 4], is_admin: true },
      { name: "Ali", age: 30, numbers: [5, 6], is_admin: false },
      { name: "Ali", age: 30, numbers: [], is_admin: false },
      { name: "Ali", age: null, numbers: [], is_admin: false },
    ]);

    expect(collection.where("is_admin", true).all()).toEqual([
      { name: "Ahmed", age: 20, numbers: [1, 2, 3], is_admin: true },
      { name: "Ahmed", age: "25", numbers: [2, 3, 4], is_admin: true },
    ]);

    expect(collection.where("is_admin", "true").all()).toEqual([
      { name: "Ahmed", age: 20, numbers: [1, 2, 3], is_admin: true },
      { name: "Ahmed", age: "25", numbers: [2, 3, 4], is_admin: true },
    ]);

    expect(collection.where("is_admin", "is true").all()).toEqual([
      { name: "Ahmed", age: 20, numbers: [1, 2, 3], is_admin: true },
      { name: "Ahmed", age: "25", numbers: [2, 3, 4], is_admin: true },
    ]);
  });

  it("should filter data where the given key is not true", () => {
    const collection = collect([
      { name: "Ahmed", age: 20, numbers: [1, 2, 3], is_admin: true },
      { name: "Ahmed", age: "25", numbers: [2, 3, 4], is_admin: true },
      { name: "Ali", age: 30, numbers: [5, 6], is_admin: false },
      { name: "Ali", age: 30, numbers: [], is_admin: false },
      { name: "Ali", age: null, numbers: [], is_admin: false },
    ]);

    expect(collection.where("is_admin", "!true").all()).toEqual([
      { name: "Ali", age: 30, numbers: [5, 6], is_admin: false },
      { name: "Ali", age: 30, numbers: [], is_admin: false },
      { name: "Ali", age: null, numbers: [], is_admin: false },
    ]);

    expect(collection.where("is_admin", "is not true").all()).toEqual([
      { name: "Ali", age: 30, numbers: [5, 6], is_admin: false },
      { name: "Ali", age: 30, numbers: [], is_admin: false },
      { name: "Ali", age: null, numbers: [], is_admin: false },
    ]);
  });

  it("should filter data where the given key is false", () => {
    const collection = collect([
      { name: "Ahmed", age: 20, numbers: [1, 2, 3], is_admin: true },
      { name: "Ahmed", age: "25", numbers: [2, 3, 4], is_admin: true },
      { name: "Ali", age: 30, numbers: [5, 6], is_admin: false },
      { name: "Ali", age: 30, numbers: [], is_admin: false },
      { name: "Ali", age: null, numbers: [], is_admin: false },
    ]);

    expect(collection.where("is_admin", false).all()).toEqual([
      { name: "Ali", age: 30, numbers: [5, 6], is_admin: false },
      { name: "Ali", age: 30, numbers: [], is_admin: false },
      { name: "Ali", age: null, numbers: [], is_admin: false },
    ]);

    expect(collection.where("is_admin", "false").all()).toEqual([
      { name: "Ali", age: 30, numbers: [5, 6], is_admin: false },
      { name: "Ali", age: 30, numbers: [], is_admin: false },
      { name: "Ali", age: null, numbers: [], is_admin: false },
    ]);

    expect(collection.where("is_admin", "is false").all()).toEqual([
      { name: "Ali", age: 30, numbers: [5, 6], is_admin: false },
      { name: "Ali", age: 30, numbers: [], is_admin: false },
      { name: "Ali", age: null, numbers: [], is_admin: false },
    ]);
  });

  it("should filter data where the given key is not false", () => {
    const collection = collect([
      { name: "Ahmed", age: 20, numbers: [1, 2, 3], is_admin: true },
      { name: "Ahmed", age: "25", numbers: [2, 3, 4], is_admin: true },
      { name: "Ali", age: 30, numbers: [5, 6], is_admin: false },
      { name: "Ali", age: 30, numbers: [], is_admin: false },
      { name: "Ali", age: null, numbers: [], is_admin: false },
    ]);

    expect(collection.where("is_admin", "!false").all()).toEqual([
      { name: "Ahmed", age: 20, numbers: [1, 2, 3], is_admin: true },
      { name: "Ahmed", age: "25", numbers: [2, 3, 4], is_admin: true },
    ]);

    expect(collection.where("is_admin", "is not false").all()).toEqual([
      { name: "Ahmed", age: 20, numbers: [1, 2, 3], is_admin: true },
      { name: "Ahmed", age: "25", numbers: [2, 3, 4], is_admin: true },
    ]);
  });

  it("should filter the data that the given key is undefined", () => {
    const collection = collect([
      { name: "Ahmed", age: 20, numbers: [1, 2, 3], is_admin: true },
      { name: "Ahmed", age: "25", numbers: [2, 3, 4], is_admin: true },
      { name: "Ali", age: 30, numbers: [5, 6], is_admin: false },
      { name: "Ali", age: 30, numbers: [], is_admin: false },
      { name: "Ali", age: null, numbers: [], is_admin: false },
      { name: "Hasan", age: null, numbers: [], is_admin: undefined },
    ]);

    expect(collection.where("is_admin", undefined).all()).toEqual([
      { name: "Hasan", age: null, numbers: [], is_admin: undefined },
    ]);

    expect(collection.where("is_admin", "undefined").all()).toEqual([
      { name: "Hasan", age: null, numbers: [], is_admin: undefined },
    ]);

    expect(collection.where("is_admin", "is undefined").all()).toEqual([
      { name: "Hasan", age: null, numbers: [], is_admin: undefined },
    ]);
  });

  it("should filter the data that the given key is not undefined", () => {
    const collection = collect([
      { name: "Ahmed", age: 20, numbers: [1, 2, 3], is_admin: true },
      { name: "Ahmed", age: "25", numbers: [2, 3, 4], is_admin: true },
      { name: "Ali", age: 30, numbers: [5, 6], is_admin: false },
      { name: "Ali", age: 30, numbers: [], is_admin: false },
      { name: "Ali", age: null, numbers: [], is_admin: false },
      { name: "Hasan", age: null, numbers: [], is_admin: undefined },
    ]);

    expect(collection.where("is_admin", "!undefined").all()).toEqual([
      { name: "Ahmed", age: 20, numbers: [1, 2, 3], is_admin: true },
      { name: "Ahmed", age: "25", numbers: [2, 3, 4], is_admin: true },
      { name: "Ali", age: 30, numbers: [5, 6], is_admin: false },
      { name: "Ali", age: 30, numbers: [], is_admin: false },
      { name: "Ali", age: null, numbers: [], is_admin: false },
    ]);

    expect(collection.where("is_admin", "is not undefined").all()).toEqual([
      { name: "Ahmed", age: 20, numbers: [1, 2, 3], is_admin: true },
      { name: "Ahmed", age: "25", numbers: [2, 3, 4], is_admin: true },
      { name: "Ali", age: 30, numbers: [5, 6], is_admin: false },
      { name: "Ali", age: 30, numbers: [], is_admin: false },
      { name: "Ali", age: null, numbers: [], is_admin: false },
    ]);
  });

  it("should filter data with primitive values", () => {
    const collection = collect([
      { name: "Ahmed", age: 20, numbers: [1, 2, 3], is_admin: true },
      { name: "Ahmed", age: "25", numbers: [2, 3, 4], is_admin: true },
      { name: "Ali", age: 30, numbers: [5, 6], is_admin: false },
      { name: "Ali", age: 30, numbers: [], is_admin: false },
      { name: "Ali", age: null, numbers: [], is_admin: null },
      { name: "Hasan", age: null, numbers: [], is_admin: undefined },
    ]);

    expect(collection.where("age", 20).all()).toEqual([
      { name: "Ahmed", age: 20, numbers: [1, 2, 3], is_admin: true },
    ]);

    expect(collection.where("name", "Hasan").all()).toEqual([
      { name: "Hasan", age: null, numbers: [], is_admin: undefined },
    ]);

    expect(collection.where("is_admin", true).all()).toEqual([
      { name: "Ahmed", age: 20, numbers: [1, 2, 3], is_admin: true },
      { name: "Ahmed", age: "25", numbers: [2, 3, 4], is_admin: true },
    ]);

    expect(collection.where("is_admin", false).all()).toEqual([
      { name: "Ali", age: 30, numbers: [5, 6], is_admin: false },
      { name: "Ali", age: 30, numbers: [], is_admin: false },
    ]);

    expect(collection.where("is_admin", null).all()).toEqual([
      { name: "Ali", age: null, numbers: [], is_admin: null },
    ]);

    expect(collection.where("is_admin", undefined).all()).toEqual([
      { name: "Hasan", age: null, numbers: [], is_admin: undefined },
    ]);
  });

  it("should return first filtered data using firstWhere", () => {
    const collection = collect([
      { name: "Ahmed", age: 20, numbers: [1, 2, 3], is_admin: true },
      { name: "Ahmed", age: "25", numbers: [2, 3, 4], is_admin: true },
      { name: "Ali", age: 30, numbers: [5, 6], is_admin: false },
      { name: "Ali", age: 30, numbers: [], is_admin: false },
      { name: "Ali", age: null, numbers: [], is_admin: null },
      { name: "Hasan", age: null, numbers: [], is_admin: undefined },
    ]);

    expect(collection.firstWhere("age", 20)).toEqual({
      name: "Ahmed",
      age: 20,
      numbers: [1, 2, 3],
      is_admin: true,
    });
    expect(collection.firstWhere("name", "Hasan")).toEqual({
      name: "Hasan",
      age: null,
      numbers: [],
      is_admin: undefined,
    });
    expect(collection.firstWhere("is_admin", true)).toEqual({
      name: "Ahmed",
      age: 20,
      numbers: [1, 2, 3],
      is_admin: true,
    });
    expect(collection.firstWhere("is_admin", false)).toEqual({
      name: "Ali",
      age: 30,
      numbers: [5, 6],
      is_admin: false,
    });
    expect(collection.firstWhere("is_admin", null)).toEqual({
      name: "Ali",
      age: null,
      numbers: [],
      is_admin: null,
    });
    expect(collection.firstWhere("is_admin", undefined)).toEqual({
      name: "Hasan",
      age: null,
      numbers: [],
      is_admin: undefined,
    });
  });
});
