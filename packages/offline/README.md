# @carefully-built/offline

Offline-first building blocks: keep data on the device encrypted, send it when the connection allows, and show the user where things stand.

- `createEncryptedStore`: a key-value store in IndexedDB, encrypted with AES-GCM 256.
- `createOfflineQueue`: a persistent send queue with retries, backoff and cross-tab safety.
- `@carefully-built/offline/react`: `useOnlineStatus`, `useOfflineQueue`, `SyncStatusBadge`.

The root import has no framework dependency. React, `lucide-react` and `@carefully-built/ui` are only needed for `/react`.

## Install

```bash
bun add @carefully-built/offline
```

## Quick Start

```ts
// lib/consent-queue.ts
import { createOfflineQueue } from '@carefully-built/offline';

export const consentQueue = createOfflineQueue<ConsentPayload>({
  name: 'consents',
  send: async (payload, { id, signal }) => {
    const response = await fetch('/api/consents', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'idempotency-key': id },
      body: JSON.stringify(payload),
      signal,
    });
    if (!response.ok) throw new HttpError(response.status);
  },
  isPermanentError: (error) => error instanceof HttpError && error.status >= 400 && error.status < 500,
});
```

```tsx
'use client';
import { SyncStatusBadge, deriveSyncStatus, useOfflineQueue, useOnlineStatus } from '@carefully-built/offline/react';

function SyncIndicator() {
  const online = useOnlineStatus({ ping: () => fetch('/api/health').then((response) => response.ok) });
  const queue = useOfflineQueue(consentQueue); // also starts the queue
  const waiting = queue.pending + queue.sending;

  return (
    <SyncStatusBadge
      status={deriveSyncStatus({ online, pending: queue.pending, sending: queue.sending })}
      pendingCount={waiting}
      detail="Tablet 2"
    />
  );
}

// Saving: resolves once the item is on disk, whatever the connection.
await consentQueue.enqueue(payload, { id: consentId });
```

## `createEncryptedStore({ dbName, storeName })`

```ts
const store = createEncryptedStore<Draft>({ dbName: 'my-app', storeName: 'drafts' });

await store.put(id, value);
await store.get(id); // value | undefined
await store.getAll(); // { id, value }[], ordered by id
await store.delete(id);
await store.count();
await store.clear(); // removes the entries, keeps the key
await store.destroy(); // removes the entries and the key
```

How it protects the data:

- Values are encrypted with **AES-GCM 256** through WebCrypto before they reach IndexedDB. Each write uses a fresh random 96-bit IV, and the entry id is bound to the ciphertext as authenticated data, so a record that is altered or copied under another id fails to decrypt instead of returning wrong data.
- The key is generated on first use as a **non-extractable** `CryptoKey` and stored in the same database. The browser will encrypt and decrypt with it, but its bytes cannot be exported, by this package or by any other script.
- `destroy()` deletes the entries and the key in one transaction. Without the key, a copy of the old database is unreadable.

What it does not do:

- It does not protect against code running on the same origin (an XSS can ask the store to decrypt). It protects data at rest: the browser profile, device backups, a disk image.
- Ids are stored in clear. Do not put personal data in an id.
- Values go through `JSON.stringify`. Encode binary data as base64 or a data URL; `Date`, `Map` and `undefined` do not survive.
- WebCrypto needs a **secure context**: HTTPS or `localhost`. On plain `http://` a store operation rejects with `OfflineStoreError`.

Several stores can share a `dbName`; each `storeName` has its own key. Errors are `OfflineStoreError`, with the underlying error in `cause`.

`createMemoryStore()` implements the same `OfflineStore` interface in memory, for tests and for environments without IndexedDB.

## `createOfflineQueue(options)`

| Option | Default | |
|---|---|---|
| `name` | required | Names the default database and the cross-tab lock. |
| `send(payload, { id, attempt, createdAt, signal })` | required | Resolve when the server has the item, reject otherwise. |
| `store` | encrypted IndexedDB store | Any `OfflineStore`. |
| `retry` | `{ baseMs: 2000, maxMs: 300000 }` | Exponential backoff with jitter. `maxAttempts` (no limit by default) moves an item to `failed` after that many tries. |
| `isPermanentError(error)` | none | Return true for errors retrying cannot fix. |
| `intervalMs` | `30000` | How often a started queue tries to flush. `0` disables the interval. |
| `sendTimeoutMs` | `60000` | A slower send is aborted (`signal`) and counts as a failure. `0` disables it. |

