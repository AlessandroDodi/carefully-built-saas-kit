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

## Components

### Primitives

- `Button`: shared button variants and sizes, including icon-only buttons.
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`: compact card building blocks for repeated items and panels.
- `Input`: styled text input primitive.
- `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell`, and related table primitives.
- `Pagination`: page navigation control for list and table views.
- `Skeleton`: loading placeholder primitive.
- `Tooltip`, `TooltipProvider`, `TooltipTrigger`, `TooltipContent`: Radix tooltip wrappers.
- `DisplayDate`: consistent date display for table/list values.
- `KeyboardKeycap`, `ShortcutModifierKeycap`: small keyboard shortcut keycap UI.

### Overlays

- `Sheet`, `SheetContent`, `SheetHeader`, `SheetTitle`, `SheetDescription`: desktop side-sheet primitives.
- `Drawer`, `DrawerContent`, `DrawerHeader`, `DrawerTitle`, `DrawerDescription`: mobile drawer primitives.
- `ResponsiveSheet`: switches between desktop sheet and mobile drawer, with optional footer actions.
- `DesktopConfirmShortcutHint`: visual hint for the desktop confirm shortcut.
- `useDesktopConfirmShortcut`: handles Cmd/Ctrl+Enter confirmation in open sheets.
- `useDesktopShortcutModifierLabel`: resolves the platform-specific modifier label.

### Search

- `SearchableSelect`: searchable single-select dropdown for compact filters and form controls.
- `getSearchableSelectPosition`: helper for positioning searchable select popovers.

### Smart Table

- `SmartTable`: responsive data table with desktop and mobile renderers.
- `SmartTableActions`: standard view/edit/delete action buttons.
- `TruncatedContent`: expandable/truncated cell content for long text.
- `useTableSorting`: sortable table state and sorting helper hook.
- `Column`, `SmartTableProps`, `PaginationConfig`, `ActionHandlers`, `ActionType`: table typing helpers.

### Table Toolbar

- `TableToolbar`: reusable toolbar with search, filter sheet, draft/apply behavior, active filter count, and clear-all support.
- `SearchInput`: search field with leading search icon and clear button.
- `FilterDropdown`: searchable select dropdown for simple enum filters.
- `CustomTableToolbarFilter`: extension point for app-specific filters such as association pickers.
- `FilterConfig`, `FilterOption`, `TableToolbarProps`: toolbar typing helpers.

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
