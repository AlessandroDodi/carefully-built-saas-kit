import { BarChart3, Building2, Sparkles, UsersRound, Workflow } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import { notFound, redirect } from 'next/navigation';

import { DashboardPageLayout } from '@carefully-built/app-shell';

import {
  SuperAdminApplicationsList,
  SuperAdminApplicationsTable,
  SuperAdminCompaniesList,
  SuperAdminUsersList,
  SuperAdminUsersTable,
} from './lists';
import {
  ApplicationAccessActions,
  FeatureFlagList,
  InviteUserDialog,
  SuperAdminRouteShell,
  type SuperAdminActionState,
} from './next-client';
import {
  DataWarning,
  MetricCard,
  OrganizationLogoMark,
  PlanBadge,
} from './ui';
import { UserGrowthChart } from './user-growth-chart';
import {
  buildWeeklyUserRegistrations,
  createSuperAdminDataLoader,
  getApplicationById,
} from './data-adapter';
import { formatShortDate } from './types';
import type { SuperAdminData } from './types';

interface SuperAdminSessionUser {
  readonly id: string;
  readonly email: string;
  readonly firstName?: string | null;
  readonly lastName?: string | null;
  readonly profilePictureUrl?: string | null;
}

interface SuperAdminSession {
  readonly user: SuperAdminSessionUser;
  readonly organizationId?: string;
}

interface WorkosUser {
  readonly id: string;
  readonly firstName: string | null;
  readonly lastName: string | null;
  readonly email: string;
  readonly createdAt: string;
}

interface WorkosOrganization {
  readonly id: string;
  readonly name: string;
  readonly createdAt: string;
  readonly domains?: readonly { readonly state: string }[];
  readonly metadata?: Record<string, string>;
}

interface WorkosOrganizationMembership {
  readonly id: string;
  readonly organizationId: string;
  readonly status: string;
  readonly userId: string;
  readonly role: {
    readonly slug: string;
  };
}

interface WorkosOrganizationRole {
  readonly name: string;
  readonly slug: string;
  readonly permissions?: readonly string[];
}

