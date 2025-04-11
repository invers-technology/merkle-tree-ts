import { chunk, toBinary } from "../src/utils";

describe("Utils", () => {
  it("should chunk an array", () => {
    const array = [1n, 2n, 3n, 4n, 5n];
    const array2 = [1n, 2n, 3n, 4n, 5n, 6n];
    const chunked = chunk(array, 2);
    const chunked2 = chunk(array2, 2);
    const chunked3 = chunk(array, 3);
    const chunked4 = chunk(array2, 3);

    expect(chunked).toEqual([[1n, 2n], [3n, 4n], [5n]]);
    expect(chunked2).toEqual([
      [1n, 2n],
      [3n, 4n],
      [5n, 6n],
    ]);
    expect(chunked3).toEqual([
      [1n, 2n, 3n],
      [4n, 5n],
    ]);
    expect(chunked4).toEqual([
      [1n, 2n, 3n],
      [4n, 5n, 6n],
    ]);
  });

  it("should convert a decimal to a binary array", () => {
    const binary = toBinary(1, 3);
    const binary2 = toBinary(17, 8);

    expect(binary).toEqual(["0", "0", "1"]);
    expect(binary2).toEqual(["0", "0", "0", "1", "0", "0", "0", "1"]);
  });
});
