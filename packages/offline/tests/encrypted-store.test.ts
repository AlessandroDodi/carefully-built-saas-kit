import 'fake-indexeddb/auto';

import { describe, expect, test } from 'bun:test';

import { createEncryptedStore } from '../src/encrypted-store';
import { OfflineStoreError } from '../src/types';

interface Note {
  readonly text: string;
  readonly tags?: readonly string[];
}

let databaseCounter = 0;
function uniqueDbName(): string {
  databaseCounter += 1;
  return `encrypted-store-test-${String(databaseCounter)}`;
}

function request<TResult>(idbRequest: IDBRequest<TResult>): Promise<TResult> {
  return new Promise((resolve, reject) => {
    idbRequest.onsuccess = () => {
      resolve(idbRequest.result);
    };
    idbRequest.onerror = () => {
      reject(idbRequest.error ?? new Error('request failed'));
    };
  });
}

function openRaw(dbName: string): Promise<IDBDatabase> {
  return request(indexedDB.open(dbName));
}

/** Everything IndexedDB holds for a store, read without going through the package. */
async function readRaw(dbName: string, storeName: string): Promise<unknown[]> {
  const database = await openRaw(dbName);
  try {
    return await request(database.transaction(storeName).objectStore(storeName).getAll());
  } finally {
    database.close();
  }
}

function bytesOf(value: unknown): Uint8Array {
  if (value instanceof ArrayBuffer) return new Uint8Array(value);
  if (ArrayBuffer.isView(value)) return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  throw new Error('not binary');
}

function containsText(bytes: Uint8Array, text: string): boolean {
  return Buffer.from(bytes).includes(Buffer.from(text, 'utf8'));
}

