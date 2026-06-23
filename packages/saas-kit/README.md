# @carefully-built/saas-kit

One install for Carefully Built SaaS components, product surfaces, and helpers.

Carefully Built SaaS Kit exists so every new B2B product does not have to reinvent the same tables, forms, filters, sheets, settings, files, notifications, calendars, and dashboard patterns from scratch.

Use this package when you want managed npm imports and shared upgrades across apps. Use `@carefully-built/cli` when you want to eject editable component source into an app.

## Component Previews

<img src="https://raw.githubusercontent.com/AlessandroDodi/carefully-built-saas-kit/main/docs/saas-kit/images/smarttable.png" alt="Smart Table" width="360" />
<img src="https://raw.githubusercontent.com/AlessandroDodi/carefully-built-saas-kit/main/docs/saas-kit/images/responsivesheet.png" alt="Responsive Sheet" width="360" />
<img src="https://raw.githubusercontent.com/AlessandroDodi/carefully-built-saas-kit/main/docs/saas-kit/images/kanban.png" alt="Kanban" width="360" />
<img src="https://raw.githubusercontent.com/AlessandroDodi/carefully-built-saas-kit/main/docs/saas-kit/images/charts.png" alt="Charts" width="360" />
<img src="https://raw.githubusercontent.com/AlessandroDodi/carefully-built-saas-kit/main/docs/saas-kit/images/notifications.png" alt="Notifications" width="360" />
<img src="https://raw.githubusercontent.com/AlessandroDodi/carefully-built-saas-kit/main/docs/saas-kit/images/search.png" alt="Search" width="360" />
<img src="https://raw.githubusercontent.com/AlessandroDodi/carefully-built-saas-kit/main/docs/saas-kit/images/calendar.png" alt="Calendar" width="360" />
<img src="https://raw.githubusercontent.com/AlessandroDodi/carefully-built-saas-kit/main/docs/saas-kit/images/maps.png" alt="Maps" width="360" />
<img src="https://raw.githubusercontent.com/AlessandroDodi/carefully-built-saas-kit/main/docs/saas-kit/images/superadmin.png" alt="Superadmin" width="360" />
<img src="https://raw.githubusercontent.com/AlessandroDodi/carefully-built-saas-kit/main/docs/saas-kit/images/widgets.png" alt="Widgets" width="360" />
<img src="https://raw.githubusercontent.com/AlessandroDodi/carefully-built-saas-kit/main/docs/saas-kit/images/file-dropper.png" alt="Files" width="360" />
<img src="https://raw.githubusercontent.com/AlessandroDodi/carefully-built-saas-kit/main/docs/saas-kit/images/theme-switcher.png" alt="Theme" width="360" />

## Install

```bash
bun add @carefully-built/saas-kit
```

```tsx
import { Button, SmartTable, TableToolbar, ResponsiveSheet } from "@carefully-built/saas-kit";
```

The package includes the modular Carefully Built packages as dependencies. Your app should still install the framework peer dependencies it actually uses, such as React, Next.js, Convex, WorkOS, Radix primitives, React Hook Form, TipTap, FullCalendar, and Recharts.

## Package Modules

Import from the root for shared UI primitives, or from a subpath for a product area.

