# @carefully-built/ui

Reusable React UI primitives and data-display components for Carefully Built SaaS apps.

This package is the shared UI foundation for dashboards, admin tools, multi-tenant CRUD apps, and internal SaaS workflows. It contains components that are generic enough to reuse across projects, while leaving app-specific Convex, WorkOS, and domain logic in the application or in separate packages.

## Install

```bash
bun add @carefully-built/ui
```

Until the package is published to npm, consume it from the local tarball or GitHub repo.

## Usage

```tsx
import { SmartTable, useTableSorting, type Column } from '@carefully-built/ui';
```

This package assumes your app provides Tailwind-compatible design tokens such as `bg-card`, `text-muted-foreground`, `border`, and `ring`.

## Lingua

Every user-visible string is a prop. When a prop is omitted, the default comes
from the active kit locale: English without a provider, Italian with
`locale="it"`. Wrap the app once:

```tsx
import { KitLocaleProvider } from '@carefully-built/ui';

<KitLocaleProvider locale="it">{children}</KitLocaleProvider>;
```

Packages define their copy with `defineKitTexts({ en: {...}, it: {...} })` and
read it with `useKitTexts(texts, overrides)`, where defined overrides (the
component props) win over the locale default. `useKitLocale()` returns the
active locale; `resolveKitTexts(texts, locale, overrides)` is the pure variant
for resolvers and tests.

## Styling And Theming

Components keep their default style when styling props are omitted. For app-specific theme differences, pass `className`, focused slot props such as `contentClassName`, or `classes` objects instead of copying primitives into the app.

```tsx
import { ResponsiveSheet, SaasErrorPage } from '@carefully-built/ui';

<ResponsiveSheet
  open={open}
  onOpenChange={setOpen}
  title="Edit resource"
  contentClassName="sm:max-w-xl"
  classes={{
    body: 'gap-4',
    footer: 'border-t',
  }}
/>;

<SaasErrorPage
  error={error}
  reset={reset}
  source="app-error-boundary"
  classes={{
    content: 'max-w-lg',
    title: 'text-2xl',
  }}
/>;
```

## Components

### Primitives

- `Button`: shared button variants and sizes, including icon-only buttons.
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`: compact card building blocks for repeated items and panels.
- `Input`: styled text input primitive.
- `Textarea`: styled textarea primitive.
- `Label`: accessible Radix label primitive.
- `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell`, and related table primitives.
- `Pagination`: page navigation control for list and table views.
- `Skeleton`: loading placeholder primitive.
- `Tooltip`, `TooltipProvider`, `TooltipTrigger`, `TooltipContent`: Radix tooltip wrappers.
- `DisplayDate`: consistent date display for table/list values.
- `KeyboardKeycap`, `ShortcutModifierKeycap`: small keyboard shortcut keycap UI.
- `Checkbox`, `CheckboxCard`: accessible Radix checkbox, and a whole tappable card that is one checkbox (title, optional badge and description). See [Checkbox and CheckboxCard](#checkbox-and-checkboxcard).
- `DeviceCodeInput`: segmented input for device codes, one-time codes and PINs, with paste, grouping (`XXX-XXX`) and masking. See [DeviceCodeInput](#devicecodeinput).
- `EventTimeline`: read-only, append-only log of events (audit trails, histories) with a coloured square marker per row and a mono line for timestamp and detail. See [EventTimeline](#eventtimeline).

### Overlays

- `Sheet`, `SheetContent`, `SheetHeader`, `SheetTitle`, `SheetDescription`: desktop side-sheet primitives.
- `Drawer`, `DrawerContent`, `DrawerHeader`, `DrawerTitle`, `DrawerDescription`: mobile drawer primitives.
- `ResponsiveSheet`: switches between desktop sheet and mobile drawer, with optional footer actions.
- `DesktopConfirmShortcutHint`: visual hint for the desktop confirm shortcut.
- `useDesktopConfirmShortcut`: handles Cmd/Ctrl+Enter confirmation in open sheets.
- `useDesktopShortcutModifierLabel`: resolves the platform-specific modifier label.
- `SaasErrorPage` and `SaasNotFoundPage`: default application error and 404 states for Next.js app routes.

### Search

- `SearchableSelect`: searchable single-select dropdown for compact filters and form controls.
- `getSearchableSelectPosition`: helper for positioning searchable select popovers.

### Smart Table

- `SmartTable`: responsive data table with desktop and mobile renderers.
- `SmartTableActions`: standard view/edit/delete action buttons.
- `TruncatedContent`: expandable/truncated cell content for long text.
- `useTableSorting`: sortable table state and sorting helper hook.
- `Column`, `SmartTableProps`, `PaginationConfig`, `ActionHandlers`, `ActionType`: table typing helpers.
- Component doc: [SmartTable](./docs/smart-table.md).

### Table Toolbar

- `TableToolbar`: reusable toolbar with search, filter sheet, draft/apply behavior, active filter count, and clear-all support.
- `SearchInput`: search field with leading search icon and clear button.
- `FilterDropdown`: searchable select dropdown for simple enum filters.
- `CustomTableToolbarFilter`: extension point for app-specific filters such as association pickers.
- `FilterConfig`, `FilterOption`, `TableToolbarProps`: toolbar typing helpers.
- Component doc: [TableToolbar](./docs/table-toolbar.md).

### Checkbox and CheckboxCard

```tsx
import { Checkbox, CheckboxCard, Label } from '@carefully-built/ui';

<div className="flex items-center gap-2">
  <Checkbox id="terms" checked={accepted} onCheckedChange={(value) => setAccepted(value === true)} />
  <Label htmlFor="terms">I accept the terms</Label>
</div>;

