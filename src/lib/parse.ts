import { regex } from "arkregex";

/** `mantissa * 10**exponent` を表す */
interface IntegerTimesPower {
  mantissa: bigint;
  exponent: bigint;
}

export const parseNumber = (s: string): IntegerTimesPower | null => {
  const mantissaPattern =
    "(?<former>[0-9]*)\\.(?<latter>[0-9]+)|(?<integer>[0-9]+)\\.?";
  const exponentPattern = "[eE](?<exponent>[+-]?[0-9]+)";
  const pattern = regex(`^(${mantissaPattern})(${exponentPattern})?$`);

  const result = pattern.exec(s);
  if (!result) {
    return null;
  }

  const mantissaPart = (() => {
    if (result.groups.latter) {
      // {former}.{latter}
      const latter = result.groups.latter;
      const width = BigInt(latter.length);
      return {
        mantissa: BigInt(result.groups.former + latter),
        exponent: -width,
      };
    } else {
      // {integer}.?
      const integer = BigInt(result.groups.integer);
      return { mantissa: integer, exponent: 0n };
    }
  })();

  if (mantissaPart.mantissa <= 0n) {
    return null;
  }
  // normalize
  while (mantissaPart.mantissa % 10n == 0n) {
    mantissaPart.mantissa /= 10n;
    mantissaPart.exponent++;
  }

  const exponent = BigInt(result.groups.exponent ?? "");
  return {
    mantissa: mantissaPart.mantissa,
    exponent: mantissaPart.exponent + exponent,
  };
};

export interface Fraction {
  numerator: bigint;
  denominator: bigint;
}

export const parseFraction = (s: string): Fraction | null => {
  const pattern = regex("^(?<num>[0-9.eE+-]+)(/(?<den>[0-9.eE+-]+))?$");
  const result = pattern.exec(s);
  if (!result) {
    return null;
  }
  const num = parseNumber(result.groups.num);
  const den = parseNumber(result.groups.den ?? "1");
  if (!num || !den) {
    return null;
  }
  const exponent = num.exponent - den.exponent;
  if (exponent >= 0n) {
    return {
      numerator: num.mantissa * 10n ** exponent,
      denominator: den.mantissa,
    };
  } else {
    return {
      numerator: num.mantissa,
      denominator: den.mantissa * 10n ** -exponent,
    };
  }
};
