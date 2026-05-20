# @carefully-built/convex-workos

Reusable Convex helpers for WorkOS-backed SaaS apps.

## What it provides

- Builds normalized user fields from WorkOS profile data.
- Upserts base user records and organization-scoped user records.
- Patches every local user row for a WorkOS user after profile changes.
- Deletes every local user row for a WorkOS user when needed.

## Usage

```ts
import { upsertWorkosUserRecord } from '@carefully-built/convex-workos';

await upsertWorkosUserRecord(ctx, {
  tableName: 'users',
  user,
  organizationId,
  role: 'member',
});
```

The app still owns its generated Convex `Doc`/`Id` types and can wrap these helpers with thin typed adapters.
