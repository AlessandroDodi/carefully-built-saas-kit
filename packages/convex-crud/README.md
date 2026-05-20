# @carefully-built/convex-crud

Reusable Convex CRUD helpers for SaaS resources.

## What It Provides

- `createAuditFields`
- `updateAuditFields`
- `archiveAuditFields`
- `patchWithAudit`
- `archiveWithAudit`
- `getActiveOrgRecord`
- `upsertOrganizationRecord`

## Usage

```ts
import { createAuditFields } from '@carefully-built/convex-crud';

await ctx.db.insert('contacts', {
  organizationId,
  ...data,
  ...createAuditFields(currentUserId),
});
```

Apps keep their validators and domain logic local while sharing the repetitive audit/archive mechanics.
