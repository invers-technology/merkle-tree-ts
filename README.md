# Merkle Tree by Poseidon Hash with Typescript

[![MIT License](https://img.shields.io/github/license/inverse-technology/merkle-tree-ts?style=flat-square)](https://github.com/inverse-technology/merkle-tree-ts/blob/master/LICENSE)
[![Language](https://img.shields.io/badge/language-TypeScript-blue.svg?style=flat-square)](https://www.typescriptlang.org) ![npm version](https://badge.fury.io/js/merkle-t.svg) [![CI Check](https://github.com/inverse-technology/merkle-tree-ts/actions/workflows/index.yml/badge.svg)](https://github.com/inverse-technology/merkle-tree-ts/actions/workflows/index.yml)

A merkle tree implementation with poseidon hash and circom circuit.

**Use at your own risk**.

## Install

```shell
$ npm i merkle-t
```

## Usage

```ts
import { MerkleTree, LeafInputs, Leaf } from "merkle-t";
import { poseidon, randomFieldElement } from "poseidon-h";

class NyLeaf implements LeafInputs {
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

const leaves = Array.from({ length: n }, () =>
  new TestLeaf([
    randomFieldElement(),
    randomFieldElement(),
    randomFieldElement(),
  ]).hash(),
);

const merkleTree = new MerkleTree(leaves, 3);
const proof = merkleTree.prove(leaves[13]);
const isValid = merkleTree.verify(proof);

expect(isValid).toBe(true);
```

## Test

```shell
$ yarn test
```
