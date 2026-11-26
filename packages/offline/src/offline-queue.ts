import { DEFAULT_BACKOFF, computeBackoffDelay } from './backoff';
import { createEncryptedStore } from './encrypted-store';

import type { OfflineStore } from './types';

export type OfflineQueueItemStatus = 'pending' | 'sending' | 'failed';

/** What is known about a queued item without its payload. */
export interface OfflineQueueItemMeta {
  readonly id: string;
  readonly status: OfflineQueueItemStatus;
  /** Epoch milliseconds of the first enqueue with this id. */
  readonly createdAt: number;
  /** Sends tried so far. */
  readonly attempts: number;
  readonly lastAttemptAt: number | null;
  readonly lastError: string | null;
}

export interface OfflineQueueSnapshot {
  /** False until the items saved by a previous session have been loaded. */
  readonly ready: boolean;
  /** Items waiting to be sent, not counting the one being sent. */
  readonly pending: number;
  /** Items being sent right now: 0 or 1. */
  readonly sending: number;
  /** Items that hit a permanent error. They stay stored until retried or removed. */
  readonly failed: number;
  /** Oldest first. Metadata only: payloads never leave the queue through a snapshot. */
  readonly items: readonly OfflineQueueItemMeta[];
  /** Epoch milliseconds of the last successful send. */
  readonly lastSyncAt: number | null;
  /** Message of the most recent error; cleared by the next successful send. */
  readonly lastError: string | null;
  /** When the next automatic retry is due, while backing off. */
  readonly nextRetryAt: number | null;
}

export interface OfflineQueueSendContext {
  /** The item id: send it along as an idempotency key. */
  readonly id: string;
  /** 1 for the first try. */
  readonly attempt: number;
  readonly createdAt: number;
  /** Aborted when the send times out. */
  readonly signal: AbortSignal;
}

export interface OfflineQueueRetryOptions {
  /** Delay after the first failure. Defaults to 2 seconds. */
  readonly baseMs?: number;
  /** Longest delay between retries. Defaults to 5 minutes. */
  readonly maxMs?: number;
  /** After this many tries an item moves to `failed`. Defaults to no limit. */
  readonly maxAttempts?: number;
}

export interface OfflineQueueOptions<TPayload> {
  /** Identifies the queue: names the default database and the cross-tab lock. */
  readonly name: string;
  /**
   * Delivers one item. Resolve when the server has it; reject otherwise. An
   * item is removed from the queue only after this resolves, so a send can be
   * repeated (a reload mid-request, a lost response): make it idempotent with
   * `context.id`.
   */
  readonly send: (payload: TPayload, context: OfflineQueueSendContext) => Promise<unknown>;
  /** Where items are kept. Defaults to an encrypted IndexedDB store named after the queue. */
  readonly store?: OfflineStore;
  readonly retry?: OfflineQueueRetryOptions;
  /**
   * True for errors that retrying cannot fix (a rejected payload, a 4xx). The
   * item moves to `failed` and the queue goes on with the next one. Any other
   * error is taken as "not now": the queue stops and retries later.
   */
  readonly isPermanentError?: (error: unknown) => boolean;
  /** How often a started queue tries to flush. Defaults to 30 seconds. */
  readonly intervalMs?: number;
  /** A send that takes longer counts as a failure. Defaults to 60 seconds; 0 disables it. */
  readonly sendTimeoutMs?: number;
}

export interface OfflineQueue<TPayload> {
  readonly name: string;
  /**
   * Saves an item and resolves once it is on disk. Enqueuing an id that is
   * already queued replaces its payload and keeps its place and `createdAt`;
   * a failed item goes back to pending.
   */
  enqueue: (payload: TPayload, options?: { id?: string }) => Promise<OfflineQueueItemMeta>;
  /** Sends what can be sent now, ignoring any backoff. Calls made while one runs share it. */
  flush: () => Promise<OfflineQueueSnapshot>;
  /** Moves failed items (one, or all) back to pending. */
  retryFailed: (id?: string) => Promise<void>;
  /** Drops an item without sending it. */
  remove: (id: string) => Promise<void>;
  subscribe: (listener: () => void) => () => void;
  /** The same object until something changes, as `useSyncExternalStore` needs. */
  getSnapshot: () => OfflineQueueSnapshot;
  /** Flush now, when the device comes back online, when the page is shown again, and on an interval. */
  start: () => void;
  stop: () => void;
}

