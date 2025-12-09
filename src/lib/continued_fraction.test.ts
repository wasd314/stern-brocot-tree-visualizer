import { expect, test } from "vitest";
import {
  type EnumeratedRow,
  enumerateAncients,
  greaterEllipsis,
  lessEllipsis,
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
    expect(toContinuedFraction({ num, den })).toStrictEqual({ cf, gcd: 1n });
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

test("enumerateAncients", () => {
  // 1/1
  expect(
    enumerateAncients({
      frac: { num: 1n, den: 1n },
      first: undefined,
      last: undefined,
    }),
  ).toStrictEqual([
    {
      center: { num: 1n, den: 1n },
      depth: 0n,
      rightIndex: 0n,
    },
  ]);

  // 3/1
  expect(
    enumerateAncients({
      frac: { num: 3n, den: 1n },
      first: undefined,
      last: undefined,
    }),
  ).toStrictEqual([
    { left: { num: 1n, den: 1n }, depth: 0n, rightIndex: 0n },
    { left: { num: 2n, den: 1n }, depth: 1n, rightIndex: 1n },
    { center: { num: 3n, den: 1n }, depth: 2n, rightIndex: 2n },
  ]);

  // 1/3
  expect(
    enumerateAncients({
      frac: { num: 1n, den: 3n },
      first: undefined,
      last: undefined,
    }),
  ).toStrictEqual([
    { right: { num: 1n, den: 1n }, depth: 0n, leftIndex: 0n, rightIndex: 0n },
    { right: { num: 1n, den: 2n }, depth: 1n, leftIndex: 1n },
    { center: { num: 1n, den: 3n }, depth: 2n, leftIndex: 2n },
  ]);

  // 2/5 = [0; 2, 2]
  expect(
    enumerateAncients({
      frac: { num: 2n, den: 5n },
      first: undefined,
      last: undefined,
    }),
  ).toStrictEqual([
    { right: { num: 1n, den: 1n }, depth: 0n, leftIndex: 0n, rightIndex: 0n },
    { right: { num: 1n, den: 2n }, depth: 1n, leftIndex: 1n },
    { left: { num: 1n, den: 3n }, depth: 2n, leftIndex: 2n, rightIndex: 0n },
    { center: { num: 2n, den: 5n }, depth: 3n, rightIndex: 1n },
  ]);

  // 29/11
  expect(
    enumerateAncients({
      frac: { num: 29n, den: 11n },
      first: undefined,
      last: undefined,
    }),
  ).toStrictEqual([
    { left: { num: 1n, den: 1n }, depth: 0n, rightIndex: 0n },
    { left: { num: 2n, den: 1n }, depth: 1n, rightIndex: 1n },
    { right: { num: 3n, den: 1n }, depth: 2n, leftIndex: 0n, rightIndex: 2n },
    { left: { num: 5n, den: 2n }, depth: 3n, leftIndex: 1n, rightIndex: 0n },
    { right: { num: 8n, den: 3n }, depth: 4n, leftIndex: 0n, rightIndex: 1n },
    { left: { num: 13n, den: 5n }, depth: 5n, leftIndex: 1n, rightIndex: 0n },
    { left: { num: 21n, den: 8n }, depth: 6n, rightIndex: 1n },
    { center: { num: 29n, den: 11n }, depth: 7n, rightIndex: 2n },
  ]);

  // 36524219/100000 = [365; 4, 7, 1, 3, 24, 6, 2, 2]
  expect(
    enumerateAncients({
      frac: { num: 36524219n, den: 100000n },
      first: 1n,
      last: 2n,
    }),
  ).toStrictEqual([
    { left: { num: 1n, den: 1n }, depth: 0n, rightIndex: 0n },
    { left: { num: 2n, den: 1n }, depth: 1n, rightIndex: 1n },
    lessEllipsis, // ... (skip 2 to 363)
    { left: { num: 365n, den: 1n }, depth: 364n, rightIndex: 364n },
    {
      right: { num: 366n, den: 1n },
      depth: 365n,
      leftIndex: 0n,
      rightIndex: 365n,
    },
    { right: { num: 731n, den: 2n }, depth: 366n, leftIndex: 1n },
    // ... (skip 2)
    greaterEllipsis,
    { right: { num: 1461n, den: 4n }, depth: 368n, leftIndex: 3n },
    {
      left: { num: 1826n, den: 5n },
      depth: 369n,
      leftIndex: 4n,
      rightIndex: 0n,
    },
    { left: { num: 3287n, den: 9n }, depth: 370n, rightIndex: 1n },
    // ... (skip 2 to 5)
    lessEllipsis,
    { left: { num: 10592n, den: 29n }, depth: 375n, rightIndex: 6n },
    {
      right: { num: 12053n, den: 33n },
      depth: 376n,
      leftIndex: 0n,
      rightIndex: 7n,
    },
    {
      left: { num: 22645n, den: 62n },
      depth: 377n,
      leftIndex: 1n,
      rightIndex: 0n,
    },
    { left: { num: 34698n, den: 95n }, depth: 378n, rightIndex: 1n },
    { left: { num: 46751n, den: 128n }, depth: 379n, rightIndex: 2n },
    {
      right: { num: 58804n, den: 161n },
      depth: 380n,
      leftIndex: 0n,
      rightIndex: 3n,
    },
    { right: { num: 105555n, den: 289n }, depth: 381n, leftIndex: 1n },
    // ... (skip 2 to 22)
    greaterEllipsis,
    { right: { num: 1134077n, den: 3105n }, depth: 403n, leftIndex: 23n },
    {
      left: { num: 1180828n, den: 3233n },
      depth: 404n,
      leftIndex: 24n,
      rightIndex: 0n,
    },
    { left: { num: 2314905n, den: 6338n }, depth: 405n, rightIndex: 1n },
    // ... (skip 2 to 4)
    lessEllipsis,
    { left: { num: 6851213n, den: 18758n }, depth: 409n, rightIndex: 5n },
    {
      right: { num: 7985290n, den: 21863n },
      depth: 410n,
      leftIndex: 0n,
      rightIndex: 6n,
    },
    { right: { num: 14836503n, den: 40621n }, depth: 411n, leftIndex: 1n },
    {
      left: { num: 21687716n, den: 59379n },
      depth: 412n,
      leftIndex: 2n,
      rightIndex: 0n,
    },
    { center: { num: 36524219n, den: 100000n }, depth: 413n, rightIndex: 1n },
  ]);

  // 0/1
  expect(
    enumerateAncients({ frac: { num: 0n, den: 1n }, first: 1n, last: 2n }),
  ).toStrictEqual<EnumeratedRow[]>([
    { left: { num: 1n, den: 1n }, depth: 0n, rightIndex: 0n },
    { center: { num: 0n, den: 1n }, depth: -1n, rightIndex: -1n },
  ]);

  // -1/1
  expect(
    enumerateAncients({ frac: { num: -1n, den: 1n }, first: 1n, last: 2n }),
  ).toStrictEqual<EnumeratedRow[]>([
    { left: { num: 1n, den: 1n }, depth: 0n, rightIndex: 0n },
    { left: { num: 0n, den: 1n }, depth: -1n, rightIndex: -1n },
    { center: { num: -1n, den: 1n }, depth: -2n, rightIndex: -2n },
  ]);

  // -2/1
  expect(
    enumerateAncients({ frac: { num: -2n, den: 1n }, first: 1n, last: 2n }),
  ).toStrictEqual<EnumeratedRow[]>([
    { left: { num: 1n, den: 1n }, depth: 0n, rightIndex: 0n },
    { left: { num: 0n, den: 1n }, depth: -1n, rightIndex: -1n },
    { left: { num: -1n, den: 1n }, depth: -2n, rightIndex: -2n },
    { center: { num: -2n, den: 1n }, depth: -3n, rightIndex: -3n },
  ]);

  // -10/1
  expect(
    enumerateAncients({ frac: { num: -10n, den: 1n }, first: 1n, last: 2n }),
  ).toStrictEqual<EnumeratedRow[]>([
    { left: { num: 1n, den: 1n }, depth: 0n, rightIndex: 0n },
    { left: { num: 0n, den: 1n }, depth: -1n, rightIndex: -1n },
    lessEllipsis,
    { left: { num: -9n, den: 1n }, depth: -10n, rightIndex: -10n },
    { center: { num: -10n, den: 1n }, depth: -11n, rightIndex: -11n },
  ]);

  // -9/4 = [-3; 1, 3]
  expect(
    enumerateAncients({ frac: { num: -9n, den: 4n }, first: 1n, last: 2n }),
  ).toStrictEqual<EnumeratedRow[]>([
    { left: { num: 1n, den: 1n }, depth: 0n, rightIndex: 0n },
    { left: { num: 0n, den: 1n }, depth: -1n, rightIndex: -1n },
    { left: { num: -1n, den: 1n }, depth: -2n, rightIndex: -2n },
    {
      left: { num: -3n, den: 1n },
      right: { num: -2n, den: 1n },
      depth: -3n,
      leftIndex: 0n,
      rightIndex: -3n,
    },
    { left: { num: -5n, den: 2n }, depth: -2n, leftIndex: 1n, rightIndex: 0n },
    { left: { num: -7n, den: 3n }, depth: -1n, rightIndex: 1n },
    { center: { num: -9n, den: 4n }, depth: 0n, rightIndex: 2n },
  ]);

  // -1/2 = [-1; 2]
  expect(
    enumerateAncients({ frac: { num: -1n, den: 2n }, first: 1n, last: 2n }),
  ).toStrictEqual<EnumeratedRow[]>([
    { left: { num: 1n, den: 1n }, depth: 0n, rightIndex: 0n },
    {
      left: { num: -1n, den: 1n },
      right: { num: 0n, den: 1n },
      depth: -1n,
      leftIndex: 0n,
      rightIndex: -1n,
    },
    { center: { num: -1n, den: 2n }, depth: 0n, leftIndex: 1n },
  ]);

  // -1/3 = [-1; 1, 2]
  expect(
    enumerateAncients({ frac: { num: -1n, den: 3n }, first: 1n, last: 2n }),
  ).toStrictEqual<EnumeratedRow[]>([
    { left: { num: 1n, den: 1n }, depth: 0n, rightIndex: 0n },
    {
      left: { num: -1n, den: 1n },
      right: { num: 0n, den: 1n },
      depth: -1n,
      leftIndex: 0n,
      rightIndex: -1n,
    },
    { left: { num: -1n, den: 2n }, depth: 0n, leftIndex: 1n, rightIndex: 0n },
    { center: { num: -1n, den: 3n }, depth: 1n, rightIndex: 1n },
  ]);
});
