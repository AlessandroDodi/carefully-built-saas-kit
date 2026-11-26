import { OfflineStoreError } from './types';

import type { OfflineStore, OfflineStoreEntry } from './types';

export interface EncryptedStoreOptions {
  /** IndexedDB database name. Several stores can share one database. */
  readonly dbName: string;
  /** Object store name inside the database. Each store has its own key. */
  readonly storeName: string;
}

/** What is written to IndexedDB for each value: never the value itself. */
interface EncryptedRecord {
  readonly iv: Uint8Array<ArrayBuffer>;
  readonly data: ArrayBuffer;
}

const KEY_STORE_NAME = '__carefully_built_keys__';
const MAX_OPEN_ATTEMPTS = 4;

function requestToPromise<TResult>(request: IDBRequest<TResult>): Promise<TResult> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      reject(request.error ?? new Error('IndexedDB request failed.'));
    };
  });
}

function transactionDone(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => {
      resolve();
    };
    transaction.onerror = () => {
      reject(transaction.error ?? new Error('IndexedDB transaction failed.'));
    };
    transaction.onabort = () => {
      reject(transaction.error ?? new Error('IndexedDB transaction was aborted.'));
    };
  });
}

function openRequest(
  factory: IDBFactory,
  dbName: string,
  version: number | undefined,
  storeNames: readonly string[],
): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = factory.open(dbName, version);
    request.onupgradeneeded = () => {
      for (const name of storeNames) {
        if (!request.result.objectStoreNames.contains(name)) request.result.createObjectStore(name);
      }
    };
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      reject(request.error ?? new Error('IndexedDB could not be opened.'));
    };
    request.onblocked = () => {
      reject(new Error('IndexedDB upgrade is blocked by another open tab.'));
    };
  });
}

/**
 * Opens the database with the object stores present. A database that already
 * exists without them is upgraded by one version; when another tab upgrades at
 * the same moment the open is simply tried again.
 */
async function openDatabase(
  factory: IDBFactory,
  dbName: string,
  storeNames: readonly string[],
): Promise<IDBDatabase> {
  let lastError: unknown;

  for (let attempt = 0; attempt < MAX_OPEN_ATTEMPTS; attempt += 1) {
    try {
      const database = await openRequest(factory, dbName, undefined, storeNames);
      if (storeNames.every((name) => database.objectStoreNames.contains(name))) return database;

      const nextVersion = database.version + 1;
      database.close();
      return await openRequest(factory, dbName, nextVersion, storeNames);
    } catch (error) {
      lastError = error;
    }
  }

  throw new OfflineStoreError(`Could not open the "${dbName}" database.`, { cause: lastError });
}

/**
 * The store's key: the one already saved, or a new one. The key is generated
 * as non-extractable, so the browser will use it to encrypt and decrypt but
 * never hand out its bytes, not even to this code. IndexedDB can still persist
 * it, because it stores the key object rather than its material.
 */
async function loadOrCreateKey(
  database: IDBDatabase,
  subtle: SubtleCrypto,
  keyId: string,
): Promise<CryptoKey> {
  const existing = (await requestToPromise(
    database.transaction(KEY_STORE_NAME, 'readonly').objectStore(KEY_STORE_NAME).get(keyId),
  )) as CryptoKey | undefined;
  if (existing) return existing;

  const candidate = await subtle.generateKey({ name: 'AES-GCM', length: 256 }, false, [
    'encrypt',
    'decrypt',
  ]);

  // Two tabs may get here together. The check and the write share one
  // transaction, so whichever key was saved first is the one both use.
  const transaction = database.transaction(KEY_STORE_NAME, 'readwrite');
  const keys = transaction.objectStore(KEY_STORE_NAME);
  const done = transactionDone(transaction);
  let key = candidate;
  const lookup = keys.get(keyId);
  lookup.onsuccess = () => {
    const saved = lookup.result as CryptoKey | undefined;
    if (saved) key = saved;
    else keys.put(candidate, keyId);
  };
  await done;
  return key;
}

/**
 * A key-value store in IndexedDB whose values are encrypted at rest with
 * AES-GCM 256 through WebCrypto.
 *
 * - The key is created on first use, is non-extractable, and lives in the
 *   same database; `destroy()` deletes it together with the data.
 * - Every value gets a fresh random IV, and the entry id is authenticated
 *   with it, so a record copied under another id does not decrypt.
 * - Ids are stored in clear: do not put personal data in them.
 * - Values must be JSON-serializable. Encode binary data as base64 or a data URL.
 *
 * This protects the data from being read out of the browser profile or a
 * device backup. It does not protect it from code running on the same origin.
 */
