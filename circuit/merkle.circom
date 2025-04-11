pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";

template MerkleTree() {
    signal input inputs[3];
    signal input leaf;
    signal input path;
    signal output root;
    component poseidon = Poseidon(3);

    poseidon.inputs <== inputs;

    root <== poseidon.out;
}

component main = MerkleTree();
