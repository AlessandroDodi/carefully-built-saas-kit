import { defineKitTexts } from '@carefully-built/ui';

/** Default copy of the sync status badge, one entry per kit locale. `{count}` is replaced. */
export const syncStatusTexts = defineKitTexts({
  en: {
    online: 'Online',
    offline: 'Offline',
    pending: 'Waiting to send',
    syncing: 'Syncing',
    pendingCount: '{count} to send',
  },
  it: {
    online: 'Online',
    offline: 'Offline',
    pending: 'In attesa di invio',
    syncing: 'Sincronizzazione',
    pendingCount: '{count} da inviare',
  },
});
