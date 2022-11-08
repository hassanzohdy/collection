import { collect } from "src/ImmutableCollection";

describe("collection/ImmutableCollection/getSingleValue", () => {
  it("should return the first value of the collection", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.first()).toBe(1);
  });

  it("should return undefined for the first value from empty collection", () => {
    const collection = collect([]);

    expect(collection.first()).toBe(undefined);
  });

  it("should return the last value of the collection using last", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.last()).toBe(5);
  });

  it("should return undefined when calling last on empty array", () => {
    const collection = collect([]);

    expect(collection.last()).toBe(undefined);
  });

  it("should return the last value of the collection using end", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.end()).toBe(5);
  });

  it("should return the value of the given index", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.index(0)).toBe(1);
  });

  it("should return the value of the given index and key", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Mohamed", age: 25 },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.get("2.name")).toBe("Ali");
  });

  it("should return the value of the given key", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Mohamed", age: 25 },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.value("name")).toBe("Ahmed");
  });

  it("should return default value if the given key doesn't exist", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Mohamed", age: 25 },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.value("nameS", "default")).toBe("default");
  });

  it("should return the value of the given key of the given index", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Mohamed", age: 25 },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.valueAt(1, "name")).toBe("Mohamed");
  });

  it("should return default value if the given key of the given index doesn't exist", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Mohamed", age: 25 },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.valueAt(1, "nameS", "default")).toBe("default");
  });

  it("should return the last item that has the given key", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Mohamed", age: 25 },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.lastValue("name")).toBe("Ali");
  });

  it("should return default value if the last item that has the given key doesn't exist", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Mohamed", age: 25 },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.lastValue("nameS", "default")).toBe("default");
  });
});