```ts
queue.enqueue(payload, { id }); // Promise<OfflineQueueItemMeta>, resolves once persisted
queue.flush(); // Promise<OfflineQueueSnapshot>, sends now, ignoring backoff
queue.retryFailed(id?); // failed items back to pending
queue.remove(id); // drop an item without sending it
queue.subscribe(listener); // returns unsubscribe
queue.getSnapshot(); // { ready, pending, sending, failed, items, lastSyncAt, lastError, nextRetryAt }
queue.start();
queue.stop();
```

Guarantees:

- **Nothing is lost on reload.** `enqueue` resolves only after the item is written to the store, and an item is deleted only after `send` resolves. If writing fails, `enqueue` rejects.
- **First in, first out, one at a time.** Order is the time of the first enqueue of each id.
- **Idempotent ids.** Enqueuing an id that is already queued replaces its payload and keeps its `createdAt` and its place. Pass a stable id (the record's own id) and forward `context.id` to the server as an idempotency key: a send can be repeated when a response is lost or the page reloads mid-request.
- **Temporary failures back off.** Any error that is not permanent stops the run and schedules a retry after `baseMs`, doubling up to `maxMs`, with jitter. The `online` event and a manual `flush()` skip the wait.
- **Permanent failures do not block.** The item is parked as `failed`, stays in the store, and the queue continues with the next one. Show failed items to the user and call `retryFailed` or `remove`.
- **Single flight.** Concurrent `flush()` calls share one run; an item enqueued during a run is picked up by it.
- **One sender across tabs.** With Web Locks (`navigator.locks`) only one tab flushes a queue at a time, and each run starts by re-reading the store, so two tabs do not send the same item. Without Web Locks the queue still works, in a single tab.

A started queue flushes right away, on the `online` event, when the page becomes visible again, on the interval, and when a backoff expires. `start()` does nothing during server rendering, so it is safe at module level; `useOfflineQueue` also calls it.

`snapshot.items` holds metadata only (`id`, `status`, `createdAt`, `attempts`, `lastAttemptAt`, `lastError`): payloads are never exposed through a snapshot. `pending` counts items waiting, `sending` the one in flight; a "to send" total is `pending + sending`.

## React

Import from `@carefully-built/offline/react`.

### `useOnlineStatus({ ping?, pingIntervalMs? })`

Returns a boolean. Without options it follows the browser's `online`/`offline` events. That flag only says a network exists, so pass `ping` (a function resolving `true` when your server answers) for a real check: it runs on mount, on reconnect, when the page becomes visible and every `pingIntervalMs` (30 seconds). A rejected ping counts as offline.

### `useOfflineQueue(queue, { autoStart? })`

The queue's snapshot through `useSyncExternalStore`. Starts the queue on mount unless `autoStart: false`.

### `SyncStatusBadge`

| Prop | |
|---|---|
| `status` | `'online' \| 'offline' \| 'pending' \| 'syncing'` |
| `pendingCount` | Shown as "3 to send" when greater than zero and not online. |
| `detail` | Extra text at the end, e.g. a device name. |
| `icon` | Replaces the default icon of the non-online states. |
| `labels` | `{ online, offline, pending, syncing, pendingCount }`; `pendingCount` is a template such as `'{count} to send'`. Defaults follow the kit locale. |
| `className`, `classes` | Slots: `root`, `marker`, `icon`, `label`. |

Looks: online is a small green square and plain text ("Online · Tablet 2"). Offline and pending are an amber pill ("Offline · 3 to send"), with a wifi-off icon when offline and an upload icon when online with items waiting. Syncing is a blue pill with a spinning icon.

`deriveSyncStatus({ online, pending, sending })` picks the status: offline first, then syncing, then pending, otherwise online.
