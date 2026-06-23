'use client';

import { Building2, CalendarDays, ShieldCheck, UsersRound } from 'lucide-react';
import { useMemo, useState } from 'react';

import { OrganizationLogoMark, PlanBadge, StatusBadge } from './ui';
import { formatShortDate } from './types';
import { createSuperAdminHref } from './navigation';

import type { Column } from '@carefully-built/ui';
import type { SuperAdminApplication, SuperAdminUser } from './types';

import { Button, SmartTable, TableToolbar, TruncatedContent, useTableSorting } from '@carefully-built/ui';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@carefully-built/ui';

type SuperAdminUserOrganization = NonNullable<SuperAdminUser['organizations']>[number];

const planOptions = [
  { value: 'enterprise', label: 'Enterprise' },
  { value: 'professional', label: 'Professional' },
  { value: 'starter', label: 'Starter' },
  { value: 'free', label: 'Free' },
] as const;

const statusOptions = [
  { value: 'attivo', label: 'Active' },
  { value: 'prova', label: 'Trial' },
  { value: 'sospeso', label: 'Suspended' },
] as const;

const DEFAULT_SEARCH_LOCALE = 'en-US';

function normalizeSearch(value: string): string {
  return value.trim().toLocaleLowerCase(DEFAULT_SEARCH_LOCALE);
}

function includesSearch(
  searchableText: readonly (string | number | null | undefined)[],
  search: string,
): boolean {
  const normalizedSearch = normalizeSearch(search);

  if (!normalizedSearch) {
    return true;
  }

  return searchableText
    .filter((value) => value !== null && value !== undefined)
    .some((value) => String(value).toLocaleLowerCase(DEFAULT_SEARCH_LOCALE).includes(normalizedSearch));
}

function MobileMetaRow({
  label,
  value,
}: {
  readonly label: string;
  readonly value: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="text-muted-foreground text-[11px] font-medium tracking-[0.08em] uppercase">
        {label}
      </span>
      <div className="text-foreground min-w-0 flex-1 text-right">{value}</div>
    </div>
  );
}

function ApplicationIdentity({
  application,
  companyOnly = false,
}: {
  readonly application: SuperAdminApplication;
  readonly companyOnly?: boolean;
}): React.ReactElement {
  const title = companyOnly ? application.companyName : application.name;
  const subtitle = companyOnly ? application.id : application.companyName;

  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <OrganizationLogoMark logoUrl={application.logoUrl} name={title} />
      <div className="min-w-0">
        <div className="text-foreground truncate font-medium">{title}</div>
        <div className="text-muted-foreground truncate text-xs">{subtitle}</div>
      </div>
    </div>
  );
}

function UserOrganizationsCell({
  organizations,
}: {
  readonly organizations: readonly SuperAdminUserOrganization[];
}): React.ReactElement {
  if (!organizations.length) {
    return <span className="text-muted-foreground text-sm">No org</span>;
  }

  const primaryOrganization = organizations[0];

  if (!primaryOrganization) {
    return <span className="text-muted-foreground text-sm">No org</span>;
  }

  const title =
    organizations.length === 1
      ? primaryOrganization.name
      : `${primaryOrganization.name} + ${String(organizations.length - 1)}`;

  return (
    <div className="flex min-w-0 items-center gap-2">
      <OrganizationLogoMark logoUrl={primaryOrganization.logoUrl} name={primaryOrganization.name} />
      <div className="min-w-0">
        <div className="text-foreground truncate text-sm font-medium">{title}</div>
        <div className="text-muted-foreground truncate text-xs">
          {organizations.length === 1
            ? primaryOrganization.role
            : `${String(organizations.length)} organizzazioni`}
        </div>
      </div>
    </div>
  );
}

