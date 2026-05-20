# Notes

Planned package: `@carefully-built/notes`.

Reusable notes UI for resource detail pages, activity logs, CRM records, and admin tools.

## Components To Build

- `NotesPanel`: full reusable notes area.
- `NotesList`: existing notes with author/date/pin/edit metadata.
- `NoteEditor`: markdown or rich-text editor.
- `NoteComposer`: create/edit composer with submit controls.
- `NoteAiButton`: optional AI assist action.

## Target Props

```tsx
<NotesPanel
  notes={notes}
  isLoading={isLoading}
  onCreate={createNote}
  onUpdate={updateNote}
  onDelete={deleteNote}
  editor={{
    mode: 'markdown',
    ai: {
      enabled: true,
      label: 'Improve',
      prompt: ({ value, context }) => `Improve this note for ${context.resourceName}: ${value}`,
      onGenerate: generateNoteSuggestion,
    },
  }}
/>;
```

## AI Boundary

- Package owns the UI, prompt callback shape, loading state, and result insertion behavior.
- Consuming app owns API keys, server calls, auth, rate limits, and final AI provider.
- The AI button should be optional and disabled by default.

## Rules

- Must work without AI.
- Must support simple markdown first.
- Should allow rich text later.
- Should work as a tab, sidebar panel, or sheet body.
