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
    leaf === poseidon.out;

    component hasher[nDepth];
    signal hash[nDepth + 1];
    for (var i = 0; i < nDepth; i++) {
        hasher[i] = Poseidon(2);
    }

    hash[0] <== leaf;

    for (var i = 0; i < nDepth; i++) {
        hasher[i].inputs[0] <-- path[i] == 0 ? hash[i] : witness[i];
        hasher[i].inputs[1] <-- path[i] == 0 ? witness[i] : hash[i];
        hash[i + 1] <== hasher[i].out;
    }

    root <== hash[nDepth];
}

component main = MerkleTree(3, 2);
