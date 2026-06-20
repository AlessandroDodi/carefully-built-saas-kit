# @carefully-built/ui

Reusable React UI primitives and data-display components for Carefully Built SaaS apps.

## Install

```bash
bun add @carefully-built/ui
```

For local development in an app inside the same parent workspace, use the packed tarball or workspace link already used by the consuming app.

## Import Paths

- `@carefully-built/ui`

## Component Usage

```tsx
import { Avatar } from '@carefully-built/ui';

// Check the API catalog below for the component source and prop types.
// Most components are controlled shells: pass app data, handlers, and slot content from the consuming app.
```

Components in this package:

- `Avatar`: import from `@carefully-built/ui`.
- `AvatarFallback`: import from `@carefully-built/ui`.
- `AvatarImage`: import from `@carefully-built/ui`.
- `Button`: import from `@carefully-built/ui`.
- `Calendar`: import from `@carefully-built/ui`.
- `Card`: import from `@carefully-built/ui`.
- `CardContent`: import from `@carefully-built/ui`.
- `CardDescription`: import from `@carefully-built/ui`.
- `CardFooter`: import from `@carefully-built/ui`.
- `CardHeader`: import from `@carefully-built/ui`.
- `CardTitle`: import from `@carefully-built/ui`.
- `Chip`: import from `@carefully-built/ui`.
- `ChipButton`: import from `@carefully-built/ui`.
- `DesktopConfirmShortcutHint`: import from `@carefully-built/ui`.
- `DesktopSheetLayout`: import from `@carefully-built/ui`.
- `DesktopView`: import from `@carefully-built/ui`.
- `Dialog`: import from `@carefully-built/ui`.
- `DialogContent`: import from `@carefully-built/ui`.
- `DialogDescription`: import from `@carefully-built/ui`.
- `DialogFooter`: import from `@carefully-built/ui`.
- `DialogHeader`: import from `@carefully-built/ui`.
- `DialogOverlay`: import from `@carefully-built/ui`.
- `DialogPortal`: import from `@carefully-built/ui`.
- `DialogTitle`: import from `@carefully-built/ui`.
- `DialogTrigger`: import from `@carefully-built/ui`.
- `DisplayDate`: import from `@carefully-built/ui`.
- `Drawer`: import from `@carefully-built/ui`.
- `DrawerContent`: import from `@carefully-built/ui`.
- `DrawerDescription`: import from `@carefully-built/ui`.
- `DrawerHeader`: import from `@carefully-built/ui`.
- `DrawerOverlay`: import from `@carefully-built/ui`.
- `DrawerPortal`: import from `@carefully-built/ui`.
- `DrawerTitle`: import from `@carefully-built/ui`.
- `DropdownMenu`: import from `@carefully-built/ui`.
- `DropdownMenuContent`: import from `@carefully-built/ui`.
- `DropdownMenuLabel`: import from `@carefully-built/ui`.
- `DropdownMenuSeparator`: import from `@carefully-built/ui`.
- `DropdownMenuTrigger`: import from `@carefully-built/ui`.
- `ErrorCode`: import from `@carefully-built/ui`.
- `FieldDetailRow`: import from `@carefully-built/ui`.
- `FileDropzone`: import from `@carefully-built/ui`.
- `FilterDropdown`: import from `@carefully-built/ui`.
- `HelpInfoButton`: import from `@carefully-built/ui`.
- `KeyboardKeycap`: import from `@carefully-built/ui`.
- `Label`: import from `@carefully-built/ui`.
- `MobileSheetLayout`: import from `@carefully-built/ui`.
- `MobileView`: import from `@carefully-built/ui`.
- `Pagination`: import from `@carefully-built/ui`.
- `Popover`: import from `@carefully-built/ui`.
- `PopoverContent`: import from `@carefully-built/ui`.
- `PopoverTrigger`: import from `@carefully-built/ui`.
- `ResponsiveSheet`: import from `@carefully-built/ui`.
- `SaasErrorPage`: import from `@carefully-built/ui`.
- `SaasNotFoundPage`: import from `@carefully-built/ui`.
- `ScrollFadeArea`: import from `@carefully-built/ui`.
- `SearchableSelect`: import from `@carefully-built/ui`.
- `SegmentedToggle`: import from `@carefully-built/ui`.
- `Select`: import from `@carefully-built/ui`.
- `SelectContent`: import from `@carefully-built/ui`.
- `SelectScrollDownButton`: import from `@carefully-built/ui`.
- `SelectScrollUpButton`: import from `@carefully-built/ui`.
- `SelectTrigger`: import from `@carefully-built/ui`.
- `Sheet`: import from `@carefully-built/ui`.
- `SheetActionFooter`: import from `@carefully-built/ui`.
- `SheetContent`: import from `@carefully-built/ui`.
- `SheetDescription`: import from `@carefully-built/ui`.
- `SheetHeader`: import from `@carefully-built/ui`.
- `SheetTitle`: import from `@carefully-built/ui`.
- `ShortcutModifierKeycap`: import from `@carefully-built/ui`.
- `Skeleton`: import from `@carefully-built/ui`.
- `SmartTable`: import from `@carefully-built/ui`.
- `SmartTableActions`: import from `@carefully-built/ui`.
- `Switch`: import from `@carefully-built/ui`.
- `Table`: import from `@carefully-built/ui`.
- `TableBody`: import from `@carefully-built/ui`.
- `TableCaption`: import from `@carefully-built/ui`.
- `TableCell`: import from `@carefully-built/ui`.
- `TableFooter`: import from `@carefully-built/ui`.
- `TableHead`: import from `@carefully-built/ui`.
- `TableHeader`: import from `@carefully-built/ui`.
- `TableRow`: import from `@carefully-built/ui`.
- `TableToolbar`: import from `@carefully-built/ui`.
- `Tabs`: import from `@carefully-built/ui`.
- `TabsContent`: import from `@carefully-built/ui`.
- `TabsList`: import from `@carefully-built/ui`.
- `TabsScrollArea`: import from `@carefully-built/ui`.
- `TabsTrigger`: import from `@carefully-built/ui`.
- `Textarea`: import from `@carefully-built/ui`.
- `Tooltip`: import from `@carefully-built/ui`.
- `TooltipContent`: import from `@carefully-built/ui`.
- `TooltipProvider`: import from `@carefully-built/ui`.
- `TooltipTrigger`: import from `@carefully-built/ui`.
- `TruncatedContent`: import from `@carefully-built/ui`.
- `UserPicker`: import from `@carefully-built/ui`.

