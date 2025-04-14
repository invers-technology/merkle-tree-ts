pragma circom 2.0.0;

include "circomlib/circuits/mux1.circom";
include "circomlib/circuits/poseidon.circom";
include "circomlib/circuits/comparators.circom";

template MerkleTree(nInputs, nDepth) {
    signal input inputs[nInputs];
    signal input leaf;
    signal input path[nDepth];
    signal input witness[nDepth];
    signal output root;

    // check whether the leaf corresponds to the correct inputs
    component poseidon = Poseidon(nInputs);
    poseidon.inputs <== inputs;
    leaf === poseidon.out;

    // initialize the hasher, hash position variables, and intermediate hashed values
    component hasher[nDepth];
    component hashPos[nDepth];
    signal hash[nDepth + 1];
    hash[0] <== leaf;

    // check whether the root is valid
    for (var i = 0; i < nDepth; i++) {
        // check whether the path is binary
        0 === path[i] * (1 - path[i]);

        // initialize the hash function and hash position selector
        hasher[i] = Poseidon(2);
        hashPos[i] = MultiMux1(2);

        // set the hash position
        hashPos[i].c[0][0] <== hash[i];
        hashPos[i].c[0][1] <== witness[i];
        hashPos[i].c[1][0] <== witness[i];
        hashPos[i].c[1][1] <== hash[i];
        hashPos[i].s <== path[i];

        // calculate the intermediate hash value
        hasher[i].inputs[0] <== hashPos[i].out[0];
        hasher[i].inputs[1] <== hashPos[i].out[1];
        hash[i + 1] <== hasher[i].out;
    }
    root <== hash[nDepth];
}
