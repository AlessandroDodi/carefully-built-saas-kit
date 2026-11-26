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
- `@carefully-built/workos/organization-profile-settings`

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
- `OrganizationProfileSettings`: import from `@carefully-built/workos`.
- `SidebarOrgSwitcherBase`: import from `@carefully-built/workos`.
- `WorkOsWidgetsIntl`: import from `@carefully-built/workos`.

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
- `createOrganizationTexts`
- `createWorkOSPipesAuthorizeUrlResponse`
- `createWorkOSWidgetTokenResponse`
- `getBestOrganizationAdminRoleSlug`
- `getCurrentOrganization`
- `getOrganizationInitials`
- `getWorkOSPipesAccessToken`
- `getWorkOSWidgetToken`
- `ORGANIZATION_LOGO_ACCEPT`
- `ORGANIZATION_LOGO_CAPTION`
- `ORGANIZATION_LOGO_HELPER_TEXT`
- `ORGANIZATION_LOGO_MAX_SIZE`
- `organizationLogoTexts`
- `organizationProfileTexts`
- `orgSwitcherTexts`
- `uploadOrganizationLogo`
- `validateOrganizationLogo`
- `workosWidgetsItalian`

## Types And Schemas

- `CreateOrganizationLabels`
- `CreateOrganizationLabelsInput`
- `createWorkOSPipesConnectionStateGetHandler`
- `getWorkOSPipesConnectionState`
- `OrganizationProfileSettingsLabels`
- `OrganizationProfileSettingsOrganization`
- `OrganizationProfileSettingsProps`
- `OrganizationProfileSettingsSaveArgs`
- `OrganizationsResponse`
- `SidebarOrgSwitcherBaseProps`
- `WidgetScopes`
- `WidgetTokenArgs`
- `WidgetTokenSession`
- `WorkOSDataProvider`
- `WorkOSListDataProvidersResponse`
- `WorkOSOrganization`
- `WorkOSOrganizationRole`
- `WorkOSPipesAccessTokenError`
- `WorkOSPipesAccessTokenOptions`
- `WorkOSPipesAccessTokenResponse`
- `WorkOSPipesAccessTokenResult`
- `WorkOSPipesAuthorizeUrlOptions`
- `WorkOSPipesConnectionState`
- `WorkOSPipesConnectionStateOptions`
- `WorkOSPipesConnectionStateRouteOptions`
- `WorkOSPipesProviderContext`
- `WorkOSPipesUserContext`
- `WorkOSProviderConnection`
- `WorkOsWidgetsCatalog`
- `WorkOsWidgetsIntlProps`
- `WorkOSWidgetTokenOptions`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `CreateOrganization` | Component | `packages/workos/src/create-organization.tsx` |
| `CreateOrganizationFormContent` | Component | `packages/workos/src/create-organization-form-content.tsx` |
| `OrganizationLogo` | Component | `packages/workos/src/sidebar-org-switcher.tsx` |
| `OrganizationLogoDropzone` | Component | `packages/workos/src/organization-logo-dropzone.tsx` |
| `OrganizationProfileSettings` | Component | `packages/workos/src/organization-profile-settings.tsx` |
| `SidebarOrgSwitcherBase` | Component | `packages/workos/src/sidebar-org-switcher.tsx` |
| `WorkOsWidgetsIntl` | Component | `packages/workos/src/widgets-intl.tsx` |
| `createFilePreview` | Helper | `packages/workos/src/organization-logo.ts` |
| `createOrganizationTexts` | Helper | `packages/workos/src/workos-texts.ts` |
| `createWorkOSPipesAuthorizeUrlResponse` | Helper | `packages/workos/src/server.ts` |
| `createWorkOSWidgetTokenResponse` | Helper | `packages/workos/src/server.ts` |
| `getBestOrganizationAdminRoleSlug` | Helper | `packages/workos/src/server.ts` |
| `getCurrentOrganization` | Helper | `packages/workos/src/sidebar-org-switcher.tsx` |
| `getOrganizationInitials` | Helper | `packages/workos/src/sidebar-org-switcher.tsx` |
| `getWorkOSPipesAccessToken` | Helper | `packages/workos/src/server.ts` |
| `getWorkOSWidgetToken` | Helper | `packages/workos/src/server.ts` |
| `ORGANIZATION_LOGO_ACCEPT` | Helper | `packages/workos/src/organization-logo.ts` |
| `ORGANIZATION_LOGO_CAPTION` | Helper | `packages/workos/src/organization-logo.ts` |
| `ORGANIZATION_LOGO_HELPER_TEXT` | Helper | `packages/workos/src/organization-logo.ts` |
| `ORGANIZATION_LOGO_MAX_SIZE` | Helper | `packages/workos/src/organization-logo.ts` |
| `organizationLogoTexts` | Helper | `packages/workos/src/workos-texts.ts` |
| `organizationProfileTexts` | Helper | `packages/workos/src/workos-texts.ts` |
| `orgSwitcherTexts` | Helper | `packages/workos/src/workos-texts.ts` |
| `uploadOrganizationLogo` | Helper | `packages/workos/src/organization-logo.ts` |
| `validateOrganizationLogo` | Helper | `packages/workos/src/organization-logo.ts` |
| `workosWidgetsItalian` | Helper | `packages/workos/src/widgets-intl.tsx` |
| `useCreateOrganizationDialog` | Hook | `packages/workos/src/use-create-organization-dialog.ts` |
| `useOrganizationLogoInput` | Hook | `packages/workos/src/use-organization-logo-input.ts` |
| `CreateOrganizationLabels` | Type | `packages/workos/src/create-organization.tsx` |
| `CreateOrganizationLabelsInput` | Type | `packages/workos/src/create-organization.tsx` |
| `createWorkOSPipesConnectionStateGetHandler` | Type | `packages/workos/src/server.ts` |
| `getWorkOSPipesConnectionState` | Type | `packages/workos/src/server.ts` |
| `OrganizationProfileSettingsLabels` | Type | `packages/workos/src/organization-profile-settings.tsx` |
| `OrganizationProfileSettingsOrganization` | Type | `packages/workos/src/organization-profile-settings.tsx` |
| `OrganizationProfileSettingsProps` | Type | `packages/workos/src/organization-profile-settings.tsx` |
| `OrganizationProfileSettingsSaveArgs` | Type | `packages/workos/src/organization-profile-settings.tsx` |
| `OrganizationsResponse` | Type | `packages/workos/src/sidebar-org-switcher.tsx` |
| `SidebarOrgSwitcherBaseProps` | Type | `packages/workos/src/sidebar-org-switcher.tsx` |
| `WidgetScopes` | Type | `packages/workos/src/server.ts` |
| `WidgetTokenArgs` | Type | `packages/workos/src/server.ts` |
| `WidgetTokenSession` | Type | `packages/workos/src/server.ts` |
| `WorkOSDataProvider` | Type | `packages/workos/src/server.ts` |
| `WorkOSListDataProvidersResponse` | Type | `packages/workos/src/server.ts` |
| `WorkOSOrganization` | Type | `packages/workos/src/sidebar-org-switcher.tsx` |
| `WorkOSOrganizationRole` | Type | `packages/workos/src/server.ts` |
| `WorkOSPipesAccessTokenError` | Type | `packages/workos/src/server.ts` |
| `WorkOSPipesAccessTokenOptions` | Type | `packages/workos/src/server.ts` |
| `WorkOSPipesAccessTokenResponse` | Type | `packages/workos/src/server.ts` |
| `WorkOSPipesAccessTokenResult` | Type | `packages/workos/src/server.ts` |
| `WorkOSPipesAuthorizeUrlOptions` | Type | `packages/workos/src/server.ts` |
| `WorkOSPipesConnectionState` | Type | `packages/workos/src/server.ts` |
| `WorkOSPipesConnectionStateOptions` | Type | `packages/workos/src/server.ts` |
| `WorkOSPipesConnectionStateRouteOptions` | Type | `packages/workos/src/server.ts` |
| `WorkOSPipesProviderContext` | Type | `packages/workos/src/server.ts` |
| `WorkOSPipesUserContext` | Type | `packages/workos/src/server.ts` |
| `WorkOSProviderConnection` | Type | `packages/workos/src/server.ts` |
| `WorkOsWidgetsCatalog` | Type | `packages/workos/src/widgets-intl.tsx` |
| `WorkOsWidgetsIntlProps` | Type | `packages/workos/src/widgets-intl.tsx` |
| `WorkOSWidgetTokenOptions` | Type | `packages/workos/src/server.ts` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
