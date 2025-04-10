import { MerkleTree } from "../src";

describe("Merkle Tree", () => {
  it("should create a merkle tree", () => {
    const merkleTree = new MerkleTree(["a", "b", "c"]);
    expect(merkleTree.leaves).toEqual(["a", "b", "c"]);
  });
});
