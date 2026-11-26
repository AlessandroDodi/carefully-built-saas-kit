'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import type { RefObject } from 'react';

import {
  DEFAULT_READ_END_TOLERANCE,
  advanceReadProgress,
  computeReadProgress,
  initialReadProgressState,
} from './read-progress';

import type { ReadProgressState } from './read-progress';

export interface UseReadProgressOptions {
  /**
   * Set to false while the text is still loading: an empty container fits
   * without scrolling and would count as read. Defaults to true.
   */
  readonly enabled?: boolean;
  /** Pixels from the bottom that still count as the end. Defaults to 8. */
  readonly tolerance?: number;
  /** Start over when this changes, e.g. the id of the document version shown. */
  readonly resetKey?: string | number | null;
  /** Called whenever progress grows or the end is reached. */
  readonly onProgress?: (state: ReadProgressState) => void;
  /** Called once, the first time the end is reached. */
  readonly onReachEnd?: (state: ReadProgressState) => void;
}

export interface UseReadProgressResult<TElement extends HTMLElement = HTMLElement>
  extends ReadProgressState {
  /** The ref passed to the hook, so the whole result can be handed to `DocumentReader`. */
  readonly scrollRef: RefObject<TElement | null>;
  /**
   * Optional: attach to an element placed after the text inside the scroll
   * container. It adds a second way of noticing the end that does not depend
   * on scroll arithmetic. `DocumentReader` attaches it for you.
   */
  readonly sentinelRef: (node: HTMLElement | null) => void;
  /** Reading time right now; `readingMs` is only as fresh as the last update. */
  readonly getReadingMs: () => number;
  /** Forget everything and start tracking again. */
  readonly reset: () => void;
}

/**
 * Tracks how much of a scrollable text has been read.
 *
 * The end is noticed from the scroll position (with a tolerance), from an
 * optional sentinel element coming into view, and again whenever the content
 * or the container changes size. Reading time only runs while the page is
 * visible.
 */
export function useReadProgress<TElement extends HTMLElement = HTMLElement>(
  scrollRef: RefObject<TElement | null>,
  options: UseReadProgressOptions = {},
): UseReadProgressResult<TElement> {
  const { enabled = true, tolerance = DEFAULT_READ_END_TOLERANCE, resetKey = null } = options;

  const [state, setState] = useState<ReadProgressState>(initialReadProgressState);
  const stateRef = useRef(state);
  const callbacks = useRef(options);
  callbacks.current = options;

  const clock = useRef<{ accumulated: number; visibleSince: number | null }>({
    accumulated: 0,
    visibleSince: null,
  });
  const [sentinel, setSentinel] = useState<HTMLElement | null>(null);
  const [resetCount, setResetCount] = useState(0);

  const getReadingMs = useCallback((): number => {
    const { accumulated, visibleSince } = clock.current;
    return accumulated + (visibleSince === null ? 0 : Date.now() - visibleSince);
  }, []);

  const reset = useCallback((): void => {
    setResetCount((count) => count + 1);
  }, []);

  // Declared before the tracking effect so a reset lands before tracking restarts.
  const generation = `${String(resetKey)}:${String(resetCount)}`;
  const lastGeneration = useRef(generation);
  useEffect(() => {
    if (lastGeneration.current === generation) return;
    lastGeneration.current = generation;
    clock.current = { accumulated: 0, visibleSince: null };
    stateRef.current = initialReadProgressState;
    setState(initialReadProgressState);
  }, [generation]);

  useEffect(() => {
    const element = scrollRef.current;
    if (!enabled || !element) return;

    const commit = (next: ReadProgressState): void => {
      stateRef.current = next;
      setState(next);
    };

    const observe = (observed: { progress: number; atEnd: boolean } | null): void => {
      if (!observed) return;
      const previous = stateRef.current;
      const next = advanceReadProgress(previous, observed, Date.now(), getReadingMs());
      if (next === previous) return;

      commit(next);
      callbacks.current.onProgress?.(next);
      if (next.reachedEnd && !previous.reachedEnd) callbacks.current.onReachEnd?.(next);
    };

    const measure = (): void => {
      observe(
        computeReadProgress({
          scrollTop: element.scrollTop,
          scrollHeight: element.scrollHeight,
          clientHeight: element.clientHeight,
          tolerance,
        }),
      );
    };

    if (stateRef.current.startedAt === null) {
      commit({ ...stateRef.current, startedAt: Date.now() });
    }
    clock.current.visibleSince = document.visibilityState === 'visible' ? Date.now() : null;

    const handleVisibility = (): void => {
      const current = clock.current;
      if (document.visibilityState === 'visible') {
        current.visibleSince ??= Date.now();
        // The layout may have changed while the page was in the background.
        measure();
      } else if (current.visibleSince !== null) {
        current.accumulated += Date.now() - current.visibleSince;
        current.visibleSince = null;
      }
      commit({ ...stateRef.current, readingMs: getReadingMs() });
    };

    element.addEventListener('scroll', measure, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);

    // The container changes size on rotation; its children when the text loads,
    // fonts swap or an image arrives.
    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    const observeSizes = (): void => {
      if (!resizeObserver) return;
      resizeObserver.disconnect();
      resizeObserver.observe(element);
      for (const child of Array.from(element.children)) resizeObserver.observe(child);
    };
    observeSizes();

    const mutationObserver =
      typeof MutationObserver === 'undefined'
        ? null
        : new MutationObserver(() => {
            observeSizes();
            measure();
          });
    mutationObserver?.observe(element, { childList: true });

    const intersectionObserver =
      sentinel && typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              // A hidden container reports no height and nothing intersecting.
              if (element.clientHeight > 0 && entries.some((entry) => entry.isIntersecting)) {
                observe({ progress: 1, atEnd: true });
              }
            },
            { root: element, rootMargin: `0px 0px ${String(tolerance)}px 0px` },
          )
        : null;
    if (sentinel) intersectionObserver?.observe(sentinel);

    measure();

    return () => {
      element.removeEventListener('scroll', measure);
      document.removeEventListener('visibilitychange', handleVisibility);
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
      intersectionObserver?.disconnect();

      const current = clock.current;
      if (current.visibleSince !== null) {
        current.accumulated += Date.now() - current.visibleSince;
        current.visibleSince = null;
      }
    };
  }, [enabled, tolerance, generation, sentinel, scrollRef, getReadingMs]);

  return { ...state, scrollRef, sentinelRef: setSentinel, getReadingMs, reset };
}