| Module | Use for |
|---|---|
| `@carefully-built/saas-kit` | Shared UI primitives, table tools, overlays, empty states, error pages, hooks, and utilities |
| `@carefully-built/saas-kit/agenda` | Calendar and agenda surfaces |
| `@carefully-built/saas-kit/app-shell` | Dashboard shell, responsive navigation, page layouts, and mobile bottom navigation |
| `@carefully-built/saas-kit/association-picker` | Searchable association selection |
| `@carefully-built/saas-kit/auth-pages` | Auth forms, controllers, pages, social login, organizations, and WorkOS auth UI |
| `@carefully-built/saas-kit/automations` | Automation builder state, canvas, options, and draft helpers |
| `@carefully-built/saas-kit/charts` | Dashboard chart widgets |
| `@carefully-built/saas-kit/convex-crud` | Convex CRUD helpers |
| `@carefully-built/saas-kit/convex-multitenant` | Convex multitenancy helpers |
| `@carefully-built/saas-kit/convex-platform` | Convex platform association helpers |
| `@carefully-built/saas-kit/convex-workos` | Convex WorkOS integration helpers |
| `@carefully-built/saas-kit/crud` | CRUD table/page state and URL filters |
| `@carefully-built/saas-kit/custom-fields` | Custom field definitions and inputs |
| `@carefully-built/saas-kit/files` | Document cards, grids, uploads, and file filtering |
| `@carefully-built/saas-kit/forms` | Schema/custom forms and user picker fields |
| `@carefully-built/saas-kit/import-export` | CSV import/export helpers and sheets |
| `@carefully-built/saas-kit/kanban` | Kanban board and pipeline helpers |
| `@carefully-built/saas-kit/legal-ui` | Legal document renderer and default legal text |
| `@carefully-built/saas-kit/maps-ui` | Google Maps Places loader helpers |
| `@carefully-built/saas-kit/notes` | Notes CRUD page and note list types |
| `@carefully-built/saas-kit/notifications` | Notification lists, buttons, and visual metadata |
| `@carefully-built/saas-kit/resource-kit` | Resource pages, entity detail shells, associated tabs, and toast helpers |
| `@carefully-built/saas-kit/rich-text` | Rich text editor and renderer |
| `@carefully-built/saas-kit/search` | Search and command palette modules |
| `@carefully-built/saas-kit/settings-ui` | Settings cards and settings tab surfaces |
| `@carefully-built/saas-kit/superadmin` | Superadmin UI, server helpers, and Next.js page factory |
| `@carefully-built/saas-kit/theme-ui` | Theme selector components |
| `@carefully-built/saas-kit/ui` | Direct access to the UI package barrel |
| `@carefully-built/saas-kit/user-picker` | User picker package barrel |
| `@carefully-built/saas-kit/widgets` | Dashboard widget wrappers |
| `@carefully-built/saas-kit/workos` | WorkOS organization UI and server helpers |
| `@carefully-built/saas-kit/server` | Server-only helpers |
| `@carefully-built/saas-kit/next` | Next.js helpers |

Example subpath imports:

```tsx
import { DashboardPageLayout } from "@carefully-built/saas-kit/app-shell";
import { AuthLoginPage } from "@carefully-built/saas-kit/auth-pages/pages";
import { createWorkOSWidgetTokenResponse } from "@carefully-built/saas-kit/server";
import { createSuperAdminPage } from "@carefully-built/saas-kit/next";
```

## Full UI Registry

Every public UI module exported by `@carefully-built/ui` is available through `@carefully-built/saas-kit` and through the CLI registry.