## Hook Usage

```tsx
import { useDesktopConfirmShortcut } from '@carefully-built/ui';

export function Example() {
  const state = useDesktopConfirmShortcut({} as never);
  return null;
}
```

Hooks in this package:

- `useDesktopConfirmShortcut`: keep app-specific data fetching and mutations in the consuming app.
- `useDesktopShortcutModifierLabel`: keep app-specific data fetching and mutations in the consuming app.
- `useIsMobile`: keep app-specific data fetching and mutations in the consuming app.
- `useMediaQuery`: keep app-specific data fetching and mutations in the consuming app.
- `useTableSorting`: keep app-specific data fetching and mutations in the consuming app.
- `useTableSorting`: keep app-specific data fetching and mutations in the consuming app.

## Helper Usage

```ts
import { AUTO_SEARCHABLE_SELECT_THRESHOLD } from '@carefully-built/ui';
```

Helpers in this package:

- `AUTO_SEARCHABLE_SELECT_THRESHOLD`
- `buildSearchText`
- `buildUserInitials`
- `buttonVariants`
- `captureErrorToPostHog`
- `captureErrorToPostHog`
- `CHIP_CLASS_NAMES`
- `cn`
- `createErrorReference`
- `createErrorReference`
- `ErrorCode`
- `filterAndRankBySearch`
- `FilterDropdown`
- `filterSelectableUsers`
- `filterUsersBySearch`
- `formatAbsoluteDate`
- `formatDisplayDate`
- `formatSelectedUserSummary`
- `formatUserDisplayName`
- `getChipClassName`
- `getColumnSortKey`
- `getColumnTooltipText`
- `getDesktopShortcutModifierLabel`
- `getNotFoundPageContent`
- `getNotFoundPageContent`
- `getSearchableSelectPortalContainer`
- `getTruncatedContentAlignmentClass`
- `isAllowedConfirmShortcutEvent`
- `isSearchableSelectPointerInside`
- `rankBySearch`
- `resolveErrorPageContent`
- `resolveErrorPageContent`
- `resolveSearchableSelectDropdownPosition`
- `SaasErrorPage`
- `SaasNotFoundPage`
- `scoreFuzzyMatch`
- `shouldRenderTooltipTrigger`
- `SmartTable`
- `SmartTableActions`
- `TableToolbar`
- `tabsListVariants`
- `toggleUserSelection`
- `TruncatedContent`

