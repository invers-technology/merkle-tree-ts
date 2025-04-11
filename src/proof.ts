import { Leaf } from "./leaf";

export type Binary = "0" | "1";

export interface MerkleProof {
  path: Binary[];
  witness: Leaf[];
  leaf: Leaf;
  root: Leaf;
}
