import { groupBy } from "lodash";

export const fingermap = {
  "'": 10,
  q: 2,
  w: 2,
  e: 3,
  r: 4,
  t: 4,
  y: 7,
  u: 7,
  i: 8,
  o: 9,
  p: 9,
  a: 1,
  s: 2,
  d: 3,
  f: 4,
  g: 4,
  h: 7,
  j: 7,
  k: 8,
  l: 9,
  z: 2,
  x: 2,
  c: 4,
  v: 4,
  b: 7,
  n: 7,
  m: 7,
  " ": 6,
} as const;

export type Key = keyof typeof fingermap;

export const groupedFingermap = groupBy(
  Object.keys(fingermap),
  (key) => fingermap[key as Key],
);

export const keyboardLayout = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "["],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", "'"],
  ["z", "x", "c", "v", "b", "n", "m", ",", "."],
  [" "],
] as readonly (readonly Key[])[];
