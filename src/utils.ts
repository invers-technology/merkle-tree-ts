import { Binary } from "./proof";

export const chunk = (arr: bigint[], size: number): bigint[][] => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size),
  );
};

export const toBinary = (decimal: number, depth: number): Binary[] => {
  const binary = (decimal >>> 0).toString(2).split("");
  const diff = depth - binary.length;
  for (let i = 0; i < diff; i++) {
    binary.unshift("0");
  }
  return binary.map((bit) => (bit === "0" ? "0" : "1")) as Binary[];
};
