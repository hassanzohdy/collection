import { describe, expect, it } from "vitest";
import { collect, ImmutableCollection } from "../ImmutableCollection";
import { users } from "./fixtures";

// The where(...) helper supports three signatures:
//   where(key, value)                  → equality on the keyed value
//   where(operator, value)             → operator applied to each item directly
//   where(key, operator, value)        → operator applied to the keyed value

describe("where — equality and basic comparison", () => {
  it("where(key, value) defaults to strict equality", () => {
    const out = collect(users).where("active", true).all();
    expect(out.map(u => u.id)).toEqual([1, 3]);
  });

  it("where(key, '=', value) is equivalent to (key, value)", () => {
    const out = collect(users).where("age", "=", 25).all();
    expect(out.map(u => u.id)).toEqual([2]);
  });

  it("where(key, 'equals', value) matches the strict-equality alias", () => {
    expect(
      collect(users)
        .where("age", "equals", 25)
        .all()
        .map(u => u.id),
    ).toEqual([2]);
  });

  it("where(key, '!=', value) and 'not'/'not equals' all negate equality", () => {
    expect(
      collect(users)
        .where("active", "!=", true)
        .all()
        .map(u => u.id),
    ).toEqual([2, 4]);
    expect(
      collect(users)
        .where("active", "not", true)
        .all()
        .map(u => u.id),
    ).toEqual([2, 4]);
    expect(
      collect(users)
        .where("active", "not equals", true)
        .all()
        .map(u => u.id),
    ).toEqual([2, 4]);
  });

  it("where(key, '>', value) / 'gt' filter strictly greater", () => {
    expect(
      collect(users)
        .where("age", ">", 25)
        .all()
        .map(u => u.id),
    ).toEqual([3, 4]);
    expect(
      collect(users)
        .where("age", "gt", 25)
        .all()
        .map(u => u.id),
    ).toEqual([3, 4]);
  });

  it("'>=' / 'gte' include the boundary; '<' / 'lt' exclude it", () => {
    expect(
      collect(users)
        .where("age", ">=", 25)
        .all()
        .map(u => u.id),
    ).toEqual([2, 3, 4]);
    expect(
      collect(users)
        .where("age", "<", 25)
        .all()
        .map(u => u.id),
    ).toEqual([1]);
    expect(
      collect(users)
        .where("age", "lte", 25)
        .all()
        .map(u => u.id),
    ).toEqual([1, 2]);
  });

  it("where uses item.get(key) when the item exposes a get method", () => {
    class Record {
      constructor(private data: Record<string, any>) {}
      get(key: string) {
        return this.data[key];
      }
    }
    const c = collect([
      new Record({ name: "Ada", age: 20 }),
      new Record({ name: "Bob", age: 30 }),
    ]);
    expect((c.where("age", ">", 25).first() as any).get("name")).toBe("Bob");
  });
});

describe("where — pattern matching", () => {
  it("'like' / '%' do a case-insensitive substring match", () => {
    expect(
      collect(users)
        .where("name", "like", "a")
        .all()
        .map(u => u.id),
    ).toEqual([1]); // Only "Ada" contains 'a' (case-insensitive)
  });

  it("'not like' / '!%' negate the substring match", () => {
    expect(
      collect(users)
        .where("name", "not like", "a")
        .all()
        .map(u => u.id),
    ).toEqual([2, 3, 4]);
  });

  it("'regex' tests a RegExp against the stringified value", () => {
    expect(
      collect(users)
        .where("name", "regex", /^A/)
        .all()
        .map(u => u.id),
    ).toEqual([1]);
  });

  it("a plain RegExp as the value also triggers regex matching", () => {
    expect(
      collect(users)
        .where("name", /^A/)
        .all()
        .map(u => u.id),
    ).toEqual([1]);
  });

  it("'contains' checks substring inclusion", () => {
    expect(
      collect(users)
        .where("name", "contains", "id")
        .all()
        .map(u => u.id),
    ).toEqual([3]); // "Cid"
  });

  it("'starts with' / 'ends with' check string boundaries", () => {
    expect(
      collect(users)
        .where("name", "starts with", "B")
        .all()
        .map(u => u.id),
    ).toEqual([2]);
    expect(
      collect(users)
        .where("name", "ends with", "t")
        .all()
        .map(u => u.id),
    ).toEqual([4]); // "Dot"
  });
});

describe("where — set membership", () => {
  it("'in' filters values present in the given array", () => {
    expect(
      collect(users)
        .where("name", "in", ["Ada", "Cid"])
        .all()
        .map(u => u.id),
    ).toEqual([1, 3]);
  });

  it("'not in' / '!in' negate set membership", () => {
    expect(
      collect(users)
        .where("name", "not in", ["Ada", "Cid"])
        .all()
        .map(u => u.id),
    ).toEqual([2, 4]);
  });

  it("'between' / '<>' filter the inclusive range", () => {
    expect(
      collect(users)
        .where("age", "between", [25, 30])
        .all()
        .map(u => u.id),
    ).toEqual([2, 3]);
  });

  it("'not between' / '!between' / '!<>' negate the range", () => {
    expect(
      collect(users)
        .where("age", "not between", [25, 30])
        .all()
        .map(u => u.id),
    ).toEqual([1, 4]);
  });
});

