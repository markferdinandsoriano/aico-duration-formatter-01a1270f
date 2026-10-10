import { describe, expect, it } from "vitest";
import * as mod from "./duration";
import { formatDuration } from "./duration";

describe("formatDuration", () => {
  it("formats worked examples", () => {
    expect(formatDuration(0)).toBe("0:00:00");
    expect(formatDuration(75)).toBe("0:01:15");
    expect(formatDuration(3725)).toBe("1:02:05");
    expect(formatDuration(360000)).toBe("100:00:00");
    expect(formatDuration(442861)).toBe("123:01:01");
    expect(formatDuration(1.9)).toBe("0:00:01");
  });

  it("handles unit boundaries", () => {
    expect(formatDuration(59)).toBe("0:00:59");
    expect(formatDuration(60)).toBe("0:01:00");
    expect(formatDuration(3599)).toBe("0:59:59");
    expect(formatDuration(3600)).toBe("1:00:00");
    expect(formatDuration(359999)).toBe("99:59:59");
  });

  it("truncates fractions so seconds never reach 60", () => {
    expect(formatDuration(59.999)).toBe("0:00:59");
    expect(formatDuration(60.5)).toBe("0:01:00");
    expect(formatDuration(0.999)).toBe("0:00:00");
  });

  it("accepts -0 as zero", () => {
    expect(formatDuration(-0)).toBe("0:00:00");
  });

  it("throws RangeError for negative values, naming the value", () => {
    expect(() => formatDuration(-1)).toThrow(RangeError);
    expect(() => formatDuration(-1)).toThrow(/-1/);
    expect(() => formatDuration(-0.5)).toThrow(RangeError);
    expect(() => formatDuration(-0.5)).toThrow(/-0\.5/);
  });

  it("throws RangeError for NaN and infinities", () => {
    expect(() => formatDuration(NaN)).toThrow(RangeError);
    expect(() => formatDuration(Infinity)).toThrow(RangeError);
    expect(() => formatDuration(-Infinity)).toThrow(RangeError);
  });

  it("throws TypeError for non-number inputs", () => {
    const bad: unknown[] = ["75", "", null, undefined, true, {}, [], BigInt(1)];
    for (const value of bad) {
      expect(() => formatDuration(value as number)).toThrow(TypeError);
    }
  });

  it("formats values above MAX_SAFE_INTEGER exactly from the double", () => {
    expect(formatDuration(Number.MAX_SAFE_INTEGER)).toBe("2501999792983:36:31");
    const big = formatDuration(2 ** 90);
    expect(big).toBe(`${(BigInt(2) ** BigInt(90)) / BigInt(3600)}:${pad(((BigInt(2) ** BigInt(90)) % BigInt(3600)) / BigInt(60))}:${pad((BigInt(2) ** BigInt(90)) % BigInt(60))}`);
    expect(big).not.toMatch(/[e+]/);
  });

  it("is deterministic and exports only formatDuration", () => {
    expect(formatDuration(12345)).toBe(formatDuration(12345));
    expect(Object.keys(mod)).toEqual(["formatDuration"]);
  });
});

function pad(value: bigint): string {
  return value.toString().padStart(2, "0");
}
