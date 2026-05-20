'use client';

import { ChevronDown, Plus, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import {
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@carefully-built/ui';

export interface WorkOSOrganization {
  readonly id: string;
  readonly name: string;
  readonly role?: string;
}

export interface OrganizationsResponse<TOrganization extends WorkOSOrganization> {
  readonly organizations: readonly TOrganization[];
  readonly currentOrganizationId?: string | null;
}

export interface SidebarOrgSwitcherBaseProps<TOrganization extends WorkOSOrganization> {
  readonly canAccessSuperAdmin?: boolean;
  readonly collapsed?: boolean;
  readonly createOrganization: (props: {
    readonly children: React.ReactNode;
    readonly onCreated: (orgId: string) => void;
  }) => React.ReactElement;
  readonly currentOrganizationId?: string | null;
  readonly dashboardHref?: string;
  readonly fetchOrganizations: () => Promise<OrganizationsResponse<TOrganization>>;
  readonly initialOrganizationId?: string | null;
  readonly initialOrganizations?: readonly TOrganization[];
  readonly mobileSheet?: boolean;
  readonly onContextOrganizationChange?: (orgId: string) => void;
  readonly onSwitch?: (orgId: string) => void;
  readonly renderLogo: (props: {
    readonly org: Pick<TOrganization, 'id' | 'name'>;
    readonly size: 'sm' | 'md';
    readonly className?: string;
  }) => React.ReactNode;
  readonly switchOrganization: (orgId: string) => Promise<{ readonly redirectUrl?: string } | void>;
  readonly superAdminHref?: string;
}

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

function getCurrentOrganization<TOrganization extends WorkOSOrganization>(
  organizations: readonly TOrganization[],
  activeOrganizationId: string | null | undefined,
): TOrganization | null {
  if (!organizations.length) {
    return null;
  }

  if (!activeOrganizationId) {
    return organizations[0] ?? null;
  }

  return (
    organizations.find((organization) => organization.id === activeOrganizationId) ??
    organizations[0] ??
    null
  );
}

function FallbackOrgLogo({
  name,
  size,
}: {
  readonly name: string;
  readonly size: 'sm' | 'md';
}): React.ReactElement {
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={cx(
        'bg-primary/10 text-primary flex shrink-0 items-center justify-center rounded-md font-semibold',
        size === 'sm' ? 'size-6 text-xs' : 'size-8 text-xs',
      )}
    >
      {initials || 'O'}
    </div>
  );
}

export function SidebarOrgSwitcherBase<TOrganization extends WorkOSOrganization>({
  canAccessSuperAdmin = false,
  collapsed = false,
  createOrganization: CreateOrganization,
  currentOrganizationId,
  dashboardHref = '/dashboard/home',
  fetchOrganizations,
  initialOrganizationId = null,
  initialOrganizations = [],
  mobileSheet = false,
  onContextOrganizationChange,
  onSwitch,
  renderLogo,
  switchOrganization,
  superAdminHref = '/super-admin/dashboard',
}: SidebarOrgSwitcherBaseProps<TOrganization>): React.ReactElement {
  const router = useRouter();
  const [organizations, setOrganizations] = useState([...initialOrganizations]);
  const [currentOrg, setCurrentOrg] = useState<TOrganization | null>(() =>
    getCurrentOrganization(initialOrganizations, initialOrganizationId),
  );
  const [isLoading, setIsLoading] = useState(initialOrganizations.length === 0);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

  const fetchOrgs = useCallback((): void => {
    if (organizations.length === 0 && currentOrg === null) {
      setIsLoading(true);
    }

    fetchOrganizations()
      .then((data) => {
        setOrganizations([...data.organizations]);
        const activeOrganizationId = data.currentOrganizationId ?? currentOrganizationId;
        const nextOrganization = getCurrentOrganization(data.organizations, activeOrganizationId);

        setCurrentOrg(nextOrganization);

        if (nextOrganization && nextOrganization.id !== currentOrganizationId) {
          onContextOrganizationChange?.(nextOrganization.id);
        }
      })
      .catch(() => {
        // Keep the existing organization visible when refresh fails.
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [
    currentOrg,
    currentOrganizationId,
    fetchOrganizations,
    onContextOrganizationChange,
    organizations.length,
  ]);

  useEffect(() => {
    setOrganizations([...initialOrganizations]);
    setCurrentOrg(getCurrentOrganization(initialOrganizations, initialOrganizationId));
    setIsLoading(initialOrganizations.length === 0);
  }, [initialOrganizationId, initialOrganizations]);

  useEffect(() => {
    if (initialOrganizations.length === 0) {
      fetchOrgs();
    }

    const handleOrgUpdate = (): void => {
      fetchOrgs();
    };

    globalThis.addEventListener('org-updated', handleOrgUpdate);
    return (): void => {
      globalThis.removeEventListener('org-updated', handleOrgUpdate);
    };
  }, [fetchOrgs, initialOrganizations.length]);

  const handleSwitch = async (org: TOrganization): Promise<void> => {
    try {
      const result = await switchOrganization(org.id);

      if (result?.redirectUrl) {
        globalThis.location.href = result.redirectUrl;
        return;
      }

      setIsMobileSheetOpen(false);
      setCurrentOrg(org);
      onContextOrganizationChange?.(org.id);
      onSwitch?.(org.id);
      router.push(dashboardHref);
      router.refresh();
    } catch (error) {
      console.error('Impossibile cambiare organizzazione:', error);
    }
  };

  const handleCreated = (orgId: string): void => {
    fetchOrganizations()
      .then((data) => {
        setOrganizations([...data.organizations]);
        const newOrg = data.organizations.find((organization) => organization.id === orgId);
        if (newOrg) {
          setCurrentOrg(newOrg);
          onContextOrganizationChange?.(newOrg.id);
        }
      })
      .catch(() => {
        // The creator already completed; a later refresh can recover the list.
      });

    onSwitch?.(orgId);
    router.refresh();
  };

  const logoFor = (
    org: Pick<TOrganization, 'id' | 'name'>,
    size: 'sm' | 'md',
    className?: string,
  ): React.ReactNode => renderLogo({ org, size, className }) ?? <FallbackOrgLogo name={org.name} size={size} />;

  const dropdownContent = (
    <DropdownMenuContent align={collapsed ? 'center' : 'start'} className="w-56">
      <DropdownMenuLabel>Organizzazioni</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {canAccessSuperAdmin ? (
        <>
          <DropdownMenuItem asChild>
            <Link href={superAdminHref}>
              <ShieldCheck className="mr-2 size-4" />
              Super admin
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
        </>
      ) : null}
      {organizations.map((org) => (
        <DropdownMenuItem
          key={org.id}
          className={cx(currentOrg?.id === org.id && 'bg-accent')}
          onClick={(): void => {
            void handleSwitch(org);
          }}
        >
          {logoFor(org, 'sm', 'mr-2')}
          <span className="truncate">{org.name}</span>
        </DropdownMenuItem>
      ))}
      {organizations.length === 0 ? (
        <DropdownMenuItem disabled>Nessuna organizzazione</DropdownMenuItem>
      ) : null}
      <DropdownMenuSeparator />
      <CreateOrganization onCreated={handleCreated}>
        <DropdownMenuItem
          onSelect={(event): void => {
            event.preventDefault();
          }}
        >
          <Plus className="mr-2 size-4" />
          Crea organizzazione
        </DropdownMenuItem>
      </CreateOrganization>
    </DropdownMenuContent>
  );

  const showSkeleton = isLoading && currentOrg === null;
  const organizationName = currentOrg?.name ?? (showSkeleton ? null : 'Seleziona organizzazione');

  if (mobileSheet) {
    return (
      <Drawer open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
        <Button
          className="h-10 w-full justify-between px-2"
          variant="ghost"
          onClick={() => {
            setIsMobileSheetOpen(true);
          }}
        >
          <span className="flex min-w-0 items-center gap-2">
            {currentOrg ? (
              logoFor(currentOrg, 'sm')
            ) : showSkeleton ? (
              <Skeleton className="size-6 shrink-0 rounded" />
            ) : (
              <FallbackOrgLogo name="Organizzazione" size="sm" />
            )}
            {showSkeleton ? (
              <Skeleton className="h-4 w-32" />
            ) : (
              <span className="truncate text-sm">{organizationName}</span>
            )}
          </span>
          <ChevronDown className="size-4 shrink-0 opacity-50" />
        </Button>
        <DrawerContent className="px-4 pb-[calc(env(safe-area-inset-bottom)+20px)]">
          <DrawerHeader className="px-0 pb-4">
            <DrawerTitle>Organizzazioni</DrawerTitle>
          </DrawerHeader>
          <div className="-mx-1 flex max-h-[70vh] flex-col gap-1 overflow-y-auto px-1 pb-2">
            {canAccessSuperAdmin ? (
              <Button className="justify-start gap-2 px-2.5" variant="ghost" asChild>
                <Link
                  href={superAdminHref}
                  onClick={() => {
                    setIsMobileSheetOpen(false);
                  }}
                >
                  <ShieldCheck className="size-4" />
                  Super admin
                </Link>
              </Button>
            ) : null}
            {organizations.map((org) => (
              <button
                key={org.id}
                type="button"
                className={cx(
                  'flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition-colors',
                  currentOrg?.id === org.id
                    ? 'bg-[rgba(151,112,255,0.17)] text-[#250089] dark:bg-[rgba(151,112,255,0.24)] dark:text-white'
                    : 'text-sidebar-foreground/75 dark:text-sidebar-foreground/90 hover:bg-sidebar-accent hover:text-sidebar-primary dark:hover:text-white',
                )}
                onClick={() => {
                  void handleSwitch(org);
                }}
              >
                {logoFor(org, 'sm')}
                <span className="truncate">{org.name}</span>
              </button>
            ))}
            {organizations.length === 0 ? (
              <div className="text-muted-foreground px-2.5 py-2 text-sm">
                Nessuna organizzazione
              </div>
            ) : null}
          </div>
          <div className="border-t pt-4">
            <CreateOrganization onCreated={handleCreated}>
              <Button className="w-full justify-start gap-2" variant="ghost">
                <Plus className="size-4" />
                Crea organizzazione
              </Button>
            </CreateOrganization>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  if (collapsed) {
    return (
      <DropdownMenu>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button className="h-10 w-full" size="icon" variant="ghost">
                {currentOrg ? (
                  logoFor(currentOrg, 'md')
                ) : showSkeleton ? (
                  <Skeleton className="size-8 rounded-md" />
                ) : (
                  <FallbackOrgLogo name="Organizzazione" size="md" />
                )}
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right">{currentOrg?.name ?? 'Organizzazione'}</TooltipContent>
        </Tooltip>
        {dropdownContent}
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-10 w-full justify-between px-2" variant="ghost">
          <span className="flex min-w-0 items-center gap-2">
            {currentOrg ? (
              logoFor(currentOrg, 'sm')
            ) : showSkeleton ? (
              <Skeleton className="size-6 shrink-0 rounded" />
            ) : (
              <FallbackOrgLogo name="Organizzazione" size="sm" />
            )}
            {showSkeleton ? (
              <Skeleton className="h-4 w-32" />
            ) : (
              <span className="truncate text-sm">{organizationName}</span>
            )}
          </span>
          <ChevronDown className="size-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      {dropdownContent}
    </DropdownMenu>
  );
}
