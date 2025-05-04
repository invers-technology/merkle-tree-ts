import { MerkleTree } from "../src";
import { dummyLeaves } from "./helper";

describe("Merkle Tree", () => {
  it("should create a merkle tree with leaves", () => {
    const leaves = dummyLeaves(3);
    const merkleTree = new MerkleTree(leaves, 3);
    const leavesResult = merkleTree.getLeaves();
    const hash = leaves[0];

    expect(leavesResult.includes(hash)).toBe(true);
  });

  it("should calculate the same root", () => {
    const leaves = dummyLeaves(3);
    const merkleTree = new MerkleTree(leaves, 3);
    const merkleTree2 = new MerkleTree(leaves, 3);
    const root = merkleTree.root();
    const root2 = merkleTree2.root();

    expect(root).toBe(root2);
  });

  it("should prove a leaf", () => {
    const leaves = dummyLeaves(17);
    const merkleTree = new MerkleTree(leaves, 3);
    const proof = merkleTree.prove(leaves[13]);
    const isValid = MerkleTree.verifyProof(proof);

    expect(isValid).toBe(true);
  });

  it("should prove a leaf with static verify", () => {
    const leaves = dummyLeaves(17);
    const merkleTree = new MerkleTree(leaves, 3);
    const proof = merkleTree.prove(leaves[13]);
    const isValid = MerkleTree.verify(
      merkleTree.root(),
      leaves[13],
      proof.merklePath,
      proof.merkleWitness,
    );

    expect(isValid).toBe(true);
  });

  it("should fail to prove a leaf with static verify", () => {
    const leaves = dummyLeaves(17);
    const merkleTree = new MerkleTree(leaves, 3);
    const proof = merkleTree.prove(leaves[13]);
    const isValid = MerkleTree.verify(
      merkleTree.root(),
      leaves[12],
      proof.merklePath,
      proof.merkleWitness,
    );

    expect(isValid).toBe(false);
  });

  it("should throw an error if the depth is less than the number of leaves", () => {
    const leaves = dummyLeaves(1025);
    expect(() => new MerkleTree(leaves, 3, { depth: 10 })).toThrow();
  });
});
