/**
 * Formats a duration given in seconds as `h:mm:ss`.
 *
 * Input contract:
 * - `seconds` must be of type number. Any other type throws TypeError. Numeric strings are not coerced.
 * - NaN, Infinity and -Infinity throw RangeError.
 * - Negative values, including -0.5, throw RangeError with the value in the message.
 * - -0 is accepted and returns "0:00:00".
 * - Fractions are truncated (Math.floor) to whole seconds: 1.9 -> "0:00:01", 59.999 -> "0:00:59".
 * - Hours are unpadded and unbounded, with no exponent notation. Minutes and seconds are two digits (00-59).
 * - Values above Number.MAX_SAFE_INTEGER are accepted. The output is the exact decimal value of the
 *   double passed in, floored.
 */
export function formatDuration(seconds: number): string {
  if (typeof seconds !== "number") {
    throw new TypeError(`formatDuration: seconds must be a number, received ${typeof seconds}`);
  }
  if (!Number.isFinite(seconds)) {
    throw new RangeError(`formatDuration: seconds must be finite, received ${String(seconds)}`);
  }
  if (seconds < 0) {
    throw new RangeError(`formatDuration: seconds must be non-negative, received ${String(seconds)}`);
  }

  const whole = BigInt(Math.floor(seconds));
  const hours = whole / BigInt(3600);
  const minutes = (whole % BigInt(3600)) / BigInt(60);
  const secs = whole % BigInt(60);

  return `${hours.toString()}:${pad2(minutes)}:${pad2(secs)}`;
}

function pad2(value: bigint): string {
  return value.toString().padStart(2, "0");
}