describe('createEncryptedStore', () => {
  test('round-trips values through put and get', async () => {
    const store = createEncryptedStore<Note>({ dbName: uniqueDbName(), storeName: 'notes' });
    const note = { text: 'Consent given by Maria Rossi', tags: ['privacy', 'marketing'] };

    await store.put('a', note);

    expect(await store.get('a')).toEqual(note);
    expect(await store.get('missing')).toBeUndefined();
  });

  test('what is on disk is ciphertext, not the value', async () => {
    const dbName = uniqueDbName();
    const store = createEncryptedStore<Note>({ dbName, storeName: 'notes' });
    const secret = 'Consent given by Maria Rossi';
    await store.put('a', { text: secret });

    const raw = await readRaw(dbName, 'notes');
    expect(raw).toHaveLength(1);

    const record = raw[0] as { iv: unknown; data: unknown; text?: unknown };
    expect(record.text).toBeUndefined();
    expect(JSON.stringify(record)).not.toContain('Maria');

    const data = bytesOf(record.data);
    expect(bytesOf(record.iv)).toHaveLength(12);
    expect(containsText(data, secret)).toBe(false);
    expect(containsText(data, 'Maria')).toBe(false);
    expect(containsText(data, 'text')).toBe(false);
    // AES-GCM output is the plaintext length plus a 16-byte tag.
    expect(data).toHaveLength(Buffer.byteLength(JSON.stringify({ text: secret })) + 16);
  });

  test('the same value encrypts differently every time', async () => {
    const dbName = uniqueDbName();
    const store = createEncryptedStore<Note>({ dbName, storeName: 'notes' });
    await store.put('a', { text: 'same' });
    await store.put('b', { text: 'same' });

    const [first, second] = (await readRaw(dbName, 'notes')) as { iv: unknown; data: unknown }[];
    expect(Buffer.from(bytesOf(first?.iv)).equals(Buffer.from(bytesOf(second?.iv)))).toBe(false);
    expect(Buffer.from(bytesOf(first?.data)).equals(Buffer.from(bytesOf(second?.data)))).toBe(false);
  });

  test('the key is AES-GCM 256 and cannot be exported', async () => {
    const dbName = uniqueDbName();
    const store = createEncryptedStore<Note>({ dbName, storeName: 'notes' });
    await store.put('a', { text: 'x' });

    const [key] = (await readRaw(dbName, '__carefully_built_keys__')) as CryptoKey[];
    expect(key).toBeDefined();
    expect(key?.extractable).toBe(false);
    expect(key?.algorithm).toMatchObject({ name: 'AES-GCM', length: 256 });
    expect([...(key?.usages ?? [])].sort()).toEqual(['decrypt', 'encrypt']);
    await expect(crypto.subtle.exportKey('raw', key as CryptoKey)).rejects.toThrow();
  });

  test('a new handle on the same database reads what an earlier one wrote', async () => {
    const dbName = uniqueDbName();
    await createEncryptedStore<Note>({ dbName, storeName: 'notes' }).put('a', { text: 'kept' });

    const reopened = createEncryptedStore<Note>({ dbName, storeName: 'notes' });
    expect(await reopened.get('a')).toEqual({ text: 'kept' });
  });

  test('two handles created together agree on one key', async () => {
    const dbName = uniqueDbName();
    const first = createEncryptedStore<Note>({ dbName, storeName: 'notes' });
    const second = createEncryptedStore<Note>({ dbName, storeName: 'notes' });

    await Promise.all([first.put('a', { text: 'from first' }), second.put('b', { text: 'from second' })]);

    expect(await first.get('b')).toEqual({ text: 'from second' });
    expect(await second.get('a')).toEqual({ text: 'from first' });
    expect(await readRaw(dbName, '__carefully_built_keys__')).toHaveLength(1);
  });

  test('getAll, count, delete and clear', async () => {
    const store = createEncryptedStore<Note>({ dbName: uniqueDbName(), storeName: 'notes' });
    expect(await store.getAll()).toEqual([]);
    expect(await store.count()).toBe(0);

    await store.put('b', { text: 'second' });
    await store.put('a', { text: 'first' });
    await store.put('c', { text: 'third' });

    expect(await store.count()).toBe(3);
    expect(await store.getAll()).toEqual([
      { id: 'a', value: { text: 'first' } },
      { id: 'b', value: { text: 'second' } },
      { id: 'c', value: { text: 'third' } },
    ]);

    await store.delete('b');
    expect(await store.get('b')).toBeUndefined();
    expect(await store.count()).toBe(2);

    await store.clear();
    expect(await store.count()).toBe(0);
    // Still usable after clear, with the same key.
    await store.put('d', { text: 'after clear' });
    expect(await store.get('d')).toEqual({ text: 'after clear' });
  });

  test('put replaces the value of an existing id', async () => {
    const store = createEncryptedStore<Note>({ dbName: uniqueDbName(), storeName: 'notes' });
    await store.put('a', { text: 'old' });
    await store.put('a', { text: 'new' });

    expect(await store.get('a')).toEqual({ text: 'new' });
    expect(await store.count()).toBe(1);
  });

  test('stores on the same database are separate and have separate keys', async () => {
    const dbName = uniqueDbName();
    const notes = createEncryptedStore<Note>({ dbName, storeName: 'notes' });
    const drafts = createEncryptedStore<Note>({ dbName, storeName: 'drafts' });

    await notes.put('a', { text: 'note' });
    await drafts.put('a', { text: 'draft' });

    expect(await notes.get('a')).toEqual({ text: 'note' });
    expect(await drafts.get('a')).toEqual({ text: 'draft' });
    expect(await readRaw(dbName, '__carefully_built_keys__')).toHaveLength(2);
  });

  test('a record moved under another id does not decrypt', async () => {
    const dbName = uniqueDbName();
    const store = createEncryptedStore<Note>({ dbName, storeName: 'notes' });
    await store.put('a', { text: 'for a' });

    const database = await openRaw(dbName);
    const transaction = database.transaction('notes', 'readwrite');
    const objectStore = transaction.objectStore('notes');
    const record = await request(objectStore.get('a'));
    await request(objectStore.put(record, 'b'));
    database.close();

    await expect(store.get('b')).rejects.toBeInstanceOf(OfflineStoreError);
    expect(await store.get('a')).toEqual({ text: 'for a' });
  });

  test('tampered data is rejected instead of returned', async () => {
    const dbName = uniqueDbName();
    const store = createEncryptedStore<Note>({ dbName, storeName: 'notes' });
    await store.put('a', { text: 'intact' });

    const database = await openRaw(dbName);
    const objectStore = database.transaction('notes', 'readwrite').objectStore('notes');
    const record = (await request(objectStore.get('a'))) as { iv: Uint8Array; data: ArrayBuffer };
    const changed = new Uint8Array(record.data.slice(0));
    changed[0] = (changed[0] ?? 0) ^ 0xff;
    await request(objectStore.put({ iv: record.iv, data: changed.buffer }, 'a'));
    database.close();

    await expect(store.get('a')).rejects.toBeInstanceOf(OfflineStoreError);
  });

  test('destroy wipes the data and the key', async () => {
    const dbName = uniqueDbName();
    const store = createEncryptedStore<Note>({ dbName, storeName: 'notes' });
    await store.put('a', { text: 'to be destroyed' });
    const [oldKey] = (await readRaw(dbName, '__carefully_built_keys__')) as CryptoKey[];

    await store.destroy();

    expect(await readRaw(dbName, 'notes')).toEqual([]);
    expect(await readRaw(dbName, '__carefully_built_keys__')).toEqual([]);
    expect(await store.count()).toBe(0);

    // Usable again, with a different key.
    await store.put('b', { text: 'fresh' });
    expect(await store.get('b')).toEqual({ text: 'fresh' });
    const [newKey] = (await readRaw(dbName, '__carefully_built_keys__')) as CryptoKey[];
    expect(newKey).toBeDefined();
    expect(newKey).not.toBe(oldKey);
  });

  test('values that are not JSON are refused', async () => {
    const store = createEncryptedStore<unknown>({ dbName: uniqueDbName(), storeName: 'notes' });
    await expect(store.put('a', undefined)).rejects.toBeInstanceOf(OfflineStoreError);
    expect(await store.count()).toBe(0);
  });
});
