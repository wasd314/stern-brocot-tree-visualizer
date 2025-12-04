import { expect, test } from "vitest";
import {
  toContinuedFraction,
  toSternBrocotAncients,
} from "./continued_fraction";

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

test("toSternBrocotAncients", () => {
  expect(
    toSternBrocotAncients({ numerator: 1n, denominator: 1n }),
  ).toStrictEqual([
    {
      begin: { numerator: 1n, denominator: 1n },
      diff: { numerator: 1n, denominator: 0n },
      length: 0n,
    },
  ]);

  expect(
    toSternBrocotAncients({ numerator: 5n, denominator: 1n }),
  ).toStrictEqual([
    {
      begin: { numerator: 1n, denominator: 1n },
      diff: { numerator: 1n, denominator: 0n },
      length: 4n,
    },
  ]);

  expect(
    toSternBrocotAncients({ numerator: 1n, denominator: 5n }),
  ).toStrictEqual([
    {
      begin: { numerator: 1n, denominator: 1n },
      diff: { numerator: 1n, denominator: 0n },
      length: 0n,
    },
    {
      begin: { numerator: 1n, denominator: 1n },
      diff: { numerator: 0n, denominator: 1n },
      length: 4n,
    },
  ]);
});
