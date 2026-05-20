# @carefully-built/superadmin

Reusable superadmin UI for SaaS apps.

Exports list/table views for applications, companies, users, metric cards, status/plan badges, organization logo marks, and the user growth chart.

Server-only helpers live at `@carefully-built/superadmin/server` so Next server pages can load WorkOS data without importing the client component entrypoint.

```ts
import { createSuperAdminDataLoader } from '@carefully-built/superadmin/server';

export const getSuperAdminData = createSuperAdminDataLoader({
  workos,
  getOrganizationLogoUrl,
});
```

The consuming app keeps auth checks, route protection, mutations, and app-specific data adapters.
