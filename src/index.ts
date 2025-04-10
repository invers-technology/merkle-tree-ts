import { poseidon } from "poseidon-h";
import { Leaf, LeafInputs, OrderedLeaf } from "./leaf";
import { MerkleProof, Binary } from "./proof";
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

  prove(leaf: Leaf): Leaf[] {
    const index = this.orderedLeaves.findIndex(({ leaf: l }) => l === leaf);
    if (index === -1) {
      throw new Error("Leaf not found");
    }
    const path = this.merklePath(leaf);
    const witness = [];
    return [];
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

  private merklePath(leaf: Leaf): Binary[] {
    const result = this.orderedLeaves.find(({ leaf: l }) => l === leaf);
    if (!result) {
      throw new Error("Leaf not found");
    }
    const { index } = result;
    const path = (index >>> 0).toString(2).split("");
    return path.map((bit) => (bit === "0" ? "0" : "1"));
  }
}
