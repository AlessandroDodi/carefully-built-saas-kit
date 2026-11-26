# @carefully-built/saas-kit

One-install Carefully Built SaaS Kit package for React, Next.js, Convex, WorkOS, and editable SaaS components.

## Install

```bash
bun add @carefully-built/saas-kit
```

For local development in an app inside the same parent workspace, use the packed tarball or workspace link already used by the consuming app.

## Import Paths

- `@carefully-built/saas-kit`
- `@carefully-built/saas-kit/agenda`
- `@carefully-built/saas-kit/app-shell`
- `@carefully-built/saas-kit/association-picker`
- `@carefully-built/saas-kit/audio`
- `@carefully-built/saas-kit/auth-pages`
- `@carefully-built/saas-kit/automations`
- `@carefully-built/saas-kit/charts`
- `@carefully-built/saas-kit/convex-crud`
- `@carefully-built/saas-kit/convex-multitenant`
- `@carefully-built/saas-kit/convex-platform`
- `@carefully-built/saas-kit/convex-workos`
- `@carefully-built/saas-kit/crud`
- `@carefully-built/saas-kit/elevenlabs`
- `@carefully-built/saas-kit/elevenlabs-react`
- `@carefully-built/saas-kit/custom-fields`
- `@carefully-built/saas-kit/files`
- `@carefully-built/saas-kit/forms`
- `@carefully-built/saas-kit/import-export`
- `@carefully-built/saas-kit/kanban`
- `@carefully-built/saas-kit/legal-ui`
- `@carefully-built/saas-kit/maps-ui`
- `@carefully-built/saas-kit/notes`
- `@carefully-built/saas-kit/notifications`
- `@carefully-built/saas-kit/offline`
- `@carefully-built/saas-kit/offline/react`
- `@carefully-built/saas-kit/organizations`
- `@carefully-built/saas-kit/resource-kit`
- `@carefully-built/saas-kit/rich-text`
- `@carefully-built/saas-kit/search`
- `@carefully-built/saas-kit/settings-ui`
- `@carefully-built/saas-kit/signature`
- `@carefully-built/saas-kit/superadmin`
- `@carefully-built/saas-kit/theme-ui`
- `@carefully-built/saas-kit/ui`
- `@carefully-built/saas-kit/user-picker`
- `@carefully-built/saas-kit/widgets`
- `@carefully-built/saas-kit/workos`
- `@carefully-built/saas-kit/workos/organization-profile-settings`
- `@carefully-built/saas-kit/auth-pages/forms`
- `@carefully-built/saas-kit/auth-pages/controllers`
- `@carefully-built/saas-kit/auth-pages/config`
- `@carefully-built/saas-kit/auth-pages/organizations`
- `@carefully-built/saas-kit/auth-pages/pages`
- `@carefully-built/saas-kit/auth-pages/social`
- `@carefully-built/saas-kit/auth-pages/workos`
- `@carefully-built/saas-kit/agenda/styles.css`
- `@carefully-built/saas-kit/theme/base.css`
- `@carefully-built/saas-kit/theme/workos-widgets.css`
- `@carefully-built/saas-kit/theme/presets/mono.css`
- `@carefully-built/saas-kit/theme/presets/teal.css`
- `@carefully-built/saas-kit/theme/styles/soft.css`
- `@carefully-built/saas-kit/files/convex`
- `@carefully-built/saas-kit/next`
- `@carefully-built/saas-kit/search/command-palette`
- `@carefully-built/saas-kit/server`
- `@carefully-built/saas-kit/settings/client`

## Component Usage

```tsx
import { AppNavigationShell } from '@carefully-built/saas-kit';

// Check the API catalog below for the component source and prop types.
// Most components are controlled shells: pass app data, handlers, and slot content from the consuming app.
```

Components in this package:

- `AppNavigationShell`: import from `@carefully-built/saas-kit`.
- `NextNavigationLink`: import from `@carefully-built/saas-kit`.

## Helper Usage

```ts
import { AppNavigationShell } from '@carefully-built/saas-kit';
```

Helpers in this package:

- `AppNavigationShell`
- `NextNavigationLink`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `AppNavigationShell` | Component | `packages/saas-kit/src/app-shell/next-navigation-shell.tsx` |
| `NextNavigationLink` | Component | `packages/saas-kit/src/app-shell/next-navigation-shell.tsx` |
| `AppNavigationShell` | Helper | `packages/saas-kit/src/app-shell.ts` |
| `NextNavigationLink` | Helper | `packages/saas-kit/src/app-shell.ts` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
