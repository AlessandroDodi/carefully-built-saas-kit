# @carefully-built/workos

Reusable WorkOS organization creation and organization logo primitives for SaaS apps.

## Install

```bash
bun add @carefully-built/workos
```

For local development in an app inside the same parent workspace, use the packed tarball or workspace link already used by the consuming app.

## Import Paths

- `@carefully-built/workos`
- `@carefully-built/workos/server`

## Component Usage

```tsx
import { CreateOrganization } from '@carefully-built/workos';

// Check the API catalog below for the component source and prop types.
// Most components are controlled shells: pass app data, handlers, and slot content from the consuming app.
```

Components in this package:

- `CreateOrganization`: import from `@carefully-built/workos`.
- `CreateOrganizationFormContent`: import from `@carefully-built/workos`.
- `OrganizationLogo`: import from `@carefully-built/workos`.
- `OrganizationLogoDropzone`: import from `@carefully-built/workos`.
- `SidebarOrgSwitcherBase`: import from `@carefully-built/workos`.

## Hook Usage

```tsx
import { useCreateOrganizationDialog } from '@carefully-built/workos';

export function Example() {
  const state = useCreateOrganizationDialog({} as never);
  return null;
}
```

Hooks in this package:

- `useCreateOrganizationDialog`: keep app-specific data fetching and mutations in the consuming app.
- `useOrganizationLogoInput`: keep app-specific data fetching and mutations in the consuming app.

## Helper Usage

```ts
import { createFilePreview } from '@carefully-built/workos';
```

Helpers in this package:

- `createFilePreview`
- `createWorkOSWidgetTokenResponse`
- `getBestOrganizationAdminRoleSlug`
- `getOrganizationInitials`
- `getWorkOSWidgetToken`
- `ORGANIZATION_LOGO_ACCEPT`
- `ORGANIZATION_LOGO_CAPTION`
- `ORGANIZATION_LOGO_HELPER_TEXT`
- `ORGANIZATION_LOGO_MAX_SIZE`
- `uploadOrganizationLogo`
- `validateOrganizationLogo`

## Types And Schemas

- `OrganizationsResponse`
- `SidebarOrgSwitcherBaseProps`
- `WidgetScopes`
- `WidgetTokenArgs`
- `WidgetTokenSession`
- `WorkOSOrganization`
- `WorkOSOrganizationRole`
- `WorkOSWidgetTokenOptions`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `CreateOrganization` | Component | `packages/workos/src/create-organization.tsx` |
| `CreateOrganizationFormContent` | Component | `packages/workos/src/create-organization-form-content.tsx` |
| `OrganizationLogo` | Component | `packages/workos/src/sidebar-org-switcher.tsx` |
| `OrganizationLogoDropzone` | Component | `packages/workos/src/organization-logo-dropzone.tsx` |
| `SidebarOrgSwitcherBase` | Component | `packages/workos/src/sidebar-org-switcher.tsx` |
| `createFilePreview` | Helper | `packages/workos/src/organization-logo.ts` |
| `createWorkOSWidgetTokenResponse` | Helper | `packages/workos/src/server.ts` |
| `getBestOrganizationAdminRoleSlug` | Helper | `packages/workos/src/server.ts` |
| `getOrganizationInitials` | Helper | `packages/workos/src/sidebar-org-switcher.tsx` |
| `getWorkOSWidgetToken` | Helper | `packages/workos/src/server.ts` |
| `ORGANIZATION_LOGO_ACCEPT` | Helper | `packages/workos/src/organization-logo.ts` |
| `ORGANIZATION_LOGO_CAPTION` | Helper | `packages/workos/src/organization-logo.ts` |
| `ORGANIZATION_LOGO_HELPER_TEXT` | Helper | `packages/workos/src/organization-logo.ts` |
| `ORGANIZATION_LOGO_MAX_SIZE` | Helper | `packages/workos/src/organization-logo.ts` |
| `uploadOrganizationLogo` | Helper | `packages/workos/src/organization-logo.ts` |
| `validateOrganizationLogo` | Helper | `packages/workos/src/organization-logo.ts` |
| `useCreateOrganizationDialog` | Hook | `packages/workos/src/use-create-organization-dialog.ts` |
| `useOrganizationLogoInput` | Hook | `packages/workos/src/use-organization-logo-input.ts` |
| `OrganizationsResponse` | Type | `packages/workos/src/sidebar-org-switcher.tsx` |
| `SidebarOrgSwitcherBaseProps` | Type | `packages/workos/src/sidebar-org-switcher.tsx` |
| `WidgetScopes` | Type | `packages/workos/src/server.ts` |
| `WidgetTokenArgs` | Type | `packages/workos/src/server.ts` |
| `WidgetTokenSession` | Type | `packages/workos/src/server.ts` |
| `WorkOSOrganization` | Type | `packages/workos/src/sidebar-org-switcher.tsx` |
| `WorkOSOrganizationRole` | Type | `packages/workos/src/server.ts` |
| `WorkOSWidgetTokenOptions` | Type | `packages/workos/src/server.ts` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
