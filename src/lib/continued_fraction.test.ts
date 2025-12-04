import { expect, test } from "vitest";
import { toContinuedFraction } from "./continued_fraction";

test("toContinuedFraction", () => {
  [
    { numerator: 1n, denominator: 1n, cf: [1n] },
    { numerator: 3n, denominator: 5n, cf: [0n, 1n, 1n, 2n] },
    { numerator: 29n, denominator: 11n, cf: [2n, 1n, 1n, 1n, 3n] },
    {
      numerator: 36524219n,
      denominator: 100000n,
      cf: [365n, 4n, 7n, 1n, 3n, 24n, 6n, 2n, 2n],
    },
  ].forEach(({ numerator, denominator, cf }) => {
    expect(toContinuedFraction({ numerator, denominator })).toStrictEqual(cf);
  });
});
