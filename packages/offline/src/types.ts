export interface OfflineStoreEntry<TValue> {
  readonly id: string;
  readonly value: TValue;
}

/**
 * A small key-value store. `createEncryptedStore` and `createMemoryStore`
 * implement it, and `createOfflineQueue` accepts anything that does.
 */
export interface OfflineStore<TValue = unknown> {
  put(id: string, value: TValue): Promise<void>;
  get(id: string): Promise<TValue | undefined>;
  /** Every entry, ordered by id. */
  getAll(): Promise<OfflineStoreEntry<TValue>[]>;
  delete(id: string): Promise<void>;
  count(): Promise<number>;
  /** Removes every entry and keeps the store usable. */
  clear(): Promise<void>;
  /** Removes every entry and whatever the store needs to read them, such as an encryption key. */
  destroy(): Promise<void>;
}

/** Thrown by the stores in this package; `cause` holds the underlying error when there is one. */
export class OfflineStoreError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'OfflineStoreError';
  }
}
