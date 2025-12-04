import { expect, test } from "vitest";
import {
  toContinuedFraction,
  toSternBrocotAncients,
} from "./continued_fraction";

test("toContinuedFraction", () => {
  [
    { num: 1n, den: 1n, cf: [1n] },
    { num: 3n, den: 5n, cf: [0n, 1n, 1n, 2n] },
    { num: 29n, den: 11n, cf: [2n, 1n, 1n, 1n, 3n] },
    {
      num: 36524219n,
      den: 100000n,
      cf: [365n, 4n, 7n, 1n, 3n, 24n, 6n, 2n, 2n],
    },
  ].forEach(({ num, den, cf }) => {
    expect(toContinuedFraction({ num, den })).toStrictEqual(cf);
  });
});

test("toSternBrocotAncients", () => {
  expect(toSternBrocotAncients({ num: 1n, den: 1n })).toStrictEqual([
    {
      begin: { num: 1n, den: 1n },
      diff: { num: 1n, den: 0n },
      length: 0n,
    },
  ]);

  expect(toSternBrocotAncients({ num: 5n, den: 1n })).toStrictEqual([
    {
      begin: { num: 1n, den: 1n },
      diff: { num: 1n, den: 0n },
      length: 4n,
    },
  ]);

  expect(toSternBrocotAncients({ num: 1n, den: 5n })).toStrictEqual([
    {
      begin: { num: 1n, den: 1n },
      diff: { num: 1n, den: 0n },
      length: 0n,
    },
    {
      begin: { num: 1n, den: 1n },
      diff: { num: 0n, den: 1n },
      length: 4n,
    },
  ]);
});
