import { LeafInputs, Leaf } from "../src";
import { poseidon, randomFieldElement } from "poseidon-h";

class TestLeaf implements LeafInputs {
  private inputs: [bigint, bigint, bigint];

  constructor(inputs: [bigint, bigint, bigint]) {
    this.inputs = inputs;
  }

  hash(): Leaf {
    return poseidon(this.inputs);
  }

  zeroHash(): Leaf {
    return poseidon(this.inputs.map(() => BigInt(0)));
  }

  toInputs(): bigint[] {
    return this.inputs;
  }
}

export const dummyLeaves = (n: number) => {
  return Array.from({ length: n }, () =>
    new TestLeaf([
      randomFieldElement(),
      randomFieldElement(),
      randomFieldElement(),
    ]).hash(),
  );
};
