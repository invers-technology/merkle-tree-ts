import { FullMerkleTree, MerkleTree } from "../src";
import { dummyInputs, dummyLeaves } from "./helper";

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

  describe("updateLeaf (partial update)", () => {
    it("should match the root of a tree rebuilt with the updated leaf", () => {
      const leaves = dummyLeaves(8);
      const tree = new MerkleTree(leaves, 3);

      const newLeaves = dummyLeaves(1);
      const updatedLeaves = [...leaves];
      updatedLeaves[3] = newLeaves[0];
      const expected = new MerkleTree(updatedLeaves, 3);

      tree.updateLeaf(3, newLeaves[0]);

      expect(tree.root()).toBe(expected.root());
    });

    it("should change the root after updateLeaf", () => {
      const leaves = dummyLeaves(8);
      const tree = new MerkleTree(leaves, 3);
      const rootBefore = tree.root();

      const [newLeaf] = dummyLeaves(1);
      tree.updateLeaf(0, newLeaf);

      expect(tree.root()).not.toBe(rootBefore);
    });

    it("should verify a proof generated after updateLeaf", () => {
      const leaves = dummyLeaves(16);
      const tree = new MerkleTree(leaves, 3);

      const [newLeaf] = dummyLeaves(1);
      tree.updateLeaf(7, newLeaf);

      const proof = tree.prove(newLeaf);
      expect(MerkleTree.verifyProof(proof)).toBe(true);
    });

    it("should match full recomputation after consecutive updateLeaf calls", () => {
      const leaves = dummyLeaves(8);
      const tree = new MerkleTree(leaves, 3);

      const newLeaves = dummyLeaves(3);
      tree.updateLeaf(1, newLeaves[0]);
      tree.updateLeaf(4, newLeaves[1]);
      tree.updateLeaf(6, newLeaves[2]);

      const updatedLeaves = [...leaves];
      updatedLeaves[1] = newLeaves[0];
      updatedLeaves[4] = newLeaves[1];
      updatedLeaves[6] = newLeaves[2];
      const expected = new MerkleTree(updatedLeaves, 3);

      expect(tree.root()).toBe(expected.root());
    });

    it("should keep proof correctness after FullMerkleTree.update()", () => {
      const inputs = dummyInputs(8);
      const tree = new FullMerkleTree(inputs, { depth: 4 });

      const [newInput] = dummyInputs(1);
      tree.update(inputs[2], newInput);

      const proof = tree.prove(newInput.hash());
      expect(MerkleTree.verifyProof(proof)).toBe(true);
    });
  });
});
