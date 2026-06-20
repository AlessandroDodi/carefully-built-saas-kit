'use client';

import {
  BarChart3,
  Building2,
  ExternalLink,
  LayoutDashboard,
  LogIn,
  PanelsTopLeft,
  Sparkles,
  Trash2,
  UserPlus,
  UserRoundPlus,
  UsersRound,
  Workflow,
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
  DashboardPageLayout,
  SidebarInset,
  SidebarProvider,
  type NavigationItem,
} from '@carefully-built/app-shell';

import {
  SuperAdminApplicationsList,
  SuperAdminApplicationsTable,
  SuperAdminCompaniesList,
  SuperAdminUsersList,
  SuperAdminUsersTable,
} from './lists';
import {
  buildWeeklyUserRegistrations,
  getApplicationById,
} from './data-adapter';
import {
  DataWarning,
  MetricCard,
  OrganizationLogoMark,
  PlanBadge,
} from './ui';
import { formatShortDate } from './types';
import type {
  SuperAdminData,
  SuperAdminFeatureFlag,
  SuperAdminRole,
} from './types';

export interface SuperAdminActionState {
  readonly error?: string;
  readonly success?: string;
}

export type SuperAdminStateAction = (
  previousState: SuperAdminActionState,
  formData: FormData,
) => Promise<SuperAdminActionState>;

export type SuperAdminFormAction = (formData: FormData) => Promise<void>;

type UserGrowthDatum = ReturnType<typeof buildWeeklyUserRegistrations>[number];

interface SuperAdminSessionUser {
  readonly id: string;
  readonly email: string;
  readonly firstName?: string | null;
  readonly lastName?: string | null;
  readonly profilePictureUrl?: string | null;
}

export interface SuperAdminExtraNavItem {
  readonly activeMatch?: 'exact' | 'prefix';
  readonly href: string;
  readonly key: string;
  readonly label: string;
}

export interface SuperAdminClientActions {
  readonly addSelfToApplication: SuperAdminStateAction;
  readonly deleteOrganization: SuperAdminStateAction;
  readonly enterApplication: SuperAdminFormAction;
  readonly inviteApplicationUser: SuperAdminStateAction;
}

