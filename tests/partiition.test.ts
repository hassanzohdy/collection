import { collect } from "src/ImmutableCollection";
import { studentsClasses } from "./data";

describe("collection/ImmutableCollection/partition", () => {
  it("should return two collections by partitioning the data using the given callback", () => {
    const [odds, evens] = collect([1, 2, 3, 4, 5, 6, 7]).partition(
      value => value % 2 === 1,
    );

    expect(odds.all()).toEqual([1, 3, 5, 7]);
    expect(evens.all()).toEqual([2, 4, 6]);
  });

  it("should return empty first collection and all items in second collection", () => {
    const [empty, all] = collect([1, 2, 3, 4, 5, 6, 7]).partition(
      value => value > 10,
    );

    expect(empty.all()).toEqual([]);

    expect(all.all()).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("should return empty second collection and all items in first collection", () => {
    const [all, empty] = collect([1, 2, 3, 4, 5, 6, 7]).partition(
      value => value < 10,
    );

    expect(empty.all()).toEqual([]);

    expect(all.all()).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });
});
