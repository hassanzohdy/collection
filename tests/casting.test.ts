import { ImmutableCollection, collect } from "src/ImmutableCollection";

describe("collection/ImmutableCollection/casting", () => {
  it("should convert all items into boolean values", () => {
    const collection = collect([
      0,
      1,
      2,
      3,
      4,
      5,
      "",
      "hello",
      "1",
      "0",
      null,
      undefined,
    ]);

    expect(collection.boolean().all()).toEqual([
      false,
      true,
      true,
      true,
      true,
      true,
      false,
      true,
      true,
      true,
      false,
      false,
    ]);
  });

  it("should convert all items into number values", () => {
    const collection = collect([
      0,
      1,
      2,
      3,
      4,
      5,
      "",
      "hello",
      "1",
      "0",
      null,
      undefined,
      "13",
    ]);

    expect(collection.number().all()).toEqual([
      0,
      1,
      2,
      3,
      4,
      5,
      0,
      NaN,
      1,
      0,
      0,
      NaN,
      13,
    ]);
  });

  it("should convert all items into string", () => {
    const collection = collect([
      0,
      1,
      2,
      3,
      4,
      5,
      "",
      "hello",
      "1",
      "0",
      null,
      undefined,
    ]);

    expect(collection.string().all()).toEqual([
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "",
      "hello",
      "1",
      "0",
      "null",
      "undefined",
    ]);
  });
});
