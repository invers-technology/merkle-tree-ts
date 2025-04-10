import { poseidon } from "poseidon-h";
import { Leaf, LeafInputs, OrderedLeaf } from "./leaf";

export * from "./leaf";

export class FullMerkleTree {
  private depth: number;
  private leavesInputs: LeafInputs[];
  public orderedLeaves: OrderedLeaf[];

  constructor(leavesInputs: LeafInputs[]) {
    this.leavesInputs = leavesInputs;
    this.depth = Math.ceil(Math.log2(leavesInputs.length));
    const diff = Math.pow(2, this.depth) - leavesInputs.length;
    this.orderedLeaves = leavesInputs.map((leafInput, index) => ({
      index,
      leaf: leafInput.hash(),
    }));
    for (let i = 0; i < diff; i++) {
      this.orderedLeaves.push({
        index: this.orderedLeaves.length,
        leaf: this.leavesInputs[i].zeroHash(),
      });
    }
  }

  root(): Leaf {
    let root = this.getLeaves();
    for (let i = 0; i < this.depth; i++) {
      const chunks = this.chunk(root, 2);
      root = chunks.map(([a, b]) => poseidon([a, b]));
    }
    return root[0];
  }

  getLeaves(): Leaf[] {
    this.orderedLeaves.sort((a, b) => a.index - b.index);
    return this.orderedLeaves.map(({ leaf }) => leaf);
  }

  private chunk(arr: any[], size: number): any[][] {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size),
    );
  }
}