export const EMPTY_OFFLINE_QUEUE_SNAPSHOT: OfflineQueueSnapshot = Object.freeze({
  ready: false,
  pending: 0,
  sending: 0,
  failed: 0,
  items: Object.freeze([]),
  lastSyncAt: null,
  lastError: null,
  nextRetryAt: null,
});

/** How an item is written to the store. */
interface QueueRecord<TPayload> {
  readonly payload: TPayload;
  readonly createdAt: number;
  readonly order: number;
  readonly attempts: number;
  readonly status: 'pending' | 'failed';
  readonly lastAttemptAt: number | null;
  readonly lastError: string | null;
}

interface QueueItem<TPayload> extends QueueRecord<TPayload> {
  readonly id: string;
  /** Grows when the payload is replaced, so a send in flight knows it is stale. */
  readonly revision: number;
  readonly sending: boolean;
}

interface QueueMetaRecord {
  readonly lastSyncAt: number | null;
}

const META_ID = '__queue_meta__';
const DEFAULT_INTERVAL_MS = 30_000;
const DEFAULT_SEND_TIMEOUT_MS = 60_000;

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message || error.name;
  return typeof error === 'string' ? error : 'Unknown error';
}

function createId(): string {
  const crypto = globalThis.crypto as Crypto | undefined;
  if (typeof crypto?.randomUUID === 'function') return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function isQueueRecord(value: unknown): value is QueueRecord<unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'payload' in value &&
    typeof (value as { createdAt?: unknown }).createdAt === 'number'
  );
}

function toMeta(item: QueueItem<unknown>): OfflineQueueItemMeta {
  return {
    id: item.id,
    status: item.sending ? 'sending' : item.status,
    createdAt: item.createdAt,
    attempts: item.attempts,
    lastAttemptAt: item.lastAttemptAt,
    lastError: item.lastError,
  };
}

function toRecord<TPayload>(item: QueueItem<TPayload>): QueueRecord<TPayload> {
  return {
    payload: item.payload,
    createdAt: item.createdAt,
    order: item.order,
    attempts: item.attempts,
    status: item.status,
    lastAttemptAt: item.lastAttemptAt,
    lastError: item.lastError,
  };
}

function compareItems(left: QueueItem<unknown>, right: QueueItem<unknown>): number {
  return (
    left.createdAt - right.createdAt ||
    left.order - right.order ||
    (left.id < right.id ? -1 : left.id > right.id ? 1 : 0)
  );
}

/**
 * A queue of things to send that survives reloads and bad connections.
 *
 * Items are written to the store before `enqueue` resolves and deleted only
 * after `send` resolves. Sending is first in, first out and one at a time. A
 * failure stops the run and schedules a retry with exponential backoff; a
 * permanent error parks that item as `failed` and the rest go on.
 */
