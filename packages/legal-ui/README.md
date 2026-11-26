# Carefully Built Legal UI

Reusable legal document pieces for SaaS apps:

- `LegalDocument`: renderer for terms, privacy, and cookie-policy pages.
- `DocumentReader`, `useReadProgress`, `ReadProgressBar`: show a text that must be read to the end, and know when it was.
- `VersionList`: the versions of a document with their status.

## Install

```bash
bun add @carefully-built/legal-ui
```

## Basic Usage

```tsx
import { LegalDocument } from '@carefully-built/legal-ui';

<LegalDocument
  title="Privacy Policy"
  content={privacyPolicyText}
  logo={<Logo className="h-9" />}
  backHref="/login"
/>;
```

The consuming app owns the actual legal text. This package owns the readable document layout, heading detection, URL rendering, and standard back/logo frame.

## Styling And Theming

Use optional `className` and `classes` props for product-specific presentation. Defaults stay unchanged when omitted.

```tsx
<LegalDocument
  title="Terms of Service"
  content={termsText}
  logo={<Logo />}
  backHref="/login"
  classes={{
    container: 'max-w-3xl',
    content: 'text-sm leading-7',
    heading: 'text-lg',
    link: 'underline-offset-4',
  }}
/>;
```

Keep the legal text and route ownership in the app. Do not copy this renderer into an app just to change spacing, typography, or link styling.


## Reading A Document To The End

`DocumentReader` is a card with a header, a scrolling body and a status line that switches to a success state when the reader reaches the end of the text. With no extra props it tracks reading by itself and reports through callbacks:

```tsx
import { DocumentReader } from '@carefully-built/legal-ui';

<DocumentReader
  title="Privacy notice"
  meta="v3 · 12/03/2026"
  onReachEnd={(state) => setCanContinue(true)}
>
  {paragraphs}
</DocumentReader>;
```

When something outside the card needs the same state (a progress bar in another panel, a disabled continue button), call `useReadProgress` in the parent and hand the result to the reader. The reader then attaches the hook's refs instead of tracking on its own:

```tsx
import { DocumentReader, ReadProgressBar, useReadProgress } from '@carefully-built/legal-ui';

const scrollRef = useRef<HTMLElement>(null);
const reading = useReadProgress(scrollRef, {
  enabled: text !== undefined,
  resetKey: versionId,
  onReachEnd: (state) => saveReadEvidence(state),
});

<DocumentReader title="Privacy notice" readProgress={reading}>{text}</DocumentReader>
<ReadProgressBar value={reading.progress} />
<Button disabled={!reading.reachedEnd}>Continue</Button>
```

### `useReadProgress(scrollRef, options?)`

Returns `{ progress, reachedEnd, startedAt, reachedEndAt, readingMs, scrollRef, sentinelRef, getReadingMs, reset }`.

- `progress` goes from 0 to 1 and never decreases: scrolling back up does not lower it.
- `reachedEnd` is detected in three ways, so it holds up on real devices: the scroll position with a small `tolerance` (8px by default, for fractional pixels at non-integer zoom), an `IntersectionObserver` on a sentinel element after the text (`sentinelRef`, attached for you by `DocumentReader`), and a `ResizeObserver` that measures again when the content or the container changes size (text loaded later, rotation, font swap).
- Text that fits without scrolling counts as read immediately. For that reason pass `enabled: false` while the text is loading, otherwise the empty container is "read" before anything is shown.
- `startedAt` and `reachedEndAt` are epoch milliseconds. `readingMs` only accumulates while the page is visible (`visibilitychange`); it is refreshed on every update, and `getReadingMs()` gives the value right now.
- `onProgress(state)` fires when progress grows; `onReachEnd(state)` fires once.
- `resetKey` (for example the version id) or `reset()` starts over.

The pure functions behind it, `computeReadProgress` and `advanceReadProgress`, are exported for tests and custom scroll containers.

### Layout

The text only scrolls when the card has a bounded height, so `DocumentReader` is capped at 80% of the viewport height by default. When the parent already sets the height (a flex column, a fixed panel), pass `className="max-h-none"`. An unbounded reader would show the whole text at once and report it as read.

`classes` slots: `root`, `header`, `title`, `meta`, `body`, `content`, `footer`, `status`. Labels: `labels={{ scrollHint, reachedEnd }}`; defaults follow the kit locale (English, Italian).

### `ReadProgressBar`

`value` (0 to 1), optional `label`, `showPercentage`, `complete`. The bar and the percentage turn to the success colour at 100%; before the end it never shows more than 99%. `classes`: `root`, `header`, `label`, `percentage`, `track`, `bar`.

## Version List

```tsx
import { VersionList } from '@carefully-built/legal-ui';

<VersionList
  versions={[
    { id: 'v3', label: 'v3', description: 'Marketing consent added', status: 'active' },
    { id: 'v2', label: 'v2', description: 'First public text', status: 'archived' },
    { id: 'v4', label: 'v4', description: 'In review', status: 'draft' },
  ]}
  selectedId={selectedId}
  onSelect={(id) => setSelectedId(id)}
  note="Published versions cannot be edited."
/>;
```

- Each row shows the mono `label`, the `description`, and the status on the right: active in the success colour, archived muted, draft in the warning colour. `statusLabel` replaces the default status text for a row; `labels={{ active, archived, draft, empty }}` replaces the defaults for the list.
- With `onSelect` the rows are buttons, and the selected one carries `aria-current="true"`. Without it the list is read-only.
- `classes`: `root`, `list`, `item`, `row`, `selectedRow`, `label`, `description`, `status`, `note`, `empty`.

## Server Components

`LegalDocument` and the default texts have no client directive; the reader, the progress bar, the version list and the hook are client modules. The package is published unbundled so each file keeps its own `'use client'` line and both kinds can be imported from the same path.
