import { LeafInputs, Leaf } from "../../src";
import { poseidon, randomFieldElement } from "poseidon-h";

type Inputs = [bigint, bigint, bigint];

class TestLeaf implements LeafInputs {
  private inputs: Inputs;
  public zeroHash: Leaf;

  constructor(inputs: Inputs) {
    this.inputs = inputs;
    this.zeroHash = poseidon(this.inputs.map(() => BigInt(0)));
  }

  hash(): Leaf {
    return poseidon(this.inputs);
  }

  toInputs(): Inputs {
    return this.inputs;
  }
}

export const dummyInputs = (n: number): LeafInputs[] => {
  return Array.from(
    { length: n },
    () =>
      new TestLeaf([
        randomFieldElement(),
        randomFieldElement(),
        randomFieldElement(),
      ]),
  );
};

export const dummyLeaves = (n: number) => {
  return dummyInputs(n).map((inputs) => inputs.hash());
};
