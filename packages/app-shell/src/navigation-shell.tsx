'use client';

import { ChevronLeft, ChevronRight, Ellipsis, X } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import type { ComponentType, ReactNode, SVGProps } from 'react';

import {
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  cn,
} from '@carefully-built/ui';

import { resolveMobileBottomNavigation, type DashboardMobileNavigationConfig } from './mobile-navigation';
import { useSidebar } from './sidebar';

export type NavigationIcon = ComponentType<SVGProps<SVGSVGElement>>;

export interface NavigationItem {
  readonly key: string;
  readonly label: ReactNode;
  readonly href: string;
  readonly icon: NavigationIcon;
  readonly trailingIcon?: NavigationIcon;
  readonly activeMatch?: 'exact' | 'prefix';
  readonly activePaths?: readonly string[];
}

export interface NavigationFooterRenderOptions {
  readonly isCollapsed: boolean;
  readonly isMobile: boolean;
  readonly closeMobileNavigation: () => void;
}

export interface NavigationSearchRenderOptions {
  readonly isCollapsed: boolean;
  readonly isMobile: boolean;
  readonly triggerVariant: 'sidebar' | 'bottom-nav';
  readonly onNavigate: () => void;
}

export interface AppNavigationShellProps {
  readonly currentPath: string;
  readonly logo: ReactNode;
  readonly darkLogo?: ReactNode;
  readonly logoHref?: string;
  readonly navItems: readonly NavigationItem[];
  readonly bottomNavItems?: readonly NavigationItem[];
  readonly mobileNavigation?: DashboardMobileNavigationConfig;
  readonly sidebarWidth?: number;
  readonly collapsedWidth?: number;
  readonly moreLabel?: string;
  readonly closeLabel?: string;
  readonly renderFooter?: (options: NavigationFooterRenderOptions) => ReactNode;
  readonly renderSearch?: (options: NavigationSearchRenderOptions) => ReactNode;
}

export function isNavigationItemActive(pathname: string, item: NavigationItem): boolean {
  if (item.activePaths?.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    return true;
  }

  if (pathname === item.href) {
    return true;
  }

  return item.activeMatch === 'prefix' && pathname.startsWith(`${item.href}/`);
}

function NavigationAnchor({
  children,
  className,
  href,
  onClick,
}: {
  readonly children: ReactNode;
  readonly className?: string;
  readonly href: string;
  readonly onClick?: () => void;
}): React.ReactElement {
  return (
    <a href={href} onClick={onClick} className={className}>
      {children}
    </a>
  );
}

function NavigationLogo({
  darkLogo,
  logo,
}: {
  readonly darkLogo?: ReactNode;
  readonly logo: ReactNode;
}): React.ReactElement {
  if (!darkLogo) {
    return <>{logo}</>;
  }

  return (
    <>
      <span className="contents dark:hidden">{logo}</span>
      <span className="hidden dark:contents">{darkLogo}</span>
    </>
  );
}

