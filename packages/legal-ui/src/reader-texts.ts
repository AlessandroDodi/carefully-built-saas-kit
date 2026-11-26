import { defineKitTexts } from '@carefully-built/ui';

/** Default copy of the document reader, progress bar and version list, per kit locale. */
export const readerTexts = defineKitTexts({
  en: {
    scrollHint: 'Scroll down to read the whole text',
    reachedEnd: 'You have reached the end of the text',
    progressLabel: 'Reading progress',
    statusActive: 'Active',
    statusArchived: 'Archived',
    statusDraft: 'Draft',
    noVersions: 'No versions yet',
  },
  it: {
    scrollHint: 'Scorri per leggere tutto il testo',
    reachedEnd: 'Hai raggiunto la fine del testo',
    progressLabel: 'Avanzamento lettura',
    statusActive: 'Attiva',
    statusArchived: 'Archiviata',
    statusDraft: 'Bozza',
    noVersions: 'Nessuna versione',
  },
});
