import { expect, test } from "vitest";
import { parseFraction, parseNumber } from "./parse";

test("parseNumber: parse {integer}.?", () => {
  ["", ".", "0", "000", "0000000000", "+1", "-1"].forEach((s) => {
    expect(parseNumber(s)).toBe(null);
    expect(parseNumber(s + ".")).toBe(null);
  });

  [
    { s: "1", mantissa: 1n, exponent: 0n },
    { s: "2", mantissa: 2n, exponent: 0n },
    { s: "3", mantissa: 3n, exponent: 0n },
    { s: "12345", mantissa: 12345n, exponent: 0n },
    { s: "67890", mantissa: 6789n, exponent: 1n },
    { s: "01", mantissa: 1n, exponent: 0n },
    { s: "002", mantissa: 2n, exponent: 0n },
    { s: "0003", mantissa: 3n, exponent: 0n },
    { s: "12000", mantissa: 12n, exponent: 3n },
    { s: "230000", mantissa: 23n, exponent: 4n },
    { s: "00034500000", mantissa: 345n, exponent: 5n },
  ].forEach(({ s, mantissa, exponent }) => {
    expect(parseNumber(s)).toStrictEqual({ mantissa, exponent });
    expect(parseNumber(s + ".")).toStrictEqual({ mantissa, exponent });
  });
});

test("parseNumber: parse .{latter}", () => {
  [".0", ".000", ".0000000000"].forEach((s) => {
    expect(parseNumber(s)).toBe(null);
  });

  [
    { s: ".1", mantissa: 1n, exponent: -1n },
    { s: ".2", mantissa: 2n, exponent: -1n },
    { s: ".3", mantissa: 3n, exponent: -1n },
    { s: ".12345", mantissa: 12345n, exponent: -5n },
    { s: ".67890", mantissa: 6789n, exponent: -4n },
    { s: ".01", mantissa: 1n, exponent: -2n },
    { s: ".002", mantissa: 2n, exponent: -3n },
    { s: ".0003", mantissa: 3n, exponent: -4n },
    { s: ".12000", mantissa: 12n, exponent: -2n },
    { s: ".230000", mantissa: 23n, exponent: -2n },
    { s: ".00034500000", mantissa: 345n, exponent: -6n },
  ].forEach(({ s, mantissa, exponent }) => {
    expect(parseNumber(s)).toStrictEqual({ mantissa, exponent });
  });
});

test("parseNumber: parse {former}.{latter}", () => {
  ["0.0", "00.000", "0.0000000000", "00000000000.000"].forEach((s) => {
    expect(parseNumber(s)).toBe(null);
  });

  [
    { s: "0.1", mantissa: 1n, exponent: -1n },
    { s: "1.2", mantissa: 12n, exponent: -1n },
    { s: "0010.3", mantissa: 103n, exponent: -1n },
    { s: "12.345", mantissa: 12345n, exponent: -3n },
    { s: "678.90", mantissa: 6789n, exponent: -1n },
    { s: " 001010. 01 ", mantissa: 101001n, exponent: -2n },
    { s: "0001230.00034500000", mantissa: 1230000345n, exponent: -6n },
  ].forEach(({ s, mantissa, exponent }) => {
    expect(parseNumber(s)).toStrictEqual({ mantissa, exponent });
  });
});

test("parseNumber: parse exponent", () => {
  ["1e", "1e+", "1e-", "1E", "1+", "1-", "1+e", "e1"].forEach((s) => {
    expect(parseNumber(s)).toBe(null);
  });

  [
    { s: "1e0", mantissa: 1n, exponent: 0n },
    { s: "1e+0", mantissa: 1n, exponent: 0n },
    { s: "1e-0", mantissa: 1n, exponent: 0n },
    { s: "1e4", mantissa: 1n, exponent: 4n },
    { s: "1e+4", mantissa: 1n, exponent: 4n },
    { s: "1e-4", mantissa: 1n, exponent: -4n },
    { s: "1E4", mantissa: 1n, exponent: 4n },
    { s: "1E+4", mantissa: 1n, exponent: 4n },
    { s: "1E-4", mantissa: 1n, exponent: -4n },
    { s: "1.2e3", mantissa: 12n, exponent: 2n },
    { s: "0010.3e-10", mantissa: 103n, exponent: -11n },
    { s: "12.345e3", mantissa: 12345n, exponent: 0n },
    { s: "678.900e0", mantissa: 6789n, exponent: -1n },
    { s: "001010.01e003", mantissa: 101001n, exponent: 1n },
    { s: "0001230.00034500000e0000012", mantissa: 1230000345n, exponent: 6n },
  ].forEach(({ s, mantissa, exponent }) => {
    expect(parseNumber(s)).toStrictEqual({ mantissa, exponent });
  });
});

test("parseFraction: reject", () => {
  [
    "0.0",
    "00.000",
    "0.0000000000",
    "00000000000.000",
    "0/1",
    "1/0",
    "",
    "./1",
  ].forEach((s) => {
    expect(parseFraction(s)).toBe(null);
  });
});

test("parseNumber: {numerator}", () => {
  [
    { s: "1", num: 1n, den: 1n },
    { s: "2", num: 2n, den: 1n },
    { s: "2.5", num: 25n, den: 10n },
    { s: "1e+0", num: 1n, den: 1n },
    { s: "1e-0", num: 1n, den: 1n },
    { s: "1e4", num: 10000n, den: 1n },
    { s: "1e+4", num: 10000n, den: 1n },
    { s: "1e-4", num: 1n, den: 10000n },
    { s: "1E4", num: 10000n, den: 1n },
    { s: "1E+4", num: 10000n, den: 1n },
    { s: "1E-4", num: 1n, den: 10000n },
    { s: "1.2e3", num: 1200n, den: 1n },
    { s: "0010.3e-10", num: 103n, den: 100000000000n },
    { s: "12.345e3", num: 12345n, den: 1n },
    { s: "678.900e0", num: 6789n, den: 10n },
    { s: "001010.01000", num: 101001n, den: 100n },
    { s: "0001230.0003450000", num: 1230000345n, den: 1000000n },
  ].forEach(({ s, num, den }) => {
    expect(parseFraction(s)).toStrictEqual({ num, den });
  });
});
