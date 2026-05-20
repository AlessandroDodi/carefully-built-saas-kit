'use client';

export {
  DashboardPageHeader,
  DashboardPageLayout,
  type DashboardPageHeaderProps,
  type DashboardPageLayoutProps,
} from './dashboard-page-layout';
export {
  SidebarContext,
  SidebarInset,
  SidebarProvider,
  useSidebar,
  type SidebarContextValue,
  type SidebarInsetProps,
} from './sidebar';
export {
  AppNavigationShell,
  isNavigationItemActive,
  type AppNavigationShellProps,
  type NavigationFooterRenderOptions,
  type NavigationIcon,
  type NavigationItem,
  type NavigationSearchRenderOptions,
} from './navigation-shell';
export {
  resolveMobileBottomNavigation,
  type DashboardMobileNavigationConfig,
  type KeyedNavigationItem,
  type ResolvedMobileBottomNavigation,
} from './mobile-navigation';
export {
  ResponsiveButton,
  resolveResponsiveButtonState,
  type ResponsiveButtonProps,
  type ResponsiveButtonState,
} from './responsive-button';
