# @carefully-built/superadmin

Reusable superadmin UI for Carefully Built SaaS apps.

## Install

```bash
bun add @carefully-built/superadmin
```

For local development in an app inside the same parent workspace, use the packed tarball or workspace link already used by the consuming app.

## Import Paths

- `@carefully-built/superadmin`
- `@carefully-built/superadmin/server`
- `@carefully-built/superadmin/next`

## Component Usage

```tsx
import { ApplicationAccessActions } from '@carefully-built/superadmin';

// Check the API catalog below for the component source and prop types.
// Most components are controlled shells: pass app data, handlers, and slot content from the consuming app.
```

Components in this package:

- `ApplicationAccessActions`: import from `@carefully-built/superadmin`.
- `Badge`: import from `@carefully-built/superadmin`.
- `DataWarning`: import from `@carefully-built/superadmin`.
- `DeleteOrganizationDialog`: import from `@carefully-built/superadmin`.
- `FeatureFlagList`: import from `@carefully-built/superadmin`.
- `InviteUserDialog`: import from `@carefully-built/superadmin`.
- `MetricCard`: import from `@carefully-built/superadmin`.
- `OrganizationLogoMark`: import from `@carefully-built/superadmin`.
- `PlanBadge`: import from `@carefully-built/superadmin`.
- `StatusBadge`: import from `@carefully-built/superadmin`.
- `SuperAdminApplicationsList`: import from `@carefully-built/superadmin`.
- `SuperAdminApplicationsTable`: import from `@carefully-built/superadmin`.
- `SuperAdminClientPage`: import from `@carefully-built/superadmin`.
- `SuperAdminCompaniesList`: import from `@carefully-built/superadmin`.
- `SuperAdminRouteShell`: import from `@carefully-built/superadmin`.
- `SuperAdminUsersList`: import from `@carefully-built/superadmin`.
- `SuperAdminUsersTable`: import from `@carefully-built/superadmin`.
- `UserGrowthChart`: import from `@carefully-built/superadmin`.

## Helper Usage

```ts
import { Badge } from '@carefully-built/superadmin';
```

Helpers in this package:

- `Badge`
- `buildWeeklyUserRegistrations`
- `buildWeeklyUserRegistrations`
- `buildWeeklyUserRegistrations`
- `createSuperAdminDataLoader`
- `createSuperAdminDataLoader`
- `createSuperAdminDataLoader`
- `createSuperAdminHref`
- `createSuperAdminPage`
- `DataWarning`
- `formatShortDate`
- `formatShortDate`
- `formatShortDate`
- `getApplicationById`
- `getApplicationById`
- `getApplicationById`
- `getOrganizationInitials`
- `getOrganizationInitials`
- `MetricCard`
- `normalizeOrganizationLogoUrl`
- `normalizeOrganizationLogoUrl`
- `OrganizationLogoMark`
- `PlanBadge`
- `StatusBadge`
- `SuperAdminApplicationsList`
- `SuperAdminApplicationsTable`
- `SuperAdminCompaniesList`
- `SuperAdminUsersList`
- `SuperAdminUsersTable`
- `UserGrowthChart`

## Types And Schemas

