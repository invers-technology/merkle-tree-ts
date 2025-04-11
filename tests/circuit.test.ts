import { poseidon } from "poseidon-h";
import path from "path";
import { dummyInputs } from "./helper";
import { FullMerkleTree } from "../src";
const wasm = require("circom_tester").wasm;

describe("Circuit", () => {
  it("should create a circuit", async () => {
    const inputs = dummyInputs(3);
    const fullMerkleTree = new FullMerkleTree(inputs);
    const circuit = await wasm(path.join("circuit", "merkle.circom"));
    const witness = await circuit.calculateWitness({
      inputs: inputs[0].toInputs(),
      leaf: inputs[0].hash(),
      path: inputs[0].hash(),
    });
    const hash = poseidon(inputs[0].toInputs());

    await circuit.assertOut(witness, { root: hash });
  });
});
