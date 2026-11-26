export interface BackoffOptions {
  /** Delay after the first failure. Doubles with each further one. */
  readonly baseMs: number;
  /** The delay never grows past this. */
  readonly maxMs: number;
}

export const DEFAULT_BACKOFF: BackoffOptions = { baseMs: 2_000, maxMs: 5 * 60_000 };

/**
 * How long to wait before the next try after `failures` failures in a row:
 * exponential, capped at `maxMs`, with jitter so that many devices coming back
 * online together do not all retry in the same instant. The result is between
 * half the exponential delay and the whole of it.
 */
export function computeBackoffDelay(
  failures: number,
  options: BackoffOptions = DEFAULT_BACKOFF,
  random: () => number = Math.random,
): number {
  const exponent = Math.max(0, Math.floor(failures) - 1);
  // 2 ** 1024 overflows; no retry policy needs more doublings than this.
  const ceiling = Math.min(options.maxMs, options.baseMs * 2 ** Math.min(exponent, 50));
  return Math.round(ceiling / 2 + (ceiling / 2) * Math.min(1, Math.max(0, random())));
}
