'use client';

import { useEffect, useSyncExternalStore } from 'react';

import { EMPTY_OFFLINE_QUEUE_SNAPSHOT } from '../offline-queue';

import type { OfflineQueue, OfflineQueueSnapshot } from '../offline-queue';

export interface UseOfflineQueueOptions {
  /**
   * Start the queue when the component mounts, so it flushes on its own.
   * Defaults to true. The queue is not stopped on unmount: it is meant to
   * live as long as the app, and `start()` is safe to call more than once.
   */
  readonly autoStart?: boolean;
}

function getServerSnapshot(): OfflineQueueSnapshot {
  return EMPTY_OFFLINE_QUEUE_SNAPSHOT;
}

/** The queue's live snapshot: counts, item metadata, last sync and last error. */
export function useOfflineQueue<TPayload>(
  queue: OfflineQueue<TPayload>,
  options: UseOfflineQueueOptions = {},
): OfflineQueueSnapshot {
  const { autoStart = true } = options;
  const snapshot = useSyncExternalStore(queue.subscribe, queue.getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (autoStart) queue.start();
  }, [queue, autoStart]);

  return snapshot;
}
