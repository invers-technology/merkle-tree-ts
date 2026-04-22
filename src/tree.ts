import { poseidon } from "poseidon-h";
import { Leaf, OrderedLeaf } from "./leaf";
import { Binary, MerkleProof } from "./proof";
import { chunk, toBinary, toDecimal, zip } from "./utils";

export interface MerkleTreeOptions {
  depth?: number;
}

export class MerkleTree {
  public depth: number;
  public orderedLeaves: OrderedLeaf[];
  public zeroHash: Leaf;
  private nodes: Leaf[][] | null = null;

  constructor(
    leaves: Leaf[],
    inputsLength: number,
    options?: MerkleTreeOptions,
  ) {
    const depthFromLeaves = Math.ceil(Math.log2(leaves.length));
    if (options?.depth && options.depth < depthFromLeaves) {
      throw new Error("Depth is less than the number of leaves");
    }
    this.depth = options?.depth ?? depthFromLeaves;
    this.orderedLeaves = leaves.map((leaf, index) => ({
      index,
      leaf,
    }));
    this.zeroHash = poseidon(
      Array.from({ length: inputsLength }, () => BigInt(0)),
    );
  }

  private buildNodes(): Leaf[][] {
    this.padLeaves();
    const nodes: Leaf[][] = [this.getLeaves()];
    for (let i = 0; i < this.depth; i++) {
      const prevLevel = nodes[i];
      nodes.push(chunk(prevLevel, 2).map(([a, b]) => poseidon([a, b])));
    }
    return nodes;
  }

  private getNodes(): Leaf[][] {
    if (!this.nodes) {
      this.nodes = this.buildNodes();
    }
    return this.nodes;
  }

  protected invalidateCache(): void {
    this.nodes = null;
  }

  root(): Leaf {
    return this.getNodes()[this.depth][0];
  }

  prove(merkleLeaf: Leaf): MerkleProof {
    const nodes = this.getNodes();
    const merklePath = this.merklePath(merkleLeaf);
    const merkleWitness: Leaf[] = [];

    let pos = toDecimal(merklePath);
    for (let level = 0; level < this.depth; level++) {
      const siblingPos = pos % 2 === 0 ? pos + 1 : pos - 1;
      merkleWitness.push(nodes[level][siblingPos]);
      pos = Math.floor(pos / 2);
    }

    merklePath.reverse();
    return {
      merklePath,
      merkleWitness,
      merkleLeaf,
      merkleRoot: nodes[this.depth][0],
    };
  }

  updateLeaf(index: number, newLeaf: Leaf): void {
    const nodes = this.getNodes();

    const entry = this.orderedLeaves.find(({ index: i }) => i === index);
    if (!entry) {
      throw new Error(`Leaf at index ${index} not found`);
    }
    entry.leaf = newLeaf;

    nodes[0][index] = newLeaf;

    let pos = index;
    for (let level = 1; level <= this.depth; level++) {
      const parentPos = Math.floor(pos / 2);
      const left = nodes[level - 1][parentPos * 2];
      const right = nodes[level - 1][parentPos * 2 + 1];
      nodes[level][parentPos] = poseidon([left, right]);
      pos = parentPos;
    }
  }

  static verify(
    merkleRoot: Leaf,
    merkleLeaf: Leaf,
    merklePath: Binary[],
    merkleWitness: Leaf[],
  ): boolean {
    return this.verifyProof({
      merklePath,
      merkleWitness,
      merkleLeaf,
      merkleRoot,
    });
  }

  static verifyProof(proof: MerkleProof): boolean {
    const { merklePath, merkleWitness, merkleLeaf, merkleRoot } = proof;
    let current = merkleLeaf;
    for (const [binary, sibling] of zip(merklePath, merkleWitness)) {
      current = poseidon(
        binary === "0" ? [current, sibling] : [sibling, current],
      );
    }
    return current === merkleRoot;
  }

  getLeaves(): Leaf[] {
    this.orderedLeaves.sort((a, b) => a.index - b.index);
    return this.orderedLeaves.map(({ leaf }) => leaf);
  }

  private padLeaves(): void {
    const diff = Math.pow(2, this.depth) - this.orderedLeaves.length;
    for (let i = 0; i < diff; i++) {
      this.orderedLeaves.push({
        index: this.orderedLeaves.length,
        leaf: this.zeroHash,
      });
    }
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
