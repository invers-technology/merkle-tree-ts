import { Leaf } from "./leaf";

export type Binary = "0" | "1";

export interface MerkleProof {
  merklePath: Binary[];
  merkleWitness: Leaf[];
  merkleLeaf: Leaf;
  merkleRoot: Leaf;
}
