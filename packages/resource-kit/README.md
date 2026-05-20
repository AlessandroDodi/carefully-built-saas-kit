# @carefully-built/resource-kit

Shared resource-page helpers for SaaS CRUD screens. Use this package for state and adapters that repeat across contacts, requests, documents, activities, notes, and other org-scoped resources.

## What It Provides

- `useResourceSheetState`: create/edit sheet state for a resource list.
- Keeps the selected resource derived from the current list, so refreshes and mutations do not leave stale objects in app state.
- Adapter-friendly: the app owns data loading, mutations, copy, routing, and domain logic.

## Usage

```tsx
import { useResourceSheetState } from '@carefully-built/resource-kit';

const sheet = useResourceSheetState({
  items: contacts,
  getItemId: (contact) => contact._id,
});

return (
  <ContactSheet
    contact={sheet.editingItem}
    open={sheet.isOpen}
    onOpenChange={sheet.syncOpen}
  />
);
```

## Adapter Pattern

Packages should own generic state and UI contracts. Product apps should pass:

- resource items
- id extractors
- mutation callbacks
- labels/copy
- app-specific form schemas