export function createOfflineQueue<TPayload>(
  options: OfflineQueueOptions<TPayload>,
): OfflineQueue<TPayload> {
  const { name, send, isPermanentError } = options;
  const backoff = {
    baseMs: options.retry?.baseMs ?? DEFAULT_BACKOFF.baseMs,
    maxMs: options.retry?.maxMs ?? DEFAULT_BACKOFF.maxMs,
  };
  const maxAttempts = options.retry?.maxAttempts ?? Number.POSITIVE_INFINITY;
  const intervalMs = options.intervalMs ?? DEFAULT_INTERVAL_MS;
  const sendTimeoutMs = options.sendTimeoutMs ?? DEFAULT_SEND_TIMEOUT_MS;

  let storeInstance = options.store;
  /** Created on first use, so building a queue during server rendering touches nothing. */
  function getStore(): OfflineStore {
    storeInstance ??= createEncryptedStore({
      dbName: `carefully-built-offline-queue:${name}`,
      storeName: 'items',
    });
    return storeInstance;
  }

  const items = new Map<string, QueueItem<TPayload>>();
  const listeners = new Set<() => void>();
  let snapshot = EMPTY_OFFLINE_QUEUE_SNAPSHOT;
  let ready = false;
  let lastSyncAt: number | null = null;
  let lastError: string | null = null;
  let nextRetryAt: number | null = null;
  let consecutiveFailures = 0;
  let orderCounter = 0;

  let loadPromise: Promise<void> | null = null;
  let flushPromise: Promise<OfflineQueueSnapshot> | null = null;
  let flushAgain = false;
  let flushAgainForced = false;
  let storeChain: Promise<unknown> = Promise.resolve();

  let started = false;
  let intervalTimer: ReturnType<typeof setInterval> | null = null;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;

  function emit(): void {
    const ordered = [...items.values()].sort(compareItems);
    let pending = 0;
    let sending = 0;
    let failed = 0;
    for (const item of ordered) {
      if (item.sending) sending += 1;
      else if (item.status === 'failed') failed += 1;
      else pending += 1;
    }

    snapshot = {
      ready,
      pending,
      sending,
      failed,
      items: ordered.map(toMeta),
      lastSyncAt,
      lastError,
      nextRetryAt,
    };
    for (const listener of [...listeners]) listener();
  }

  /** Store reads and writes run one after another, so they never see each other half done. */
  function exclusive<TResult>(task: () => Promise<TResult>): Promise<TResult> {
    const result = storeChain.then(task, task);
    storeChain = result.catch(() => undefined);
    return result;
  }

  /**
   * Makes memory match the store, which is the truth shared with other tabs:
   * items another tab sent disappear, items it added appear.
   */
  async function refreshFromStore(): Promise<void> {
    const entries = await getStore().getAll();
    const seen = new Set<string>();

    for (const entry of entries) {
      if (entry.id === META_ID) {
        const saved = (entry.value as QueueMetaRecord | undefined)?.lastSyncAt ?? null;
        if (saved !== null && (lastSyncAt === null || saved > lastSyncAt)) lastSyncAt = saved;
        continue;
      }
      if (!isQueueRecord(entry.value)) continue;

      const record = entry.value as QueueRecord<TPayload>;
      const current = items.get(entry.id);
      seen.add(entry.id);
      orderCounter = Math.max(orderCounter, record.order);
      // An item being sent from this tab keeps its in-memory state.
      if (current?.sending) continue;
      items.set(entry.id, {
        ...record,
        id: entry.id,
        revision: current?.revision ?? 0,
        sending: false,
      });
    }

    for (const [id, item] of items) {
      if (!seen.has(id) && !item.sending) items.delete(id);
    }
  }

  function load(): Promise<void> {
    loadPromise ??= exclusive(refreshFromStore).then(
      () => {
        ready = true;
        emit();
      },
      (error: unknown) => {
        // Try again on the next call instead of staying broken.
        loadPromise = null;
        lastError = errorMessage(error);
        emit();
        throw error;
      },
    );
    return loadPromise;
  }

  function scheduleRetry(): void {
    if (retryTimer !== null) clearTimeout(retryTimer);
    retryTimer = null;
    if (!started || nextRetryAt === null) return;

    retryTimer = setTimeout(
      () => {
        retryTimer = null;
        void runFlush(false);
      },
      Math.max(0, nextRetryAt - Date.now()),
    );
  }

  function nextPending(): QueueItem<TPayload> | undefined {
    let next: QueueItem<TPayload> | undefined;
    for (const item of items.values()) {
      if (item.status !== 'pending' || item.sending) continue;
      if (!next || compareItems(item, next) < 0) next = item;
    }
    return next;
  }

  async function deliver(item: QueueItem<TPayload>, attempt: number): Promise<void> {
    const controller = new AbortController();
    const context: OfflineQueueSendContext = {
      id: item.id,
      attempt,
      createdAt: item.createdAt,
      signal: controller.signal,
    };
    // Wrapped so that a `send` that throws synchronously is a rejection too.
    const sending = Promise.resolve().then(() => send(item.payload, context));
    if (!(sendTimeoutMs > 0) || !Number.isFinite(sendTimeoutMs)) {
      await sending;
      return;
    }

    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        controller.abort();
        reject(new Error(`Sending timed out after ${String(sendTimeoutMs)} ms.`));
      }, sendTimeoutMs);
    });
    try {
      await Promise.race([sending, timeout]);
    } finally {
      clearTimeout(timer);
      // The loser of the race must not surface as an unhandled rejection.
      sending.catch(() => undefined);
    }
  }

  /** Sends one item. Returns false when the run should stop. */
  async function sendItem(item: QueueItem<TPayload>): Promise<boolean> {
    const attempt = item.attempts + 1;
    const attemptedAt = Date.now();
    items.set(item.id, { ...item, sending: true, attempts: attempt, lastAttemptAt: attemptedAt });
    emit();

    try {
      await deliver(item, attempt);
    } catch (error) {
      const message = errorMessage(error);
      let permanent = attempt >= maxAttempts;
      try {
        permanent ||= isPermanentError?.(error) === true;
      } catch {
        // A classifier that throws must not lose the item: treat as temporary.
      }

      const current = items.get(item.id);
      if (current) {
        const failed: QueueItem<TPayload> = {
          ...current,
          sending: false,
          // A payload replaced during the send deserves a fresh try.
          status: permanent && current.revision === item.revision ? 'failed' : 'pending',
          lastError: message,
        };
        items.set(item.id, failed);
        await exclusive(() => getStore().put(item.id, toRecord(failed))).catch(() => undefined);
      }
      lastError = message;

      if (permanent) {
        emit();
        return true;
      }

      consecutiveFailures += 1;
      nextRetryAt = Date.now() + computeBackoffDelay(consecutiveFailures, backoff);
      emit();
      scheduleRetry();
      return false;
    }

    const current = items.get(item.id);
    if (current && current.revision !== item.revision) {
      // Enqueued again with a new payload while this one was on its way:
      // what was delivered is out of date, so the item stays to be sent again.
      items.set(item.id, { ...current, sending: false });
      emit();
      return true;
    }

    try {
      await exclusive(() => getStore().delete(item.id));
    } catch (error) {
      // Still on disk, so it will be sent again later: `send` must be idempotent.
      if (current) items.set(item.id, { ...current, sending: false });
      lastError = errorMessage(error);
      emit();
      return false;
    }

    items.delete(item.id);
    consecutiveFailures = 0;
    nextRetryAt = null;
    lastError = null;
    lastSyncAt = Date.now();
    const meta: QueueMetaRecord = { lastSyncAt };
    await exclusive(() => getStore().put(META_ID, meta)).catch(() => undefined);
    emit();
    return true;
  }

  async function flushOnce(force: boolean): Promise<void> {
    await exclusive(refreshFromStore);
    ready = true;
    emit();

    if (!force && nextRetryAt !== null && Date.now() < nextRetryAt) return;

    for (let item = nextPending(); item; item = nextPending()) {
      if (!(await sendItem(item))) return;
    }
  }

  /**
   * With Web Locks only one tab flushes a queue at a time, and each starts by
   * re-reading the store, so an item is not sent from two tabs.
   */
  async function withLock(task: () => Promise<void>): Promise<void> {
    const locks = (globalThis.navigator as Navigator | undefined)?.locks as LockManager | undefined;
    if (typeof locks?.request !== 'function') {
      await task();
      return;
    }
    await locks.request(`carefully-built-offline-queue:${name}`, task);
  }

  function runFlush(force: boolean): Promise<OfflineQueueSnapshot> {
    if (flushPromise) {
      // Whatever asked may have enqueued after the run looked: look once more.
      flushAgain = true;
      flushAgainForced ||= force;
      return flushPromise;
    }

    const run = (async (): Promise<OfflineQueueSnapshot> => {
      try {
        let forced = force;
        do {
          flushAgain = false;
          flushAgainForced = false;
          await withLock(() => flushOnce(forced));
          forced = flushAgainForced;
        } while (flushAgain);
      } catch (error) {
        lastError = errorMessage(error);
        emit();
      } finally {
        flushPromise = null;
      }
      return snapshot;
    })();
    flushPromise = run;
    return run;
  }

  function handleOnline(): void {
    void runFlush(true);
  }

  function handleVisibility(): void {
    if ((globalThis as { document?: Document }).document?.visibilityState === 'visible') {
      void runFlush(false);
    }
  }

  return {
    name,

    async enqueue(payload, enqueueOptions) {
      const id = enqueueOptions?.id ?? createId();
      if (id === META_ID) throw new Error(`"${META_ID}" is reserved by the queue.`);
      await load().catch(() => undefined);

      const meta = await exclusive(async () => {
        const store = getStore();
        let existing: QueueRecord<TPayload> | undefined = items.get(id);
        if (!existing) {
          // Another tab may have queued this id already.
          const stored = await store.get(id);
          if (isQueueRecord(stored)) existing = stored as QueueRecord<TPayload>;
        }

        const current = items.get(id);
        const item: QueueItem<TPayload> = {
          id,
          payload,
          createdAt: existing?.createdAt ?? Date.now(),
          order: existing?.order ?? (orderCounter += 1),
          attempts: 0,
          status: 'pending',
          lastAttemptAt: null,
          lastError: null,
          revision: (current?.revision ?? 0) + 1,
          sending: current?.sending ?? false,
        };
        // On disk first: once this resolves the item survives a reload.
        await store.put(id, toRecord(item));
        items.set(id, item);
        ready = true;
        emit();
        return toMeta(item);
      });

      if (started) void runFlush(false);
      return meta;
    },

    flush: () => runFlush(true),

    async retryFailed(id) {
      await load().catch(() => undefined);
      await exclusive(async () => {
        for (const item of [...items.values()]) {
          if (item.status !== 'failed' || (id !== undefined && item.id !== id)) continue;
          const retried: QueueItem<TPayload> = { ...item, status: 'pending', attempts: 0, lastError: null };
          await getStore().put(item.id, toRecord(retried));
          items.set(item.id, retried);
        }
        emit();
      });
      if (started) void runFlush(true);
    },

    async remove(id) {
      await load().catch(() => undefined);
      await exclusive(async () => {
        await getStore().delete(id);
        items.delete(id);
        emit();
      });
    },

    subscribe(listener) {
      listeners.add(listener);
      // Show what a previous session left behind as soon as someone is watching.
      load().catch(() => undefined);
      return () => {
        listeners.delete(listener);
      };
    },

    getSnapshot: () => snapshot,

    start() {
      if (started) return;
      // Nothing to listen to and nowhere to store during server rendering.
      const target = globalThis as {
        addEventListener?: Window['addEventListener'];
        document?: Document;
      };
      if (options.store === undefined && (globalThis as { indexedDB?: unknown }).indexedDB === undefined) {
        return;
      }

      started = true;
      target.addEventListener?.('online', handleOnline);
      target.document?.addEventListener('visibilitychange', handleVisibility);
      if (intervalMs > 0 && Number.isFinite(intervalMs)) {
        intervalTimer = setInterval(() => {
          void runFlush(false);
        }, intervalMs);
        // Do not keep a Node or test process alive for the timer.
        (intervalTimer as { unref?: () => void }).unref?.();
      }
      void runFlush(false);
    },

    stop() {
      if (!started) return;
      started = false;
      const target = globalThis as {
        removeEventListener?: Window['removeEventListener'];
        document?: Document;
      };
      target.removeEventListener?.('online', handleOnline);
      target.document?.removeEventListener('visibilitychange', handleVisibility);
      if (intervalTimer !== null) clearInterval(intervalTimer);
      if (retryTimer !== null) clearTimeout(retryTimer);
      intervalTimer = null;
      retryTimer = null;
    },
  };
}
