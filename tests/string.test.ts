import { ImmutableCollection, collect } from "src/ImmutableCollection";

describe("collection/ImmutableCollection/string", () => {
  it("should trim all whitespace from items", () => {
    const collection = collect([
      "  hello  ",
      "  world  ",
      "  ",
      "  ",
      "  ",
      "  ",
      "  1  ",
      "  0  ",
      "  ",
      "  ",
      "  ",
      "  ",
    ]);

    expect(collection.trim().all()).toEqual([
      "hello",
      "world",
      "",
      "",
      "",
      "",
      "1",
      "0",
      "",
      "",
      "",
      "",
    ]);
  });

  it("should remove ed from beginning and end of items", () => {
    const collection = collect([
      "hello",
      "world",
      "ed",
      "ed",
      "ed",
      "ed",
      "1",
      "0",
      "ed",
      "ed",
      "ed",
      "ed",
      "edgered",
    ]);

    expect(collection.trim("ed").all()).toEqual([
      "hello",
      "world",
      "",
      "",
      "",
      "",
      "1",
      "0",
      "",
      "",
      "",
      "",
      "ger",
    ]);
  });

  it("should remove whitespace from the given key of each item", () => {
    const collection = collect([
      { name: "  hello  " },
      { name: "  world  " },
      { name: "  " },
      { name: "  " },
      { name: "  " },
      { name: "  " },
      { name: "  1  " },
      { name: "  0  " },
      { name: "  " },
      { name: "  " },
      { name: "  " },
      { name: "  " },
    ]);

    expect(collection.trim(" ", "name").all()).toEqual([
      { name: "hello" },
      { name: "world" },
      { name: "" },
      { name: "" },
      { name: "" },
      { name: "" },
      { name: "1" },
      { name: "0" },
      { name: "" },
      { name: "" },
      { name: "" },
      { name: "" },
    ]);
  });
});
