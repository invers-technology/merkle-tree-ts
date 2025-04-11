import { poseidon } from "poseidon-h";
import { Leaf, LeafInputs, OrderedLeaf } from "./leaf";
import { MerkleProof, Binary } from "./proof";
export * from "./leaf";
import { chunk, toBinary, toDecimal, zip } from "./utils";

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
      const chunks = chunk(root, 2);
      root = chunks.map(([a, b]) => poseidon([a, b]));
    }
    return root[0];
  }

  prove(leaf: Leaf): MerkleProof {
    const index = this.orderedLeaves.findIndex(({ leaf: l }) => l === leaf);
    if (index === -1) {
      throw new Error("Leaf not found");
    }
    const path = this.merklePath(leaf);
    let leaves = this.getLeaves();
    const witness: Leaf[] = [];
    for (let i = 0; i < this.depth; i++) {
      const position = toDecimal(path.slice(0, this.depth - i));
      if (path[this.depth - i - 1] === "1") {
        witness.push(leaves[position - 1]);
      } else {
        witness.push(leaves[position + 1]);
      }
      const chunks = chunk(leaves, 2);
      leaves = chunks.map(([a, b]) => poseidon([a, b]));
    }
    return { path, witness, leaf, root: this.root() };
  }

  verify(proof: MerkleProof): boolean {
    const { path, witness, leaf, root } = proof;
    let current = leaf;
    path.reverse();
    for (const [binary, sibling] of zip(path, witness)) {
      if (binary === "0") {
        current = poseidon([current, sibling]);
      } else {
        current = poseidon([sibling, current]);
      }
    }
    return current === root;
  }

  getLeaves(): Leaf[] {
    this.orderedLeaves.sort((a, b) => a.index - b.index);
    return this.orderedLeaves.map(({ leaf }) => leaf);
  }

  private merklePath(leaf: Leaf): Binary[] {
    const result = this.orderedLeaves.find(({ leaf: l }) => l === leaf);
    if (!result) {
      throw new Error("Leaf not found");
    }
    const { index } = result;
    return toBinary(index, this.depth);
  }
}
