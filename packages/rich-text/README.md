# @carefully-built/rich-text

Reusable rich-text primitives for Carefully Built SaaS apps.

## What It Exports

- `RichTextEditor` - TipTap editor with formatting, links, tables, and optional AI improve action.
- `RichTextRenderer` - read-only renderer for serialized TipTap JSON.
- `AIActionButton` - gradient action button for AI-assisted controls.
- Rich-text helpers - parse, stringify, plain-text extraction, validation, and document creation.

## Basic Usage

```tsx
import { RichTextEditor } from '@carefully-built/rich-text';

<RichTextEditor
  value={notes}
  onChange={setNotes}
  label="Notes"
  placeholder="Write a note..."
/>
```

## With AI Improve

```tsx
<RichTextEditor
  value={body}
  onChange={setBody}
  improveText={async (serializedDocument) => {
    return await improveTextWithYourBackend(serializedDocument);
  }}
  onImproveError={() => {
    toast.error('Could not improve the text');
  }}
/>
```

The package does not own API keys or auth. Apps pass the improve function so the same UI works with Convex, Next actions, REST, or no AI at all.
