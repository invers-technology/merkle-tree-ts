import { Leaf } from "./leaf";
import { Binary } from "./proof";

export const chunk = (arr: bigint[], size: number): bigint[][] => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size),
  );
};

export const zip = (arr1: Binary[], arr2: Leaf[]): [Binary, Leaf][] => {
  return arr1.map((_, i) => [arr1[i], arr2[i]]);
};

export const toBinary = (decimal: number, depth: number): Binary[] => {
  const binary = (decimal >>> 0).toString(2).split("");
  const diff = depth - binary.length;
  for (let i = 0; i < diff; i++) {
    binary.unshift("0");
  }
  return binary.map((bit) => (bit === "0" ? "0" : "1")) as Binary[];
};

export const toDecimal = (binary: Binary[]): number => {
  return parseInt(binary.join(""), 2);
};