- `CreateSuperAdminPageOptions`
- `SuperAdminActionState`
- `SuperAdminApplication`
- `SuperAdminClientActions`
- `SuperAdminData`
- `SuperAdminExtraNavItem`
- `SuperAdminFeatureFlag`
- `SuperAdminFormAction`
- `SuperAdminPlan`
- `SuperAdminRole`
- `SuperAdminRouteExtension`
- `SuperAdminStateAction`
- `SuperAdminStatus`
- `SuperAdminUser`
- `SuperAdminUserOrganization`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `ApplicationAccessActions` | Component | `packages/superadmin/src/next-client.tsx` |
| `Badge` | Component | `packages/superadmin/src/ui.tsx` |
| `DataWarning` | Component | `packages/superadmin/src/ui.tsx` |
| `DeleteOrganizationDialog` | Component | `packages/superadmin/src/next-client.tsx` |
| `FeatureFlagList` | Component | `packages/superadmin/src/next-client.tsx` |
| `InviteUserDialog` | Component | `packages/superadmin/src/next-client.tsx` |
| `MetricCard` | Component | `packages/superadmin/src/ui.tsx` |
| `OrganizationLogoMark` | Component | `packages/superadmin/src/ui.tsx` |
| `PlanBadge` | Component | `packages/superadmin/src/ui.tsx` |
| `StatusBadge` | Component | `packages/superadmin/src/ui.tsx` |
| `SuperAdminApplicationsList` | Component | `packages/superadmin/src/lists.tsx` |
| `SuperAdminApplicationsTable` | Component | `packages/superadmin/src/lists.tsx` |
| `SuperAdminClientPage` | Component | `packages/superadmin/src/next-client.tsx` |
| `SuperAdminCompaniesList` | Component | `packages/superadmin/src/lists.tsx` |
| `SuperAdminRouteShell` | Component | `packages/superadmin/src/next-client.tsx` |
| `SuperAdminUsersList` | Component | `packages/superadmin/src/lists.tsx` |
| `SuperAdminUsersTable` | Component | `packages/superadmin/src/lists.tsx` |
| `UserGrowthChart` | Component | `packages/superadmin/src/user-growth-chart.tsx` |
| `Badge` | Helper | `packages/superadmin/src/index.ts` |
| `buildWeeklyUserRegistrations` | Helper | `packages/superadmin/src/data-adapter.ts` |
| `buildWeeklyUserRegistrations` | Helper | `packages/superadmin/src/index.ts` |
| `buildWeeklyUserRegistrations` | Helper | `packages/superadmin/src/server.ts` |
| `createSuperAdminDataLoader` | Helper | `packages/superadmin/src/data-adapter.ts` |
| `createSuperAdminDataLoader` | Helper | `packages/superadmin/src/index.ts` |
| `createSuperAdminDataLoader` | Helper | `packages/superadmin/src/server.ts` |
| `createSuperAdminHref` | Helper | `packages/superadmin/src/navigation.ts` |
| `createSuperAdminPage` | Helper | `packages/superadmin/src/next.tsx` |
| `DataWarning` | Helper | `packages/superadmin/src/index.ts` |
| `formatShortDate` | Helper | `packages/superadmin/src/index.ts` |
| `formatShortDate` | Helper | `packages/superadmin/src/server.ts` |
| `formatShortDate` | Helper | `packages/superadmin/src/types.ts` |
| `getApplicationById` | Helper | `packages/superadmin/src/data-adapter.ts` |
| `getApplicationById` | Helper | `packages/superadmin/src/index.ts` |
| `getApplicationById` | Helper | `packages/superadmin/src/server.ts` |
| `getOrganizationInitials` | Helper | `packages/superadmin/src/index.ts` |
| `getOrganizationInitials` | Helper | `packages/superadmin/src/logo.ts` |
| `MetricCard` | Helper | `packages/superadmin/src/index.ts` |
| `normalizeOrganizationLogoUrl` | Helper | `packages/superadmin/src/index.ts` |
| `normalizeOrganizationLogoUrl` | Helper | `packages/superadmin/src/logo.ts` |
| `OrganizationLogoMark` | Helper | `packages/superadmin/src/index.ts` |
| `PlanBadge` | Helper | `packages/superadmin/src/index.ts` |
| `StatusBadge` | Helper | `packages/superadmin/src/index.ts` |
| `SuperAdminApplicationsList` | Helper | `packages/superadmin/src/index.ts` |
| `SuperAdminApplicationsTable` | Helper | `packages/superadmin/src/index.ts` |
| `SuperAdminCompaniesList` | Helper | `packages/superadmin/src/index.ts` |
| `SuperAdminUsersList` | Helper | `packages/superadmin/src/index.ts` |
| `SuperAdminUsersTable` | Helper | `packages/superadmin/src/index.ts` |
| `UserGrowthChart` | Helper | `packages/superadmin/src/index.ts` |
| `CreateSuperAdminPageOptions` | Type | `packages/superadmin/src/next.tsx` |
| `SuperAdminActionState` | Type | `packages/superadmin/src/next-client.tsx` |
| `SuperAdminApplication` | Type | `packages/superadmin/src/types.ts` |
| `SuperAdminClientActions` | Type | `packages/superadmin/src/next-client.tsx` |
| `SuperAdminData` | Type | `packages/superadmin/src/types.ts` |
| `SuperAdminExtraNavItem` | Type | `packages/superadmin/src/next-client.tsx` |
| `SuperAdminFeatureFlag` | Type | `packages/superadmin/src/types.ts` |
| `SuperAdminFormAction` | Type | `packages/superadmin/src/next-client.tsx` |
| `SuperAdminPlan` | Type | `packages/superadmin/src/types.ts` |
| `SuperAdminRole` | Type | `packages/superadmin/src/types.ts` |
| `SuperAdminRouteExtension` | Type | `packages/superadmin/src/next.tsx` |
| `SuperAdminStateAction` | Type | `packages/superadmin/src/next-client.tsx` |
| `SuperAdminStatus` | Type | `packages/superadmin/src/types.ts` |
| `SuperAdminUser` | Type | `packages/superadmin/src/types.ts` |
| `SuperAdminUserOrganization` | Type | `packages/superadmin/src/types.ts` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