describe("where — type / instance / existence", () => {
  const mixed = [
    { id: 1, age: 20 },
    { id: 2, age: "25" },
    { id: 3 },
  ];

  it("'is' / 'typeof' filter by typeof", () => {
    expect(
      collect(mixed)
        .where("age", "is", "number")
        .all()
        .map(o => o.id),
    ).toEqual([1]);
    expect(
      collect(mixed)
        .where("age", "typeof", "string")
        .all()
        .map(o => o.id),
    ).toEqual([2]);
  });

  it("'is not' / '!is' / 'not typeof' negate typeof", () => {
    expect(
      collect(mixed)
        .where("age", "is not", "number")
        .all()
        .map(o => o.id),
    ).toEqual([2, 3]); // "25" (string) and undefined
  });

  it("'instanceof' / 'is a' check constructor lineage", () => {
    const data = [
      { id: 1, items: collect([1, 2]) },
      { id: 2, items: [3, 4] },
    ];
    expect(
      collect(data)
        .where("items", "instanceof", ImmutableCollection)
        .all()
        .map(o => o.id),
    ).toEqual([1]);
  });

  it("'exists' returns items where the key path resolves", () => {
    expect(
      collect(mixed)
        .where("age", "exists")
        .all()
        .map(o => o.id),
    ).toEqual([1, 2]);
  });

  it("'not exists' / '!exists' return items where the key path is missing", () => {
    expect(
      collect(mixed)
        .where("age", "not exists")
        .all()
        .map(o => o.id),
    ).toEqual([3]);
  });
});

describe("where — null / undefined / empty / boolean", () => {
  const data = [
    { id: 1, val: 0 },
    { id: 2, val: null },
    { id: 3, val: undefined },
    { id: 4, val: "" },
    { id: 5, val: "x" },
    { id: 6, val: true },
    { id: 7, val: false },
  ];

  it("'is null' / 'null' / where(key, null) all match exact null", () => {
    expect(
      collect(data)
        .where("val", "is null")
        .all()
        .map(o => o.id),
    ).toEqual([2]);
    expect(
      collect(data)
        .where("val", "null")
        .all()
        .map(o => o.id),
    ).toEqual([2]);
    expect(
      collect(data)
        .where("val", null)
        .all()
        .map(o => o.id),
    ).toEqual([2]);
  });

  it("'is undefined' / 'undefined' match exact undefined", () => {
    expect(
      collect(data)
        .where("val", "is undefined")
        .all()
        .map(o => o.id),
    ).toEqual([3]);
  });

  it("'!null' / 'is not null' filter out only null (keeping undefined)", () => {
    expect(
      collect(data)
        .where("val", "is not null")
        .all()
        .map(o => o.id),
    ).toEqual([1, 3, 4, 5, 6, 7]);
  });

  it("'is empty' / 'empty' include null, undefined, '', and empty arrays", () => {
    expect(
      collect(data)
        .where("val", "is empty")
        .all()
        .map(o => o.id)
        .sort(),
    ).toEqual([2, 3, 4].sort());
  });

  it("'true' / 'is true' check strict-true; 'false' / 'is false' check strict-false", () => {
    expect(
      collect(data)
        .where("val", "is true")
        .all()
        .map(o => o.id),
    ).toEqual([6]);
    expect(
      collect(data)
        .where("val", "is false")
        .all()
        .map(o => o.id),
    ).toEqual([7]);
  });
});

describe("where — primitive-mode (two args, first is an operator)", () => {
  it("when the first argument is an operator, items themselves are tested", () => {
    expect(collect([1, 2, 3, 4]).where(">", 2).all()).toEqual([3, 4]);
    expect(collect(["a", "b", "c"]).where("in", ["a", "c"]).all()).toEqual([
      "a",
      "c",
    ]);
  });
});

describe("firstWhere / lastWhere", () => {
  it("firstWhere returns the first matching item", () => {
    expect(collect(users).firstWhere("active", true)).toMatchObject({
      id: 1,
      name: "Ada",
    });
  });

  it("firstWhere returns undefined when nothing matches", () => {
    expect(collect(users).firstWhere("age", 999)).toBeUndefined();
  });

  it("lastWhere returns the last matching item", () => {
    expect(collect(users).lastWhere("active", true)).toMatchObject({
      id: 3,
      name: "Cid",
    });
  });
});

