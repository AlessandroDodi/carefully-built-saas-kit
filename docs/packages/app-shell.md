# @carefully-built/app-shell

Reusable dashboard shell primitives for Carefully Built SaaS apps.

## Install

```bash
bun add @carefully-built/app-shell
```

For local development in an app inside the same parent workspace, use the packed tarball or workspace link already used by the consuming app.

## Import Paths

- `@carefully-built/app-shell`

## Component Usage

```tsx
import { AppNavigationShell } from '@carefully-built/app-shell';

// Check the API catalog below for the component source and prop types.
// Most components are controlled shells: pass app data, handlers, and slot content from the consuming app.
```

Components in this package:

- `AppNavigationShell`: import from `@carefully-built/app-shell`.
- `DashboardPageHeader`: import from `@carefully-built/app-shell`.
- `DashboardPageLayout`: import from `@carefully-built/app-shell`.
- `ResponsiveButton`: import from `@carefully-built/app-shell`.
- `SidebarContext`: import from `@carefully-built/app-shell`.
- `SidebarInset`: import from `@carefully-built/app-shell`.
- `SidebarProvider`: import from `@carefully-built/app-shell`.

## Hook Usage

```tsx
import { useSidebar } from '@carefully-built/app-shell';

export function Example() {
  const state = useSidebar({} as never);
  return null;
}
```

Hooks in this package:

- `useSidebar`: keep app-specific data fetching and mutations in the consuming app.
- `useSidebar`: keep app-specific data fetching and mutations in the consuming app.

## Helper Usage

```ts
import { AppNavigationShell } from '@carefully-built/app-shell';
```

Helpers in this package:

- `AppNavigationShell`
- `DashboardPageHeader`
- `DashboardPageLayout`
- `resolveMobileBottomNavigation`
- `resolveMobileBottomNavigation`
- `ResponsiveButton`
- `SidebarContext`
- `SidebarInset`
- `SidebarProvider`

## Types And Schemas

- `AppNavigationShellProps`
- `DashboardMobileNavigationConfig`
- `DashboardPageHeaderProps`
- `DashboardPageLayoutProps`
- `isNavigationItemActive`
- `isNavigationItemActive`
- `KeyedNavigationItem`
- `NavigationFooterRenderOptions`
- `NavigationIcon`
- `NavigationItem`
- `NavigationSearchRenderOptions`
- `ResolvedMobileBottomNavigation`
- `resolveResponsiveButtonState`
- `resolveResponsiveButtonState`
- `ResponsiveButtonProps`
- `ResponsiveButtonState`
- `SidebarContextValue`
- `SidebarInsetProps`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `AppNavigationShell` | Component | `packages/app-shell/src/navigation-shell.tsx` |
| `DashboardPageHeader` | Component | `packages/app-shell/src/dashboard-page-layout.tsx` |
| `DashboardPageLayout` | Component | `packages/app-shell/src/dashboard-page-layout.tsx` |
| `ResponsiveButton` | Component | `packages/app-shell/src/responsive-button.tsx` |
| `SidebarContext` | Component | `packages/app-shell/src/sidebar.tsx` |
| `SidebarInset` | Component | `packages/app-shell/src/sidebar.tsx` |
| `SidebarProvider` | Component | `packages/app-shell/src/sidebar.tsx` |
| `AppNavigationShell` | Helper | `packages/app-shell/src/index.ts` |
| `DashboardPageHeader` | Helper | `packages/app-shell/src/index.ts` |
| `DashboardPageLayout` | Helper | `packages/app-shell/src/index.ts` |
| `resolveMobileBottomNavigation` | Helper | `packages/app-shell/src/index.ts` |
| `resolveMobileBottomNavigation` | Helper | `packages/app-shell/src/mobile-navigation.ts` |
| `ResponsiveButton` | Helper | `packages/app-shell/src/index.ts` |
| `SidebarContext` | Helper | `packages/app-shell/src/index.ts` |
| `SidebarInset` | Helper | `packages/app-shell/src/index.ts` |
| `SidebarProvider` | Helper | `packages/app-shell/src/index.ts` |
| `useSidebar` | Hook | `packages/app-shell/src/index.ts` |
| `useSidebar` | Hook | `packages/app-shell/src/sidebar.tsx` |
| `AppNavigationShellProps` | Type | `packages/app-shell/src/navigation-shell.tsx` |
| `DashboardMobileNavigationConfig` | Type | `packages/app-shell/src/mobile-navigation.ts` |
| `DashboardPageHeaderProps` | Type | `packages/app-shell/src/dashboard-page-layout.tsx` |
| `DashboardPageLayoutProps` | Type | `packages/app-shell/src/dashboard-page-layout.tsx` |
| `isNavigationItemActive` | Type | `packages/app-shell/src/index.ts` |
| `isNavigationItemActive` | Type | `packages/app-shell/src/navigation-shell.tsx` |
| `KeyedNavigationItem` | Type | `packages/app-shell/src/mobile-navigation.ts` |
| `NavigationFooterRenderOptions` | Type | `packages/app-shell/src/navigation-shell.tsx` |
| `NavigationIcon` | Type | `packages/app-shell/src/navigation-shell.tsx` |
| `NavigationItem` | Type | `packages/app-shell/src/navigation-shell.tsx` |
| `NavigationSearchRenderOptions` | Type | `packages/app-shell/src/navigation-shell.tsx` |
| `ResolvedMobileBottomNavigation` | Type | `packages/app-shell/src/mobile-navigation.ts` |
| `resolveResponsiveButtonState` | Type | `packages/app-shell/src/index.ts` |
| `resolveResponsiveButtonState` | Type | `packages/app-shell/src/responsive-button.tsx` |
| `ResponsiveButtonProps` | Type | `packages/app-shell/src/responsive-button.tsx` |
| `ResponsiveButtonState` | Type | `packages/app-shell/src/responsive-button.tsx` |
| `SidebarContextValue` | Type | `packages/app-shell/src/sidebar.tsx` |
| `SidebarInsetProps` | Type | `packages/app-shell/src/sidebar.tsx` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