interface WorkosFeatureFlag {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly description: string;
  readonly enabled: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

interface WorkosClient {
  readonly organizations: {
    getOrganization: (organizationId: string) => Promise<WorkosOrganization>;
    listOrganizationRoles: (args: {
      organizationId: string;
    }) => Promise<{ data: WorkosOrganizationRole[] }>;
    listOrganizations: (args: { limit: number }) => Promise<{ data: WorkosOrganization[] }>;
    listOrganizationFeatureFlags: (args: {
      organizationId: string;
      limit: number;
    }) => Promise<{ data: WorkosFeatureFlag[] }>;
  };
  readonly userManagement: {
    createOrganizationMembership: (args: {
      organizationId: string;
      roleSlug?: string;
      userId: string;
    }) => Promise<unknown>;
    getAuthorizationUrl: (args: {
      clientId: string;
      organizationId: string;
      redirectUri: string;
    }) => string;
    getUser: (userId: string) => Promise<WorkosUser>;
    listOrganizationMemberships: (args: {
      organizationId: string;
      statuses?: string[];
      userId?: string;
      limit?: number;
    }) => Promise<{ data: WorkosOrganizationMembership[] }>;
    listUsers: (args: { limit: number }) => Promise<{ data: WorkosUser[] }>;
    reactivateOrganizationMembership: (membershipId: string) => Promise<unknown>;
    sendInvitation: (args: {
      email: string;
      organizationId: string;
      roleSlug?: string;
    }) => Promise<unknown>;
    updateOrganizationMembership: (
      membershipId: string,
      args: { roleSlug: string },
    ) => Promise<unknown>;
  };
}

export interface SuperAdminRouteExtension {
  readonly path: string;
  readonly label: string;
  readonly icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  readonly render: (args: {
    admin: SuperAdminSessionUser;
    data: SuperAdminData;
    segments: readonly string[];
  }) => Promise<React.ReactNode> | React.ReactNode;
}

export interface CreateSuperAdminPageOptions<TSession extends SuperAdminSession = SuperAdminSession> {
  readonly access?: {
    readonly allowedEmails?: readonly string[];
    readonly allowedEmailsEnv?: string;
    readonly fallbackPath?: string;
    readonly loginPath?: string;
  };
  readonly basePath?: string;
  readonly enterPath?: string;
  readonly extensions?: readonly SuperAdminRouteExtension[];
  readonly getOrganizationLogoUrl?: (organizationId: string) => Promise<string | null>;
  readonly getRedirectUri: () => Promise<string>;
  readonly session: {
    readonly createSession: (session: TSession & { organizationId?: string }) => Promise<void>;
    readonly getSession: () => Promise<TSession | null>;
  };
  readonly syncUser?: (
    user: SuperAdminSessionUser,
    organizationId?: string | null,
  ) => Promise<void>;
  readonly workos: unknown;
  readonly workosClientId: string;
}

interface SuperAdminCatchAllPageProps {
  readonly params: Promise<{
    path?: string[];
  }>;
}

const adminRoleSlugHints = ['owner', 'admin', 'organization_admin', 'org_admin', 'super_admin'];

function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function parseAllowedEmails(envName: string, explicitEmails: readonly string[] = []): Set<string> {
  const envEmails: string[] = (process.env[envName] ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  return new Set([...explicitEmails.map((email) => email.trim().toLowerCase()), ...envEmails]);
}

function formatUserName(user: SuperAdminSessionUser): string {
  return `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email;
}

async function getBestOrganizationAdminRoleSlug(
  workos: WorkosClient,
  organizationId: string,
): Promise<string | null> {
  try {
    const roles = await workos.organizations.listOrganizationRoles({ organizationId });

    if (!roles.data.length) {
      return null;
    }

    const hintedRole = roles.data.find((role) =>
      adminRoleSlugHints.some((hint) => role.slug.toLowerCase().includes(hint)),
    );

    if (hintedRole) {
      return hintedRole.slug;
    }

    const usersWidgetRole = roles.data.find((role) =>
      role.permissions?.includes('widgets:users-table:manage'),
    );

    if (usersWidgetRole) {
      return usersWidgetRole.slug;
    }

    const roleWithMostPermissions = [...roles.data].sort(
      (a, b) => (b.permissions?.length ?? 0) - (a.permissions?.length ?? 0),
    )[0];

    return roleWithMostPermissions?.slug ?? null;
  } catch (error) {
    console.error('Failed to list organization roles:', error);
    return null;
  }
}

function createSuperAdminGuard<TSession extends SuperAdminSession>(
  options: CreateSuperAdminPageOptions<TSession>,
): () => Promise<TSession['user']> {
  const loginPath = options.access?.loginPath ?? '/login';
  const fallbackPath = options.access?.fallbackPath ?? '/dashboard';
  const allowedEmails = parseAllowedEmails(
    options.access?.allowedEmailsEnv ?? 'SUPER_ADMIN_EMAILS',
    options.access?.allowedEmails,
  );

  return async function requireSuperAdmin(): Promise<TSession['user']> {
    const session = await options.session.getSession();

    if (!session?.user) {
      redirect(loginPath);
    }

    if (!allowedEmails.has(session.user.email.trim().toLowerCase())) {
      redirect(fallbackPath);
    }

    return session.user;
  };
}

function createActions<TSession extends SuperAdminSession>(
  options: CreateSuperAdminPageOptions<TSession>,
  requireSuperAdmin: () => Promise<TSession['user']>,
): {
  addSelfToApplication: (
    previousState: SuperAdminActionState,
    formData: FormData,
  ) => Promise<SuperAdminActionState>;
  enterApplication: (formData: FormData) => Promise<void>;
  inviteApplicationUser: (
    previousState: SuperAdminActionState,
    formData: FormData,
  ) => Promise<SuperAdminActionState>;
} {
  const workos = options.workos as WorkosClient;

  async function userHasActiveMembership(userId: string, organizationId: string): Promise<boolean> {
    const memberships = await workos.userManagement.listOrganizationMemberships({
      organizationId,
      statuses: ['active'],
      userId,
    });

    return memberships.data.some((membership) => membership.organizationId === organizationId);
  }

  async function getExistingMembershipId(
    userId: string,
    organizationId: string,
  ): Promise<{ id: string; status: string } | null> {
    const memberships = await workos.userManagement.listOrganizationMemberships({
      organizationId,
      userId,
    });

    const membership = memberships.data.find(
      (organizationMembership) => organizationMembership.organizationId === organizationId,
    );

    return membership ? { id: membership.id, status: membership.status } : null;
  }

  async function organizationRequiresSso(organizationId: string): Promise<boolean> {
    const organization = await workos.organizations.getOrganization(organizationId);
    return organization.domains?.some((domain) => domain.state === 'verified') ?? false;
  }

  async function isValidRole(organizationId: string, roleSlug: string): Promise<boolean> {
    const roles = await workos.organizations.listOrganizationRoles({ organizationId });
    return roles.data.some((role) => role.slug === roleSlug);
  }

  return {
    async addSelfToApplication(
      _previousState: SuperAdminActionState,
      formData: FormData,
    ): Promise<SuperAdminActionState> {
      'use server';

      const admin = await requireSuperAdmin();
      const organizationId = getString(formData, 'organizationId');

      if (!organizationId) {
        return { error: 'Applicazione non valida.' };
      }

      try {
        const roleSlug = await getBestOrganizationAdminRoleSlug(workos, organizationId);
        const existingMembership = await getExistingMembershipId(admin.id, organizationId);

        if (existingMembership) {
          if (existingMembership.status !== 'active') {
            await workos.userManagement.reactivateOrganizationMembership(
              existingMembership.id,
            );
          }

          if (roleSlug) {
            await workos.userManagement.updateOrganizationMembership(existingMembership.id, {
              roleSlug,
            });
          }
        } else {
          await workos.userManagement.createOrganizationMembership({
            organizationId,
            roleSlug: roleSlug ?? undefined,
            userId: admin.id,
          });
        }

        revalidatePath(`${options.basePath ?? '/super-admin'}/applications/${organizationId}`);

        return { success: roleSlug ? `Aggiunto come ${roleSlug}.` : "Aggiunto all'applicazione." };
      } catch (error) {
        console.error('Failed to add super-admin to application:', error);
        return { error: "Impossibile aggiungerti all'applicazione in WorkOS." };
      }
    },

    async enterApplication(formData: FormData): Promise<void> {
      'use server';

      const admin = await requireSuperAdmin();
      const organizationId = getString(formData, 'organizationId');
      const session = await options.session.getSession();

      if (!session?.user || !organizationId) {
        redirect(`${options.basePath ?? '/super-admin'}/applications`);
      }

      if (!(await userHasActiveMembership(admin.id, organizationId))) {
        redirect(`${options.basePath ?? '/super-admin'}/applications/${organizationId}`);
      }

      if (await organizationRequiresSso(organizationId)) {
        redirect(
          workos.userManagement.getAuthorizationUrl({
            clientId: options.workosClientId,
            organizationId,
            redirectUri: await options.getRedirectUri(),
          }),
        );
      }

      await options.session.createSession({
        ...session,
        organizationId,
      });

      await options.syncUser?.(session.user, organizationId);

      redirect(options.enterPath ?? '/dashboard/home');
    },

    async inviteApplicationUser(
      _previousState: SuperAdminActionState,
      formData: FormData,
    ): Promise<SuperAdminActionState> {
      'use server';

      const admin = await requireSuperAdmin();
      const email = getString(formData, 'email').toLowerCase();
      const organizationId = getString(formData, 'organizationId');
      const roleSlug = getString(formData, 'roleSlug');

      if (!email) {
        return { error: "Inserisci l'email dell'utente da invitare." };
      }

      if (!organizationId) {
        return { error: 'Applicazione non valida.' };
      }

      if (roleSlug && !(await isValidRole(organizationId, roleSlug))) {
        return { error: 'Il ruolo selezionato non e disponibile in questa organizzazione.' };
      }

      try {
        await workos.userManagement.sendInvitation({
          email,
          organizationId,
          roleSlug: roleSlug || undefined,
        });

        revalidatePath(`${options.basePath ?? '/super-admin'}/applications/${organizationId}`);

        return {
          success: `Invito inviato a ${email} da ${admin.email}.`,
        };
      } catch (error) {
        console.error('Failed to send super-admin invitation:', error);
        return { error: "Impossibile inviare l'invito con WorkOS." };
      }
    },
  };
}

function DashboardPage({ data }: { readonly data: SuperAdminData }): React.ReactElement {
  const enterpriseClients = data.applications.filter(
    (application) => application.plan === 'enterprise',
  ).length;
  const freeTrials = data.applications.filter((application) => application.status === 'prova').length;
  const weeklyRegistrations = buildWeeklyUserRegistrations(data.users);

  return (
    <DashboardPageLayout title="Dashboard" fillViewport={false} className="space-y-4">
      <DataWarning message={data.error} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Workflow} label="Applicazioni Totali" value={data.applications.length} />
        <MetricCard icon={UsersRound} label="Utenti Totali" value={data.users.length} />
        <MetricCard icon={Building2} label="Clienti Enterprise" value={enterpriseClients} />
        <MetricCard icon={Sparkles} label="Prove Gratuite in Corso" value={freeTrials} />
      </div>

      <section className="rounded-[14px] border border-[#e5e7eb] bg-white p-4">
        <div>
          <div className="text-sm font-medium text-[#101828]">Crescita Utenti</div>
          <div className="mt-1 text-xs text-[#6a7282]">
            Nuove registrazioni WorkOS per intervallo settimanale
          </div>
        </div>
        <UserGrowthChart data={weeklyRegistrations} />
      </section>

      <section className="space-y-3 rounded-[14px] border border-[#e5e7eb] bg-white p-4">
        <div>
          <div className="text-sm font-medium text-[#101828]">Applicazioni Recenti</div>
          <div className="mt-1 text-xs text-[#6a7282]">
            Gestisci tutte le applicazioni dei clienti e le loro configurazioni
          </div>
        </div>
        {data.applications.length ? (
          <SuperAdminApplicationsTable applications={data.applications.slice(0, 6)} />
        ) : (
          <div className="flex min-h-40 flex-col items-center justify-center gap-2 text-sm text-[#6a7282]">
            <BarChart3 className="size-5" />
            Nessuna applicazione trovata
          </div>
        )}
      </section>
    </DashboardPageLayout>
  );
}

function ApplicationsPage({ data }: { readonly data: SuperAdminData }): React.ReactElement {
  return (
    <DashboardPageLayout title="Applicazioni">
      <DataWarning message={data.error} />
      <SuperAdminApplicationsList applications={data.applications} />
    </DashboardPageLayout>
  );
}

function CompaniesPage({ data }: { readonly data: SuperAdminData }): React.ReactElement {
  return (
    <DashboardPageLayout title="Aziende">
      <DataWarning message={data.error} />
      <SuperAdminCompaniesList applications={data.applications} />
    </DashboardPageLayout>
  );
}

function UsersPage({ data }: { readonly data: SuperAdminData }): React.ReactElement {
  return (
    <DashboardPageLayout title="Utenti">
      <DataWarning message={data.error} />
      <SuperAdminUsersList users={data.users} />
    </DashboardPageLayout>
  );
}

function ApplicationDetailPage({
  addSelfAction,
  admin,
  applicationId,
  basePath,
  data,
  enterAction,
  inviteAction,
}: {
  readonly addSelfAction: (
    previousState: SuperAdminActionState,
    formData: FormData,
  ) => Promise<SuperAdminActionState>;
  readonly admin: SuperAdminSessionUser;
  readonly applicationId: string;
  readonly basePath: string;
  readonly data: SuperAdminData;
  readonly enterAction: (formData: FormData) => Promise<void>;
  readonly inviteAction: (
    previousState: SuperAdminActionState,
    formData: FormData,
  ) => Promise<SuperAdminActionState>;
}): React.ReactElement {
  const application = getApplicationById(data, applicationId);

  if (!application && !data.error) {
    notFound();
  }

  if (!application) {
    return <DataWarning message={data.error} />;
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
          label="ID Applicazione"
          value={`#${application.id.slice(-6)}`}
          description="Identificatore unico"
        />
        <MetricCard
          label="Utenti Totali"
          value={application.userCount}
          description={`${String(application.adminCount)} admin`}
        />
        <MetricCard
          label="Creata"
          value={formatShortDate(application.createdAt)}
          description="Data di creazione"
        />
      </div>

      <section className="space-y-4 rounded-[14px] border border-[#e5e7eb] bg-white p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-medium text-[#101828]">Utenti</div>
            <div className="mt-1 text-xs text-[#6a7282]">
              Utenti attivi in WorkOS per questa applicazione
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <ApplicationAccessActions
              addSelfAction={addSelfAction}
              canEnter={canEnterApplication}
              enterAction={enterAction}
              organizationId={application.id}
            />
            <InviteUserDialog
              inviteAction={inviteAction}
              organizationId={application.id}
              roles={application.roles}
            />
          </div>
        </div>

        <SuperAdminUsersTable users={application.users} />
      </section>

      <section className="space-y-4 rounded-[14px] border border-[#e5e7eb] bg-white p-4">
        <div>
          <div className="text-sm font-medium text-[#101828]">Feature Flags</div>
          <div className="mt-1 flex items-center gap-2 text-xs text-[#6a7282]">
            Feature flags configurate in WorkOS per questa applicazione
          </div>
        </div>
        <FeatureFlagList featureFlags={application.featureFlags} />
      </section>
    </DashboardPageLayout>
  );
}

function normalizeSegments(segments: readonly string[] | undefined): readonly string[] {
  if (!segments?.length) {
    return ['dashboard'];
  }

  return segments;
}

export function createSuperAdminPage<TSession extends SuperAdminSession>(
  options: CreateSuperAdminPageOptions<TSession>,
): (props: SuperAdminCatchAllPageProps) => Promise<React.ReactElement> {
  const basePath = options.basePath ?? '/super-admin';
  const getSuperAdminData = createSuperAdminDataLoader({
    workos: options.workos as WorkosClient,
    getOrganizationLogoUrl: options.getOrganizationLogoUrl,
  });
  const requireSuperAdmin = createSuperAdminGuard(options);
  const actions = createActions(options, requireSuperAdmin);

  return async function SuperAdminCatchAllPage({
    params,
  }: SuperAdminCatchAllPageProps): Promise<React.ReactElement> {
    const { path } = await params;
    const segments = normalizeSegments(path);
    const currentPath = `${basePath}/${segments.join('/')}`;
    const [admin, data] = await Promise.all([requireSuperAdmin(), getSuperAdminData()]);
    const userName = formatUserName(admin);
    const extraNavItems = (options.extensions ?? []).map((extension) => ({
      key: extension.path,
      label: extension.label,
      href: `${basePath}/${extension.path}`,
      icon: extension.icon ?? Sparkles,
      activeMatch: 'prefix' as const,
    }));

    let content: React.ReactNode;

    if (segments[0] === 'dashboard') {
      content = <DashboardPage data={data} />;
    } else if (segments[0] === 'applications' && segments[1]) {
      content = (
        <ApplicationDetailPage
          addSelfAction={actions.addSelfToApplication}
          admin={admin}
          applicationId={segments[1]}
          basePath={basePath}
          data={data}
          enterAction={actions.enterApplication}
          inviteAction={actions.inviteApplicationUser}
        />
      );
    } else if (segments[0] === 'applications') {
      content = <ApplicationsPage data={data} />;
    } else if (segments[0] === 'companies') {
      content = <CompaniesPage data={data} />;
    } else if (segments[0] === 'users') {
      content = <UsersPage data={data} />;
    } else {
      const extension = (options.extensions ?? []).find(
        (item) => item.path === segments[0] || item.path === segments.join('/'),
      );

      if (!extension) {
        notFound();
      }

      content = await extension.render({ admin, data, segments });
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
  };
}