describe("dedicated where helpers (whereIn, whereNot, whereBetween, ...)", () => {
  it("whereIn(values) filters primitives", () => {
    expect(collect([1, 2, 3, 4]).whereIn([2, 4]).all()).toEqual([2, 4]);
  });

  it("whereIn(key, values) filters by an object key", () => {
    expect(
      collect(users)
        .whereIn("name", ["Ada", "Cid"])
        .all()
        .map(u => u.id),
    ).toEqual([1, 3]);
  });

  it("whereNot(value) drops primitives strictly equal to the value", () => {
    expect(collect([1, 2, 3, 2, 1]).whereNot(2).all()).toEqual([1, 3, 1]);
  });

  it("whereNot(key, value) drops objects whose keyed value matches", () => {
    expect(
      collect(users)
        .whereNot("active", true)
        .all()
        .map(u => u.id),
    ).toEqual([2, 4]);
  });

  it("whereBetween(values) on primitives", () => {
    expect(collect([1, 2, 3, 4, 5]).whereBetween([2, 4]).all()).toEqual([
      2, 3, 4,
    ]);
  });

  it("whereBetween(key, values) on objects", () => {
    expect(
      collect(users)
        .whereBetween("age", [25, 30])
        .all()
        .map(u => u.id),
    ).toEqual([2, 3]);
  });

  it("whereNotBetween is the complement of whereBetween", () => {
    expect(
      collect(users)
        .whereNotBetween("age", [25, 30])
        .all()
        .map(u => u.id),
    ).toEqual([1, 4]);
  });

  it("whereEmpty / whereNotEmpty filter on isEmpty()", () => {
    const data = [
      { id: 1, tags: [] },
      { id: 2, tags: ["x"] },
      { id: 3, tags: null },
    ];
    expect(
      collect(data)
        .whereEmpty("tags")
        .all()
        .map(o => o.id),
    ).toEqual([1, 3]);
    expect(
      collect(data)
        .whereNotEmpty("tags")
        .all()
        .map(o => o.id),
    ).toEqual([2]);
    // heavy is the alias for whereNotEmpty
    expect(
      collect(data)
        .heavy("tags")
        .all()
        .map(o => o.id),
    ).toEqual([2]);
  });

  it("whereNull / whereNotNull check for exact null", () => {
    const data = [{ v: 1 }, { v: null }, { v: undefined }];
    expect(collect(data).whereNull("v").all()).toEqual([{ v: null }]);
    expect(collect(data).whereNotNull("v").all()).toEqual([
      { v: 1 },
      { v: undefined },
    ]);
  });

  it("whereUndefined / whereNotUndefined check for exact undefined", () => {
    const data = [{ v: 1 }, { v: null }, { v: undefined }];
    expect(collect(data).whereUndefined("v").all()).toEqual([{ v: undefined }]);
    expect(collect(data).whereNotUndefined("v").all()).toEqual([
      { v: 1 },
      { v: null },
    ]);
  });

  it("whereExists / whereNotExists filter on the 'exists' operator", () => {
    const data = [{ a: 1 }, { a: 2 }, { b: 3 }];
    expect(collect(data).whereExists("a").all()).toEqual([{ a: 1 }, { a: 2 }]);
    expect(collect(data).whereNotExists("a").all()).toEqual([{ b: 3 }]);
  });
});

describe("reject / except / not / skip variants", () => {
  it("reject is the inverse of filter", () => {
    expect(
      collect([1, 2, 3, 4])
        .reject(n => n % 2 === 0)
        .all(),
    ).toEqual([1, 3]);
  });

  it("except is an alias for reject", () => {
    expect(
      collect([1, 2, 3])
        .except(n => n === 2)
        .all(),
    ).toEqual([1, 3]);
  });

  it("skipWhile is also an alias for reject", () => {
    expect(
      collect([1, 2, 3])
        .skipWhile(n => n === 2)
        .all(),
    ).toEqual([1, 3]);
  });

  it("not(value) drops every item strictly equal to value", () => {
    expect(collect([1, 2, 1, 3, 1]).not(1).all()).toEqual([2, 3]);
  });

  it("rejectFirst / exceptFirst drop only the first match", () => {
    expect(
      collect([1, 2, 3, 2, 1])
        .rejectFirst(n => n === 2)
        .all(),
    ).toEqual([1, 3, 2, 1]);
    expect(
      collect([1, 2, 3, 2, 1])
        .exceptFirst(n => n === 2)
        .all(),
    ).toEqual([1, 3, 2, 1]);
  });

  it("rejectLast / exceptLast drop only the last match", () => {
    expect(
      collect([1, 2, 3, 2, 1])
        .rejectLast(n => n === 2)
        .all(),
    ).toEqual([1, 2, 3, 1]);
    expect(
      collect([1, 2, 3, 2, 1])
        .exceptLast(n => n === 2)
        .all(),
    ).toEqual([1, 2, 3, 1]);
  });
});
