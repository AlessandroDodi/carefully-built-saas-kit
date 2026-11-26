'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

export interface UseOnlineStatusOptions {
  /**
   * A real check that the server can be reached, e.g. a request to a health
   * endpoint that resolves true on success. The browser's own flag only says
   * that there is a network, which is also true on a Wi-Fi without internet.
   * A rejection counts as offline.
   */
  readonly ping?: () => Promise<boolean>;
  /** How often to ping while the page is visible. Defaults to 30 seconds. */
  readonly pingIntervalMs?: number;
}

function subscribeToConnection(listener: () => void): () => void {
  window.addEventListener('online', listener);
  window.addEventListener('offline', listener);
  return () => {
    window.removeEventListener('online', listener);
    window.removeEventListener('offline', listener);
  };
}

function getBrowserOnline(): boolean {
  return navigator.onLine;
}

function getServerOnline(): boolean {
  return true;
}

/**
 * Whether the device is online: the browser's flag, combined with `ping` when
 * one is given. Assumes online during server rendering and until the first
 * ping answers.
 */
export function useOnlineStatus(options: UseOnlineStatusOptions = {}): boolean {
  const { ping, pingIntervalMs = 30_000 } = options;
  const browserOnline = useSyncExternalStore(subscribeToConnection, getBrowserOnline, getServerOnline);
  const [reachable, setReachable] = useState(true);

  const pingRef = useRef(ping);
  pingRef.current = ping;
  const hasPing = ping !== undefined;

  useEffect(() => {
    if (!hasPing || !browserOnline) return;

    let cancelled = false;
    let sequence = 0;
    const check = async (): Promise<void> => {
      const current = (sequence += 1);
      let result = false;
      try {
        result = (await pingRef.current?.()) !== false;
      } catch {
        result = false;
      }
      // Only the latest answer counts: a slow earlier ping must not overwrite it.
      if (!cancelled && current === sequence) setReachable(result);
    };

    const handleVisibility = (): void => {
      if (document.visibilityState === 'visible') void check();
    };

    void check();
    document.addEventListener('visibilitychange', handleVisibility);
    const timer =
      pingIntervalMs > 0
        ? setInterval(() => {
            if (document.visibilityState === 'visible') void check();
          }, pingIntervalMs)
        : null;

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', handleVisibility);
      if (timer !== null) clearInterval(timer);
    };
  }, [hasPing, browserOnline, pingIntervalMs]);

  return browserOnline && (!hasPing || reachable);
}
