export type SyncStatus = 'online' | 'offline' | 'pending' | 'syncing';

/**
 * One status for a badge, from the connection and a queue snapshot: offline
 * wins, then sending, then items waiting to be sent, otherwise online.
 */
export function deriveSyncStatus(input: {
  readonly online: boolean;
  readonly pending?: number;
  readonly sending?: number;
}): SyncStatus {
  if (!input.online) return 'offline';
  if ((input.sending ?? 0) > 0) return 'syncing';
  if ((input.pending ?? 0) > 0) return 'pending';
  return 'online';
}
