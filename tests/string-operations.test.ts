import { collect } from "src/ImmutableCollection";

describe("collection/ImmutableCollection/string", () => {
  it("should append the given string to each collection item", () => {
    const collection = collect(["Ahmed", "Mohamed", "Ali"]);

    expect(collection.appendString(" Mohamed").all()).toEqual([
      "Ahmed Mohamed",
      "Mohamed Mohamed",
      "Ali Mohamed",
    ]);
  });

  it("should append the given string to the given key of each collection item", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Mohamed", age: 25 },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.appendString(" Mohamed", "name").all()).toEqual([
      { name: "Ahmed Mohamed", age: 20 },
      { name: "Mohamed Mohamed", age: 25 },
      { name: "Ali Mohamed", age: 30 },
    ]);
  });

  it("should prepend the given string to each collection item", () => {
    const collection = collect(["Ahmed", "Mohamed", "Ali"]);

    expect(collection.prependString("Mohamed ").all()).toEqual([
      "Mohamed Ahmed",
      "Mohamed Mohamed",
      "Mohamed Ali",
    ]);
  });

  it("should prepend the given string to the given key of each collection item", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Mohamed", age: 25 },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.prependString("Mohamed ", "name").all()).toEqual([
      { name: "Mohamed Ahmed", age: 20 },
      { name: "Mohamed Mohamed", age: 25 },
      { name: "Mohamed Ali", age: 30 },
    ]);
  });

  it("should concat the given string to each element", () => {
    const collection = collect(["Ahmed", "Mohamed", "Ali"]);

    expect(collection.concatString(" Mohamed").all()).toEqual([
      "Ahmed Mohamed",
      "Mohamed Mohamed",
      "Ali Mohamed",
    ]);
  });

  it("should concat the given string to the given key of each collection item", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Mohamed", age: 25 },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.concatString(" Mohamed", "name").all()).toEqual([
      { name: "Ahmed Mohamed", age: 20 },
      { name: "Mohamed Mohamed", age: 25 },
      { name: "Ali Mohamed", age: 30 },
    ]);
  });

  it("should find and replace the given string in each element", () => {
    const collection = collect(["Ahmed", "Mohamed", "Ali"]);

    expect(collection.replaceString("Ahmed", "Mohamed").all()).toEqual([
      "Mohamed",
      "Mohamed",
      "Ali",
    ]);
  });

  it("should find and replace the given string in each element using regular expression", () => {
    const collection = collect(["Ahmed", "Mohamed", "Ali"]);

    expect(collection.replaceString(/Ahmed/, "Mohamed").all()).toEqual([
      "Mohamed",
      "Mohamed",
      "Ali",
    ]);
  });

  it("should find and replace the given string in the given key of each collection item", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Mohamed", age: 25 },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.replaceString("Ahmed", "Mohamed", "name").all()).toEqual([
      { name: "Mohamed", age: 20 },
      { name: "Mohamed", age: 25 },
      { name: "Ali", age: 30 },
    ]);
  });

  it("should find and replace the given string in the given key of each collection item using regular expression", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Mohamed", age: 25 },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.replaceString(/Ahmed/, "Mohamed", "name").all()).toEqual([
      { name: "Mohamed", age: 20 },
      { name: "Mohamed", age: 25 },
      { name: "Ali", age: 30 },
    ]);
  });

  it("should find all matched strings in each element and replace it all", () => {
    const collection = collect(["Ahmed", "Mohamed", "Ali"]);

    expect(collection.replaceAllString("a", "l").all()).toEqual([
      "Ahmed",
      "Mohlmed",
      "Ali",
    ]);
  });

  it("should find all matched strings in the given key of each collection item and replace it all", () => {
    const collection = collect([
      { name: "Ahmed", age: 20 },
      { name: "Mohamed", age: 25 },
      { name: "Ali", age: 30 },
    ]);

    expect(collection.replaceAllString("a", "l", "name").all()).toEqual([
      { name: "Ahmed", age: 20 },
      { name: "Mohlmed", age: 25 },
      { name: "Ali", age: 30 },
    ]);
  });

  it("should remove the given string from each matched element", () => {
    const collection = collect(["Ahmed", "Mohamed", "Ali"]);

    expect(collection.removeString("e").all()).toEqual([
      "Ahmd",
      "Mohamd",
      "Ali",
    ]);
  });

  it("should remove the matched regular expression from each element", () => {
    const collection = collect(["Ahmed", "Mohamed", "Ali"]);

    expect(collection.removeString(/e/).all()).toEqual([
      "Ahmd",
      "Mohamd",
      "Ali",
    ]);
  });

  it("should remove all matched strings from each element", () => {
    const collection = collect(["Ahmed", "Mohamed Naser", "Ali"]);

    expect(collection.removeAllString("a").all()).toEqual([
      "Ahmed",
      "Mohmed Nser",
      "Ali",
    ]);
  });

  it("should convert array into string", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.toString()).toBe("1,2,3,4,5");
  });
});
