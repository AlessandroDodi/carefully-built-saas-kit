# @carefully-built/import-export

Reusable tabular import/export sheets, CSV parsing, preview rows, and contact import examples for SaaS apps.

## Install

```bash
bun add @carefully-built/import-export
```

For local development in an app inside the same parent workspace, use the packed tarball or workspace link already used by the consuming app.

## Import Paths

- `@carefully-built/import-export`

## Component Usage

```tsx
import { ContactsImportSheet } from '@carefully-built/import-export';

// Check the API catalog below for the component source and prop types.
// Most components are controlled shells: pass app data, handlers, and slot content from the consuming app.
```

Components in this package:

- `ContactsImportSheet`: import from `@carefully-built/import-export`.
- `EntityImportSheet`: import from `@carefully-built/import-export`.

## Hook Usage

```tsx
import { useContactImportState } from '@carefully-built/import-export';

export function Example() {
  const state = useContactImportState({} as never);
  return null;
}
```

Hooks in this package:

- `useContactImportState`: keep app-specific data fetching and mutations in the consuming app.

## Helper Usage

```ts
import { buildContactImportCsvTemplate } from '@carefully-built/import-export';
```

Helpers in this package:

- `buildContactImportCsvTemplate`
- `buildContactImportMutationPayload`
- `buildContactImportPreview`
- `buildCsvExport`
- `CONTACT_IMPORT_HEADERS`
- `normalizeImportedContactRow`
- `parseImportedContactRow`
- `parseTabularImportRows`
- `summarizeContactImportPreview`

## Types And Schemas

- `ContactImportPreviewResult`
- `ContactImportPreviewRow`
- `ContactImportPreviewSummary`
- `ContactImportState`
- `ContactImportSummary`
- `ContactsImportSheetProps`
- `CsvExportColumn`
- `ImportedContactStatus`
- `ImportPreviewRow`
- `NormalizedImportedContactRow`
- `ParsedTabularFile`
- `ParsedTabularImportRow`
- `TabularImportAction`
- `TabularImportError`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `ContactsImportSheet` | Component | `packages/imports/src/contacts/contact-import-ui.tsx` |
| `EntityImportSheet` | Component | `packages/imports/src/entity-import-sheet.tsx` |
| `buildContactImportCsvTemplate` | Helper | `packages/imports/src/contacts/contact-import-template.ts` |
| `buildContactImportMutationPayload` | Helper | `packages/imports/src/contacts/contact-import-ui.tsx` |
| `buildContactImportPreview` | Helper | `packages/imports/src/contacts/build-contact-import-preview.ts` |
| `buildCsvExport` | Helper | `packages/imports/src/export-csv.ts` |
| `CONTACT_IMPORT_HEADERS` | Helper | `packages/imports/src/contacts/contact-import-schema.ts` |
| `normalizeImportedContactRow` | Helper | `packages/imports/src/contacts/contact-import-schema.ts` |
| `parseImportedContactRow` | Helper | `packages/imports/src/contacts/contact-import-schema.ts` |
| `parseTabularImportRows` | Helper | `packages/imports/src/parse-tabular-import-file.ts` |
| `summarizeContactImportPreview` | Helper | `packages/imports/src/contacts/contact-import-ui.tsx` |
| `useContactImportState` | Hook | `packages/imports/src/use-contact-import-state.ts` |
| `ContactImportPreviewResult` | Type | `packages/imports/src/contacts/build-contact-import-preview.ts` |
| `ContactImportPreviewRow` | Type | `packages/imports/src/contacts/contact-import-ui.tsx` |
| `ContactImportPreviewSummary` | Type | `packages/imports/src/use-contact-import-state.ts` |
| `ContactImportState` | Type | `packages/imports/src/use-contact-import-state.ts` |
| `ContactImportSummary` | Type | `packages/imports/src/contacts/contact-import-ui.tsx` |
| `ContactsImportSheetProps` | Type | `packages/imports/src/contacts/contact-import-ui.tsx` |
| `CsvExportColumn` | Type | `packages/imports/src/export-csv.ts` |
| `ImportedContactStatus` | Type | `packages/imports/src/contacts/contact-import-schema.ts` |
| `ImportPreviewRow` | Type | `packages/imports/src/import-types.ts` |
| `NormalizedImportedContactRow` | Type | `packages/imports/src/contacts/contact-import-schema.ts` |
| `ParsedTabularFile` | Type | `packages/imports/src/parse-tabular-import-file.ts` |
| `ParsedTabularImportRow` | Type | `packages/imports/src/import-types.ts` |
| `TabularImportAction` | Type | `packages/imports/src/import-types.ts` |
| `TabularImportError` | Type | `packages/imports/src/import-types.ts` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
