# @carefully-built/notes

Reusable notes building blocks for Carefully Built SaaS apps.

## Includes

- `NoteCard` for rich-text note previews with association chips.
- `NotesGrid` for loading, empty, no-results, and responsive card layouts.
- `NotesSheetFooter` for edit/archive sheet actions.
- `filterNotes`, `getNotePreview`, and association normalization helpers.

Keep API calls and app-specific routing in the consuming app. Pass `getAssociationHref` when the default dashboard routes do not match your app.