function DesktopNavLink({
  item,
  isCollapsed,
  pathname,
  onNavClick,
}: {
  readonly item: NavigationItem;
  readonly isCollapsed: boolean;
  readonly pathname: string;
  readonly onNavClick: () => void;
}): React.ReactElement {
  const isActive = isNavigationItemActive(pathname, item);
  const Icon = item.icon;
  const TrailingIcon = item.trailingIcon;
  const content = (
    <NavigationAnchor
      href={item.href}
      onClick={onNavClick}
      className={cn(
        'flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors',
        isActive
          ? 'bg-sidebar-primary/12 text-sidebar-primary shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--sidebar-primary)_20%,transparent)]'
          : 'text-sidebar-foreground/75 dark:text-sidebar-foreground/90 hover:bg-sidebar-accent hover:text-sidebar-primary dark:hover:text-white',
        isCollapsed && 'justify-center px-2',
      )}
    >
      <Icon className="size-4 shrink-0" />
      {!isCollapsed ? (
        <>
          <span className="min-w-0 flex-1 truncate">{item.label}</span>
          {TrailingIcon ? <TrailingIcon className="size-3.5 shrink-0 opacity-70" /> : null}
        </>
      ) : null}
    </NavigationAnchor>
  );

  if (isCollapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

function MobileNavLink({
  item,
  pathname,
  onNavClick,
}: {
  readonly item: NavigationItem;
  readonly pathname: string;
  readonly onNavClick: () => void;
}): React.ReactElement {
  const isActive = isNavigationItemActive(pathname, item);
  const Icon = item.icon;
  const TrailingIcon = item.trailingIcon;

  return (
    <NavigationAnchor
      href={item.href}
      onClick={onNavClick}
      className={cn(
        'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors',
        isActive
          ? 'bg-sidebar-primary/12 text-sidebar-primary shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--sidebar-primary)_20%,transparent)]'
          : 'text-sidebar-foreground/75 dark:text-sidebar-foreground/90 hover:bg-sidebar-accent hover:text-sidebar-primary dark:hover:text-white',
      )}
    >
      <Icon className="size-4 shrink-0" />
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {TrailingIcon ? <TrailingIcon className="size-3.5 shrink-0 opacity-70" /> : null}
    </NavigationAnchor>
  );
}

function MobileBottomNavLink({
  item,
  pathname,
  onNavClick,
}: {
  readonly item: NavigationItem;
  readonly pathname: string;
  readonly onNavClick: () => void;
}): React.ReactElement {
  const isActive = isNavigationItemActive(pathname, item);
  const Icon = item.icon;

  return (
    <NavigationAnchor
      href={item.href}
      onClick={onNavClick}
      className={cn(
        'mx-1 my-1 flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium transition-colors',
        isActive
          ? 'bg-primary/12 text-primary shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--primary)_20%,transparent)]'
          : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
      )}
    >
      <Icon className="size-5 shrink-0" />
      <span className="max-w-full truncate">{item.label}</span>
    </NavigationAnchor>
  );
}

function SidebarContent({
  bottomNavItems,
  closeLabel,
  darkLogo,
  isCollapsed,
  isMobile = false,
  logo,
  logoHref,
  navItems,
  onNavClick,
  pathname,
  renderFooter,
  renderSearch,
  setIsCollapsed,
  setIsMobileOpen,
}: {
  readonly bottomNavItems: readonly NavigationItem[];
  readonly closeLabel: string;
  readonly darkLogo?: ReactNode;
  readonly isCollapsed: boolean;
  readonly isMobile?: boolean;
  readonly logo: ReactNode;
  readonly logoHref: string;
  readonly navItems: readonly NavigationItem[];
  readonly onNavClick: () => void;
  readonly pathname: string;
  readonly renderFooter?: (options: NavigationFooterRenderOptions) => ReactNode;
  readonly renderSearch?: (options: NavigationSearchRenderOptions) => ReactNode;
  readonly setIsCollapsed: (value: boolean) => void;
  readonly setIsMobileOpen: (value: boolean) => void;
}): React.ReactElement {
  return (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          'flex min-h-12 items-center gap-2 px-2 py-3',
          isMobile && 'justify-between',
          isCollapsed && !isMobile && 'justify-center',
          !isCollapsed && 'mb-3',
        )}
      >
        {isCollapsed && !isMobile ? (
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => setIsCollapsed(false)}
          >
            <ChevronRight className="size-4" />
          </Button>
        ) : (
          <>
            <NavigationAnchor
              href={logoHref}
              className="flex min-w-0 flex-1 items-center gap-2 pl-3"
              onClick={onNavClick}
            >
              <NavigationLogo logo={logo} darkLogo={darkLogo} />
            </NavigationAnchor>
            {isMobile ? (
              <Button
                variant="ghost"
                size="icon"
                className="size-7 shrink-0"
                aria-label={closeLabel}
                onClick={() => setIsMobileOpen(false)}
              >
                <X className="size-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="size-7 shrink-0"
                onClick={() => setIsCollapsed(true)}
              >
                <ChevronLeft className="size-4" />
              </Button>
            )}
          </>
        )}
      </div>

      {renderSearch ? (
        <div className="w-full px-2 pb-3">
          {renderSearch({
            isCollapsed,
            isMobile,
            onNavigate: onNavClick,
            triggerVariant: 'sidebar',
          })}
        </div>
      ) : null}

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2">
        {navItems.map((item) =>
          isMobile ? (
            <MobileNavLink key={item.key} item={item} pathname={pathname} onNavClick={onNavClick} />
          ) : (
            <DesktopNavLink
              key={item.key}
              item={item}
              isCollapsed={isCollapsed}
              pathname={pathname}
              onNavClick={onNavClick}
            />
          ),
        )}
      </nav>

      <div className="space-y-2 px-2 py-2">
        {bottomNavItems.map((item) =>
          isMobile ? (
            <MobileNavLink key={item.key} item={item} pathname={pathname} onNavClick={onNavClick} />
          ) : (
            <DesktopNavLink
              key={item.key}
              item={item}
              isCollapsed={isCollapsed}
              pathname={pathname}
              onNavClick={onNavClick}
            />
          ),
        )}
        {renderFooter?.({
          closeMobileNavigation: onNavClick,
          isCollapsed,
          isMobile,
        })}
      </div>
    </div>
  );
}

