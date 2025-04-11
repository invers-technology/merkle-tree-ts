pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";

template MerkleTree(nInputs, nDepth) {
    signal input inputs[nInputs];
    signal input leaf;
    signal input path[nDepth];
    signal input witness[nDepth];

    signal output root;

    component poseidon = Poseidon(nInputs);
    poseidon.inputs <== inputs;

    root <== poseidon.out;
}

component main = MerkleTree(3, 2);
