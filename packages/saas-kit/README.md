# Carefully Built SaaS Kit

One install for Carefully Built SaaS components and helpers.

```bash
bun add @carefully-built/saas-kit
```

```tsx
import { SmartTable, ResourcePageShell, WorkosOrganizationLogo } from '@carefully-built/saas-kit';
```

Use the CLI when you want editable source code copied into your app instead:

```bash
bunx @carefully-built/cli list
bunx @carefully-built/cli add smart-table
```

The package includes the modular Carefully Built packages as dependencies. Your app should still install the framework peer dependencies it actually uses, such as React, Next.js, Convex, WorkOS, shadcn/Radix primitives, React Hook Form, TipTap, FullCalendar, and Recharts.

For server-only helpers:

```ts
import { createWorkosOrganization } from '@carefully-built/saas-kit/server';
```

For Next.js superadmin helpers:

```tsx
import { createSuperAdminPage } from '@carefully-built/saas-kit/next';
```
