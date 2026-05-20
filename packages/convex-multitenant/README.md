# @carefully-built/convex-multitenant

Reusable Convex helpers for organization-scoped SaaS apps.

## What It Provides

- `requireUserInOrganization`: verifies a user belongs to an organization and is not archived.
- `findCurrentUserByWorkosId`: resolves a synced WorkOS user in the current organization, falling back to legacy WorkOS-only lookup.

## Usage

```ts
import { requireUserInOrganization } from '@carefully-built/convex-multitenant';

await requireUserInOrganization(ctx, args.currentUserId, args.organizationId);
```

The package uses structural Convex context types so each app can keep generated Convex types local.