export function createEncryptedStore<TValue = unknown>(
  options: EncryptedStoreOptions,
): OfflineStore<TValue> {
  const { dbName, storeName } = options;
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  let databasePromise: Promise<IDBDatabase> | null = null;
  let keyPromise: Promise<CryptoKey> | null = null;

  function getSubtle(): SubtleCrypto {
    const subtle = (globalThis.crypto as Crypto | undefined)?.subtle;
    if (!subtle) {
      throw new OfflineStoreError(
        'WebCrypto is not available. It needs a secure context: HTTPS or localhost.',
      );
    }
    return subtle;
  }

  function getDatabase(): Promise<IDBDatabase> {
    if (databasePromise) return databasePromise;

    const factory = (globalThis as { indexedDB?: IDBFactory }).indexedDB;
    if (!factory) {
      return Promise.reject(new OfflineStoreError('IndexedDB is not available in this environment.'));
    }

    const opening = openDatabase(factory, dbName, [storeName, KEY_STORE_NAME]).then((database) => {
      const forget = (): void => {
        if (databasePromise === opening) {
          databasePromise = null;
          keyPromise = null;
        }
      };
      // Let another tab upgrade the database; the next call opens it again.
      database.onversionchange = () => {
        database.close();
        forget();
      };
      database.onclose = forget;
      return database;
    });
    databasePromise = opening;
    opening.catch(() => {
      if (databasePromise === opening) databasePromise = null;
    });
    return opening;
  }

  function getKey(database: IDBDatabase): Promise<CryptoKey> {
    if (keyPromise) return keyPromise;

    const loading = loadOrCreateKey(database, getSubtle(), storeName);
    keyPromise = loading;
    loading.catch(() => {
      if (keyPromise === loading) keyPromise = null;
    });
    return loading;
  }

  async function encrypt(key: CryptoKey, id: string, value: TValue): Promise<EncryptedRecord> {
    const serialized = JSON.stringify(value) as string | undefined;
    if (serialized === undefined) {
      throw new OfflineStoreError(`The value for "${id}" cannot be stored: it is not JSON-serializable.`);
    }

    const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));
    const data = await getSubtle().encrypt(
      { name: 'AES-GCM', iv, additionalData: encoder.encode(id) },
      key,
      encoder.encode(serialized),
    );
    return { iv, data };
  }

  async function decrypt(key: CryptoKey, id: string, record: EncryptedRecord): Promise<TValue> {
    try {
      const plain = await getSubtle().decrypt(
        { name: 'AES-GCM', iv: record.iv, additionalData: encoder.encode(id) },
        key,
        record.data,
      );
      return JSON.parse(decoder.decode(plain)) as TValue;
    } catch (error) {
      throw new OfflineStoreError(
        `Could not decrypt "${id}": the key is missing or the data was changed.`,
        { cause: error },
      );
    }
  }

  return {
    async put(id, value) {
      const database = await getDatabase();
      const key = await getKey(database);
      // Encrypt before opening the transaction: it would close while waiting.
      const record = await encrypt(key, id, value);
      const transaction = database.transaction(storeName, 'readwrite');
      const done = transactionDone(transaction);
      transaction.objectStore(storeName).put(record, id);
      await done;
    },

    async get(id) {
      const database = await getDatabase();
      const record = (await requestToPromise(
        database.transaction(storeName, 'readonly').objectStore(storeName).get(id),
      )) as EncryptedRecord | undefined;
      if (!record) return undefined;

      return decrypt(await getKey(database), id, record);
    },

    async getAll() {
      const database = await getDatabase();
      const objectStore = database.transaction(storeName, 'readonly').objectStore(storeName);
      const [ids, records] = await Promise.all([
        requestToPromise(objectStore.getAllKeys()),
        requestToPromise(objectStore.getAll() as IDBRequest<EncryptedRecord[]>),
      ]);
      if (ids.length === 0) return [];

      const key = await getKey(database);
      return Promise.all(
        ids.map(async (rawId, index): Promise<OfflineStoreEntry<TValue>> => {
          const id = String(rawId);
          return { id, value: await decrypt(key, id, records[index] as EncryptedRecord) };
        }),
      );
    },

    async delete(id) {
      const database = await getDatabase();
      const transaction = database.transaction(storeName, 'readwrite');
      const done = transactionDone(transaction);
      transaction.objectStore(storeName).delete(id);
      await done;
    },

    async count() {
      const database = await getDatabase();
      return requestToPromise(
        database.transaction(storeName, 'readonly').objectStore(storeName).count(),
      );
    },

    async clear() {
      const database = await getDatabase();
      const transaction = database.transaction(storeName, 'readwrite');
      const done = transactionDone(transaction);
      transaction.objectStore(storeName).clear();
      await done;
    },

    async destroy() {
      const database = await getDatabase();
      const transaction = database.transaction([storeName, KEY_STORE_NAME], 'readwrite');
      const done = transactionDone(transaction);
      transaction.objectStore(storeName).clear();
      transaction.objectStore(KEY_STORE_NAME).delete(storeName);
      await done;
      // Without the key nothing written before can be read again, even from a
      // copy of the database. The next write creates a new key.
      keyPromise = null;
    },
  };
}
