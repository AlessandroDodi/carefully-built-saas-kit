# @carefully-built/import-export

Reusable tabular import/export for SaaS apps: CSV and Excel import with column mapping, dedupe and preview, CSV export.

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
- `MappingRow`: import from `@carefully-built/import-export`.
- `TabularImportBody`: import from `@carefully-built/import-export`.
- `TabularImportSheet`: import from `@carefully-built/import-export`.
- `TabularMappingStep`: import from `@carefully-built/import-export`.
- `TabularPreviewStep`: import from `@carefully-built/import-export`.

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
- `useTabularImport`: keep app-specific data fetching and mutations in the consuming app.

## Helper Usage

```ts
import { assignColumn } from '@carefully-built/import-export';
```

Helpers in this package:

- `assignColumn`
- `autoMapColumns`
- `buildContactImportCsvTemplate`
- `buildContactImportMutationPayload`
- `buildContactImportPreview`
- `buildCsvExport`
- `buildTabularPayload`
- `buildTabularPreview`
- `CONTACT_IMPORT_HEADERS`
- `downloadTabularTemplate`
- `findUnmappedRequiredFields`
- `normalizeHeader`
- `normalizeImportedContactRow`
- `parseImportedContactRow`
- `parseTabularImportRows`
- `readTabularFile`
- `summarizeContactImportPreview`
- `summarizeTabularPreview`
- `TabularFileError`
- `tabularImportTexts`

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
- `MappingRowProps`
- `NormalizedImportedContactRow`
- `ParsedTabularFile`
- `ParsedTabularImportRow`
- `TabularFileContent`
- `TabularFileErrorCode`
- `TabularImportAction`
- `TabularImportDefinition`
- `TabularImportError`
- `TabularImportField`
- `TabularImportFieldFor`
- `TabularImportMapping`
- `TabularImportPayload`
- `TabularImportPreviewRow`
- `TabularImportSheetProps`
- `TabularImportState`
- `TabularImportSummary`
- `TabularNormalizeResult`
- `TabularPreviewMessages`
- `TabularSkipReason`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `ContactsImportSheet` | Component | `packages/imports/src/contacts/contact-import-ui.tsx` |
| `EntityImportSheet` | Component | `packages/imports/src/entity-import-sheet.tsx` |
| `MappingRow` | Component | `packages/imports/src/tabular/tabular-mapping-row.tsx` |
| `TabularImportBody` | Component | `packages/imports/src/tabular/tabular-import-body.tsx` |
| `TabularImportSheet` | Component | `packages/imports/src/tabular/tabular-import-sheet.tsx` |
| `TabularMappingStep` | Component | `packages/imports/src/tabular/tabular-mapping-step.tsx` |
| `TabularPreviewStep` | Component | `packages/imports/src/tabular/tabular-preview-step.tsx` |
| `assignColumn` | Helper | `packages/imports/src/tabular/match-columns.ts` |
| `autoMapColumns` | Helper | `packages/imports/src/tabular/match-columns.ts` |
| `buildContactImportCsvTemplate` | Helper | `packages/imports/src/contacts/contact-import-template.ts` |
| `buildContactImportMutationPayload` | Helper | `packages/imports/src/contacts/contact-import-ui.tsx` |
| `buildContactImportPreview` | Helper | `packages/imports/src/contacts/build-contact-import-preview.ts` |
| `buildCsvExport` | Helper | `packages/imports/src/export-csv.ts` |
| `buildTabularPayload` | Helper | `packages/imports/src/tabular/build-tabular-preview.ts` |
| `buildTabularPreview` | Helper | `packages/imports/src/tabular/build-tabular-preview.ts` |
| `CONTACT_IMPORT_HEADERS` | Helper | `packages/imports/src/contacts/contact-import-schema.ts` |
| `downloadTabularTemplate` | Helper | `packages/imports/src/tabular/download-tabular-template.ts` |
| `findUnmappedRequiredFields` | Helper | `packages/imports/src/tabular/match-columns.ts` |
| `normalizeHeader` | Helper | `packages/imports/src/tabular/match-columns.ts` |
| `normalizeImportedContactRow` | Helper | `packages/imports/src/contacts/contact-import-schema.ts` |
| `parseImportedContactRow` | Helper | `packages/imports/src/contacts/contact-import-schema.ts` |
| `parseTabularImportRows` | Helper | `packages/imports/src/parse-tabular-import-file.ts` |
| `readTabularFile` | Helper | `packages/imports/src/tabular/read-tabular-file.ts` |
| `summarizeContactImportPreview` | Helper | `packages/imports/src/contacts/contact-import-ui.tsx` |
| `summarizeTabularPreview` | Helper | `packages/imports/src/tabular/build-tabular-preview.ts` |
| `TabularFileError` | Helper | `packages/imports/src/tabular/read-tabular-file.ts` |
| `tabularImportTexts` | Helper | `packages/imports/src/tabular/tabular-import-texts.ts` |
| `useContactImportState` | Hook | `packages/imports/src/use-contact-import-state.ts` |
| `useTabularImport` | Hook | `packages/imports/src/tabular/use-tabular-import.ts` |
| `ContactImportPreviewResult` | Type | `packages/imports/src/contacts/build-contact-import-preview.ts` |
| `ContactImportPreviewRow` | Type | `packages/imports/src/contacts/contact-import-ui.tsx` |
| `ContactImportPreviewSummary` | Type | `packages/imports/src/use-contact-import-state.ts` |
| `ContactImportState` | Type | `packages/imports/src/use-contact-import-state.ts` |
| `ContactImportSummary` | Type | `packages/imports/src/contacts/contact-import-ui.tsx` |
| `ContactsImportSheetProps` | Type | `packages/imports/src/contacts/contact-import-ui.tsx` |
| `CsvExportColumn` | Type | `packages/imports/src/export-csv.ts` |
| `ImportedContactStatus` | Type | `packages/imports/src/contacts/contact-import-schema.ts` |
| `ImportPreviewRow` | Type | `packages/imports/src/import-types.ts` |
| `MappingRowProps` | Type | `packages/imports/src/tabular/tabular-mapping-row.tsx` |
| `NormalizedImportedContactRow` | Type | `packages/imports/src/contacts/contact-import-schema.ts` |
| `ParsedTabularFile` | Type | `packages/imports/src/parse-tabular-import-file.ts` |
| `ParsedTabularImportRow` | Type | `packages/imports/src/import-types.ts` |
| `TabularFileContent` | Type | `packages/imports/src/tabular/tabular-import-types.ts` |
| `TabularFileErrorCode` | Type | `packages/imports/src/tabular/read-tabular-file.ts` |
| `TabularImportAction` | Type | `packages/imports/src/import-types.ts` |
| `TabularImportDefinition` | Type | `packages/imports/src/tabular/tabular-import-types.ts` |
| `TabularImportError` | Type | `packages/imports/src/import-types.ts` |
| `TabularImportField` | Type | `packages/imports/src/tabular/tabular-import-types.ts` |
| `TabularImportFieldFor` | Type | `packages/imports/src/tabular/tabular-import-types.ts` |
| `TabularImportMapping` | Type | `packages/imports/src/tabular/tabular-import-types.ts` |
| `TabularImportPayload` | Type | `packages/imports/src/tabular/tabular-import-types.ts` |
| `TabularImportPreviewRow` | Type | `packages/imports/src/tabular/tabular-import-types.ts` |
| `TabularImportSheetProps` | Type | `packages/imports/src/tabular/tabular-import-sheet.tsx` |
| `TabularImportState` | Type | `packages/imports/src/tabular/tabular-import-types.ts` |
| `TabularImportSummary` | Type | `packages/imports/src/tabular/tabular-import-types.ts` |
| `TabularNormalizeResult` | Type | `packages/imports/src/tabular/tabular-import-types.ts` |
| `TabularPreviewMessages` | Type | `packages/imports/src/tabular/build-tabular-preview.ts` |
| `TabularSkipReason` | Type | `packages/imports/src/tabular/tabular-import-types.ts` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
