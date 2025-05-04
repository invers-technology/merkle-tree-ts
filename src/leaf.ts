export type Leaf = bigint;

export interface LeafInputs {
  zeroHash: Leaf;
  hash(): Leaf;
  toInputs(): bigint[];
}

export interface OrderedLeaf {
  index: number;
  leaf: Leaf;
}
