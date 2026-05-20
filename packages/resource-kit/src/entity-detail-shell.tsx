'use client';

import { useSidebar } from '@carefully-built/app-shell';
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  ScrollFadeArea,
  Tabs,
  TabsList,
  TabsScrollArea,
  TabsTrigger,
  cn,
} from '@carefully-built/ui';
import { ArrowLeft, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import type { CSSProperties, ReactNode } from 'react';

export interface EntityDetailTabOption<TValue extends string> {
  readonly value: TValue;
  readonly label: string;
  readonly icon?: ReactNode;
  readonly count?: number;
}

interface EntityDetailShellProps<TValue extends string> {
  readonly title: ReactNode;
  readonly actions?: ReactNode;
  readonly tabs: readonly EntityDetailTabOption<TValue>[];
  readonly activeTab: TValue;
  readonly onTabChange: (value: TValue) => void;
  readonly sidebar?: ReactNode;
  readonly showSidebar?: boolean;
  readonly mobileSidebarLabel?: string;
  readonly children: ReactNode;
  readonly className?: string;
}

export function EntityDetailShell<TValue extends string>({
  title,
  actions,
  tabs,
  activeTab,
  onTabChange,
  sidebar,
  showSidebar = false,
  mobileSidebarLabel,
  children,
  className,
}: EntityDetailShellProps<TValue>): React.ReactElement {
  const router = useRouter();
  const { isCollapsed } = useSidebar();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const shouldShowMobileSidebarTrigger =
    showSidebar && Boolean(sidebar) && Boolean(mobileSidebarLabel);
  const compactSidebarTriggerOffset = isCollapsed ? 'calc(56px + 1rem)' : 'calc(220px + 1rem)';

  useEffect(() => {
    if (!shouldShowMobileSidebarTrigger && isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    }
  }, [isMobileSidebarOpen, shouldShowMobileSidebarTrigger]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const desktopSidebarMediaQuery = window.matchMedia('(min-width: 1280px)');
    const closeCompactSidebar = (event: MediaQueryListEvent): void => {
      if (event.matches) {
        setIsMobileSidebarOpen(false);
      }
    };

    desktopSidebarMediaQuery.addEventListener('change', closeCompactSidebar);

    if (desktopSidebarMediaQuery.matches) {
      setIsMobileSidebarOpen(false);
    }

    return () => {
      desktopSidebarMediaQuery.removeEventListener('change', closeCompactSidebar);
    };
  }, []);

  const tabsMarkup = (
    <TabsScrollArea className="pt-1">
      <TabsList className="min-w-max touch-pan-x">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5">
            {tab.icon}
            <span>{tab.label}</span>
            {typeof tab.count === 'number' ? (
              <span className="text-muted-foreground text-[11px] leading-none">{tab.count}</span>
            ) : null}
          </TabsTrigger>
        ))}
      </TabsList>
    </TabsScrollArea>
  );

  return (
    <div className="relative flex h-[calc(100vh-theme(spacing.16)-theme(spacing.8))] flex-col md:h-[calc(100vh-theme(spacing.12))]">
      <div className="flex shrink-0 items-center justify-between gap-4 px-0">
        <div className="flex min-w-0 items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => {
              router.back();
            }}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <h1 className="truncate text-xl font-semibold tracking-tight">{title}</h1>
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(nextValue) => {
          if (nextValue) {
            onTabChange(nextValue as TValue);
          }
        }}
        className="mt-2 flex min-h-0 flex-1 flex-col"
      >
        {showSidebar ? (
          <div
            className={cn(
              'grid min-h-0 flex-1 xl:grid-cols-[minmax(0,1fr)_394px] xl:gap-3',
              className,
            )}
          >
            <div className="flex min-h-0 min-w-0 flex-col">
              {tabsMarkup}
              <ScrollFadeArea
                className="min-h-0 flex-1"
                scrollbarVisibility="section-hover"
                viewportClassName={cn(
                  'pt-3',
                  shouldShowMobileSidebarTrigger ? 'pb-28 md:pb-20 lg:pb-24' : null,
                  'xl:pb-0',
                )}
              >
                {children}
              </ScrollFadeArea>
            </div>
            <ScrollFadeArea
              className="hidden min-h-0 min-w-0 xl:block"
              scrollbarVisibility="section-hover"
              viewportClassName="pt-0"
            >
              {sidebar}
            </ScrollFadeArea>
          </div>
        ) : (
          <>
            {tabsMarkup}
            <ScrollFadeArea
              className={cn('min-h-0 flex-1', className)}
              scrollbarVisibility="section-hover"
              viewportClassName="pt-3"
            >
              {children}
            </ScrollFadeArea>
          </>
        )}
      </Tabs>

      {shouldShowMobileSidebarTrigger ? (
        <>
          <button
            type="button"
            className="border-border bg-background fixed inset-x-4 bottom-[calc(env(safe-area-inset-bottom)+5.5rem+8px)] z-40 flex items-center justify-between rounded-[18px] border px-4 py-3 text-left shadow-[0_18px_40px_rgba(15,23,42,0.12)] md:right-4 md:bottom-4 md:left-[var(--detail-compact-sidebar-offset)] lg:right-6 lg:bottom-6 xl:hidden"
            onClick={() => {
              setIsMobileSidebarOpen(true);
            }}
            style={
              {
                '--detail-compact-sidebar-offset': compactSidebarTriggerOffset,
              } as CSSProperties
            }
          >
            <span className="text-foreground text-sm font-medium">{mobileSidebarLabel}</span>
            <ChevronUp className="text-muted-foreground size-4" />
          </button>

          <Drawer open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
            <DrawerContent className="px-4 pb-[calc(env(safe-area-inset-bottom)+20px)]">
              <DrawerHeader className="px-0 pb-4">
                <DrawerTitle>{mobileSidebarLabel}</DrawerTitle>
              </DrawerHeader>
              <ScrollFadeArea
                className="-mx-1 flex-1"
                scrollbarVisibility="section-hover"
                viewportClassName="px-1 pb-3"
              >
                {sidebar}
              </ScrollFadeArea>
            </DrawerContent>
          </Drawer>
        </>
      ) : null}
    </div>
  );
}