const defaultNavItems: readonly NavigationItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    href: '/super-admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    key: 'applications',
    label: 'Applications',
    href: '/super-admin/applications',
    icon: PanelsTopLeft,
    activeMatch: 'prefix',
  },
  {
    key: 'companies',
    label: 'Companies',
    href: '/super-admin/companies',
    icon: Building2,
    activeMatch: 'prefix',
  },
  {
    key: 'users',
    label: 'Users',
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
  readonly extraNavItems?: readonly SuperAdminExtraNavItem[];
  readonly userName: string;
}): React.ReactElement {
  const navItems = [
    ...defaultNavItems.map((item) => withBasePath(item, basePath)),
    ...extraNavItems.map((item) => ({
      ...item,
      icon: Sparkles,
    })),
  ];
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

function UserGrowthBars({
  data,
}: {
  readonly data: readonly UserGrowthDatum[];
}): React.ReactElement {
  const maxValue = Math.max(...data.map((item) => item.value), 0);

  if (maxValue === 0) {
    return (
      <div className="mt-6 flex h-56 items-center justify-center rounded-lg border border-dashed border-[#d1d5dc] text-sm text-[#6a7282]">
        No registrations in the last 8 weeks.
      </div>
    );
  }

  return (
    <div className="mt-6 flex h-64 items-end gap-2">
      {data.map((item) => (
        <div key={item.rangeLabel} className="flex min-w-0 flex-1 flex-col items-center gap-2">
          <div
            className="w-full rounded-t-md bg-gradient-to-t from-[#7c3aed] to-[#ec4899]"
            style={{ height: `${Math.max((item.value / maxValue) * 100, 6)}%` }}
            title={`${item.rangeLabel}: ${String(item.value)}`}
          />
          <div className="text-muted-foreground max-w-full truncate text-[11px]">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

function DashboardPage({
  basePath,
  data,
}: {
  readonly basePath: string;
  readonly data: SuperAdminData;
}): React.ReactElement {
  const enterpriseClients = data.applications.filter(
    (application) => application.plan === 'enterprise',
  ).length;
  const freeTrials = data.applications.filter((application) => application.status === 'prova').length;
  const weeklyRegistrations = buildWeeklyUserRegistrations(data.users);

  return (
    <DashboardPageLayout title="Dashboard" fillViewport={false} className="space-y-4">
      <DataWarning message={data.error} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Workflow} label="Total applications" value={data.applications.length} />
        <MetricCard icon={UsersRound} label="Total users" value={data.users.length} />
        <MetricCard icon={Building2} label="Enterprise clients" value={enterpriseClients} />
        <MetricCard icon={Sparkles} label="Active trials" value={freeTrials} />
      </div>

      <section className="rounded-[14px] border border-[#e5e7eb] bg-white p-4">
        <div>
          <div className="text-sm font-medium text-[#101828]">User growth</div>
          <div className="mt-1 text-xs text-[#6a7282]">
            New registrations by weekly interval
          </div>
        </div>
        <UserGrowthBars data={weeklyRegistrations} />
      </section>

      <section className="space-y-3 rounded-[14px] border border-[#e5e7eb] bg-white p-4">
        <div>
          <div className="text-sm font-medium text-[#101828]">Recent applications</div>
          <div className="mt-1 text-xs text-[#6a7282]">
            Manage all client applications and their configurations
          </div>
        </div>
        {data.applications.length ? (
          <SuperAdminApplicationsTable
            applications={data.applications.slice(0, 6)}
            basePath={basePath}
          />
        ) : (
          <div className="flex min-h-40 flex-col items-center justify-center gap-2 text-sm text-[#6a7282]">
            <BarChart3 className="size-5" />
            No applications found
          </div>
        )}
      </section>
    </DashboardPageLayout>
  );
}

function ApplicationsPage({
  basePath,
  data,
}: {
  readonly basePath: string;
  readonly data: SuperAdminData;
}): React.ReactElement {
  return (
    <DashboardPageLayout title="Applications">
      <DataWarning message={data.error} />
      <SuperAdminApplicationsList applications={data.applications} basePath={basePath} />
    </DashboardPageLayout>
  );
}

function CompaniesPage({ data }: { readonly data: SuperAdminData }): React.ReactElement {
  return (
    <DashboardPageLayout title="Companies">
      <DataWarning message={data.error} />
      <SuperAdminCompaniesList applications={data.applications} />
    </DashboardPageLayout>
  );
}

function UsersPage({
  basePath,
  data,
}: {
  readonly basePath: string;
  readonly data: SuperAdminData;
}): React.ReactElement {
  return (
    <DashboardPageLayout title="Users">
      <DataWarning message={data.error} />
      <SuperAdminUsersList users={data.users} basePath={basePath} />
    </DashboardPageLayout>
  );
}

function ApplicationDetailPage({
  actions,
  admin,
  applicationId,
  basePath,
  data,
}: {
  readonly actions: SuperAdminClientActions;
  readonly admin: SuperAdminSessionUser;
  readonly applicationId: string;
  readonly basePath: string;
  readonly data: SuperAdminData;
}): React.ReactElement {
  const application = getApplicationById(data, applicationId);

  if (!application) {
    return (
      <DashboardPageLayout title="Application">
        <DataWarning message={data.error ?? 'Application not found.'} />
      </DashboardPageLayout>
    );
  }

  const canEnterApplication = application.users.some((user) => user.id === admin.id);

  return (
    <DashboardPageLayout
      fillViewport={false}
      title={application.name}
      backHref={`${basePath}/applications`}
      actions={<PlanBadge plan={application.plan} />}
      className="space-y-6"
    >
      <DataWarning message={data.error} />

      <section className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <OrganizationLogoMark
              logoUrl={application.logoUrl}
              name={application.companyName}
              size="lg"
            />
            <div className="min-w-0">
              <h2 className="truncate text-xl font-semibold tracking-normal text-[#101828]">
                {application.name}
              </h2>
              <p className="mt-1 truncate text-sm text-[#6a7282]">{application.companyName}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Application ID"
          value={`#${application.id.slice(-6)}`}
          description="Unique identifier"
        />
        <MetricCard
          label="Total users"
          value={application.userCount}
          description={`${String(application.adminCount)} admin`}
        />
        <MetricCard
          label="Created"
          value={formatShortDate(application.createdAt)}
          description="Creation date"
        />
      </div>

      <section className="space-y-4 rounded-[14px] border border-[#e5e7eb] bg-white p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-medium text-[#101828]">Users</div>
            <div className="mt-1 text-xs text-[#6a7282]">
              Active users for this application
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <ApplicationAccessActions
              addSelfAction={actions.addSelfToApplication}
              canEnter={canEnterApplication}
              enterAction={actions.enterApplication}
              organizationId={application.id}
            />
            <InviteUserDialog
              inviteAction={actions.inviteApplicationUser}
              organizationId={application.id}
              roles={application.roles}
            />
          </div>
        </div>

        <SuperAdminUsersTable users={application.users} />
      </section>

      <section className="space-y-4 rounded-[14px] border border-[#e5e7eb] bg-white p-4">
        <div>
          <div className="text-sm font-medium text-[#101828]">Feature flags</div>
          <div className="mt-1 flex items-center gap-2 text-xs text-[#6a7282]">
            Feature flags configured for this application
          </div>
        </div>
        <FeatureFlagList featureFlags={application.featureFlags} />
      </section>

      <section className="space-y-4 rounded-[14px] border border-red-200 bg-red-50/50 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-medium text-red-950">Danger zone</div>
            <div className="mt-1 text-xs text-red-700">
              Delete this organization after confirming its exact name.
            </div>
          </div>
          <DeleteOrganizationDialog
            deleteAction={actions.deleteOrganization}
            organizationId={application.id}
            organizationName={application.companyName}
          />
        </div>
      </section>
    </DashboardPageLayout>
  );
}

function renderSuperAdminContent({
  actions,
  admin,
  basePath,
  data,
  extensionContent,
  segments,
}: {
  readonly actions: SuperAdminClientActions;
  readonly admin: SuperAdminSessionUser;
  readonly basePath: string;
  readonly data: SuperAdminData;
  readonly extensionContent?: React.ReactNode;
  readonly segments: readonly string[];
}): React.ReactNode {
  if (extensionContent) {
    return extensionContent;
  }

  if (segments[0] === 'dashboard') {
    return <DashboardPage data={data} basePath={basePath} />;
  }

  if (segments[0] === 'applications' && segments[1]) {
    return (
      <ApplicationDetailPage
        actions={actions}
        admin={admin}
        applicationId={segments[1]}
        basePath={basePath}
        data={data}
      />
    );
  }

  if (segments[0] === 'applications') {
    return <ApplicationsPage data={data} basePath={basePath} />;
  }

  if (segments[0] === 'companies') {
    return <CompaniesPage data={data} />;
  }

  return <UsersPage data={data} basePath={basePath} />;
}

export function SuperAdminClientPage({
  actions,
  admin,
  basePath,
  currentPath,
  data,
  extensionContent,
  extraNavItems,
  renderShell = true,
  segments,
  userName,
}: {
  readonly actions: SuperAdminClientActions;
  readonly admin: SuperAdminSessionUser;
  readonly basePath: string;
  readonly currentPath: string;
  readonly data: SuperAdminData;
  readonly extensionContent?: React.ReactNode;
  readonly extraNavItems?: readonly SuperAdminExtraNavItem[];
  readonly renderShell?: boolean;
  readonly segments: readonly string[];
  readonly userName: string;
}): React.ReactElement {
  const content = renderSuperAdminContent({
    actions,
    admin,
    basePath,
    data,
    extensionContent,
    segments,
  });

  if (!renderShell) {
    return <>{content}</>;
  }

  return (
    <SuperAdminRouteShell
      basePath={basePath}
      currentPath={currentPath}
      extraNavItems={extraNavItems}
      userName={userName}
    >
      {content}
    </SuperAdminRouteShell>
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
          Enter
        </Button>
      </form>
    );
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="organizationId" value={organizationId} />
      <Button size="sm" type="submit" variant="secondary" disabled={isPending}>
        <UserRoundPlus className="size-4" />
        {isPending ? 'Adding...' : 'Add me'}
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
          Invite user
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite user</DialogTitle>
          <DialogDescription>
            Send an invitation to add a user to this application.
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
              placeholder="name@company.com"
              required
            />
          </div>

          {roles.length ? (
            <div className="space-y-2">
              <Label htmlFor="invite-role">Role</Label>
              <Select name="roleSlug" defaultValue={roles[0]?.slug}>
                <SelectTrigger id="invite-role" className="w-full">
                  <SelectValue placeholder="Select role" />
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
              {isPending ? 'Sending...' : 'Send invitation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteOrganizationDialog({
  deleteAction,
  organizationId,
  organizationName,
}: {
  readonly deleteAction: SuperAdminStateAction;
  readonly organizationId: string;
  readonly organizationName: string;
}): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [confirmationName, setConfirmationName] = useState('');
  const [state, formAction, isPending] = useActionState(deleteAction, initialState);
  const canDelete = confirmationName.trim() === organizationName;

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="size-4" />
          Delete organization
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete organization</DialogTitle>
          <DialogDescription>
            This permanently removes {organizationName}. Type the organization name to confirm.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="organizationId" value={organizationId} />
          <div className="space-y-2">
            <Label htmlFor="delete-confirmation-name">Organization name</Label>
            <Input
              id="delete-confirmation-name"
              name="confirmationName"
              value={confirmationName}
              onChange={(event) => setConfirmationName(event.target.value)}
              placeholder={organizationName}
              autoComplete="off"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={!canDelete || isPending}>
              <Trash2 className="size-4" />
              {isPending ? 'Deleting...' : 'Delete organization'}
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
        No feature flags configured for this application.
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
