'use client';

import {
  Building2,
  ExternalLink,
  LayoutDashboard,
  LogIn,
  PanelsTopLeft,
  UserPlus,
  UserRoundPlus,
  UsersRound,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  TooltipProvider,
  cn,
} from '@carefully-built/ui';
import {
  AppNavigationShell,
  SidebarInset,
  SidebarProvider,
  type NavigationItem,
} from '@carefully-built/app-shell';

import type { SuperAdminFeatureFlag, SuperAdminRole } from './types';

export interface SuperAdminActionState {
  readonly error?: string;
  readonly success?: string;
}

export type SuperAdminStateAction = (
  previousState: SuperAdminActionState,
  formData: FormData,
) => Promise<SuperAdminActionState>;

export type SuperAdminFormAction = (formData: FormData) => Promise<void>;

const defaultNavItems: readonly NavigationItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    href: '/super-admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    key: 'applications',
    label: 'Applicazioni',
    href: '/super-admin/applications',
    icon: PanelsTopLeft,
    activeMatch: 'prefix',
  },
  {
    key: 'companies',
    label: 'Aziende',
    href: '/super-admin/companies',
    icon: Building2,
    activeMatch: 'prefix',
  },
  {
    key: 'users',
    label: 'Utenti',
    href: '/super-admin/users',
    icon: UsersRound,
    activeMatch: 'prefix',
  },
] as const;

const defaultBottomNavItems: readonly NavigationItem[] = [
  {
    key: 'normal-dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    trailingIcon: ExternalLink,
  },
] as const;

function withBasePath(item: NavigationItem, basePath: string): NavigationItem {
  if (!item.href.startsWith('/super-admin')) {
    return item;
  }

  return {
    ...item,
    href: `${basePath}${item.href.slice('/super-admin'.length)}`,
  };
}

function SuperAdminLogo(): React.ReactElement {
  return (
    <>
      <div className="grid size-7 shrink-0 place-items-center rounded-md bg-[#250089] text-white">
        <PanelsTopLeft className="size-4" />
      </div>
      <span className="truncate text-sm font-semibold tracking-tight">Superadmin</span>
    </>
  );
}

function SuperAdminUserFooter({
  userName,
  isCollapsed,
  isMobile,
}: {
  readonly userName: string;
  readonly isCollapsed: boolean;
  readonly isMobile: boolean;
}): React.ReactElement {
  return (
    <div
      className={cn(
        'text-sidebar-foreground flex min-h-8 items-center gap-2 rounded-md px-1.5 text-xs font-medium',
        isCollapsed && !isMobile && 'justify-center px-0',
      )}
    >
      <div className="border-sidebar-border bg-background grid size-6 shrink-0 place-items-center rounded-[5px] border">
        <UsersRound className="size-3.5" />
      </div>
      {isCollapsed && !isMobile ? null : <span className="truncate">{userName}</span>}
    </div>
  );
}

export function SuperAdminRouteShell({
  basePath,
  children,
  currentPath,
  extraNavItems = [],
  userName,
}: {
  readonly basePath: string;
  readonly children: React.ReactNode;
  readonly currentPath: string;
  readonly extraNavItems?: readonly NavigationItem[];
  readonly userName: string;
}): React.ReactElement {
  const navItems = [...defaultNavItems.map((item) => withBasePath(item, basePath)), ...extraNavItems];
  const bottomNavItems = defaultBottomNavItems.map((item) => withBasePath(item, basePath));

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="min-h-screen bg-white">
          <AppNavigationShell
            logo={<SuperAdminLogo />}
            logoHref={`${basePath}/dashboard`}
            currentPath={currentPath}
            navItems={navItems}
            bottomNavItems={bottomNavItems}
            mobileNavigation={{
              bottom: ['dashboard', 'applications', 'companies', 'users'],
            }}
            renderFooter={({ isCollapsed, isMobile }) => (
              <SuperAdminUserFooter
                userName={userName}
                isCollapsed={isCollapsed}
                isMobile={isMobile}
              />
            )}
          />

          <SidebarInset as="main" hasMobileBottomNav className="bg-white">
            {children}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}

const initialState: SuperAdminActionState = {};

export function ApplicationAccessActions({
  addSelfAction,
  canEnter,
  enterAction,
  organizationId,
}: {
  readonly addSelfAction: SuperAdminStateAction;
  readonly canEnter: boolean;
  readonly enterAction: SuperAdminFormAction;
  readonly organizationId: string;
}): React.ReactElement {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(addSelfAction, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success(state.success);
      router.refresh();
    }

    if (state.error) {
      toast.error(state.error);
    }
  }, [router, state]);

  if (canEnter) {
    return (
      <form action={enterAction}>
        <input type="hidden" name="organizationId" value={organizationId} />
        <Button size="sm" type="submit" variant="secondary">
          <LogIn className="size-4" />
          Entra
        </Button>
      </form>
    );
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="organizationId" value={organizationId} />
      <Button size="sm" type="submit" variant="secondary" disabled={isPending}>
        <UserRoundPlus className="size-4" />
        {isPending ? 'Aggiungo...' : 'Aggiungimi'}
      </Button>
    </form>
  );
}

export function InviteUserDialog({
  inviteAction,
  organizationId,
  roles,
}: {
  readonly inviteAction: SuperAdminStateAction;
  readonly organizationId: string;
  readonly roles: readonly SuperAdminRole[];
}): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(inviteAction, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success(state.success);
      setOpen(false);
    }

    if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <UserPlus className="size-4" />
          Invita utente
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invita utente</DialogTitle>
          <DialogDescription>
            Invia un invito WorkOS per aggiungere un utente a questa applicazione.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="organizationId" value={organizationId} />

          <div className="space-y-2">
            <Label htmlFor="invite-email">Email</Label>
            <Input
              id="invite-email"
              name="email"
              type="email"
              placeholder="nome@azienda.com"
              required
            />
          </div>

          {roles.length ? (
            <div className="space-y-2">
              <Label htmlFor="invite-role">Ruolo</Label>
              <Select name="roleSlug" defaultValue={roles[0]?.slug}>
                <SelectTrigger id="invite-role" className="w-full">
                  <SelectValue placeholder="Seleziona ruolo" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.slug} value={role.slug}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Invio...' : 'Invia invito'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function FeatureFlagList({
  featureFlags,
}: {
  readonly featureFlags: readonly SuperAdminFeatureFlag[];
}): React.ReactElement {
  if (!featureFlags.length) {
    return (
      <div className="rounded-lg border border-dashed border-[#d1d5dc] px-3 py-8 text-center text-sm text-[#6a7282]">
        Nessuna feature flag configurata in WorkOS per questa applicazione.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {featureFlags.map((featureFlag) => (
        <div
          key={featureFlag.id}
          className="flex min-h-[76px] items-center justify-between gap-4 rounded-lg border border-black/10 px-3 py-3"
        >
          <div className="min-w-0">
            <div className="text-sm font-medium tracking-normal text-[#101828]">
              {featureFlag.name}
            </div>
            {featureFlag.description ? (
              <div className="mt-1 text-xs text-[#4a5565]">{featureFlag.description}</div>
            ) : null}
            <div className="mt-1 text-xs text-[#6a7282]">{featureFlag.slug}</div>
          </div>
          <Switch
            checked={featureFlag.enabled}
            disabled
            aria-label={`Feature flag ${featureFlag.name}`}
          />
        </div>
      ))}
    </div>
  );
}
