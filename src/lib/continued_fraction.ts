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

interface DescendProps {
  begin: Fraction;
  diff: Fraction;
  length: bigint;
}
export const descend = ({ begin, diff, length }: DescendProps): Fraction => {
  return {
    numerator: begin.numerator + diff.numerator * length,
    denominator: begin.denominator + diff.denominator * length,
  };
};

/**
 * 系列 begin (+) i (*) diff (0 <= i <= length)
 * ただし (+), (*) は分母・分子ごとに
 */
interface Path {
  begin: Fraction;
  diff: Fraction;
  length: bigint;
}

export const toSternBrocotAncients = (frac: Fraction) => {
  const cf = toContinuedFraction(frac);
  cf[cf.length - 1]--;
  const paths: Path[] = [];
  let begin: Fraction = { numerator: 1n, denominator: 1n };
  let diff: Fraction = { numerator: 1n, denominator: 0n };
  cf.forEach((length) => {
    paths.push({ begin, diff, length });
    const newBegin = descend({ begin, diff, length });
    const newDiff = descend({ begin, diff, length: length - 1n });
    begin = newBegin;
    diff = newDiff;
  });

  return paths;
};
