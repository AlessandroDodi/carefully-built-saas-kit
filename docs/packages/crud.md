# @carefully-built/crud

Config-driven CRUD table and form helpers for Carefully Built SaaS apps.

## Install

```bash
bun add @carefully-built/crud
```

For local development in an app inside the same parent workspace, use the packed tarball or workspace link already used by the consuming app.

## Import Paths

- `@carefully-built/crud`

## Component Usage

```tsx
import { CrudDataTable } from '@carefully-built/crud';

// Check the API catalog below for the component source and prop types.
// Most components are controlled shells: pass app data, handlers, and slot content from the consuming app.
```

Components in this package:

- `CrudDataTable`: import from `@carefully-built/crud`.
- `CrudListTable`: import from `@carefully-built/crud`.
- `CrudResourceSheet`: import from `@carefully-built/crud`.
- `CrudTableToolbar`: import from `@carefully-built/crud`.
- `CrudTableView`: import from `@carefully-built/crud`.
- `FilterDropdown`: import from `@carefully-built/crud`.

## Hook Usage

```tsx
import { useCrudDataTableController } from '@carefully-built/crud';

export function Example() {
  const state = useCrudDataTableController({} as never);
  return null;
}
```

Hooks in this package:

- `useCrudDataTableController`: keep app-specific data fetching and mutations in the consuming app.
- `useCrudFormDirty`: keep app-specific data fetching and mutations in the consuming app.
- `useCrudTableState`: keep app-specific data fetching and mutations in the consuming app.
- `useCrudTableState`: keep app-specific data fetching and mutations in the consuming app.
- `useCrudUrlListState`: keep app-specific data fetching and mutations in the consuming app.
- `useUrlPagination`: keep app-specific data fetching and mutations in the consuming app.
- `useUrlPagination`: keep app-specific data fetching and mutations in the consuming app.
- `useUrlStringFilters`: keep app-specific data fetching and mutations in the consuming app.
- `useUrlStringFilters`: keep app-specific data fetching and mutations in the consuming app.

## Helper Usage

```ts
import { buildCrudSearchText } from '@carefully-built/crud';
```

Helpers in this package:

- `buildCrudSearchText`
- `CrudDataTable`
- `CrudListTable`
- `CrudResourceSheet`
- `CrudTableView`
- `getValidPage`
- `matchesCrudSearch`
- `paginateCrudData`

## Types And Schemas

- `CrudDataTableController`
- `CrudDataTableProps`
- `CrudEmptyState`
- `CrudFilterDefinition`
- `CrudListTableProps`
- `CrudPaginationState`
- `CrudResourceSheetProps`
- `CrudTableState`
- `CrudTableToolbarProps`
- `CrudTableViewProps`
- `CrudUrlListState`
- `CrudUrlListStateOptions`
- `SearchInput`
- `UrlPaginationState`
- `UrlStringFilterDefinition`
- `UrlStringFiltersState`
- `UseCrudDataTableControllerOptions`
- `UseCrudTableStateOptions`
- `UseUrlPaginationOptions`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `CrudDataTable` | Component | `packages/crud/src/crud-data-table.tsx` |
| `CrudListTable` | Component | `packages/crud/src/crud-list-table.tsx` |
| `CrudResourceSheet` | Component | `packages/crud/src/crud-resource-sheet.tsx` |
| `CrudTableToolbar` | Component | `packages/crud/src/crud-table-toolbar.tsx` |
| `CrudTableView` | Component | `packages/crud/src/crud-table-view.tsx` |
| `FilterDropdown` | Component | `packages/crud/src/crud-table-toolbar.tsx` |
| `buildCrudSearchText` | Helper | `packages/crud/src/search.ts` |
| `CrudDataTable` | Helper | `packages/crud/src/index.ts` |
| `CrudListTable` | Helper | `packages/crud/src/index.ts` |
| `CrudResourceSheet` | Helper | `packages/crud/src/index.ts` |
| `CrudTableView` | Helper | `packages/crud/src/index.ts` |
| `getValidPage` | Helper | `packages/crud/src/pagination.ts` |
| `matchesCrudSearch` | Helper | `packages/crud/src/search.ts` |
| `paginateCrudData` | Helper | `packages/crud/src/pagination.ts` |
| `useCrudDataTableController` | Hook | `packages/crud/src/use-crud-data-table-controller.ts` |
| `useCrudFormDirty` | Hook | `packages/crud/src/use-crud-form-dirty.ts` |
| `useCrudTableState` | Hook | `packages/crud/src/index.ts` |
| `useCrudTableState` | Hook | `packages/crud/src/use-crud-table-state.ts` |
| `useCrudUrlListState` | Hook | `packages/crud/src/use-crud-url-list-state.ts` |
| `useUrlPagination` | Hook | `packages/crud/src/index.ts` |
| `useUrlPagination` | Hook | `packages/crud/src/use-url-pagination.ts` |
| `useUrlStringFilters` | Hook | `packages/crud/src/index.ts` |
| `useUrlStringFilters` | Hook | `packages/crud/src/use-url-string-filters.ts` |
| `CrudDataTableController` | Type | `packages/crud/src/use-crud-data-table-controller.ts` |
| `CrudDataTableProps` | Type | `packages/crud/src/types.ts` |
| `CrudEmptyState` | Type | `packages/crud/src/types.ts` |
| `CrudFilterDefinition` | Type | `packages/crud/src/types.ts` |
| `CrudListTableProps` | Type | `packages/crud/src/crud-list-table.tsx` |
| `CrudPaginationState` | Type | `packages/crud/src/pagination.ts` |
| `CrudResourceSheetProps` | Type | `packages/crud/src/crud-resource-sheet.tsx` |
| `CrudTableState` | Type | `packages/crud/src/types.ts` |
| `CrudTableToolbarProps` | Type | `packages/crud/src/crud-table-toolbar.tsx` |
| `CrudTableViewProps` | Type | `packages/crud/src/types.ts` |
| `CrudUrlListState` | Type | `packages/crud/src/use-crud-url-list-state.ts` |
| `CrudUrlListStateOptions` | Type | `packages/crud/src/use-crud-url-list-state.ts` |
| `SearchInput` | Type | `packages/crud/src/crud-table-toolbar.tsx` |
| `UrlPaginationState` | Type | `packages/crud/src/use-url-pagination.ts` |
| `UrlStringFilterDefinition` | Type | `packages/crud/src/use-url-string-filters.ts` |
| `UrlStringFiltersState` | Type | `packages/crud/src/use-url-string-filters.ts` |
| `UseCrudDataTableControllerOptions` | Type | `packages/crud/src/use-crud-data-table-controller.ts` |
| `UseCrudTableStateOptions` | Type | `packages/crud/src/types.ts` |
| `UseUrlPaginationOptions` | Type | `packages/crud/src/use-url-pagination.ts` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
