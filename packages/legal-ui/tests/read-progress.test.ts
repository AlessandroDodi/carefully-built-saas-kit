import { describe, expect, test } from 'bun:test';

import {
  advanceReadProgress,
  computeReadProgress,
  initialReadProgressState,
} from '../src/read-progress';

describe('computeReadProgress', () => {
  test('starts at zero at the top of a long text', () => {
    expect(computeReadProgress({ scrollTop: 0, scrollHeight: 2000, clientHeight: 500 })).toEqual({
      progress: 0,
      atEnd: false,
    });
  });

  test('is proportional to the scrolled distance', () => {
    expect(computeReadProgress({ scrollTop: 750, scrollHeight: 2000, clientHeight: 500 })).toEqual({
      progress: 0.5,
      atEnd: false,
    });
  });

  test('reaches the end exactly at the bottom', () => {
    expect(computeReadProgress({ scrollTop: 1500, scrollHeight: 2000, clientHeight: 500 })).toEqual({
      progress: 1,
      atEnd: true,
    });
  });

  test('fractional pixels short of the bottom still count as the end', () => {
    expect(
      computeReadProgress({ scrollTop: 1498.6, scrollHeight: 2000, clientHeight: 500 }),
    ).toEqual({ progress: 1, atEnd: true });
  });

  test('just outside the tolerance is not the end', () => {
    const result = computeReadProgress({ scrollTop: 1480, scrollHeight: 2000, clientHeight: 500 });
    expect(result?.atEnd).toBe(false);
    expect(result?.progress).toBeLessThan(1);
  });

  test('the tolerance is configurable', () => {
    expect(
      computeReadProgress({ scrollTop: 1480, scrollHeight: 2000, clientHeight: 500, tolerance: 24 }),
    ).toEqual({ progress: 1, atEnd: true });
  });

  test('text shorter than the viewport is read at once', () => {
    expect(computeReadProgress({ scrollTop: 0, scrollHeight: 300, clientHeight: 500 })).toEqual({
      progress: 1,
      atEnd: true,
    });
    expect(computeReadProgress({ scrollTop: 0, scrollHeight: 504, clientHeight: 500 })).toEqual({
      progress: 1,
      atEnd: true,
    });
  });

  test('a container without height says nothing', () => {
    expect(computeReadProgress({ scrollTop: 0, scrollHeight: 0, clientHeight: 0 })).toBeNull();
  });

  test('overscroll is clamped', () => {
    expect(computeReadProgress({ scrollTop: -40, scrollHeight: 2000, clientHeight: 500 })?.progress).toBe(0);
    expect(computeReadProgress({ scrollTop: 1600, scrollHeight: 2000, clientHeight: 500 })).toEqual({
      progress: 1,
      atEnd: true,
    });
  });
});

describe('advanceReadProgress', () => {
  const started = { ...initialReadProgressState, startedAt: 1000 };

  test('progress grows', () => {
    const next = advanceReadProgress(started, { progress: 0.4, atEnd: false }, 2000, 900);
    expect(next).toEqual({ ...started, progress: 0.4, readingMs: 900 });
  });

  test('progress never decreases when scrolling back up', () => {
    const forward = advanceReadProgress(started, { progress: 0.7, atEnd: false }, 2000, 900);
    const back = advanceReadProgress(forward, { progress: 0.2, atEnd: false }, 3000, 1900);
    expect(back).toBe(forward);
    expect(back.progress).toBe(0.7);
  });

  test('reaching the end sets progress to 1 and records the time once', () => {
    const end = advanceReadProgress(started, { progress: 1, atEnd: true }, 5000, 3500);
    expect(end.progress).toBe(1);
    expect(end.reachedEnd).toBe(true);
    expect(end.reachedEndAt).toBe(5000);
    expect(end.readingMs).toBe(3500);

    const later = advanceReadProgress(end, { progress: 0.1, atEnd: false }, 9000, 7000);
    expect(later).toBe(end);
    const again = advanceReadProgress(end, { progress: 1, atEnd: true }, 9500, 7500);
    expect(again.reachedEndAt).toBe(5000);
  });

  test('out-of-range observations are clamped', () => {
    expect(advanceReadProgress(started, { progress: 4, atEnd: false }, 2000, 0).progress).toBe(1);
    expect(advanceReadProgress(started, { progress: -1, atEnd: false }, 2000, 0)).toBe(started);
  });
});
