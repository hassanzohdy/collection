import { collect } from "src/ImmutableCollection";

describe("collection/ImmutableCollection/builtin", () => {
  // Original Array Methods tests
  it("should return map over the collection items", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.map(item => item * 2).all()).toEqual([2, 4, 6, 8, 10]);
  });

  it("should return filter over the collection items", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.filter(item => item % 2 === 0).all()).toEqual([2, 4]);
  });

  it("should return reduce over the collection items", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.reduce((acc, item) => acc + item, 0)).toBe(15);
  });

  it("should return reduceRight over the collection items", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.reduceRight((acc, item) => acc + item, 0)).toBe(15);
  });

  it("should return forEach over the collection items", () => {
    const collection = collect([1, 2, 3, 4, 5]);
    const spy = jest.fn();

    collection.forEach(spy);

    expect(spy).toHaveBeenCalledTimes(5);
  });

  it("should return every over the collection items", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.every(item => item > 0)).toBeTruthy();
  });

  it("should return some over the collection items", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.some(item => item > 0)).toBeTruthy();
  });

  it("should return find over the collection items", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.find(item => item > 3)).toBe(4);
  });

  it("should return findIndex over the collection items", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.findIndex(item => item > 3)).toBe(3);
  });

  it("should return includes over the collection items", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.includes(3)).toBeTruthy();
  });

  it("should return indexOf over the collection items", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.indexOf(3)).toBe(2);
  });

  it("should return lastIndexOf over the collection items", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.lastIndexOf(3)).toBe(2);
  });

  it("should return join over the collection items", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.join(",")).toBe("1,2,3,4,5");
  });

  it("should return keys over the collection items", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.keys().all()).toEqual([0, 1, 2, 3, 4]);
  });

  it("should return values over the collection items", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.values().all()).toEqual([1, 2, 3, 4, 5]);
  });

  it("should return entries over the collection items", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.entries().all()).toEqual([
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
    ]);
  });

  it("should return flat over the collection items", () => {
    const collection = collect([1, [2, 3], [4, 5]]);

    expect(collection.flat().all()).toEqual([1, 2, 3, 4, 5]);
  });

  it("should return flatMap over the collection items", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.flatMap(item => [item, item * 2]).all()).toEqual([
      1, 2, 2, 4, 3, 6, 4, 8, 5, 10,
    ]);
  });

  it("should concat the given array", () => {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.concat([6, 7, 8]).all()).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8,
    ]);
  });
});
