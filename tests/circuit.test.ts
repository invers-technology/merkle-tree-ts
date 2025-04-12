import path from "path";
import { dummyInputs } from "./helper";
import { FullMerkleTree, MerkleTree } from "../src";
const wasm = require("circom_tester").wasm;

describe("Circuit", () => {
  it("should create a circuit", async () => {
    const inputs = dummyInputs(3);
    const fullMerkleTree = new FullMerkleTree(inputs);
    const leaves = fullMerkleTree.getLeaves();
    const leaf = leaves[0];
    const root = fullMerkleTree.root();
    const { merklePath, merkleWitness } = fullMerkleTree.prove(leaf);
    const circuit = await wasm(path.join("circuit", "merkle.circom"));
    const witness = await circuit.calculateWitness({
      inputs: inputs[0].toInputs(),
      leaf: inputs[0].hash(),
      path: merklePath,
      witness: merkleWitness,
    });

    await circuit.assertOut(witness, { root });
    expect(MerkleTree.verify(root, leaf, merklePath, merkleWitness)).toEqual(
      true,
    );
  });
});
