# @carefully-built/import-export

Import and export of tabular data for SaaS apps.

## Includes

- `TabularImportSheet`: import from `.csv` or `.xlsx` in three steps (file, column mapping, preview), with dedupe on a key field.
- `useTabularImport`: the same state without the UI, for custom screens.
- Pure helpers: `readTabularFile`, `autoMapColumns`, `buildTabularPreview`, `buildTabularPayload`.
- `buildCsvExport` for exports.
- Older contact-specific helpers (`ContactsImportSheet`, `useContactImportState`, …), kept for existing apps.

## Generic import

The host describes its record with typed fields. Every column of the file is
matched automatically to a field by key, label or alias (case, accents and
punctuation are ignored); the user can change the mapping before the preview.

```tsx
import { TabularImportSheet, type TabularImportDefinition } from '@carefully-built/import-export';

interface ContactRecord {
  firstName: string;
  lastName?: string;
  phone: string;
  email?: string;
}

const definition: TabularImportDefinition<ContactRecord> = useMemo(
  () => ({
    fields: [
      { key: 'firstName', label: 'Nome', required: true },
      { key: 'lastName', label: 'Cognome' },
      {
        key: 'phone',
        label: 'Telefono',
        required: true,
        aliases: ['cellulare', 'numero', 'telefono cellulare'],
        normalize: (raw) => {
          const phone = normalizePhone(raw);
          return phone ? { value: phone } : { error: 'Numero non valido' };
        },
      },
      { key: 'email', label: 'Email', aliases: ['e-mail', 'posta elettronica'] },
    ],
    // One contact per phone number: repeats in the file are skipped,
    // numbers already stored become updates (or are skipped, see the switch).
    dedupeKey: 'phone',
    existing: new Map(contacts.map((contact) => [contact.phone, contact._id])),
  }),
  [contacts],
);

<TabularImportSheet
  open={isImportOpen}
  onOpenChange={setIsImportOpen}
  definition={definition}
  title="Importa contatti"
  importing={isImporting}
  onImport={async ({ creates, updates }) => {
    await importContacts({ creates, updates });
    setIsImportOpen(false);
  }}
/>;
```

### Rules

- First sheet of the file, first row = column names. CSV delimiter (`,` or `;`) is detected.
- Empty optional cells are left out of the record; an empty required cell rejects the row.
- `normalize` runs on non-empty cells only; return `{ value }` or `{ error }`. Fields without it receive the trimmed text, so give it to every non-string field.
- `existing` maps the normalized dedupe value to the id of the stored record. With `updateExisting` off (switch in the mapping step, default on) those rows are skipped instead.
- The preview shows the first 50 rows; the payload always covers the whole file.
- `.xlsx` is read with `read-excel-file`; numeric cells are kept as written, so phone numbers stored as numbers stay intact.

## Language

All copy follows `KitLocaleProvider` from `@carefully-built/ui` (`en`, `it`). The sheet title can be overridden with `title`.
