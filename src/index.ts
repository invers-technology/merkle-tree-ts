import { Leaf, LeafInputs, OrderedLeaf } from "./leaf";
import { MerkleTree, MerkleTreeOptions } from "./tree";

export { Leaf, LeafInputs, OrderedLeaf, MerkleTree, MerkleTreeOptions };

export class FullMerkleTree extends MerkleTree {
  private leavesInputs: LeafInputs[];

  constructor(leavesInputs: LeafInputs[], options?: MerkleTreeOptions) {
    super(
      leavesInputs.map((leafInput) => leafInput.hash()),
      leavesInputs.length,
      options,
    );
    this.leavesInputs = leavesInputs;
  }

  insert(leafInput: LeafInputs): void {
    const max = Math.pow(2, this.depth) - 1;
    if (this.orderedLeaves.length >= max) {
      throw new Error("Tree is full");
    }
    this.leavesInputs.push(leafInput);
    this.orderedLeaves.push({
      index: this.orderedLeaves.length,
      leaf: leafInput.hash(),
    });
  }

  update(key: LeafInputs, leafInput: LeafInputs): void {
    const index = this.leavesInputs.findIndex((leafInput) => leafInput === key);
    if (index === -1) {
      throw new Error("Key not found");
    }
    this.leavesInputs[index] = leafInput;
  }
}
