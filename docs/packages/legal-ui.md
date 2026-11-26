# @carefully-built/legal-ui

Reusable legal document renderer, read-to-the-end document reader and version list for Carefully Built SaaS apps.

## Install

```bash
bun add @carefully-built/legal-ui
```

For local development in an app inside the same parent workspace, use the packed tarball or workspace link already used by the consuming app.

## Import Paths

- `@carefully-built/legal-ui`

## Component Usage

```tsx
import { DocumentReader } from '@carefully-built/legal-ui';

// Check the API catalog below for the component source and prop types.
// Most components are controlled shells: pass app data, handlers, and slot content from the consuming app.
```

Components in this package:

- `DocumentReader`: import from `@carefully-built/legal-ui`.
- `DocumentReader`: import from `@carefully-built/legal-ui`.
- `LegalDocument`: import from `@carefully-built/legal-ui`.
- `ReadProgressBar`: import from `@carefully-built/legal-ui`.
- `ReadProgressBar`: import from `@carefully-built/legal-ui`.
- `VersionList`: import from `@carefully-built/legal-ui`.
- `VersionList`: import from `@carefully-built/legal-ui`.

## Hook Usage

```tsx
import { useReadProgress } from '@carefully-built/legal-ui';

export function Example() {
  const state = useReadProgress({} as never);
  return null;
}
```

Hooks in this package:

- `useReadProgress`: keep app-specific data fetching and mutations in the consuming app.
- `useReadProgress`: keep app-specific data fetching and mutations in the consuming app.

## Helper Usage

```ts
import { advanceReadProgress } from '@carefully-built/legal-ui';
```

Helpers in this package:

- `advanceReadProgress`
- `advanceReadProgress`
- `computeReadProgress`
- `computeReadProgress`
- `DEFAULT_READ_END_TOLERANCE`
- `privacyPolicyText`
- `privacyPolicyText`
- `readerTexts`
- `termsAndConditionsText`
- `termsAndConditionsText`

## Types And Schemas

- `DocumentReaderClassNames`
- `DocumentReaderLabels`
- `DocumentReaderProps`
- `DocumentVersion`
- `DocumentVersionStatus`
- `initialReadProgressState`
- `initialReadProgressState`
- `LegalDocumentClassNames`
- `LegalDocumentProps`
- `ReadProgressBarClassNames`
- `ReadProgressBarProps`
- `ReadProgressMeasurement`
- `ReadProgressState`
- `UseReadProgressOptions`
- `UseReadProgressResult`
- `VersionListClassNames`
- `VersionListLabels`
- `VersionListProps`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `DocumentReader` | Component | `packages/legal-ui/src/document-reader.tsx` |
| `DocumentReader` | Component | `packages/legal-ui/src/index.tsx` |
| `LegalDocument` | Component | `packages/legal-ui/src/index.tsx` |
| `ReadProgressBar` | Component | `packages/legal-ui/src/index.tsx` |
| `ReadProgressBar` | Component | `packages/legal-ui/src/read-progress-bar.tsx` |
| `VersionList` | Component | `packages/legal-ui/src/index.tsx` |
| `VersionList` | Component | `packages/legal-ui/src/version-list.tsx` |
| `advanceReadProgress` | Helper | `packages/legal-ui/src/index.tsx` |
| `advanceReadProgress` | Helper | `packages/legal-ui/src/read-progress.ts` |
| `computeReadProgress` | Helper | `packages/legal-ui/src/index.tsx` |
| `computeReadProgress` | Helper | `packages/legal-ui/src/read-progress.ts` |
| `DEFAULT_READ_END_TOLERANCE` | Helper | `packages/legal-ui/src/read-progress.ts` |
| `privacyPolicyText` | Helper | `packages/legal-ui/src/index.tsx` |
| `privacyPolicyText` | Helper | `packages/legal-ui/src/legal-texts.ts` |
| `readerTexts` | Helper | `packages/legal-ui/src/reader-texts.ts` |
| `termsAndConditionsText` | Helper | `packages/legal-ui/src/index.tsx` |
| `termsAndConditionsText` | Helper | `packages/legal-ui/src/legal-texts.ts` |
| `useReadProgress` | Hook | `packages/legal-ui/src/index.tsx` |
| `useReadProgress` | Hook | `packages/legal-ui/src/use-read-progress.ts` |
| `DocumentReaderClassNames` | Type | `packages/legal-ui/src/document-reader.tsx` |
| `DocumentReaderLabels` | Type | `packages/legal-ui/src/document-reader.tsx` |
| `DocumentReaderProps` | Type | `packages/legal-ui/src/document-reader.tsx` |
| `DocumentVersion` | Type | `packages/legal-ui/src/version-list.tsx` |
| `DocumentVersionStatus` | Type | `packages/legal-ui/src/version-list.tsx` |
| `initialReadProgressState` | Type | `packages/legal-ui/src/index.tsx` |
| `initialReadProgressState` | Type | `packages/legal-ui/src/read-progress.ts` |
| `LegalDocumentClassNames` | Type | `packages/legal-ui/src/index.tsx` |
| `LegalDocumentProps` | Type | `packages/legal-ui/src/index.tsx` |
| `ReadProgressBarClassNames` | Type | `packages/legal-ui/src/read-progress-bar.tsx` |
| `ReadProgressBarProps` | Type | `packages/legal-ui/src/read-progress-bar.tsx` |
| `ReadProgressMeasurement` | Type | `packages/legal-ui/src/read-progress.ts` |
| `ReadProgressState` | Type | `packages/legal-ui/src/read-progress.ts` |
| `UseReadProgressOptions` | Type | `packages/legal-ui/src/use-read-progress.ts` |
| `UseReadProgressResult` | Type | `packages/legal-ui/src/use-read-progress.ts` |
| `VersionListClassNames` | Type | `packages/legal-ui/src/version-list.tsx` |
| `VersionListLabels` | Type | `packages/legal-ui/src/version-list.tsx` |
| `VersionListProps` | Type | `packages/legal-ui/src/version-list.tsx` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
