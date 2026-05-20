# @carefully-built/rich-text

Reusable rich text editor, renderer, AI action affordances, and serialization helpers for SaaS apps.

## Install

```bash
bun add @carefully-built/rich-text
```

For local development in an app inside the same parent workspace, use the packed tarball or workspace link already used by the consuming app.

## Import Paths

- `@carefully-built/rich-text`

## Component Usage

```tsx
import { AIActionButton } from '@carefully-built/rich-text';

// Check the API catalog below for the component source and prop types.
// Most components are controlled shells: pass app data, handlers, and slot content from the consuming app.
```

Components in this package:

- `AIActionButton`: import from `@carefully-built/rich-text`.
- `RichTextEditor`: import from `@carefully-built/rich-text`.
- `RichTextRenderer`: import from `@carefully-built/rich-text`.

## Helper Usage

```ts
import { AIActionButton } from '@carefully-built/rich-text';
```

Helpers in this package:

- `AIActionButton`
- `createRichTextDocumentFromText`
- `createRichTextDocumentFromText`
- `getPlainTextFromRichText`
- `getPlainTextFromRichText`
- `hasRichTextContent`
- `hasRichTextContent`
- `isRichTextDocument`
- `isRichTextDocument`
- `parseRichTextContent`
- `parseRichTextContent`
- `parseSerializedRichTextDocument`
- `parseSerializedRichTextDocument`
- `RichTextEditor`
- `RichTextRenderer`
- `stringifyRichTextContent`
- `stringifyRichTextContent`

## Types And Schemas

- `AIActionButtonProps`
- `RichTextEditorProps`
- `RichTextRendererProps`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `AIActionButton` | Component | `packages/rich-text/src/ai-action-button.tsx` |
| `RichTextEditor` | Component | `packages/rich-text/src/rich-text-editor.tsx` |
| `RichTextRenderer` | Component | `packages/rich-text/src/rich-text-renderer.tsx` |
| `AIActionButton` | Helper | `packages/rich-text/src/index.ts` |
| `createRichTextDocumentFromText` | Helper | `packages/rich-text/src/index.ts` |
| `createRichTextDocumentFromText` | Helper | `packages/rich-text/src/rich-text-utils.ts` |
| `getPlainTextFromRichText` | Helper | `packages/rich-text/src/index.ts` |
| `getPlainTextFromRichText` | Helper | `packages/rich-text/src/rich-text-utils.ts` |
| `hasRichTextContent` | Helper | `packages/rich-text/src/index.ts` |
| `hasRichTextContent` | Helper | `packages/rich-text/src/rich-text-utils.ts` |
| `isRichTextDocument` | Helper | `packages/rich-text/src/index.ts` |
| `isRichTextDocument` | Helper | `packages/rich-text/src/rich-text-utils.ts` |
| `parseRichTextContent` | Helper | `packages/rich-text/src/index.ts` |
| `parseRichTextContent` | Helper | `packages/rich-text/src/rich-text-utils.ts` |
| `parseSerializedRichTextDocument` | Helper | `packages/rich-text/src/index.ts` |
| `parseSerializedRichTextDocument` | Helper | `packages/rich-text/src/rich-text-utils.ts` |
| `RichTextEditor` | Helper | `packages/rich-text/src/index.ts` |
| `RichTextRenderer` | Helper | `packages/rich-text/src/index.ts` |
| `stringifyRichTextContent` | Helper | `packages/rich-text/src/index.ts` |
| `stringifyRichTextContent` | Helper | `packages/rich-text/src/rich-text-utils.ts` |
| `AIActionButtonProps` | Type | `packages/rich-text/src/ai-action-button.tsx` |
| `RichTextEditorProps` | Type | `packages/rich-text/src/rich-text-editor.tsx` |
| `RichTextRendererProps` | Type | `packages/rich-text/src/rich-text-renderer.tsx` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
