import { collect } from "src/ImmutableCollection";
import { studentsClasses } from "./data";

describe("collection/ImmutableCollection/group", () => {
  it("should group values from collection", () => {
    const collection = collect(studentsClasses);

    expect(collection.groupBy("class").length).toEqual(3);
  });

  // it("should group values from collection using dot notation syntax", () => {
  //   const collection = collect();

  //   console.log(groupBy(orders, "total.price"));

  //   expect(collection.groupBy("total.price").length).toEqual(3);
  // });
});