function UserDetailSheet({
  basePath,
  onOpenChange,
  user,
}: {
  readonly basePath?: string;
  readonly onOpenChange: (open: boolean) => void;
  readonly user: SuperAdminUser | null;
}): React.ReactElement {
  const organizations = user?.organizations ?? [];

  return (
    <Sheet open={Boolean(user)} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader className="border-b">
          <SheetTitle>{user?.name ?? 'User'}</SheetTitle>
          <SheetDescription>{user?.email}</SheetDescription>
        </SheetHeader>
        {user ? (
          <div className="min-h-0 space-y-4 overflow-y-auto px-4 pb-4">
            <section className="space-y-2">
              <div className="text-foreground text-sm font-medium">Summary</div>
              <div className="border-border grid gap-2 rounded-lg border p-3 text-sm">
                <MobileMetaRow label="Email" value={user.email} />
                <MobileMetaRow
                  label="ID"
                  value={<TruncatedContent tooltip={user.id}>{user.id}</TruncatedContent>}
                />
                <MobileMetaRow label="Role" value={user.role} />
                <MobileMetaRow label="Org" value={String(organizations.length)} />
                <MobileMetaRow label="Created" value={formatShortDate(user.createdAt)} />
              </div>
            </section>

            <section className="space-y-2">
              <div className="text-foreground text-sm font-medium">Organizations</div>
              {organizations.length ? (
                <div className="border-border overflow-hidden rounded-lg border">
                  <div className="bg-muted/40 text-muted-foreground grid grid-cols-[minmax(0,1fr)_112px] gap-3 px-3 py-2 text-xs font-medium">
                    <span>Organization</span>
                    <span>Role</span>
                  </div>
                  {organizations.map((organization) => (
                    <a
                      key={organization.id}
                      href={createSuperAdminHref(basePath, `/applications/${organization.id}`)}
                      className="border-border hover:bg-muted/40 grid grid-cols-[minmax(0,1fr)_112px] items-center gap-3 border-t px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-[#9770ff]/35"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <OrganizationLogoMark
                          logoUrl={organization.logoUrl}
                          name={organization.name}
                        />
                        <div className="min-w-0">
                          <div className="text-foreground truncate text-sm font-medium">
                            {organization.name}
                          </div>
                          <div className="text-muted-foreground truncate text-xs">
                            {organization.id}
                          </div>
                        </div>
                      </div>
                      <div className="text-muted-foreground truncate text-sm">
                        {organization.role}
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="border-border text-muted-foreground rounded-lg border border-dashed px-3 py-8 text-center text-sm">
                  No organization associated.
                </div>
              )}
            </section>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

function filterApplications(
  applications: readonly SuperAdminApplication[],
  search: string,
  selectedPlan: string,
  selectedStatus: string,
): SuperAdminApplication[] {
  return applications.filter((application) => {
    const matchesPlan = selectedPlan === 'all' || application.plan === selectedPlan;
    const matchesStatus = selectedStatus === 'all' || application.status === selectedStatus;
    const matchesSearch = includesSearch(
      [
        application.name,
        application.companyName,
        application.id,
        application.plan,
        application.status,
      ],
      search,
    );

    return matchesPlan && matchesStatus && matchesSearch;
  });
}

function ApplicationMobileCard({
  application,
  basePath,
  showAction,
}: {
  readonly application: SuperAdminApplication;
  readonly basePath?: string;
  readonly showAction: boolean;
}): React.ReactElement {
  return (
    <div className="space-y-3">
      <ApplicationIdentity application={application} />
      <div className="border-border/70 grid gap-2 border-t pt-3">
        <MobileMetaRow label="Plan" value={<PlanBadge plan={application.plan} />} />
        <MobileMetaRow label="Status" value={<StatusBadge status={application.status} />} />
        <MobileMetaRow label="Users" value={String(application.userCount)} />
        <MobileMetaRow label="Created" value={formatShortDate(application.createdAt)} />
      </div>
      {showAction ? (
        <div className="mt-3 flex justify-end border-t pt-2.5">
          <Button variant="ghost" size="sm" asChild>
            <a href={createSuperAdminHref(basePath, `/applications/${application.id}`)}>
              Manage
            </a>
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export function SuperAdminApplicationsTable({
  applications,
  basePath,
  showAction = true,
}: {
  readonly applications: readonly SuperAdminApplication[];
  readonly basePath?: string;
  readonly showAction?: boolean;
}): React.ReactElement {
  const columns: Column<SuperAdminApplication>[] = [
    {
      header: 'Application',
      accessor: 'name',
      width: '34%',
      render: (_, application) => <ApplicationIdentity application={application} />,
    },
    {
      header: 'Plan',
      accessor: 'plan',
      width: '16%',
      truncate: false,
      render: (_, application) => <PlanBadge plan={application.plan} />,
    },
    {
      header: 'Status',
      accessor: 'status',
      width: '16%',
      truncate: false,
      render: (_, application) => <StatusBadge status={application.status} />,
    },
    {
      header: 'Users',
      accessor: 'userCount',
      width: '12%',
      render: (_, application) => String(application.userCount),
    },
    {
      header: 'Created',
      accessor: 'createdAt',
      width: showAction ? '14%' : '22%',
      render: (_, application) => formatShortDate(application.createdAt),
    },
  ];
  const { sortedData, sortState, setSortState } = useTableSorting({
    data: applications,
    columns,
  });

  return (
    <SmartTable
      data={sortedData}
      columns={columns}
      isLoading={false}
      getRowKey={(application) => application.id}
      renderActions={
        showAction
          ? (application) => (
              <Button variant="ghost" size="sm" asChild>
                <a href={createSuperAdminHref(basePath, `/applications/${application.id}`)}>
                  Manage
                </a>
              </Button>
            )
          : undefined
      }
      renderMobileCard={(application) => (
        <ApplicationMobileCard
          application={application}
          basePath={basePath}
          showAction={showAction}
        />
      )}
      noDataMessage="No applications found"
      sortState={sortState}
      onSortChange={setSortState}
    />
  );
}

export function SuperAdminApplicationsList({
  applications,
  basePath,
}: {
  readonly applications: readonly SuperAdminApplication[];
  readonly basePath?: string;
}): React.ReactElement {
  const [search, setSearch] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const filteredApplications = useMemo(
    () => filterApplications(applications, search, selectedPlan, selectedStatus),
    [applications, search, selectedPlan, selectedStatus],
  );

  function getDraftResultCount(draftValues: Record<string, string>): number {
    return filterApplications(
      applications,
      search,
      draftValues.plan ?? selectedPlan,
      draftValues.status ?? selectedStatus,
    ).length;
  }

  return (
    <>
      <TableToolbar
        search={{ value: search, onChange: setSearch, placeholder: 'Search applications' }}
        filters={[
          {
            config: {
              key: 'plan',
              label: 'Plan',
              icon: ShieldCheck,
              options: planOptions,
            },
            value: selectedPlan,
            onChange: setSelectedPlan,
          },
          {
            config: {
              key: 'status',
              label: 'Status',
              icon: CalendarDays,
              options: statusOptions,
            },
            value: selectedStatus,
            onChange: setSelectedStatus,
          },
        ]}
        onClearAll={() => {
          setSelectedPlan('all');
          setSelectedStatus('all');
        }}
        getDraftResultCount={getDraftResultCount}
      />
      <SuperAdminApplicationsTable applications={filteredApplications} basePath={basePath} />
    </>
  );
}

export function SuperAdminCompaniesList({
  applications,
}: {
  readonly applications: readonly SuperAdminApplication[];
}): React.ReactElement {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const companies = useMemo(
    () =>
      applications.filter((application) => {
        const matchesStatus = selectedStatus === 'all' || application.status === selectedStatus;
        const matchesSearch = includesSearch(
          [application.companyName, application.name, application.id, application.status],
          search,
        );

        return matchesStatus && matchesSearch;
      }),
    [applications, search, selectedStatus],
  );
  const columns: Column<SuperAdminApplication>[] = [
    {
      header: 'Company',
      accessor: 'companyName',
      width: '42%',
      render: (_, application) => <ApplicationIdentity application={application} companyOnly />,
    },
    {
      header: 'Application',
      accessor: 'name',
      width: '28%',
    },
    {
      header: 'Status',
      accessor: 'status',
      width: '14%',
      truncate: false,
      render: (_, application) => <StatusBadge status={application.status} />,
    },
    {
      header: 'Created',
      accessor: 'createdAt',
      width: '16%',
      render: (_, application) => formatShortDate(application.createdAt),
    },
  ];
  const { sortedData: sortedCompanies, sortState, setSortState } = useTableSorting({
    data: companies,
    columns,
  });

  return (
    <>
      <TableToolbar
        search={{ value: search, onChange: setSearch, placeholder: 'Search companies' }}
        filters={[
          {
            config: {
              key: 'status',
              label: 'Status',
              icon: Building2,
              options: statusOptions,
            },
            value: selectedStatus,
            onChange: setSelectedStatus,
          },
        ]}
        onClearAll={() => {
          setSelectedStatus('all');
        }}
        getDraftResultCount={(draftValues) =>
          applications.filter((application) => {
            const draftStatus = draftValues.status ?? selectedStatus;
            return (
              (draftStatus === 'all' || application.status === draftStatus) &&
              includesSearch([application.companyName, application.name, application.id], search)
            );
          }).length
        }
      />
      <SmartTable
        data={sortedCompanies}
        columns={columns}
        isLoading={false}
        getRowKey={(application) => application.id}
        renderMobileCard={(application) => (
          <div className="space-y-3">
            <ApplicationIdentity application={application} companyOnly />
            <div className="border-border/70 grid gap-2 border-t pt-3">
              <MobileMetaRow label="Application" value={application.name} />
              <MobileMetaRow label="Status" value={<StatusBadge status={application.status} />} />
              <MobileMetaRow label="Created" value={formatShortDate(application.createdAt)} />
            </div>
          </div>
        )}
        noDataMessage="No companies found"
        sortState={sortState}
        onSortChange={setSortState}
      />
    </>
  );
}

export function SuperAdminUsersList({
  basePath,
  users,
}: {
  readonly basePath?: string;
  readonly users: readonly SuperAdminUser[];
}): React.ReactElement {
  const [search, setSearch] = useState('');
  const filteredUsers = useMemo(
    () =>
      users.filter((user) =>
        includesSearch(
          [
            user.name,
            user.email,
            user.role,
            ...(user.organizations?.flatMap((organization) => [
              organization.name,
              organization.role,
            ]) ?? []),
          ],
          search,
        ),
      ),
    [search, users],
  );

  return (
    <>
      <TableToolbar search={{ value: search, onChange: setSearch, placeholder: 'Search users' }} />
      <SuperAdminUsersTable users={filteredUsers} basePath={basePath} showOrganizations />
    </>
  );
}

export function SuperAdminUsersTable({
  basePath,
  showOrganizations = false,
  users,
}: {
  readonly basePath?: string;
  readonly showOrganizations?: boolean;
  readonly users: readonly SuperAdminUser[];
}): React.ReactElement {
  const [selectedUser, setSelectedUser] = useState<SuperAdminUser | null>(null);
  const columns: Column<SuperAdminUser>[] = [
    {
      header: 'Name',
      accessor: 'name',
      width: showOrganizations ? '24%' : '30%',
      render: (_, user) => (
        <div className="min-w-0">
          <div className="text-foreground truncate font-medium">{user.name}</div>
          <div className="text-muted-foreground truncate text-xs">{user.id}</div>
        </div>
      ),
    },
    {
      header: 'Email',
      accessor: 'email',
      width: showOrganizations ? '28%' : '34%',
      render: (_, user) => <TruncatedContent tooltip={user.email}>{user.email}</TruncatedContent>,
    },
    ...(showOrganizations
      ? [
          {
            header: 'Org',
            accessor: 'organizations' as const,
            width: '28%',
            render: (_: unknown, user: SuperAdminUser) => (
              <UserOrganizationsCell organizations={user.organizations ?? []} />
            ),
          },
        ]
      : []),
    {
      header: 'Role',
      accessor: 'role',
      width: showOrganizations ? '10%' : '18%',
    },
    {
      header: 'Created',
      accessor: 'createdAt',
      width: showOrganizations ? '10%' : '18%',
      render: (_, user) => formatShortDate(user.createdAt),
    },
  ];
  const { sortedData, sortState, setSortState } = useTableSorting({
    data: users,
    columns,
  });

  return (
    <>
      <SmartTable
        data={sortedData}
        columns={columns}
        isLoading={false}
        getRowKey={(user) => user.id}
        onRowClick={showOrganizations ? setSelectedUser : undefined}
        renderMobileCard={(user) => (
          <div className="space-y-3">
            <div className="flex min-w-0 items-start gap-2.5">
              <div className="bg-muted text-muted-foreground grid size-9 shrink-0 place-items-center rounded-lg">
                <UsersRound className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-foreground truncate text-[14px] leading-5 font-semibold">
                  {user.name}
                </div>
                <div className="text-muted-foreground mt-px text-[12px] leading-4">
                  <TruncatedContent tooltip={user.email}>{user.email}</TruncatedContent>
                </div>
              </div>
            </div>
            <div className="border-border/70 grid gap-2 border-t pt-3">
              {showOrganizations ? (
                <MobileMetaRow
                  label="Org"
                  value={<UserOrganizationsCell organizations={user.organizations ?? []} />}
                />
              ) : null}
              <MobileMetaRow label="Ruolo" value={user.role} />
              <MobileMetaRow label="Created" value={formatShortDate(user.createdAt)} />
            </div>
          </div>
        )}
        noDataMessage="No users found"
        sortState={sortState}
        onSortChange={setSortState}
      />
      {showOrganizations ? (
        <UserDetailSheet
          basePath={basePath}
          user={selectedUser}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedUser(null);
            }
          }}
        />
      ) : null}
    </>
  );
}
