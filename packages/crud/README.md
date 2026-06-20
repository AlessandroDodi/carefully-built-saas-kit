# Carefully Built CRUD

Config-driven CRUD table helpers for Carefully Built SaaS apps.

## Install

```bash
bun add @carefully-built/crud @carefully-built/ui
```

## What It Includes

- `useCrudTableState`: search, select filters, sorting, pagination, and empty-state derivation for table CRUD screens.
- `CrudTableView`: shared toolbar plus `SmartTable` rendering with consistent empty-state and pagination wiring.
- `CrudListTable`: direct CRUD table wrapper for pages that already own their toolbar/filter layout.
- `CrudResourceSheet`: responsive create/edit sheet for resource forms, with confirm/cancel footer wiring.
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

## Sheet Usage

Use `CrudResourceSheet` for create/edit forms instead of wiring `ResponsiveSheet` repeatedly in each app.

```tsx
<CrudResourceSheet
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Edit contact"
  description="Update the contact details."
  formId="contact-form"
  confirmLabel="Save"
  confirmLoading={isSaving}
  classes={{
    body: 'gap-4',
    footer: 'border-t',
  }}
>
  <ContactForm id="contact-form" />
</CrudResourceSheet>
```

`className`, `contentClassName`, `footerClassName`, and `classes` are optional. Omit them to keep the default kit style.

## Component Docs

- [CRUD Table](./docs/crud-table.md)
