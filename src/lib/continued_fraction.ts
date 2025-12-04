import { type Fraction } from "./parse";

export const toContinuedFraction = ({
  numerator: a,
  denominator: b,
}: Fraction) => {
  const cf = [];
  while (b !== 0n) {
    cf.push(a / b);
    const r = a % b;
    a = b;
    b = r;
  }
  return cf;
};
