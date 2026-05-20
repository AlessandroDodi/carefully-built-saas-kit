# CRUD Table

Reusable state and view layer for the common SaaS resource list: search, filters, sorting, pagination, table, empty states, and actions.

## Import

```tsx
import { CrudTableView, useCrudTableState } from '@carefully-built/crud';
```

## Basic Example

```tsx
const table = useCrudTableState({
  data: contacts,
  columns,
  searchFields: ['name', 'email'],
  filters: [{ key: 'status', config: STATUS_FILTER }],
  pageSize: 25,
});

<CrudTableView
  state={table}
  columns={columns}
  isLoading={contacts === undefined}
  searchPlaceholder="Search contacts..."
  filters={[{ key: 'status', config: STATUS_FILTER }]}
  actions={['view', 'edit', 'delete']}
  actionHandlers={handlers}
/>;
```

## Config

- `data`: source rows.
- `columns`: `@carefully-built/ui` table columns.
- `searchFields`: item keys searched with fuzzy matching.
- `filters`: select filters.
- `pageSize`: default page size.
- `initialSortState`: default sort.

## Package Owns

- Search state.
- Select filter state.
- Draft filter result counts.
- Sorting.
- Pagination.
- Empty state type: initial vs no-results.
- Wiring `TableToolbar` to `SmartTable`.

## App Owns

- Fetching data.
- Mutations.
- Domain columns.
- Custom mobile cards.
- Empty-state content.

## Open Decisions

- Add generated create/edit/detail sheets.
- Add server-side mode for large resources.
- Add URL query-state sync.
- Add bulk actions and row selection.
