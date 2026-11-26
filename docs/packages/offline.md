# @carefully-built/offline

Offline-first building blocks for Carefully Built SaaS apps: an encrypted IndexedDB store, a persistent retrying send queue, and React bindings with a sync status badge.

## Install

```bash
bun add @carefully-built/offline
```

For local development in an app inside the same parent workspace, use the packed tarball or workspace link already used by the consuming app.

## Import Paths

- `@carefully-built/offline`
- `@carefully-built/offline/react`

## Component Usage

```tsx
import { SyncStatusBadge } from '@carefully-built/offline';

// Check the API catalog below for the component source and prop types.
// Most components are controlled shells: pass app data, handlers, and slot content from the consuming app.
```

Components in this package:

- `SyncStatusBadge`: import from `@carefully-built/offline`.

## Hook Usage

```tsx
import { useOfflineQueue } from '@carefully-built/offline';

export function Example() {
  const state = useOfflineQueue({} as never);
  return null;
}
```

Hooks in this package:

- `useOfflineQueue`: keep app-specific data fetching and mutations in the consuming app.
- `useOfflineQueue`: keep app-specific data fetching and mutations in the consuming app.
- `useOnlineStatus`: keep app-specific data fetching and mutations in the consuming app.
- `useOnlineStatus`: keep app-specific data fetching and mutations in the consuming app.

## Helper Usage

```ts
import { computeBackoffDelay } from '@carefully-built/offline';
```

Helpers in this package:

- `computeBackoffDelay`
- `computeBackoffDelay`
- `createEncryptedStore`
- `createEncryptedStore`
- `createMemoryStore`
- `createMemoryStore`
- `createOfflineQueue`
- `createOfflineQueue`
- `DEFAULT_BACKOFF`
- `DEFAULT_BACKOFF`
- `deriveSyncStatus`
- `deriveSyncStatus`
- `deriveSyncStatus`
- `EMPTY_OFFLINE_QUEUE_SNAPSHOT`
- `EMPTY_OFFLINE_QUEUE_SNAPSHOT`
- `OfflineStoreError`
- `OfflineStoreError`
- `SyncStatusBadge`
- `syncStatusTexts`

## Types And Schemas

- `BackoffOptions`
- `EncryptedStoreOptions`
- `OfflineQueue`
- `OfflineQueueItemMeta`
- `OfflineQueueItemStatus`
- `OfflineQueueOptions`
- `OfflineQueueRetryOptions`
- `OfflineQueueSendContext`
- `OfflineQueueSnapshot`
- `OfflineStore`
- `OfflineStoreEntry`
- `SyncStatus`
- `SyncStatusBadgeClassNames`
- `SyncStatusBadgeLabels`
- `SyncStatusBadgeProps`
- `UseOfflineQueueOptions`
- `UseOnlineStatusOptions`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `SyncStatusBadge` | Component | `packages/offline/src/react/sync-status-badge.tsx` |
| `computeBackoffDelay` | Helper | `packages/offline/src/backoff.ts` |
| `computeBackoffDelay` | Helper | `packages/offline/src/index.ts` |
| `createEncryptedStore` | Helper | `packages/offline/src/encrypted-store.ts` |
| `createEncryptedStore` | Helper | `packages/offline/src/index.ts` |
| `createMemoryStore` | Helper | `packages/offline/src/index.ts` |
| `createMemoryStore` | Helper | `packages/offline/src/memory-store.ts` |
| `createOfflineQueue` | Helper | `packages/offline/src/index.ts` |
| `createOfflineQueue` | Helper | `packages/offline/src/offline-queue.ts` |
| `DEFAULT_BACKOFF` | Helper | `packages/offline/src/backoff.ts` |
| `DEFAULT_BACKOFF` | Helper | `packages/offline/src/index.ts` |
| `deriveSyncStatus` | Helper | `packages/offline/src/index.ts` |
| `deriveSyncStatus` | Helper | `packages/offline/src/react.ts` |
| `deriveSyncStatus` | Helper | `packages/offline/src/sync-status.ts` |
| `EMPTY_OFFLINE_QUEUE_SNAPSHOT` | Helper | `packages/offline/src/index.ts` |
| `EMPTY_OFFLINE_QUEUE_SNAPSHOT` | Helper | `packages/offline/src/offline-queue.ts` |
| `OfflineStoreError` | Helper | `packages/offline/src/index.ts` |
| `OfflineStoreError` | Helper | `packages/offline/src/types.ts` |
| `SyncStatusBadge` | Helper | `packages/offline/src/react.ts` |
| `syncStatusTexts` | Helper | `packages/offline/src/react/sync-texts.ts` |
| `useOfflineQueue` | Hook | `packages/offline/src/react/use-offline-queue.ts` |
| `useOfflineQueue` | Hook | `packages/offline/src/react.ts` |
| `useOnlineStatus` | Hook | `packages/offline/src/react/use-online-status.ts` |
| `useOnlineStatus` | Hook | `packages/offline/src/react.ts` |
| `BackoffOptions` | Type | `packages/offline/src/backoff.ts` |
| `EncryptedStoreOptions` | Type | `packages/offline/src/encrypted-store.ts` |
| `OfflineQueue` | Type | `packages/offline/src/offline-queue.ts` |
| `OfflineQueueItemMeta` | Type | `packages/offline/src/offline-queue.ts` |
| `OfflineQueueItemStatus` | Type | `packages/offline/src/offline-queue.ts` |
| `OfflineQueueOptions` | Type | `packages/offline/src/offline-queue.ts` |
| `OfflineQueueRetryOptions` | Type | `packages/offline/src/offline-queue.ts` |
| `OfflineQueueSendContext` | Type | `packages/offline/src/offline-queue.ts` |
| `OfflineQueueSnapshot` | Type | `packages/offline/src/offline-queue.ts` |
| `OfflineStore` | Type | `packages/offline/src/types.ts` |
| `OfflineStoreEntry` | Type | `packages/offline/src/types.ts` |
| `SyncStatus` | Type | `packages/offline/src/sync-status.ts` |
| `SyncStatusBadgeClassNames` | Type | `packages/offline/src/react/sync-status-badge.tsx` |
| `SyncStatusBadgeLabels` | Type | `packages/offline/src/react/sync-status-badge.tsx` |
| `SyncStatusBadgeProps` | Type | `packages/offline/src/react/sync-status-badge.tsx` |
| `UseOfflineQueueOptions` | Type | `packages/offline/src/react/use-offline-queue.ts` |
| `UseOnlineStatusOptions` | Type | `packages/offline/src/react/use-online-status.ts` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
