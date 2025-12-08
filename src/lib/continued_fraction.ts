import { type Fraction } from "./parse";

export const toContinuedFraction = ({ num: a, den: b }: Fraction) => {
  const cf = [];
  while (b !== 0n) {
    let [q, r] = [a / b, a % b];
    if (r < 0n) {
      q -= 1n;
      r += b;
    }
    cf.push(q);
    [a, b] = [b, r];
  }
  return { cf, gcd: a >= 0 ? a : -a };
};

interface DescendProps {
  begin: Fraction;
  diff: Fraction;
  length: bigint;
}
export const descend = ({ begin, diff, length }: DescendProps): Fraction => {
  return {
    num: begin.num + diff.num * length,
    den: begin.den + diff.den * length,
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
  const { cf } = toContinuedFraction(frac);
  cf[cf.length - 1]--;
  const paths: Path[] = [];
  let begin: Fraction = { num: 1n, den: 1n };
  let diff: Fraction = { num: 1n, den: 0n };
  cf.forEach((length) => {
    paths.push({ begin, diff, length });
    const newBegin = descend({ begin, diff, length });
    const newDiff = descend({ begin, diff, length: length - 1n });
    begin = newBegin;
    diff = newDiff;
  });

  return paths;
};

interface GreaterRow {
  right: Fraction;
  depth: bigint;
  leftIndex: bigint;
}
interface LessRow {
  left: Fraction;
  depth: bigint;
  rightIndex: bigint;
}
interface TurningGreaterRow extends GreaterRow {
  rightIndex: bigint;
}
interface TurningLessRow extends LessRow {
  leftIndex: bigint;
}
interface LeftEqualRow {
  center: Fraction;
  depth: bigint;
  leftIndex: bigint;
}
interface RightEqualRow {
  center: Fraction;
  depth: bigint;
  rightIndex: bigint;
}
type Ellipsis = "⋮";
export const Ellipsis = "⋮";

interface GreaterEllipsisRow {
  right: Ellipsis;
  depth: Ellipsis;
  leftIndex: Ellipsis;
}
interface LessEllipsisRow {
  left: Ellipsis;
  depth: Ellipsis;
  rightIndex: Ellipsis;
}
type EnumeratedRow =
  | LessRow
  | TurningLessRow
  | GreaterRow
  | TurningGreaterRow
  | LeftEqualRow
  | RightEqualRow
  | GreaterEllipsisRow
  | LessEllipsisRow;

interface EnumerateAncientsProps {
  frac: Fraction;
  first: bigint | undefined;
  last: bigint | undefined;
}
export const enumerateAncients = ({
  frac,
  first,
  last,
}: EnumerateAncientsProps): EnumeratedRow[] => {
  const paths = toSternBrocotAncients(frac);
  const n = paths.length;
  if (n === 1 && paths[0].length === 0n) {
    return [
      {
        center: { num: 1n, den: 1n },
        depth: 0n,
        rightIndex: 0n,
      },
    ];
  }
  let depth = 0n;
  const min = (a: bigint, b: bigint) => (a <= b ? a : b);
  const max = (a: bigint, b: bigint) => (a >= b ? a : b);
  const rows = paths.flatMap(({ begin, diff, length }, index) => {
    const seq: EnumeratedRow[] =
      index === 0 && length > 0
        ? [
            {
              left: { num: 1n, den: 1n },
              depth,
              rightIndex: 0n,
            },
          ]
        : [];
    const isLeft = index % 2 === 1;
    const first1 = min(first ?? length, length - 1n);
    const last1 = max(length - (last ?? length) + 1n, 1n);
    const middleRow = (i: bigint) =>
      isLeft
        ? {
            right: descend({ begin, diff, length: i }),
            depth: depth + i,
            leftIndex: i,
          }
        : {
            left: descend({ begin, diff, length: i }),
            depth: depth + i,
            rightIndex: i,
          };
    // push [1, first1] | [last1, length - 1]
    if (first1 >= last1 - 1n) {
      // united
      seq.push(
        ...Array.from({ length: Number(length - 1n) }, (_, i1) =>
          middleRow(BigInt(i1) + 1n),
        ),
      );
    } else if (length > 0) {
      // split
      const skip: GreaterEllipsisRow | LessEllipsisRow = isLeft
        ? { right: Ellipsis, depth: Ellipsis, leftIndex: Ellipsis }
        : { left: Ellipsis, depth: Ellipsis, rightIndex: Ellipsis };
      // console.log({index, length, first1, last1});
      seq.push(
        // [1, first1]
        ...Array.from({ length: Number(first1) }, (_, i1) =>
          middleRow(BigInt(i1) + 1n),
        ),
        skip,
        // [last1, length - 1]
        ...Array.from({ length: Number(length - last1) }, (_, i1) =>
          middleRow(BigInt(i1) + last1),
        ),
      );
    }
    // push [length]
    if (isLeft) {
      seq.push(
        index === n - 1
          ? {
              center: descend({ begin, diff, length }),
              depth: depth + length,
              leftIndex: length,
            }
          : {
              left: descend({ begin, diff, length }),
              depth: depth + length,
              leftIndex: length,
              rightIndex: 0n,
            },
      );
    } else {
      seq.push(
        index === n - 1
          ? {
              center: descend({ begin, diff, length }),
              depth: depth + length,
              rightIndex: length,
            }
          : {
              right: descend({ begin, diff, length }),
              depth: depth + length,
              rightIndex: length,
              leftIndex: 0n,
            },
      );
    }
    depth += length;
    return seq;
  });
  return rows;
};
