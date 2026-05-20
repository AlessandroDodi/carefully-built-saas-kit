# @carefully-built/imports

Reusable import/export primitives for SaaS apps.

## Includes

- `EntityImportSheet` for a standard import flow shell.
- `parseTabularImportRows` for CSV parsing and normalized headers.
- Generic import preview row types.
- Contact import schema, template, and preview builder as a reusable example.

## Example

```tsx
import {
  EntityImportSheet,
  parseTabularImportRows,
  parseImportedContactRow,
  buildContactImportPreview,
} from '@carefully-built/imports';
```
