# Carefully Built CRUD

Config-driven CRUD table helpers for Carefully Built SaaS apps.

## Install

```bash
bun add @carefully-built/crud @carefully-built/ui
```

## What It Includes

- `useCrudTableState`: search, select filters, sorting, pagination, and empty-state derivation for table CRUD screens.
- `CrudTableView`: shared toolbar plus `SmartTable` rendering with consistent empty-state and pagination wiring.
- CRUD types for resource configs, filters, and empty-state values.

## Basic Usage

```tsx
const table = useCrudTableState({
  data: items,
  columns,
  searchFields: ["name", "description"],
  filters: [
    { key: "status", config: STATUS_FILTER },
    { key: "priority", config: PRIORITY_FILTER },
  ],
});

<CrudTableView
  state={table}
  columns={columns}
  isLoading={isLoading}
  searchPlaceholder="Search..."
  actions={["edit", "delete"]}
  actionHandlers={actionHandlers}
/>;
```

Keep domain actions, mutations, and labels inside the consuming app. This package owns the repeated table mechanics.
