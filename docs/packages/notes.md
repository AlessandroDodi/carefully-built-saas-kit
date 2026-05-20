# @carefully-built/notes

Reusable notes cards, grids, helpers, and editor shell pieces for SaaS apps.

## Install

```bash
bun add @carefully-built/notes
```

For local development in an app inside the same parent workspace, use the packed tarball or workspace link already used by the consuming app.

## Import Paths

- `@carefully-built/notes`

## Component Usage

```tsx
import { AssociationDisplayList } from '@carefully-built/notes';

// Check the API catalog below for the component source and prop types.
// Most components are controlled shells: pass app data, handlers, and slot content from the consuming app.
```

Components in this package:

- `AssociationDisplayList`: import from `@carefully-built/notes`.
- `NoteCard`: import from `@carefully-built/notes`.
- `NotesGrid`: import from `@carefully-built/notes`.
- `NotesSheetFooter`: import from `@carefully-built/notes`.

## Hook Usage

```tsx
import { useNotesPageState } from '@carefully-built/notes';

export function Example() {
  const state = useNotesPageState({} as never);
  return null;
}
```

Hooks in this package:

- `useNotesPageState`: keep app-specific data fetching and mutations in the consuming app.
- `useNotesPageState`: keep app-specific data fetching and mutations in the consuming app.

## Helper Usage

```ts
import { AssociationDisplayList } from '@carefully-built/notes';
```

Helpers in this package:

- `AssociationDisplayList`
- `filterNotes`
- `filterNotes`
- `getNotePreview`
- `getNotePreview`
- `normalizeAssociationEntityType`
- `normalizeAssociationEntityType`
- `NoteCard`
- `NotesGrid`
- `NotesSheetFooter`

## Types And Schemas

- `EditableNote`
- `FilterNotesOptions`
- `NoteAssociation`
- `NoteAssociationOption`
- `NoteFormValuesLike`
- `NoteListItem`
- `SupportedNoteAssociationEntityType`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `AssociationDisplayList` | Component | `packages/notes/src/association-display-list.tsx` |
| `NoteCard` | Component | `packages/notes/src/note-card.tsx` |
| `NotesGrid` | Component | `packages/notes/src/notes-grid.tsx` |
| `NotesSheetFooter` | Component | `packages/notes/src/notes-sheet-footer.tsx` |
| `AssociationDisplayList` | Helper | `packages/notes/src/index.ts` |
| `filterNotes` | Helper | `packages/notes/src/index.ts` |
| `filterNotes` | Helper | `packages/notes/src/note-helpers.ts` |
| `getNotePreview` | Helper | `packages/notes/src/index.ts` |
| `getNotePreview` | Helper | `packages/notes/src/note-helpers.ts` |
| `normalizeAssociationEntityType` | Helper | `packages/notes/src/index.ts` |
| `normalizeAssociationEntityType` | Helper | `packages/notes/src/note-helpers.ts` |
| `NoteCard` | Helper | `packages/notes/src/index.ts` |
| `NotesGrid` | Helper | `packages/notes/src/index.ts` |
| `NotesSheetFooter` | Helper | `packages/notes/src/index.ts` |
| `useNotesPageState` | Hook | `packages/notes/src/index.ts` |
| `useNotesPageState` | Hook | `packages/notes/src/use-notes-page-state.ts` |
| `EditableNote` | Type | `packages/notes/src/use-notes-page-state.ts` |
| `FilterNotesOptions` | Type | `packages/notes/src/note-helpers.ts` |
| `NoteAssociation` | Type | `packages/notes/src/note-helpers.ts` |
| `NoteAssociationOption` | Type | `packages/notes/src/use-notes-page-state.ts` |
| `NoteFormValuesLike` | Type | `packages/notes/src/use-notes-page-state.ts` |
| `NoteListItem` | Type | `packages/notes/src/note-helpers.ts` |
| `SupportedNoteAssociationEntityType` | Type | `packages/notes/src/note-helpers.ts` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