## Types And Schemas

- `ActionHandlers`
- `ActionType`
- `ChipSize`
- `CollectionEmptyState`
- `Column`
- `ColumnAlign`
- `CustomTableToolbarFilter`
- `DateDisplayValue`
- `DisplayDateProps`
- `DropdownMenuCheckboxItem`
- `DropdownMenuItem`
- `EmptyStateCard`
- `EmptyStateCard`
- `EmptyStateCardProps`
- `ErrorCodeProps`
- `ErrorPageContent`
- `ErrorPageKind`
- `FieldDetailRowProps`
- `FilterConfig`
- `FilterOption`
- `getColumnValue`
- `getNextSortState`
- `HelpInfoButtonProps`
- `InitialEmptyState`
- `InitialEmptyState`
- `InitialEmptyStateProps`
- `Input`
- `NoResultsState`
- `NoResultsState`
- `NoResultsStateProps`
- `PaginationConfig`
- `PaginationProps`
- `PostHogErrorCapturePayload`
- `renderColumnValue`
- `resolveCollectionEmptyState`
- `resolveCollectionEmptyState`
- `ResolveCollectionEmptyStateOptions`
- `ResolveErrorPageContentOptions`
- `ResponsiveSheetClassNames`
- `ResponsiveSheetProps`
- `SaasErrorPageClassNames`
- `SaasErrorPageProps`
- `SaasNotFoundPageProps`
- `SearchableSelectOption`
- `SearchableSelectProps`
- `SearchableSelectRect`
- `SearchInput`
- `SearchInput`
- `SearchTextPart`
- `SegmentedToggleOption`
- `SegmentedToggleProps`
- `SelectItem`
- `SelectValue`
- `SheetOutsideInteractionGuard`
- `SmartTableProps`
- `SortDirection`
- `SortState`
- `SortValue`
- `TableToolbarProps`
- `UserPickerCopy`
- `UserPickerOption`
- `UserPickerProps`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `Avatar` | Component | `packages/ui/src/primitives/avatar.tsx` |
| `AvatarFallback` | Component | `packages/ui/src/primitives/avatar.tsx` |
| `AvatarImage` | Component | `packages/ui/src/primitives/avatar.tsx` |
| `Button` | Component | `packages/ui/src/primitives/button.tsx` |
| `Calendar` | Component | `packages/ui/src/primitives/calendar.tsx` |
| `Card` | Component | `packages/ui/src/primitives/card.tsx` |
| `CardContent` | Component | `packages/ui/src/primitives/card.tsx` |
| `CardDescription` | Component | `packages/ui/src/primitives/card.tsx` |
| `CardFooter` | Component | `packages/ui/src/primitives/card.tsx` |
| `CardHeader` | Component | `packages/ui/src/primitives/card.tsx` |
| `CardTitle` | Component | `packages/ui/src/primitives/card.tsx` |
| `Chip` | Component | `packages/ui/src/primitives/chip.tsx` |
| `ChipButton` | Component | `packages/ui/src/primitives/chip.tsx` |
| `DesktopConfirmShortcutHint` | Component | `packages/ui/src/overlays/responsive-sheet.footer.tsx` |
| `DesktopSheetLayout` | Component | `packages/ui/src/overlays/responsive-sheet.layouts.tsx` |
| `DesktopView` | Component | `packages/ui/src/smart-table/DesktopView.tsx` |
| `Dialog` | Component | `packages/ui/src/primitives/dialog.tsx` |
| `DialogContent` | Component | `packages/ui/src/primitives/dialog.tsx` |
| `DialogDescription` | Component | `packages/ui/src/primitives/dialog.tsx` |
| `DialogFooter` | Component | `packages/ui/src/primitives/dialog.tsx` |
| `DialogHeader` | Component | `packages/ui/src/primitives/dialog.tsx` |
| `DialogOverlay` | Component | `packages/ui/src/primitives/dialog.tsx` |
| `DialogPortal` | Component | `packages/ui/src/primitives/dialog.tsx` |
| `DialogTitle` | Component | `packages/ui/src/primitives/dialog.tsx` |
| `DialogTrigger` | Component | `packages/ui/src/primitives/dialog.tsx` |
| `DisplayDate` | Component | `packages/ui/src/primitives/display-date.tsx` |
| `Drawer` | Component | `packages/ui/src/primitives/drawer.tsx` |
| `DrawerContent` | Component | `packages/ui/src/primitives/drawer.tsx` |
| `DrawerDescription` | Component | `packages/ui/src/primitives/drawer.tsx` |
| `DrawerHeader` | Component | `packages/ui/src/primitives/drawer.tsx` |
| `DrawerOverlay` | Component | `packages/ui/src/primitives/drawer.tsx` |
| `DrawerPortal` | Component | `packages/ui/src/primitives/drawer.tsx` |
| `DrawerTitle` | Component | `packages/ui/src/primitives/drawer.tsx` |
| `DropdownMenu` | Component | `packages/ui/src/primitives/dropdown-menu.tsx` |
| `DropdownMenuContent` | Component | `packages/ui/src/primitives/dropdown-menu.tsx` |
| `DropdownMenuLabel` | Component | `packages/ui/src/primitives/dropdown-menu.tsx` |
| `DropdownMenuSeparator` | Component | `packages/ui/src/primitives/dropdown-menu.tsx` |
| `DropdownMenuTrigger` | Component | `packages/ui/src/primitives/dropdown-menu.tsx` |
| `ErrorCode` | Component | `packages/ui/src/error-page/error-code.tsx` |
| `FieldDetailRow` | Component | `packages/ui/src/primitives/field-detail-row.tsx` |
| `FileDropzone` | Component | `packages/ui/src/primitives/file-dropzone.tsx` |
| `FilterDropdown` | Component | `packages/ui/src/table-toolbar/table-toolbar.tsx` |
| `HelpInfoButton` | Component | `packages/ui/src/primitives/help-info-button.tsx` |
| `KeyboardKeycap` | Component | `packages/ui/src/primitives/keyboard-shortcut-hint.tsx` |
| `Label` | Component | `packages/ui/src/primitives/label.tsx` |
| `MobileSheetLayout` | Component | `packages/ui/src/overlays/responsive-sheet.layouts.tsx` |
| `MobileView` | Component | `packages/ui/src/smart-table/MobileView.tsx` |
| `Pagination` | Component | `packages/ui/src/primitives/pagination.tsx` |
| `Popover` | Component | `packages/ui/src/primitives/popover.tsx` |
| `PopoverContent` | Component | `packages/ui/src/primitives/popover.tsx` |
| `PopoverTrigger` | Component | `packages/ui/src/primitives/popover.tsx` |
| `ResponsiveSheet` | Component | `packages/ui/src/overlays/responsive-sheet.tsx` |
| `SaasErrorPage` | Component | `packages/ui/src/error-page/saas-error-page.tsx` |
| `SaasNotFoundPage` | Component | `packages/ui/src/error-page/saas-error-page.tsx` |
| `ScrollFadeArea` | Component | `packages/ui/src/primitives/scroll-fade-area.tsx` |
| `SearchableSelect` | Component | `packages/ui/src/search/searchable-select.tsx` |
| `SegmentedToggle` | Component | `packages/ui/src/primitives/segmented-toggle.tsx` |
| `Select` | Component | `packages/ui/src/primitives/select.tsx` |
| `SelectContent` | Component | `packages/ui/src/primitives/select.tsx` |
| `SelectScrollDownButton` | Component | `packages/ui/src/primitives/select.tsx` |
| `SelectScrollUpButton` | Component | `packages/ui/src/primitives/select.tsx` |
| `SelectTrigger` | Component | `packages/ui/src/primitives/select.tsx` |
| `Sheet` | Component | `packages/ui/src/primitives/sheet.tsx` |
| `SheetActionFooter` | Component | `packages/ui/src/overlays/responsive-sheet.footer.tsx` |
| `SheetContent` | Component | `packages/ui/src/primitives/sheet.tsx` |
| `SheetDescription` | Component | `packages/ui/src/primitives/sheet.tsx` |
| `SheetHeader` | Component | `packages/ui/src/primitives/sheet.tsx` |
| `SheetTitle` | Component | `packages/ui/src/primitives/sheet.tsx` |
| `ShortcutModifierKeycap` | Component | `packages/ui/src/primitives/keyboard-shortcut-hint.tsx` |
| `Skeleton` | Component | `packages/ui/src/primitives/skeleton.tsx` |
| `SmartTable` | Component | `packages/ui/src/smart-table/SmartTable.tsx` |
| `SmartTableActions` | Component | `packages/ui/src/smart-table/SmartTableActions.tsx` |
| `Switch` | Component | `packages/ui/src/primitives/switch.tsx` |
| `Table` | Component | `packages/ui/src/primitives/table.tsx` |
| `TableBody` | Component | `packages/ui/src/primitives/table.tsx` |
| `TableCaption` | Component | `packages/ui/src/primitives/table.tsx` |
| `TableCell` | Component | `packages/ui/src/primitives/table.tsx` |
| `TableFooter` | Component | `packages/ui/src/primitives/table.tsx` |
| `TableHead` | Component | `packages/ui/src/primitives/table.tsx` |
| `TableHeader` | Component | `packages/ui/src/primitives/table.tsx` |
| `TableRow` | Component | `packages/ui/src/primitives/table.tsx` |
| `TableToolbar` | Component | `packages/ui/src/table-toolbar/table-toolbar.tsx` |
| `Tabs` | Component | `packages/ui/src/primitives/tabs.tsx` |
| `TabsContent` | Component | `packages/ui/src/primitives/tabs.tsx` |
| `TabsList` | Component | `packages/ui/src/primitives/tabs.tsx` |
| `TabsScrollArea` | Component | `packages/ui/src/primitives/tabs.tsx` |
| `TabsTrigger` | Component | `packages/ui/src/primitives/tabs.tsx` |
| `Textarea` | Component | `packages/ui/src/primitives/textarea.tsx` |
| `Tooltip` | Component | `packages/ui/src/primitives/tooltip.tsx` |
| `TooltipContent` | Component | `packages/ui/src/primitives/tooltip.tsx` |
| `TooltipProvider` | Component | `packages/ui/src/primitives/tooltip.tsx` |
| `TooltipTrigger` | Component | `packages/ui/src/primitives/tooltip.tsx` |
| `TruncatedContent` | Component | `packages/ui/src/smart-table/TruncatedContent.tsx` |
| `UserPicker` | Component | `packages/ui/src/primitives/user-picker.tsx` |
| `AUTO_SEARCHABLE_SELECT_THRESHOLD` | Helper | `packages/ui/src/search/searchable-select.tsx` |
| `buildSearchText` | Helper | `packages/ui/src/utils/search.ts` |
| `buildUserInitials` | Helper | `packages/ui/src/primitives/user-picker-utils.ts` |
| `buttonVariants` | Helper | `packages/ui/src/primitives/button.tsx` |
| `captureErrorToPostHog` | Helper | `packages/ui/src/error-page/index.ts` |
| `captureErrorToPostHog` | Helper | `packages/ui/src/error-page/posthog-error-capture.ts` |
| `CHIP_CLASS_NAMES` | Helper | `packages/ui/src/primitives/chip-utils.ts` |
| `cn` | Helper | `packages/ui/src/utils/cn.ts` |
| `createErrorReference` | Helper | `packages/ui/src/error-page/index.ts` |
| `createErrorReference` | Helper | `packages/ui/src/error-page/posthog-error-capture.ts` |
| `ErrorCode` | Helper | `packages/ui/src/error-page/index.ts` |
| `filterAndRankBySearch` | Helper | `packages/ui/src/utils/search.ts` |
| `FilterDropdown` | Helper | `packages/ui/src/table-toolbar/index.ts` |
| `filterSelectableUsers` | Helper | `packages/ui/src/primitives/user-picker-utils.ts` |
| `filterUsersBySearch` | Helper | `packages/ui/src/primitives/user-picker-utils.ts` |
| `formatAbsoluteDate` | Helper | `packages/ui/src/utils/date-display.ts` |
| `formatDisplayDate` | Helper | `packages/ui/src/utils/date-display.ts` |
| `formatSelectedUserSummary` | Helper | `packages/ui/src/primitives/user-picker-utils.ts` |
| `formatUserDisplayName` | Helper | `packages/ui/src/primitives/user-picker-utils.ts` |
| `getChipClassName` | Helper | `packages/ui/src/primitives/chip-utils.ts` |
| `getColumnSortKey` | Helper | `packages/ui/src/smart-table/sorting.ts` |
| `getColumnTooltipText` | Helper | `packages/ui/src/smart-table/utils.ts` |
| `getDesktopShortcutModifierLabel` | Helper | `packages/ui/src/overlays/responsive-sheet.shortcuts.ts` |
| `getNotFoundPageContent` | Helper | `packages/ui/src/error-page/error-page-content.ts` |
| `getNotFoundPageContent` | Helper | `packages/ui/src/error-page/index.ts` |
| `getSearchableSelectPortalContainer` | Helper | `packages/ui/src/search/searchable-select.tsx` |
| `getTruncatedContentAlignmentClass` | Helper | `packages/ui/src/smart-table/truncated-content.utils.ts` |
| `isAllowedConfirmShortcutEvent` | Helper | `packages/ui/src/overlays/responsive-sheet.shortcuts.ts` |
| `isSearchableSelectPointerInside` | Helper | `packages/ui/src/search/searchable-select.tsx` |
| `rankBySearch` | Helper | `packages/ui/src/utils/search.ts` |
| `resolveErrorPageContent` | Helper | `packages/ui/src/error-page/error-page-content.ts` |
| `resolveErrorPageContent` | Helper | `packages/ui/src/error-page/index.ts` |
| `resolveSearchableSelectDropdownPosition` | Helper | `packages/ui/src/search/searchable-select-position.ts` |
| `SaasErrorPage` | Helper | `packages/ui/src/error-page/index.ts` |
| `SaasNotFoundPage` | Helper | `packages/ui/src/error-page/index.ts` |
| `scoreFuzzyMatch` | Helper | `packages/ui/src/utils/search.ts` |
| `shouldRenderTooltipTrigger` | Helper | `packages/ui/src/smart-table/truncated-content.utils.ts` |
| `SmartTable` | Helper | `packages/ui/src/smart-table/index.ts` |
| `SmartTableActions` | Helper | `packages/ui/src/smart-table/index.ts` |
| `TableToolbar` | Helper | `packages/ui/src/table-toolbar/index.ts` |
| `tabsListVariants` | Helper | `packages/ui/src/primitives/tabs.tsx` |
| `toggleUserSelection` | Helper | `packages/ui/src/primitives/user-picker-utils.ts` |
| `TruncatedContent` | Helper | `packages/ui/src/smart-table/index.ts` |
| `useDesktopConfirmShortcut` | Hook | `packages/ui/src/overlays/responsive-sheet.shortcuts.ts` |
| `useDesktopShortcutModifierLabel` | Hook | `packages/ui/src/overlays/responsive-sheet.shortcuts.ts` |
| `useIsMobile` | Hook | `packages/ui/src/utils/use-media-query.ts` |
| `useMediaQuery` | Hook | `packages/ui/src/utils/use-media-query.ts` |
| `useTableSorting` | Hook | `packages/ui/src/smart-table/index.ts` |
| `useTableSorting` | Hook | `packages/ui/src/smart-table/sorting.ts` |
| `ActionHandlers` | Type | `packages/ui/src/smart-table/types.ts` |
| `ActionType` | Type | `packages/ui/src/smart-table/types.ts` |
| `ChipSize` | Type | `packages/ui/src/primitives/chip-utils.ts` |
| `CollectionEmptyState` | Type | `packages/ui/src/empty-state/collection-empty-state.ts` |
| `Column` | Type | `packages/ui/src/smart-table/types.ts` |
| `ColumnAlign` | Type | `packages/ui/src/smart-table/types.ts` |
| `CustomTableToolbarFilter` | Type | `packages/ui/src/table-toolbar/table-toolbar.tsx` |
| `DateDisplayValue` | Type | `packages/ui/src/utils/date-display.ts` |
| `DisplayDateProps` | Type | `packages/ui/src/primitives/display-date.tsx` |
| `DropdownMenuCheckboxItem` | Type | `packages/ui/src/primitives/dropdown-menu.tsx` |
| `DropdownMenuItem` | Type | `packages/ui/src/primitives/dropdown-menu.tsx` |
| `EmptyStateCard` | Type | `packages/ui/src/empty-state/empty-state-card.tsx` |
| `EmptyStateCard` | Type | `packages/ui/src/empty-state/index.ts` |
| `EmptyStateCardProps` | Type | `packages/ui/src/empty-state/empty-state-card.tsx` |
| `ErrorCodeProps` | Type | `packages/ui/src/error-page/error-code.tsx` |
| `ErrorPageContent` | Type | `packages/ui/src/error-page/error-page-content.ts` |
| `ErrorPageKind` | Type | `packages/ui/src/error-page/error-page-content.ts` |
| `FieldDetailRowProps` | Type | `packages/ui/src/primitives/field-detail-row.tsx` |
| `FilterConfig` | Type | `packages/ui/src/table-toolbar/table-toolbar.tsx` |
| `FilterOption` | Type | `packages/ui/src/table-toolbar/table-toolbar.tsx` |
| `getColumnValue` | Type | `packages/ui/src/smart-table/utils.ts` |
| `getNextSortState` | Type | `packages/ui/src/smart-table/sorting.ts` |
| `HelpInfoButtonProps` | Type | `packages/ui/src/primitives/help-info-button.tsx` |
| `InitialEmptyState` | Type | `packages/ui/src/empty-state/index.ts` |
| `InitialEmptyState` | Type | `packages/ui/src/empty-state/initial-empty-state.tsx` |
| `InitialEmptyStateProps` | Type | `packages/ui/src/empty-state/initial-empty-state.tsx` |
| `Input` | Type | `packages/ui/src/primitives/input.tsx` |
| `NoResultsState` | Type | `packages/ui/src/empty-state/index.ts` |
| `NoResultsState` | Type | `packages/ui/src/empty-state/no-results-state.tsx` |
| `NoResultsStateProps` | Type | `packages/ui/src/empty-state/no-results-state.tsx` |
| `PaginationConfig` | Type | `packages/ui/src/smart-table/types.ts` |
| `PaginationProps` | Type | `packages/ui/src/primitives/pagination.tsx` |
| `PostHogErrorCapturePayload` | Type | `packages/ui/src/error-page/posthog-error-capture.ts` |
| `renderColumnValue` | Type | `packages/ui/src/smart-table/utils.ts` |
| `resolveCollectionEmptyState` | Type | `packages/ui/src/empty-state/collection-empty-state.ts` |
| `resolveCollectionEmptyState` | Type | `packages/ui/src/empty-state/index.ts` |
| `ResolveCollectionEmptyStateOptions` | Type | `packages/ui/src/empty-state/collection-empty-state.ts` |
| `ResolveErrorPageContentOptions` | Type | `packages/ui/src/error-page/error-page-content.ts` |
| `ResponsiveSheetClassNames` | Type | `packages/ui/src/overlays/responsive-sheet.tsx` |
| `ResponsiveSheetProps` | Type | `packages/ui/src/overlays/responsive-sheet.tsx` |
| `SaasErrorPageClassNames` | Type | `packages/ui/src/error-page/saas-error-page.tsx` |
| `SaasErrorPageProps` | Type | `packages/ui/src/error-page/saas-error-page.tsx` |
| `SaasNotFoundPageProps` | Type | `packages/ui/src/error-page/saas-error-page.tsx` |
| `SearchableSelectOption` | Type | `packages/ui/src/search/searchable-select.tsx` |
| `SearchableSelectProps` | Type | `packages/ui/src/search/searchable-select.tsx` |
| `SearchableSelectRect` | Type | `packages/ui/src/search/searchable-select-position.ts` |
| `SearchInput` | Type | `packages/ui/src/table-toolbar/index.ts` |
| `SearchInput` | Type | `packages/ui/src/table-toolbar/table-toolbar.tsx` |
| `SearchTextPart` | Type | `packages/ui/src/utils/search.ts` |
| `SegmentedToggleOption` | Type | `packages/ui/src/primitives/segmented-toggle.tsx` |
| `SegmentedToggleProps` | Type | `packages/ui/src/primitives/segmented-toggle.tsx` |
| `SelectItem` | Type | `packages/ui/src/primitives/select.tsx` |
| `SelectValue` | Type | `packages/ui/src/primitives/select.tsx` |
| `SheetOutsideInteractionGuard` | Type | `packages/ui/src/overlays/responsive-sheet.tsx` |
| `SmartTableProps` | Type | `packages/ui/src/smart-table/types.ts` |
| `SortDirection` | Type | `packages/ui/src/smart-table/types.ts` |
| `SortState` | Type | `packages/ui/src/smart-table/types.ts` |
| `SortValue` | Type | `packages/ui/src/smart-table/types.ts` |
| `TableToolbarProps` | Type | `packages/ui/src/table-toolbar/table-toolbar.tsx` |
| `UserPickerCopy` | Type | `packages/ui/src/primitives/user-picker-utils.ts` |
| `UserPickerOption` | Type | `packages/ui/src/primitives/user-picker-utils.ts` |
| `UserPickerProps` | Type | `packages/ui/src/primitives/user-picker.tsx` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
