export type Leaf = bigint;

export interface LeafInputs {
  hash(): Leaf;
  zeroHash(): Leaf;
  toInputs(): bigint[];
}

export interface OrderedLeaf {
  index: number;
  leaf: Leaf;
}