| Registry entry | Managed import | Editable source |
|---|---|---|
| `avatar` | `import { Avatar, AvatarFallback, AvatarImage } from "@carefully-built/saas-kit"` | `bunx @carefully-built/cli add avatar` |
| `button` | `import { Button, ButtonSize, ButtonVariant, buttonVariants } from "@carefully-built/saas-kit"` | `bunx @carefully-built/cli add button` |
| `calendar` | `import { Calendar } from "@carefully-built/saas-kit"` | `bunx @carefully-built/cli add calendar` |
| `card` | `import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@carefully-built/saas-kit"` | `bunx @carefully-built/cli add card` |
| `chip` | `import { Chip, ChipButton } from "@carefully-built/saas-kit"` | `bunx @carefully-built/cli add chip` |
| `chip-utils` | `import { CHIP_CLASS_NAMES, ChipSize, getChipClassName } from "@carefully-built/saas-kit"` | `bunx @carefully-built/cli add chip-utils` |
| `date-display` | `import { DateDisplayValue, formatAbsoluteDate, formatDisplayDate } from "@carefully-built/saas-kit"` | `bunx @carefully-built/cli add date-display` |
| `dialog` | `import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay } from "@carefully-built/saas-kit"` | `bunx @carefully-built/cli add dialog` |
| `display-date` | `import { DisplayDate } from "@carefully-built/saas-kit"` | `bunx @carefully-built/cli add display-date` |
| `drawer` | `import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerOverlay, DrawerPortal } from "@carefully-built/saas-kit"` | `bunx @carefully-built/cli add drawer` |
| `dropdown-menu` | `import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@carefully-built/saas-kit"` | `bunx @carefully-built/cli add dropdown-menu` |
| `empty-state` | `import { CollectionEmptyState, EmptyStateCard, InitialEmptyState, NoResultsState, ResolveCollectionEmptyStateOptions, resolveCollectionEmptyState } from "@carefully-built/saas-kit"` | `bunx @carefully-built/cli add empty-state` |
| `error-page` | `import { ErrorCode, ErrorPageContent, ErrorPageKind, PostHogErrorCapturePayload, ResolveErrorPageContentOptions, SaasErrorPage } from "@carefully-built/saas-kit"` | `bunx @carefully-built/cli add error-page` |
| `field-detail-row` | `import { FieldDetailRow } from "@carefully-built/saas-kit"` | `bunx @carefully-built/cli add field-detail-row` |
| `file-dropzone` | `import { FileDropzone } from "@carefully-built/saas-kit"` | `bunx @carefully-built/cli add file-dropzone` |
| `help-info-button` | `import { HelpInfoButton } from "@carefully-built/saas-kit"` | `bunx @carefully-built/cli add help-info-button` |
| `input` | `import { Input } from "@carefully-built/saas-kit"` | `bunx @carefully-built/cli add input` |
| `keyboard-shortcut-hint` | `import { KeyboardKeycap, ShortcutModifierKeycap } from "@carefully-built/saas-kit"` | `bunx @carefully-built/cli add keyboard-shortcut-hint` |
| `label` | `import { Label } from "@carefully-built/saas-kit"` | `bunx @carefully-built/cli add label` |
| `pagination` | `import { Pagination } from "@carefully-built/saas-kit"` | `bunx @carefully-built/cli add pagination` |
| `popover` | `import { Popover, PopoverContent, PopoverTrigger } from "@carefully-built/saas-kit"` | `bunx @carefully-built/cli add popover` |
| `responsive-sheet` | `import { ResponsiveSheet, SheetOutsideInteractionGuard } from "@carefully-built/saas-kit"` | `bunx @carefully-built/cli add responsive-sheet` |
| `responsive-sheet.footer` | `import { DesktopConfirmShortcutHint, SheetActionFooter } from "@carefully-built/saas-kit"` | `bunx @carefully-built/cli add responsive-sheet.footer` |
| `responsive-sheet.shortcuts` | `import { getDesktopShortcutModifierLabel, isAllowedConfirmShortcutEvent, useDesktopConfirmShortcut, useDesktopShortcutModifierLabel } from "@carefully-built/saas-kit"` | `bunx @carefully-built/cli add responsive-sheet.shortcuts` |
| `scroll-fade-area` | `import { ScrollFadeArea } from "@carefully-built/saas-kit"` | `bunx @carefully-built/cli add scroll-fade-area` |
| `search` | `import { SearchTextPart, buildSearchText, filterAndRankBySearch, rankBySearch, scoreFuzzyMatch } from "@carefully-built/saas-kit"` | `bunx @carefully-built/cli add search` |
| `searchable-select` | `import { AUTO_SEARCHABLE_SELECT_THRESHOLD, SearchableSelect, SearchableSelectOption, getSearchableSelectPortalContainer, isSearchableSelectPointerInside } from "@carefully-built/saas-kit"` | `bunx @carefully-built/cli add searchable-select` |
| `searchable-select-position` | `import { SearchableSelectRect, resolveSearchableSelectDropdownPosition } from "@carefully-built/saas-kit"` | `bunx @carefully-built/cli add searchable-select-position` |
| `segmented-toggle` | `import { SegmentedToggle, SegmentedToggleOption } from "@carefully-built/saas-kit"` | `bunx @carefully-built/cli add segmented-toggle` |
| `select` | `import { Select, SelectContent, SelectItem, SelectScrollDownButton, SelectScrollUpButton, SelectTrigger } from "@carefully-built/saas-kit"` | `bunx @carefully-built/cli add select` |
| `sheet` | `import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@carefully-built/saas-kit"` | `bunx @carefully-built/cli add sheet` |
| `skeleton` | `import { Skeleton } from "@carefully-built/saas-kit"` | `bunx @carefully-built/cli add skeleton` |
| `smart-table` | `import { ActionHandlers, ActionType, Column, ColumnAlign, PaginationConfig, SmartTable } from "@carefully-built/saas-kit"` | `bunx @carefully-built/cli add smart-table` |
| `switch` | `import { Switch } from "@carefully-built/saas-kit"` | `bunx @carefully-built/cli add switch` |
| `table` | `import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead } from "@carefully-built/saas-kit"` | `bunx @carefully-built/cli add table` |
| `table-toolbar` | `import { CustomTableToolbarFilter, FilterConfig, FilterDropdown, FilterOption, SearchInput, TableToolbar } from "@carefully-built/saas-kit"` | `bunx @carefully-built/cli add table-toolbar` |
| `tabs` | `import { Tabs, TabsContent, TabsList, TabsScrollArea, TabsTrigger, tabsListVariants } from "@carefully-built/saas-kit"` | `bunx @carefully-built/cli add tabs` |
| `textarea` | `import { Textarea } from "@carefully-built/saas-kit"` | `bunx @carefully-built/cli add textarea` |
| `tooltip` | `import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@carefully-built/saas-kit"` | `bunx @carefully-built/cli add tooltip` |
| `use-media-query` | `import { useIsMobile, useMediaQuery } from "@carefully-built/saas-kit"` | `bunx @carefully-built/cli add use-media-query` |
| `user-picker` | `import { UserPicker } from "@carefully-built/saas-kit"` | `bunx @carefully-built/cli add user-picker` |
| `user-picker-utils` | `import { UserPickerCopy, UserPickerOption, buildUserInitials, filterSelectableUsers, filterUsersBySearch, formatSelectedUserSummary } from "@carefully-built/saas-kit"` | `bunx @carefully-built/cli add user-picker-utils` |

Some entries export several related components, hooks, helpers, and types from one module. TypeScript autocomplete will show the full API after installing the kit.

## Editable Source With The CLI

Use the CLI when a component should become local code that you can edit directly.

```bash
bunx @carefully-built/cli list
bunx @carefully-built/cli add button
bunx @carefully-built/cli add smart-table
bunx @carefully-built/cli add responsive-sheet
```

The CLI copies the component source and its local dependency closure into your app. It reads common shadcn project conventions such as `components.json` aliases and `tsconfig.json` paths.

## Import vs Eject

Import from `@carefully-built/saas-kit` when:

- you want package updates and bug fixes
- the component should stay shared across apps
- product-specific differences can be handled with props, slots, `className`, or `classes`

Use `@carefully-built/cli add` when:

- the component needs local product behavior
- design needs to diverge from the shared package
- you want to own and edit every line in the consuming app
- the component should follow the app's normal source-control workflow

## Copy And Localization

SaaS kit defaults are English. Italian or other localized apps should pass app-specific copy through the component label/config props. Components with user-facing copy are designed to expose labels or configuration objects so package defaults do not force one language across all apps.
