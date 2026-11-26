import 'fake-indexeddb/auto';

import { afterEach, describe, expect, test } from 'bun:test';

import { computeBackoffDelay } from '../src/backoff';
import { createEncryptedStore } from '../src/encrypted-store';
import { createMemoryStore } from '../src/memory-store';
import { createOfflineQueue } from '../src/offline-queue';
import { deriveSyncStatus } from '../src/sync-status';

import type { OfflineQueue, OfflineQueueOptions } from '../src/offline-queue';

interface Payload {
  readonly text: string;
}

let nameCounter = 0;
function uniqueName(): string {
  nameCounter += 1;
  return `queue-test-${String(nameCounter)}`;
}

const running: OfflineQueue<Payload>[] = [];
function createQueue(options: OfflineQueueOptions<Payload>): OfflineQueue<Payload> {
  const queue = createOfflineQueue<Payload>({ intervalMs: 0, ...options });
  running.push(queue);
  return queue;
}

afterEach(() => {
  for (const queue of running.splice(0)) queue.stop();
});

function deferred<TValue = void>(): {
  promise: Promise<TValue>;
  resolve: (value: TValue) => void;
  reject: (error: unknown) => void;
} {
  let resolve: (value: TValue) => void = () => undefined;
  let reject: (error: unknown) => void = () => undefined;
  const promise = new Promise<TValue>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function waitFor(condition: () => boolean, timeoutMs = 2000): Promise<void> {
  const startedAt = Date.now();
  while (!condition()) {
    if (Date.now() - startedAt > timeoutMs) throw new Error('waitFor timed out');
    await wait(5);
  }
}

class PermanentError extends Error {}

describe('computeBackoffDelay', () => {
  const options = { baseMs: 1000, maxMs: 30_000 };

  test('doubles with every failure', () => {
    const noJitter = (): number => 1;
    expect(computeBackoffDelay(1, options, noJitter)).toBe(1000);
    expect(computeBackoffDelay(2, options, noJitter)).toBe(2000);
    expect(computeBackoffDelay(3, options, noJitter)).toBe(4000);
    expect(computeBackoffDelay(5, options, noJitter)).toBe(16_000);
  });

  test('is capped at maxMs, also for absurd failure counts', () => {
    expect(computeBackoffDelay(6, options, () => 1)).toBe(30_000);
    expect(computeBackoffDelay(10_000, options, () => 1)).toBe(30_000);
  });

  test('jitter spreads the delay between half and the whole', () => {
    expect(computeBackoffDelay(3, options, () => 0)).toBe(2000);
    expect(computeBackoffDelay(3, options, () => 0.5)).toBe(3000);
    for (let index = 0; index < 50; index += 1) {
      const delay = computeBackoffDelay(3, options);
      expect(delay).toBeGreaterThanOrEqual(2000);
      expect(delay).toBeLessThanOrEqual(4000);
    }
  });
});

describe('deriveSyncStatus', () => {
  test('offline wins, then syncing, then pending', () => {
    expect(deriveSyncStatus({ online: false, pending: 3, sending: 1 })).toBe('offline');
    expect(deriveSyncStatus({ online: true, pending: 3, sending: 1 })).toBe('syncing');
    expect(deriveSyncStatus({ online: true, pending: 3 })).toBe('pending');
    expect(deriveSyncStatus({ online: true, pending: 0, sending: 0 })).toBe('online');
  });
});

describe('createOfflineQueue', () => {
  test('sends items in the order they were enqueued and empties the queue', async () => {
    const sent: string[] = [];
    const queue = createQueue({
      name: uniqueName(),
      store: createMemoryStore(),
      send: async (payload) => {
        // Later items resolving faster must not overtake earlier ones.
        await wait(payload.text === 'first' ? 20 : 1);
        sent.push(payload.text);
      },
    });

    await queue.enqueue({ text: 'first' });
    await queue.enqueue({ text: 'second' });
    await queue.enqueue({ text: 'third' });
    expect(queue.getSnapshot().pending).toBe(3);

    const snapshot = await queue.flush();

    expect(sent).toEqual(['first', 'second', 'third']);
    expect(snapshot.pending).toBe(0);
    expect(snapshot.items).toEqual([]);
    expect(snapshot.lastSyncAt).not.toBeNull();
    expect(snapshot.lastError).toBeNull();
  });

  test('ordering follows createdAt even when ids sort the other way', async () => {
    const sent: string[] = [];
    const queue = createQueue({
      name: uniqueName(),
      store: createMemoryStore(),
      send: (payload) => {
        sent.push(payload.text);
        return Promise.resolve();
      },
    });

    await queue.enqueue({ text: 'one' }, { id: 'zzz' });
    await queue.enqueue({ text: 'two' }, { id: 'mmm' });
    await queue.enqueue({ text: 'three' }, { id: 'aaa' });
    expect(queue.getSnapshot().items.map((item) => item.id)).toEqual(['zzz', 'mmm', 'aaa']);

    await queue.flush();
    expect(sent).toEqual(['one', 'two', 'three']);
  });

  test('items survive a reload: a new queue on the same store sends them', async () => {
    const name = uniqueName();
    const before = createQueue({
      name,
      send: () => Promise.reject(new Error('offline')),
    });
    await before.enqueue({ text: 'kept one' }, { id: 'a' });
    await before.enqueue({ text: 'kept two' }, { id: 'b' });
    await before.flush();
    expect(before.getSnapshot().pending).toBe(2);
    before.stop();

    // Same name, fresh instance: what a page reload gives.
    const sent: { text: string; id: string; attempt: number }[] = [];
    const after = createQueue({
      name,
      send: (payload, context) => {
        sent.push({ text: payload.text, id: context.id, attempt: context.attempt });
        return Promise.resolve();
      },
    });
    expect(after.getSnapshot().ready).toBe(false);

    const snapshot = await after.flush();

    expect(sent).toEqual([
      { text: 'kept one', id: 'a', attempt: 2 },
      { text: 'kept two', id: 'b', attempt: 1 },
    ]);
    expect(snapshot.ready).toBe(true);
    expect(snapshot.pending).toBe(0);
  });

  test('the default store keeps payloads encrypted on disk', async () => {
    const name = uniqueName();
    const queue = createQueue({ name, send: () => Promise.reject(new Error('offline')) });
    await queue.enqueue({ text: 'Signed by Maria Rossi' }, { id: 'a' });

    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const open = indexedDB.open(`carefully-built-offline-queue:${name}`);
      open.onsuccess = () => {
        resolve(open.result);
      };
      open.onerror = () => {
        reject(open.error ?? new Error('open failed'));
      };
    });
    const raw = await new Promise<unknown[]>((resolve, reject) => {
      const all = database.transaction('items').objectStore('items').getAll();
      all.onsuccess = () => {
        resolve(all.result);
      };
      all.onerror = () => {
        reject(all.error ?? new Error('getAll failed'));
      };
    });
    database.close();

    expect(raw).toHaveLength(1);
    const record = raw[0] as { data: ArrayBuffer; payload?: unknown };
    expect(record.payload).toBeUndefined();
    expect(Buffer.from(new Uint8Array(record.data)).includes(Buffer.from('Maria'))).toBe(false);
  });

  test('an item is removed only after send resolves', async () => {
    const store = createMemoryStore();
    const gate = deferred();
    const queue = createQueue({ name: uniqueName(), store, send: () => gate.promise });
    await queue.enqueue({ text: 'slow' }, { id: 'a' });

    const flushing = queue.flush();
    await waitFor(() => queue.getSnapshot().sending === 1);

    // In flight: still on disk, and reported as being sent.
    expect(await store.get('a')).toBeDefined();
    expect(queue.getSnapshot().items).toMatchObject([{ id: 'a', status: 'sending', attempts: 1 }]);
    expect(queue.getSnapshot().pending).toBe(0);

    gate.resolve();
    await flushing;

    expect(await store.get('a')).toBeUndefined();
    expect(queue.getSnapshot().sending).toBe(0);
    expect(queue.getSnapshot().items).toEqual([]);
  });

  test('a failed send keeps the item, records the error and backs off', async () => {
    let calls = 0;
    const store = createMemoryStore();
    const queue = createQueue({
      name: uniqueName(),
      store,
      retry: { baseMs: 1000, maxMs: 8000 },
      send: () => {
        calls += 1;
        return Promise.reject(new Error('network down'));
      },
    });
    await queue.enqueue({ text: 'a' }, { id: 'a' });
    await queue.enqueue({ text: 'b' }, { id: 'b' });

    const before = Date.now();
    const snapshot = await queue.flush();

    // The run stops at the first failure: the second item is not tried.
    expect(calls).toBe(1);
    expect(snapshot.pending).toBe(2);
    expect(snapshot.failed).toBe(0);
    expect(snapshot.lastError).toBe('network down');
    expect(snapshot.items[0]).toMatchObject({ id: 'a', status: 'pending', attempts: 1, lastError: 'network down' });
    expect(snapshot.items[1]).toMatchObject({ id: 'b', status: 'pending', attempts: 0 });
    expect(snapshot.nextRetryAt).not.toBeNull();
    expect((snapshot.nextRetryAt ?? 0) - before).toBeGreaterThanOrEqual(500);
    expect((snapshot.nextRetryAt ?? 0) - before).toBeLessThanOrEqual(1100);
    expect(await store.count()).toBe(2);
  });

  test('the delay grows with consecutive failures and resets after a success', async () => {
    let online = false;
    const queue = createQueue({
      name: uniqueName(),
      store: createMemoryStore(),
      retry: { baseMs: 1000, maxMs: 60_000 },
      send: () => (online ? Promise.resolve() : Promise.reject(new Error('offline'))),
    });
    await queue.enqueue({ text: 'a' });

    const delays: number[] = [];
    for (let index = 0; index < 4; index += 1) {
      const before = Date.now();
      const snapshot = await queue.flush();
      delays.push((snapshot.nextRetryAt ?? 0) - before);
    }

    // Each is between half and the whole of 1s, 2s, 4s, 8s.
    expect(delays[0]).toBeLessThanOrEqual(1100);
    expect(delays[1]).toBeGreaterThanOrEqual(1000);
    expect(delays[2]).toBeGreaterThanOrEqual(2000);
    expect(delays[3]).toBeGreaterThanOrEqual(4000);
    expect(delays[3]).toBeLessThanOrEqual(8100);

    online = true;
    const snapshot = await queue.flush();
    expect(snapshot.pending).toBe(0);
    expect(snapshot.nextRetryAt).toBeNull();
    expect(snapshot.lastError).toBeNull();
  });

  test('a started queue retries by itself after the backoff', async () => {
    let calls = 0;
    const queue = createQueue({
      name: uniqueName(),
      store: createMemoryStore(),
      retry: { baseMs: 20, maxMs: 40 },
      send: () => {
        calls += 1;
        return calls < 3 ? Promise.reject(new Error('flaky')) : Promise.resolve();
      },
    });
    queue.start();
    await queue.enqueue({ text: 'a' });

    await waitFor(() => queue.getSnapshot().items.length === 0);

    expect(calls).toBe(3);
    expect(queue.getSnapshot().lastSyncAt).not.toBeNull();
  });

  test('automatic flushes respect the backoff, a manual flush does not', async () => {
    let calls = 0;
    const queue = createQueue({
      name: uniqueName(),
      store: createMemoryStore(),
      retry: { baseMs: 60_000, maxMs: 60_000 },
      send: () => {
        calls += 1;
        return Promise.reject(new Error('offline'));
      },
    });
    queue.start();
    await queue.enqueue({ text: 'a' });
    await waitFor(() => calls === 1);
    await waitFor(() => queue.getSnapshot().nextRetryAt !== null);

    // Enqueuing triggers an automatic flush, which must wait for the backoff.
    await queue.enqueue({ text: 'b' });
    await wait(30);
    expect(calls).toBe(1);

    await queue.flush();
    expect(calls).toBe(2);
  });

  test('the same id is queued once: the payload is replaced, createdAt and place are kept', async () => {
    const sent: string[] = [];
    const queue = createQueue({
      name: uniqueName(),
      store: createMemoryStore(),
      send: (payload) => {
        sent.push(payload.text);
        return Promise.resolve();
      },
    });

    const first = await queue.enqueue({ text: 'draft' }, { id: 'consent-1' });
    await queue.enqueue({ text: 'other' }, { id: 'consent-2' });
    await wait(5);
    const again = await queue.enqueue({ text: 'final' }, { id: 'consent-1' });

    expect(again.createdAt).toBe(first.createdAt);
    expect(queue.getSnapshot().items.map((item) => item.id)).toEqual(['consent-1', 'consent-2']);

    await queue.flush();
    expect(sent).toEqual(['final', 'other']);
  });

  test('createdAt of an id is kept across a reload', async () => {
    const name = uniqueName();
    const before = createQueue({ name, send: () => Promise.reject(new Error('offline')) });
    const first = await before.enqueue({ text: 'v1' }, { id: 'same' });
    before.stop();
    await wait(5);

    const after = createQueue({ name, send: () => Promise.resolve() });
    const again = await after.enqueue({ text: 'v2' }, { id: 'same' });

    expect(again.createdAt).toBe(first.createdAt);
    expect(after.getSnapshot().items).toHaveLength(1);
  });

  test('the id reaches send, so the server can deduplicate a repeated delivery', async () => {
    const seen: string[] = [];
    let fail = true;
    const queue = createQueue({
      name: uniqueName(),
      store: createMemoryStore(),
      send: (_payload, context) => {
        seen.push(`${context.id}#${String(context.attempt)}`);
        if (fail) {
          fail = false;
          return Promise.reject(new Error('response lost'));
        }
        return Promise.resolve();
      },
    });
    await queue.enqueue({ text: 'a' }, { id: 'key-1' });

    await queue.flush();
    await queue.flush();

    expect(seen).toEqual(['key-1#1', 'key-1#2']);
  });

  test('without an id every enqueue gets its own', async () => {
    const queue = createQueue({ name: uniqueName(), store: createMemoryStore(), send: () => Promise.resolve() });
    const first = await queue.enqueue({ text: 'same' });
    const second = await queue.enqueue({ text: 'same' });

    expect(first.id).not.toBe(second.id);
    expect(queue.getSnapshot().pending).toBe(2);
  });

  test('a payload replaced while it is being sent is sent again', async () => {
    const sent: string[] = [];
    const gate = deferred();
    let first = true;
    const queue = createQueue({
      name: uniqueName(),
      store: createMemoryStore(),
      send: async (payload) => {
        sent.push(payload.text);
        if (first) {
          first = false;
          await gate.promise;
        }
      },
    });
    await queue.enqueue({ text: 'old' }, { id: 'a' });

    const flushing = queue.flush();
    await waitFor(() => queue.getSnapshot().sending === 1);
    await queue.enqueue({ text: 'new' }, { id: 'a' });
    gate.resolve();
    await flushing;

    expect(sent).toEqual(['old', 'new']);
    expect(queue.getSnapshot().items).toEqual([]);
  });

  test('a permanent error parks the item as failed and the rest still go', async () => {
    const sent: string[] = [];
    const store = createMemoryStore();
    const queue = createQueue({
      name: uniqueName(),
      store,
      isPermanentError: (error) => error instanceof PermanentError,
      send: (payload) => {
        if (payload.text === 'bad') return Promise.reject(new PermanentError('rejected by server'));
        sent.push(payload.text);
        return Promise.resolve();
      },
    });
    await queue.enqueue({ text: 'good one' }, { id: 'a' });
    await queue.enqueue({ text: 'bad' }, { id: 'b' });
    await queue.enqueue({ text: 'good two' }, { id: 'c' });

    const snapshot = await queue.flush();

    expect(sent).toEqual(['good one', 'good two']);
    expect(snapshot.pending).toBe(0);
    expect(snapshot.failed).toBe(1);
    expect(snapshot.items).toMatchObject([
      { id: 'b', status: 'failed', attempts: 1, lastError: 'rejected by server' },
    ]);
    // Failed items are kept, not dropped, and are not retried on the next flush.
    expect(await store.get('b')).toBeDefined();
    expect(snapshot.nextRetryAt).toBeNull();
    await queue.flush();
    expect(queue.getSnapshot().items[0]?.attempts).toBe(1);
  });

  test('a failed item stays failed after a reload and can be retried or removed', async () => {
    const name = uniqueName();
    let reject = true;
    const options: OfflineQueueOptions<Payload> = {
      name,
      isPermanentError: () => true,
      send: () => (reject ? Promise.reject(new Error('invalid')) : Promise.resolve()),
    };
    const before = createQueue(options);
    await before.enqueue({ text: 'a' }, { id: 'a' });
    await before.enqueue({ text: 'b' }, { id: 'b' });
    await before.flush();
    expect(before.getSnapshot().failed).toBe(2);
    before.stop();

    const after = createQueue(options);
    await after.flush();
    expect(after.getSnapshot().failed).toBe(2);

    await after.remove('b');
    expect(after.getSnapshot().items.map((item) => item.id)).toEqual(['a']);

    reject = false;
    await after.retryFailed('a');
    expect(after.getSnapshot().items[0]).toMatchObject({ status: 'pending', attempts: 0 });
    await after.flush();
    expect(after.getSnapshot().items).toEqual([]);
  });

  test('maxAttempts turns a repeated failure into a failed item', async () => {
    const queue = createQueue({
      name: uniqueName(),
      store: createMemoryStore(),
      retry: { baseMs: 1, maxMs: 1, maxAttempts: 2 },
      send: () => Promise.reject(new Error('always')),
    });
    await queue.enqueue({ text: 'a' }, { id: 'a' });

    await queue.flush();
    expect(queue.getSnapshot().items[0]).toMatchObject({ status: 'pending', attempts: 1 });
    await queue.flush();
    expect(queue.getSnapshot().items[0]).toMatchObject({ status: 'failed', attempts: 2 });
  });

  test('a classifier that throws does not lose the item', async () => {
    const queue = createQueue({
      name: uniqueName(),
      store: createMemoryStore(),
      isPermanentError: () => {
        throw new Error('classifier bug');
      },
      send: () => Promise.reject(new Error('boom')),
    });
    await queue.enqueue({ text: 'a' });

    const snapshot = await queue.flush();
    expect(snapshot.pending).toBe(1);
    expect(snapshot.failed).toBe(0);
  });

  test('flush is single-flight: concurrent calls share one run', async () => {
    let calls = 0;
    const gate = deferred();
    const queue = createQueue({
      name: uniqueName(),
      store: createMemoryStore(),
      send: async () => {
        calls += 1;
        await gate.promise;
      },
    });
    await queue.enqueue({ text: 'a' });

    const first = queue.flush();
    const second = queue.flush();
    const third = queue.flush();
    expect(second).toBe(first);
    expect(third).toBe(first);

    gate.resolve();
    await Promise.all([first, second, third]);
    expect(calls).toBe(1);
  });

  test('an item enqueued during a flush is sent by that flush', async () => {
    const sent: string[] = [];
    const gate = deferred();
    const queue = createQueue({
      name: uniqueName(),
      store: createMemoryStore(),
      send: async (payload) => {
        if (payload.text === 'first') await gate.promise;
        sent.push(payload.text);
      },
    });
    await queue.enqueue({ text: 'first' });

    const flushing = queue.flush();
    await waitFor(() => queue.getSnapshot().sending === 1);
    await queue.enqueue({ text: 'late' });
    gate.resolve();
    await flushing;

    expect(sent).toEqual(['first', 'late']);
  });

  test('a send that hangs times out and is retried later', async () => {
    let aborted = false;
    const queue = createQueue({
      name: uniqueName(),
      store: createMemoryStore(),
      sendTimeoutMs: 20,
      send: (_payload, context) =>
        new Promise<void>(() => {
          context.signal.addEventListener('abort', () => {
            aborted = true;
          });
        }),
    });
    await queue.enqueue({ text: 'a' });

    const snapshot = await queue.flush();

    expect(aborted).toBe(true);
    expect(snapshot.pending).toBe(1);
    expect(snapshot.lastError).toContain('timed out');
  });

  test('a send that throws synchronously is a failure, not a crash', async () => {
    const queue = createQueue({
      name: uniqueName(),
      store: createMemoryStore(),
      send: () => {
        throw new Error('sync throw');
      },
    });
    await queue.enqueue({ text: 'a' });

    const snapshot = await queue.flush();
    expect(snapshot.pending).toBe(1);
    expect(snapshot.lastError).toBe('sync throw');
  });

  test('subscribers are told about changes and snapshots are stable in between', async () => {
    const queue = createQueue({ name: uniqueName(), store: createMemoryStore(), send: () => Promise.resolve() });
    let notifications = 0;
    const unsubscribe = queue.subscribe(() => {
      notifications += 1;
    });
    await waitFor(() => queue.getSnapshot().ready);

    const idle = queue.getSnapshot();
    expect(queue.getSnapshot()).toBe(idle);

    const seenBefore = notifications;
    await queue.enqueue({ text: 'a' });
    expect(notifications).toBeGreaterThan(seenBefore);
    expect(queue.getSnapshot()).not.toBe(idle);

    unsubscribe();
    const seenAfter = notifications;
    await queue.flush();
    expect(notifications).toBe(seenAfter);
  });

  test('snapshots carry metadata only, never payloads', async () => {
    const queue = createQueue({
      name: uniqueName(),
      store: createMemoryStore(),
      send: () => Promise.reject(new Error('offline')),
    });
    await queue.enqueue({ text: 'Signed by Maria Rossi' }, { id: 'a' });
    await queue.flush();

    const snapshot = queue.getSnapshot();
    expect(Object.keys(snapshot.items[0] ?? {}).sort()).toEqual([
      'attempts',
      'createdAt',
      'id',
      'lastAttemptAt',
      'lastError',
      'status',
    ]);
    expect(JSON.stringify(snapshot)).not.toContain('Maria');
  });

  test('lastSyncAt survives a reload', async () => {
    const name = uniqueName();
    const before = createQueue({ name, send: () => Promise.resolve() });
    await before.enqueue({ text: 'a' });
    const { lastSyncAt } = await before.flush();
    expect(lastSyncAt).not.toBeNull();
    before.stop();

    const after = createQueue({ name, send: () => Promise.resolve() });
    const snapshot = await after.flush();
    expect(snapshot.lastSyncAt).toBe(lastSyncAt);
    expect(snapshot.items).toEqual([]);
  });

  test('two queues on one store do not send the same item twice', async () => {
    // Two tabs: same name, same store, each with its own memory.
    const store = createEncryptedStore({ dbName: `shared-${uniqueName()}`, storeName: 'items' });
    const name = uniqueName();
    const sent: string[] = [];
    const send = async (payload: Payload): Promise<void> => {
      await wait(5);
      sent.push(payload.text);
    };
    const tabOne = createQueue({ name, store, send });
    const tabTwo = createQueue({ name, store, send });

    await tabOne.enqueue({ text: 'a' }, { id: 'a' });
    await tabOne.enqueue({ text: 'b' }, { id: 'b' });
    await tabTwo.flush();
    await tabOne.flush();

    expect(sent).toEqual(['a', 'b']);
    expect(tabOne.getSnapshot().items).toEqual([]);
    expect(tabTwo.getSnapshot().items).toEqual([]);
  });

  test('uses a Web Lock named after the queue when the browser has them', async () => {
    const requested: string[] = [];
    const navigatorLike = globalThis.navigator as unknown as { locks?: unknown };
    const original = navigatorLike.locks;
    Object.defineProperty(navigatorLike, 'locks', {
      configurable: true,
      value: {
        request: async (lockName: string, task: () => Promise<void>): Promise<void> => {
          requested.push(lockName);
          await task();
        },
      },
    });

    try {
      const name = uniqueName();
      const sent: string[] = [];
      const queue = createQueue({
        name,
        store: createMemoryStore(),
        send: (payload) => {
          sent.push(payload.text);
          return Promise.resolve();
        },
      });
      await queue.enqueue({ text: 'a' });
      await queue.flush();

      expect(requested).toEqual([`carefully-built-offline-queue:${name}`]);
      expect(sent).toEqual(['a']);
    } finally {
      Object.defineProperty(navigatorLike, 'locks', { configurable: true, value: original });
    }
  });

  test('enqueue rejects when the item could not be saved', async () => {
    const broken = createMemoryStore();
    broken.put = () => Promise.reject(new Error('disk full'));
    const queue = createQueue({ name: uniqueName(), store: broken, send: () => Promise.resolve() });

    await expect(queue.enqueue({ text: 'a' })).rejects.toThrow('disk full');
    expect(queue.getSnapshot().items).toEqual([]);
  });
});