<CheckboxCard
  title="Product updates"
  description="One email a month, no more."
  badge="Optional"
  checked={updates}
  onCheckedChange={setUpdates}
/>;
```

- `Checkbox`: a Radix checkbox (`role="checkbox"`, Space toggles) with `checked`, `defaultChecked`, `onCheckedChange`, `disabled`, and `name` / `value` / `required` for forms. `checked` can also be `'indeterminate'`, drawn as a dash. It has no label of its own: pair it with a `Label` or pass `aria-label`.
- `size`: `default` is a 16px square; `lg` is a 24px square with a 44px hit area, for touch screens.
- Themed with the kit tokens: `--input` border, `--primary` fill and `--primary-foreground` tick when checked, the usual focus ring. `data-slot="checkbox"`, plus Radix's `data-state` (`checked`, `unchecked`, `indeterminate`) and `data-disabled` for styling through `className`.
- `CheckboxCard`: the whole card is the checkbox, so it is one tab stop, Space toggles it and its accessible name is the title, badge and description (or `aria-label`). The square on the left is decorative. `checked` / `onCheckedChange(checked: boolean)` control it; without `checked` it keeps its own state and starts unchecked unless `defaultChecked` is set.
- The card sets `data-checked` when checked (style it with `data-checked:` classes) and its square carries the same `data-state` / `data-disabled` as `Checkbox`.
- `classes`: `root`, `checkbox`, `content`, `header`, `title`, `badge`, `description`. `size` picks the square as in `Checkbox`.
- `getCheckboxBoxClassName(size)` returns the classes of the square, to draw the same box elsewhere; `getCheckboxDataState(checked)` returns its `data-state`.

### EventTimeline

```tsx
import { EventTimeline } from '@carefully-built/ui';

<EventTimeline
  order="desc"
  items={[
    { id: '1', title: 'Document opened', timestamp: openedAt },
    { id: '2', title: 'Signed', timestamp: signedAt, tone: 'success', meta: 'Tablet 2' },
    { id: '3', title: 'Revoked', timestamp: '12/03/2026 09:41', tone: 'danger' },
  ]}
/>;
```

- `items`: `{ id, title, meta?, timestamp?, tone?, icon? }[]`, in the order they were appended. `order="desc"` shows the newest first; the component never sorts by timestamp.
- `timestamp`: a `Date` or epoch milliseconds is formatted in the kit locale (override with `formatTimestamp`); a string is shown as given.
- `tone`: `neutral` (default), `success`, `danger`, `warning`, `info`. It colours the square marker, or the `icon` when one is passed.
- `renderMeta(item)` replaces the default rendering of `item.meta`; `emptyState` replaces the default "No events yet" text.
- `classes`: `root`, `item`, `marker`, `content`, `title`, `details`, `timestamp`, `meta`, `empty`.
- There are no edit or delete affordances by design: use it for logs that must not look editable.

### DeviceCodeInput

```tsx
import { DeviceCodeInput } from '@carefully-built/ui';

// Pairing code shown as XXX-XXX
<DeviceCodeInput groups={[3, 3]} value={code} onChange={setCode} onComplete={pairDevice} />;

// Four-digit PIN shown as dots
<DeviceCodeInput length={4} charset="numeric" mask onComplete={unlock} error={wrongPin} />;
```

- `length` (default 6) or `groups` (e.g. `[3, 3]`, which also sets the length) decide the cells; `separator` is drawn between groups.
- `value` / `onChange` are the normalized code: allowed characters only, no separators, upper-cased unless `uppercase={false}`. Without `value` the component keeps its own state (`defaultValue`).
- `onComplete(value)` fires when the last character is filled in.
- `charset`: `alphanumeric` (default) or `numeric`, which also opens the digits keyboard. `mask` shows dots and uses a password field.
- A pasted or autofilled code is cleaned of separators and spaces; a whole code replaces what was typed. Arrow keys, Home/End and Backspace move between cells.
- One real, transparent `<input autocomplete="one-time-code">` covers the cells, so on-screen keyboards, paste menus and code autofill behave as in a normal field. The `ref` points to that input.
- Cells are 48×56px by default for touch use. `classes`: `root`, `group`, `cell`, `activeCell`, `separator`, `caret`, `input`.
- Pure helpers for validation and display: `normalizeDeviceCode`, `formatDeviceCode`, `splitDeviceCode`, `resolveDeviceCodeGroups`, `pasteDeviceCode`, `filterDeviceCodeCharacters`, `getDeviceCodeInputMode`.

### Component Docs

- [SmartTable](./docs/smart-table.md)
- [TableToolbar](./docs/table-toolbar.md)
- [ResponsiveSheet](./docs/responsive-sheet.md)

### Utilities

- `cn`: Tailwind class merge helper.
- `formatDisplayDate`: date formatting utility.
- `buildSearchText`, `rankBySearch`, `fuzzyIncludes`: reusable fuzzy search helpers.
- `useMediaQuery`, `useIsMobile`: responsive media-query hooks.

## Peer Dependencies

The consuming app must provide:

- `react`
- `react-dom`
- `lucide-react`
- `radix-ui`
- `vaul`
- `class-variance-authority`
- `clsx`
- `tailwind-merge`

The consuming app also needs Tailwind CSS styles and design tokens compatible with the class names used by these components.

## Publish Checklist

Before publishing:

```bash
bun install
bun run check
cd packages/ui
npm publish --dry-run --access public
```

Then publish with:

```bash
npm publish --access public
```

## Keep This Updated

Whenever a reusable component is added, moved, renamed, or removed, update this README in the same PR/commit. Treat this file as the package catalog so future apps can quickly see what already exists before rebuilding it.
