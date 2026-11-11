import { defineKitTexts } from '@carefully-built/ui';

import type { TabularImportAction } from '../import-types';
import type { TabularFileErrorCode } from './read-tabular-file';
import type { TabularSkipReason } from './tabular-import-types';

interface TabularImportTexts {
  readonly title: string;
  readonly dropTitle: string;
  readonly dropHelper: string;
  readonly templateLabel: string;
  readonly templateHelper: string;
  readonly templateFileName: string;
  readonly requiredMark: string;
  readonly mappingDescription: string;
  readonly columnHeader: string;
  readonly fieldHeader: string;
  readonly sampleHeader: string;
  readonly ignoreOption: string;
  readonly missingRequired: (fieldLabels: string) => string;
  readonly updateExistingLabel: string;
  readonly updateExistingDescription: string;
  readonly continueLabel: string;
  readonly backLabel: string;
  readonly cancelLabel: string;
  readonly importLabel: (rowCount: number) => string;
  readonly rowHeader: string;
  readonly statusHeader: string;
  readonly previewLimit: (shown: number, total: number) => string;
  readonly required: (fieldLabel: string) => string;
  readonly actions: Readonly<Record<TabularImportAction, string>>;
  readonly summary: Readonly<Record<TabularImportAction, string>>;
  readonly skipReasons: Readonly<Record<TabularSkipReason, string>>;
  readonly fileErrors: Readonly<Record<TabularFileErrorCode, string>>;
}

export const tabularImportTexts = defineKitTexts<TabularImportTexts>({
  en: {
    title: 'Import from file',
    dropTitle: 'Drop a CSV or Excel file here',
    dropHelper: 'The first row must contain the column names. Formats: .csv, .xlsx.',
    templateLabel: 'Download the Excel template',
    templateHelper: 'Fill it in and drop it here: the columns are matched automatically.',
    templateFileName: 'import-template.xlsx',
    requiredMark: '(required)',
    mappingDescription: 'Match each column of the file to a field. Unmatched columns are ignored.',
    columnHeader: 'File column',
    fieldHeader: 'Field',
    sampleHeader: 'Example',
    ignoreOption: 'Ignore',
    missingRequired: (fieldLabels) => `Also match: ${fieldLabels}`,
    updateExistingLabel: 'Update existing records',
    updateExistingDescription: 'When off, rows that already exist are skipped.',
    continueLabel: 'Continue',
    backLabel: 'Back',
    cancelLabel: 'Cancel',
    importLabel: (rowCount) => (rowCount === 1 ? 'Import 1 row' : `Import ${String(rowCount)} rows`),
    rowHeader: 'Row',
    statusHeader: 'Status',
    previewLimit: (shown, total) => `Showing the first ${String(shown)} of ${String(total)} rows.`,
    required: (fieldLabel) => `${fieldLabel} is missing`,
    actions: { create: 'New', update: 'Update', skip: 'Skipped', reject: 'Error' },
    summary: { create: 'New', update: 'To update', skip: 'Skipped', reject: 'With errors' },
    skipReasons: { 'duplicate-in-file': 'Repeated in the file', existing: 'Already exists' },
    fileErrors: {
      'unsupported-format': 'Unsupported format: use a .csv or .xlsx file.',
      empty: 'The file has no rows to import.',
      unreadable: 'The file could not be read.',
    },
  },
  it: {
    title: 'Importa da file',
    dropTitle: 'Trascina qui un file CSV o Excel',
    dropHelper: 'La prima riga deve contenere i nomi delle colonne. Formati: .csv, .xlsx.',
    templateLabel: 'Scarica il modello Excel',
    templateHelper: 'Compilalo e trascinalo qui: le colonne vengono riconosciute da sole.',
    templateFileName: 'modello-importazione.xlsx',
    requiredMark: '(obbligatorio)',
    mappingDescription: 'Abbina ogni colonna del file a un campo. Le colonne non abbinate vengono ignorate.',
    columnHeader: 'Colonna del file',
    fieldHeader: 'Campo',
    sampleHeader: 'Esempio',
    ignoreOption: 'Ignora',
    missingRequired: (fieldLabels) => `Abbina anche: ${fieldLabels}`,
    updateExistingLabel: 'Aggiorna i record già presenti',
    updateExistingDescription: 'Se disattivato, le righe già presenti vengono saltate.',
    continueLabel: 'Continua',
    backLabel: 'Indietro',
    cancelLabel: 'Annulla',
    importLabel: (rowCount) => (rowCount === 1 ? 'Importa 1 riga' : `Importa ${String(rowCount)} righe`),
    rowHeader: 'Riga',
    statusHeader: 'Esito',
    previewLimit: (shown, total) => `Anteprima delle prime ${String(shown)} righe su ${String(total)}.`,
    required: (fieldLabel) => `Manca ${fieldLabel.toLowerCase()}`,
    actions: { create: 'Nuovo', update: 'Aggiorna', skip: 'Saltato', reject: 'Errore' },
    summary: { create: 'Nuovi', update: 'Da aggiornare', skip: 'Saltati', reject: 'Con errori' },
    skipReasons: { 'duplicate-in-file': 'Ripetuto nel file', existing: 'Già presente' },
    fileErrors: {
      'unsupported-format': 'Formato non supportato: usa un file .csv o .xlsx.',
      empty: 'Il file non contiene righe da importare.',
      unreadable: 'Non è stato possibile leggere il file.',
    },
  },
});

export type { TabularImportTexts };
