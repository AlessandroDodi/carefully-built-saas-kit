# Carefully Built App Shell

Reusable dashboard shell primitives for Carefully Built SaaS apps.

## Install

```bash
bun add @carefully-built/app-shell @carefully-built/ui
```

## What It Includes

- `SidebarProvider`, `useSidebar`, and `SidebarInset`: shared collapsed/mobile sidebar state and main content offset layout.
- `AppNavigationShell`: config-driven desktop sidebar, mobile drawer, and mobile bottom navigation with slots for logo, search, and footer/org switcher.
- `resolveMobileBottomNavigation`: turns a nav config into direct bottom-nav items and overflow items.
- `ResponsiveButton`: desktop/mobile action button that can collapse labels on mobile.

## Basic Usage

```tsx
import { AppNavigationShell, SidebarInset, SidebarProvider } from '@carefully-built/app-shell';

<SidebarProvider>
  <AppNavigationShell
    currentPath={pathname}
    logo={<Logo />}
    logoHref="/dashboard"
    navItems={navItems}
    bottomNavItems={bottomNavItems}
    mobileNavigation={{ bottom: ['home', 'contacts', 'settings'] }}
    renderSearch={({ isCollapsed, isMobile, onNavigate, triggerVariant }) => (
      <CommandSearch
        isCollapsed={isCollapsed}
        isMobile={isMobile}
        onNavigate={onNavigate}
        triggerVariant={triggerVariant}
      />
    )}
    renderFooter={({ isCollapsed, isMobile }) => (
      <OrgSwitcher collapsed={isCollapsed && !isMobile} />
    )}
  />
  <SidebarInset as="main" hasMobileBottomNav>
    {children}
  </SidebarInset>
</SidebarProvider>
```

Keep app-specific nav items, org switchers, logos, search data, and route loading inside the consuming app. This package owns the repeated shell mechanics and responsive navigation behavior.
