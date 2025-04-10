import { FullMerkleTree } from "../src";
import { dummyLeaves } from "./utils";

describe("Merkle Tree", () => {
  it("should create a merkle tree with leaves", () => {
    const leaves = dummyLeaves(3);
    const merkleTree = new FullMerkleTree(leaves);
    const leavesResult = merkleTree.getLeaves();
    const hash = leaves[0].hash();

    expect(leavesResult.includes(hash)).toBe(true);
  });

  it("should calculate the same root", () => {
    const leaves = dummyLeaves(3);
    const merkleTree = new FullMerkleTree(leaves);
    const merkleTree2 = new FullMerkleTree(leaves);
    const root = merkleTree.root();
    const root2 = merkleTree2.root();

    expect(root).toBe(root2);
  });
});
