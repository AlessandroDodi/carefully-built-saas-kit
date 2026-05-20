# SmartTable

Responsive data table for CRUD and admin screens. It renders desktop table rows and mobile cards from the same column config.

## Import

```tsx
import { SmartTable, useTableSorting, type Column } from '@carefully-built/ui';
```

## Props

- `data`: rows to render.
- `columns`: column config with `header`, `accessor`, `render`, `sortable`, `sortKey`, `sortAccessor`, `hideOnMobile`, `truncate`, `align`, and `width`.
- `isLoading`: shows skeleton rows.
- `skeletonRows`: number of loading rows.
- `actions` / `actionHandlers`: built-in view/edit/delete buttons.
- `renderActions`: custom action area.
- `noDataMessage` / `noDataContent`: empty state.
- `getRowKey`: stable row key.
- `onRowClick`: clickable rows/cards.
- `renderMobileCard`: fully custom mobile card.
- `pagination`: page state and `onPageChange`.
- `stickyHeader`, `maxHeight`, `fullHeight`: table sizing.
- `sortState`, `onSortChange`: controlled sorting.

## Basic Example

```tsx
const columns: Column<Contact>[] = [
  { header: 'Name', accessor: 'name', sortable: true },
  { header: 'Email', accessor: 'email' },
  {
    header: 'Status',
    accessor: 'status',
    render: (value) => <StatusBadge value={String(value)} />,
  },
];

<SmartTable
  data={contacts}
  columns={columns}
  isLoading={contacts === undefined}
  actions={['view', 'edit', 'delete']}
  actionHandlers={{ onView: openContact, onEdit: editContact, onDelete: deleteContact }}
  getRowKey={(contact) => contact.id}
/>;
```

## Package Owns

- Desktop/mobile rendering.
- Loading skeletons.
- Sorting UI hooks.
- Built-in action buttons.
- Pagination rendering.
- Truncated content behavior.

## App Owns

- Data fetching.
- Mutations/actions.
- Domain-specific cells.
- Empty-state copy when needed.

## Open Decisions

- Add row selection/check boxes.
- Add bulk action footer.
- Add column visibility controls.
