import { OfflineStoreError } from './types';

import type { OfflineStore, OfflineStoreEntry } from './types';

/**
 * An `OfflineStore` that lives in memory and is gone on reload. For tests,
 * server rendering and environments without IndexedDB. Values go through JSON
 * like in the encrypted store, so both accept and return the same things.
 */
export function createMemoryStore<TValue = unknown>(): OfflineStore<TValue> {
  const entries = new Map<string, string>();

  return {
    put: (id, value) => {
      const serialized = JSON.stringify(value) as string | undefined;
      if (serialized === undefined) {
        return Promise.reject(new OfflineStoreError('The value cannot be stored: it is not JSON-serializable.'));
      }
      entries.set(id, serialized);
      return Promise.resolve();
    },
    get: (id) => {
      const serialized = entries.get(id);
      return Promise.resolve(serialized === undefined ? undefined : (JSON.parse(serialized) as TValue));
    },
    getAll: () =>
      Promise.resolve(
        [...entries.entries()]
          .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0))
          .map(([id, serialized]): OfflineStoreEntry<TValue> => ({ id, value: JSON.parse(serialized) as TValue })),
      ),
    delete: (id) => {
      entries.delete(id);
      return Promise.resolve();
    },
    count: () => Promise.resolve(entries.size),
    clear: () => {
      entries.clear();
      return Promise.resolve();
    },
    destroy: () => {
      entries.clear();
      return Promise.resolve();
    },
  };
}
