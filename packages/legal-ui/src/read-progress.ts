/** Where a reader is in a document. Plain data, safe to store or send. */
export interface ReadProgressState {
  /** 0 to 1. Never decreases: scrolling back up does not lower it. */
  readonly progress: number;
  readonly reachedEnd: boolean;
  /** Epoch milliseconds when tracking began, or null before it did. */
  readonly startedAt: number | null;
  /** Epoch milliseconds when the end was first reached. */
  readonly reachedEndAt: number | null;
  /** Milliseconds the page was visible while tracking, as of the last update. */
  readonly readingMs: number;
}

export interface ReadProgressMeasurement {
  readonly scrollTop: number;
  readonly scrollHeight: number;
  readonly clientHeight: number;
  /** Pixels from the bottom that still count as the end. Defaults to 8. */
  readonly tolerance?: number;
}

export const DEFAULT_READ_END_TOLERANCE = 8;

export const initialReadProgressState: ReadProgressState = {
  progress: 0,
  reachedEnd: false,
  startedAt: null,
  reachedEndAt: null,
  readingMs: 0,
};

/**
 * How far a scroll container has been scrolled. Returns null while the
 * container has no height (hidden or not laid out yet), because nothing can be
 * said about it. Content that fits without scrolling is at the end right away.
 * The tolerance absorbs fractional pixels from zoom and high-density screens.
 */
export function computeReadProgress(
  measurement: ReadProgressMeasurement,
): { progress: number; atEnd: boolean } | null {
  const { scrollTop, scrollHeight, clientHeight } = measurement;
  const tolerance = measurement.tolerance ?? DEFAULT_READ_END_TOLERANCE;
  if (!(clientHeight > 0)) return null;

  const scrollable = scrollHeight - clientHeight;
  if (scrollable <= tolerance) return { progress: 1, atEnd: true };

  if (scrollable - scrollTop <= tolerance) return { progress: 1, atEnd: true };

  return { progress: Math.min(1, Math.max(0, scrollTop / scrollable)), atEnd: false };
}

/**
 * The state after a new observation: progress only grows, and the end, once
 * reached, stays reached with its original time. Returns the same object when
 * nothing changed.
 */
export function advanceReadProgress(
  state: ReadProgressState,
  observed: { progress: number; atEnd: boolean },
  now: number,
  readingMs: number,
): ReadProgressState {
  const reachedEnd = state.reachedEnd || observed.atEnd;
  const progress = reachedEnd ? 1 : Math.max(state.progress, Math.min(1, Math.max(0, observed.progress)));
  if (progress === state.progress && reachedEnd === state.reachedEnd) return state;

  return {
    ...state,
    progress,
    reachedEnd,
    reachedEndAt: reachedEnd && !state.reachedEnd ? now : state.reachedEndAt,
    readingMs,
  };
}
