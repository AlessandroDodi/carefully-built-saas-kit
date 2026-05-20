'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import type { ReactNode } from 'react';

import { cn } from '@carefully-built/ui';

export interface SidebarContextValue {
  readonly isCollapsed: boolean;
  readonly setIsCollapsed: (value: boolean) => void;
  readonly isMobileOpen: boolean;
  readonly setIsMobileOpen: (value: boolean) => void;
  readonly refreshOrg: () => void;
}

export const SidebarContext = createContext<SidebarContextValue>({
  isCollapsed: false,
  setIsCollapsed: () => undefined,
  isMobileOpen: false,
  setIsMobileOpen: () => undefined,
  refreshOrg: () => undefined,
});

export function useSidebar(): SidebarContextValue {
  return useContext(SidebarContext);
}

export interface SidebarInsetProps {
  readonly children: ReactNode;
  readonly as?: 'div' | 'main';
  readonly className?: string;
  readonly contentClassName?: string;
  readonly hasMobileBottomNav?: boolean;
  readonly mobileTopOffset?: boolean;
}

export function SidebarInset({
  children,
  as: Component = 'div',
  className,
  contentClassName,
  hasMobileBottomNav = false,
  mobileTopOffset = false,
}: SidebarInsetProps): React.ReactElement {
  const { isCollapsed } = useSidebar();
  const insetClassName = cn(
    'min-h-screen transition-all duration-200 ease-in-out md:pl-14',
    !isCollapsed && 'md:pl-[220px]',
    mobileTopOffset && !hasMobileBottomNav && 'pt-16 md:pt-0',
    hasMobileBottomNav && 'pb-[calc(env(safe-area-inset-bottom)+5.5rem)] md:pb-0',
    className,
  );
  const content = <div className={cn('p-4 lg:p-6', contentClassName)}>{children}</div>;

  if (Component === 'main') {
    return <main className={insetClassName}>{content}</main>;
  }

  return <div className={insetClassName}>{content}</div>;
}

interface SidebarProviderProps {
  readonly children: ReactNode;
}

export function SidebarProvider({ children }: SidebarProviderProps): React.ReactElement {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const refreshOrg = useCallback((): void => {
    globalThis.dispatchEvent(new CustomEvent('org-updated'));
  }, []);

  const contextValue = useMemo<SidebarContextValue>(
    () => ({
      isCollapsed,
      setIsCollapsed,
      isMobileOpen,
      setIsMobileOpen,
      refreshOrg,
    }),
    [isCollapsed, isMobileOpen, refreshOrg],
  );

  return <SidebarContext.Provider value={contextValue}>{children}</SidebarContext.Provider>;
}
