# `@carefully-built/convex-platform`

Reusable Convex helpers for multitenant SaaS apps.

## What It Includes

- Shared entity association types.
- Association value builders and type labels.
- Organization-scoped association labels.
- Association option listing across contacts, properties, requests, opportunities, activities, notes, and documents.

## Example

```ts
import { listAssociationOptions } from "@carefully-built/convex-platform";

export async function listOptions(ctx, organizationId: string) {
  return listAssociationOptions(ctx, organizationId);
}
```

The package uses structural Convex context types so apps can keep their generated
Convex types locally while reusing the common platform logic.
