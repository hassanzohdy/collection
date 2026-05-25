import { describe, expect, it } from "vitest";
import { collect } from "../ImmutableCollection";

describe("string operations on primitive items", () => {
  it("appendString concatenates after each string", () => {
    expect(collect(["a", "b"]).appendString("!").all()).toEqual(["a!", "b!"]);
  });

  it("prependString concatenates before each string", () => {
    expect(collect(["a", "b"]).prependString(">>").all()).toEqual([
      ">>a",
      ">>b",
    ]);
  });

  it("concatString is functionally identical to appendString on strings", () => {
    expect(collect(["a", "b"]).concatString(":1").all()).toEqual(["a:1", "b:1"]);
  });

  it("replaceString replaces the first occurrence (string)", () => {
    expect(collect(["aba", "bab"]).replaceString("a", "x").all()).toEqual([
      "xba",
      "bxb",
    ]);
  });

  it("replaceString accepts a RegExp", () => {
    expect(collect(["abc", "def"]).replaceString(/[a-c]/, "X").all()).toEqual([
      "Xbc",
      "def",
    ]);
  });

  it("replaceAllString replaces every occurrence (built from `new RegExp(str, 'g')`)", () => {
    expect(collect(["aaa", "aba"]).replaceAllString("a", "X").all()).toEqual([
      "XXX",
      "XbX",
    ]);
  });

  it("removeString removes the first occurrence", () => {
    expect(collect(["aba", "bab"]).removeString("a").all()).toEqual([
      "ba",
      "bb",
    ]);
  });

  it("removeAllString removes every occurrence", () => {
    expect(collect(["aaba", "bab"]).removeAllString("a").all()).toEqual([
      "b",
      "bb",
    ]);
  });

  it("trim() removes whitespace from each string", () => {
    expect(collect(["  hi  ", " x "]).trim().all()).toEqual(["hi", "x"]);
  });

  it("trim(chars) removes the given characters from the boundaries", () => {
    expect(collect(["##a##", "#b#"]).trim("#").all()).toEqual(["a", "b"]);
  });
});

describe("string operations on keyed values", () => {
  const users = () => [
    { id: 1, name: "Ada" },
    { id: 2, name: "Bob" },
  ];

  it("appendString(value, key) writes back to the keyed value", () => {
    expect(
      collect(users())
        .appendString("!", "name")
        .all(),
    ).toEqual([
      { id: 1, name: "Ada!" },
      { id: 2, name: "Bob!" },
    ]);
  });

  it("prependString(value, key) writes back to the keyed value", () => {
    expect(
      collect(users())
        .prependString("Mr. ", "name")
        .all(),
    ).toEqual([
      { id: 1, name: "Mr. Ada" },
      { id: 2, name: "Mr. Bob" },
    ]);
  });

  it("replaceString(search, repl, key) targets only the keyed value", () => {
    expect(
      collect(users())
        .replaceString("o", "0", "name")
        .all(),
    ).toEqual([
      { id: 1, name: "Ada" },
      { id: 2, name: "B0b" },
    ]);
  });

  it("trim(chars, key) trims the keyed value", () => {
    const c = collect([{ name: "  Ada  " }, { name: "  Bob  " }]);
    expect(c.trim(" ", "name").all()).toEqual([
      { name: "Ada" },
      { name: "Bob" },
    ]);
  });
});

describe("casting helpers", () => {
  it("string() coerces each item to a string", () => {
    expect(collect([1, true, null]).string().all()).toEqual([
      "1",
      "true",
      "null",
    ]);
  });

  it("number() coerces each item to a number", () => {
    expect(collect(["1", "2", "abc", ""]).number().all()).toEqual([
      1,
      2,
      NaN,
      0,
    ]);
  });

  it("boolean() coerces each item via Boolean()", () => {
    expect(collect([1, 0, "x", "", null, undefined]).boolean().all()).toEqual([
      true,
      false,
      true,
      false,
      false,
      false,
    ]);
  });
});
