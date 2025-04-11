import { poseidon } from "poseidon-h";
import { Leaf, OrderedLeaf } from "./leaf";
import { Binary, MerkleProof } from "./proof";
import { chunk, toBinary, toDecimal, zip } from "./utils";

export class MerkleTree {
  public depth: number;
  public orderedLeaves: OrderedLeaf[];

  constructor(leaves: Leaf[], inputsLength: number) {
    this.depth = Math.ceil(Math.log2(leaves.length));
    const diff = Math.pow(2, this.depth) - leaves.length;
    this.orderedLeaves = leaves.map((leaf, index) => ({
      index,
      leaf,
    }));
    for (let i = 0; i < diff; i++) {
      this.orderedLeaves.push({
        index: this.orderedLeaves.length,
        leaf: poseidon(Array.from({ length: inputsLength }, () => BigInt(0))),
      });
    }
  }

  root(): Leaf {
    let root = this.getLeaves();
    for (let i = 0; i < this.depth; i++) {
      root = chunk(root, 2).map(([a, b]) => poseidon([a, b]));
    }
    return root[0];
  }

  prove(leaf: Leaf): MerkleProof {
    const path = this.merklePath(leaf);
    let leaves = this.getLeaves();
    const witness: Leaf[] = [];
    for (let i = this.depth; i > 0; i--) {
      const position = toDecimal(path.slice(0, i));
      const sibilingPosition = position + (path[i - 1] === "1" ? -1 : 1);
      witness.push(leaves[sibilingPosition]);
      leaves = chunk(leaves, 2).map(poseidon);
    }
    path.reverse();
    return { path, witness, leaf, root: this.root() };
  }

  verify(proof: MerkleProof): boolean {
    const { path, witness, leaf, root } = proof;
    let current = leaf;
    for (const [binary, sibling] of zip(path, witness)) {
      current = poseidon(
        binary === "0" ? [current, sibling] : [sibling, current],
      );
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
