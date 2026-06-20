# @carefully-built/files

Reusable file and document UI primitives, previews, filters, and association helpers for SaaS apps.

## Install

```bash
bun add @carefully-built/files
```

For local development in an app inside the same parent workspace, use the packed tarball or workspace link already used by the consuming app.

## Import Paths

- `@carefully-built/files`
- `@carefully-built/files/convex`

## Component Usage

```tsx
import { DocumentCard } from '@carefully-built/files';

// Check the API catalog below for the component source and prop types.
// Most components are controlled shells: pass app data, handlers, and slot content from the consuming app.
```

Components in this package:

- `DocumentCard`: import from `@carefully-built/files`.
- `DocumentCardGrid`: import from `@carefully-built/files`.
- `DocumentFormShell`: import from `@carefully-built/files`.
- `DocumentSheetBase`: import from `@carefully-built/files`.
- `FileCardSkeleton`: import from `@carefully-built/files`.
- `FileUploadSheet`: import from `@carefully-built/files`.

## Helper Usage

```ts
import { buildDocumentListItems } from '@carefully-built/files';
```

Helpers in this package:

- `buildDocumentListItems`
- `buildPendingPublicUploadUrl`
- `buildPublicUploadRequestResult`
- `createDocumentMutationSet`
- `createFileMutationSet`
- `generatePublicUploadToken`
- `getPublicUploadFileDownload`
- `listDocumentFiles`
- `listPublicDocumentFiles`
- `normalizeAssociationInput`
- `normalizeOptionalString`
- `shouldBackfillLegacyFile`
- `buildDocumentAssociationSummary`
- `DOCUMENT_CARD_GRID_CLASS`
- `filterDocuments`
- `formatFileSize`
- `isPreviewable`

## Types And Schemas

- `documentFormSchema`
- `buildDocumentAssociationValue`
- `DocumentAssociationInput`
- `DocumentAssociationOption`
- `DocumentAssociationSummaryItem`
- `DocumentAssociationValueItem`
- `DocumentCardAssociationItem`
- `DocumentCardItem`
- `DocumentFilterOptions`
- `DocumentFormValues`
- `DocumentListItemBase`
- `DocumentSheetAssociationOption`
- `DocumentSheetBaseProps`
- `DocumentSheetDocument`
- `mapAssociationValuesToDocumentAssociations`
- `mapAssociationValuesToDocumentPayload`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `DocumentCard` | Component | `packages/files/src/document-card.tsx` |
| `DocumentCardGrid` | Component | `packages/files/src/document-card-grid.tsx` |
| `DocumentFormShell` | Component | `packages/files/src/document-form-shell.tsx` |
| `DocumentSheetBase` | Component | `packages/files/src/document-sheet.tsx` |
| `FileCardSkeleton` | Component | `packages/files/src/file-card-skeleton.tsx` |
| `FileUploadSheet` | Component | `packages/files/src/file-upload-sheet.tsx` |
| `buildDocumentListItems` | Convex helper | `packages/files/src/convex.ts` |
| `buildPendingPublicUploadUrl` | Convex helper | `packages/files/src/convex.ts` |
| `buildPublicUploadRequestResult` | Convex helper | `packages/files/src/convex.ts` |
| `createDocumentMutationSet` | Convex helper | `packages/files/src/convex.ts` |
| `createFileMutationSet` | Convex helper | `packages/files/src/convex.ts` |
| `generatePublicUploadToken` | Convex helper | `packages/files/src/convex.ts` |
| `getPublicUploadFileDownload` | Convex helper | `packages/files/src/convex.ts` |
| `listDocumentFiles` | Convex helper | `packages/files/src/convex.ts` |
| `listPublicDocumentFiles` | Convex helper | `packages/files/src/convex.ts` |
| `normalizeAssociationInput` | Convex helper | `packages/files/src/convex.ts` |
| `normalizeOptionalString` | Convex helper | `packages/files/src/convex.ts` |
| `shouldBackfillLegacyFile` | Convex helper | `packages/files/src/convex.ts` |
| `buildDocumentAssociationSummary` | Helper | `packages/files/src/document-helpers.ts` |
| `DOCUMENT_CARD_GRID_CLASS` | Helper | `packages/files/src/document-card-grid.tsx` |
| `filterDocuments` | Helper | `packages/files/src/document-helpers.ts` |
| `formatFileSize` | Helper | `packages/files/src/file-utils.ts` |
| `isPreviewable` | Helper | `packages/files/src/file-utils.ts` |
| `documentFormSchema` | Schema | `packages/files/src/document-form-shell.tsx` |
| `buildDocumentAssociationValue` | Type | `packages/files/src/document-helpers.ts` |
| `DocumentAssociationInput` | Type | `packages/files/src/convex.ts` |
| `DocumentAssociationOption` | Type | `packages/files/src/document-helpers.ts` |
| `DocumentAssociationSummaryItem` | Type | `packages/files/src/document-helpers.ts` |
| `DocumentAssociationValueItem` | Type | `packages/files/src/document-helpers.ts` |
| `DocumentCardAssociationItem` | Type | `packages/files/src/document-card.tsx` |
| `DocumentCardItem` | Type | `packages/files/src/document-card.tsx` |
| `DocumentFilterOptions` | Type | `packages/files/src/document-helpers.ts` |
| `DocumentFormValues` | Type | `packages/files/src/document-form-shell.tsx` |
| `DocumentListItemBase` | Type | `packages/files/src/document-helpers.ts` |
| `DocumentSheetAssociationOption` | Type | `packages/files/src/document-sheet.tsx` |
| `DocumentSheetBaseProps` | Type | `packages/files/src/document-sheet.tsx` |
| `DocumentSheetDocument` | Type | `packages/files/src/document-sheet.tsx` |
| `mapAssociationValuesToDocumentAssociations` | Type | `packages/files/src/document-helpers.ts` |
| `mapAssociationValuesToDocumentPayload` | Type | `packages/files/src/document-helpers.ts` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