function MobileBottomNav({
  directItems,
  overflowItems,
  moreLabel,
  onNavClick,
  pathname,
  renderFooter,
  renderSearch,
}: {
  readonly directItems: readonly NavigationItem[];
  readonly overflowItems: readonly NavigationItem[];
  readonly moreLabel: string;
  readonly onNavClick: () => void;
  readonly pathname: string;
  readonly renderFooter?: (options: NavigationFooterRenderOptions) => ReactNode;
  readonly renderSearch?: (options: NavigationSearchRenderOptions) => ReactNode;
}): React.ReactElement {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const handleOverflowClick = useCallback((): void => {
    setIsMoreOpen(false);
    onNavClick();
  }, [onNavClick]);

  if (directItems.length === 0) {
    return <></>;
  }

  return (
    <>
      <div className="bg-background/95 fixed inset-x-0 bottom-0 z-40 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        <nav className="flex min-h-16 items-stretch">
          {directItems.map((item) => (
            <MobileBottomNavLink
              key={item.key}
              item={item}
              pathname={pathname}
              onNavClick={onNavClick}
            />
          ))}
          {renderSearch?.({
            isCollapsed: false,
            isMobile: true,
            onNavigate: onNavClick,
            triggerVariant: 'bottom-nav',
          })}
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-2 py-2 text-[11px] font-medium transition-colors"
            onClick={() => setIsMoreOpen(true)}
          >
            <Ellipsis className="size-5 shrink-0" />
            <span className="max-w-full truncate">{moreLabel}</span>
          </button>
        </nav>
      </div>

      <Drawer open={isMoreOpen} onOpenChange={setIsMoreOpen}>
        <DrawerContent className="px-4 pb-[calc(env(safe-area-inset-bottom)+20px)] md:hidden">
          <DrawerHeader className="px-0 pb-4">
            <DrawerTitle>{moreLabel}</DrawerTitle>
          </DrawerHeader>
          <div className="-mx-1 flex max-h-[70vh] flex-col gap-4 overflow-y-auto px-1 pb-2">
            {overflowItems.length > 0 ? (
              <div className="flex flex-col gap-1">
                {overflowItems.map((item) => (
                  <MobileNavLink
                    key={item.key}
                    item={item}
                    pathname={pathname}
                    onNavClick={handleOverflowClick}
                  />
                ))}
              </div>
            ) : null}
            {renderFooter ? (
              <div className="border-sidebar-border border-t pt-4">
                {renderFooter({
                  closeMobileNavigation: handleOverflowClick,
                  isCollapsed: false,
                  isMobile: true,
                })}
              </div>
            ) : null}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export function AppNavigationShell({
  bottomNavItems = [],
  closeLabel = 'Close sidebar',
  collapsedWidth = 56,
  currentPath,
  darkLogo,
  logo,
  logoHref = '/',
  mobileNavigation,
  moreLabel = 'Altro',
  navItems,
  renderFooter,
  renderSearch,
  sidebarWidth = 220,
}: AppNavigationShellProps): React.ReactElement {
  const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar();
  const mobileBottomNavigation = useMemo(
    () => resolveMobileBottomNavigation(mobileNavigation, navItems, bottomNavItems),
    [bottomNavItems, mobileNavigation, navItems],
  );
  const handleNavClick = useCallback((): void => {
    setIsMobileOpen(false);
  }, [setIsMobileOpen]);
  const shouldUseMobileBottomNav = mobileBottomNavigation.enabled;

  return (
    <>
      {!shouldUseMobileBottomNav && isMobileOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-50 bg-black/50 md:hidden"
            onClick={() => setIsMobileOpen(false)}
            aria-label={closeLabel}
          />
          <aside className="border-sidebar-border bg-sidebar text-sidebar-foreground fixed inset-y-0 left-0 z-50 w-full max-w-xs border-r md:hidden">
            <SidebarContent
              bottomNavItems={bottomNavItems}
              closeLabel={closeLabel}
              darkLogo={darkLogo}
              isCollapsed={isCollapsed}
              isMobile
              logo={logo}
              logoHref={logoHref}
              navItems={navItems}
              onNavClick={handleNavClick}
              pathname={currentPath}
              renderFooter={renderFooter}
              renderSearch={renderSearch}
              setIsCollapsed={setIsCollapsed}
              setIsMobileOpen={setIsMobileOpen}
            />
          </aside>
        </>
      ) : null}

      <aside
        className="border-sidebar-border bg-sidebar text-sidebar-foreground fixed top-0 left-0 z-40 hidden h-screen flex-col border-r transition-all duration-200 ease-in-out md:flex"
        style={{ width: isCollapsed ? collapsedWidth : sidebarWidth }}
      >
        <SidebarContent
          bottomNavItems={bottomNavItems}
          closeLabel={closeLabel}
          darkLogo={darkLogo}
          isCollapsed={isCollapsed}
          logo={logo}
          logoHref={logoHref}
          navItems={navItems}
          onNavClick={handleNavClick}
          pathname={currentPath}
          renderFooter={renderFooter}
          renderSearch={renderSearch}
          setIsCollapsed={setIsCollapsed}
          setIsMobileOpen={setIsMobileOpen}
        />
      </aside>

      {mobileBottomNavigation.enabled ? (
        <MobileBottomNav
          directItems={mobileBottomNavigation.directItems}
          moreLabel={moreLabel}
          overflowItems={mobileBottomNavigation.overflowItems}
          pathname={currentPath}
          onNavClick={handleNavClick}
          renderFooter={renderFooter}
          renderSearch={renderSearch}
        />
      ) : null}
    </>
  );
}
