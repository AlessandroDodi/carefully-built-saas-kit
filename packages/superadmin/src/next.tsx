import { revalidatePath } from 'next/cache';
import { notFound, redirect } from 'next/navigation';

import {
  SuperAdminClientPage,
  type SuperAdminActionState,
  type SuperAdminExtraNavItem,
} from './next-client';
import {
  createSuperAdminDataLoader,
  getApplicationById,
} from './data-adapter';
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
    deleteOrganization: (organizationId: string) => Promise<unknown>;
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
  readonly renderShell?: boolean;
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
  return async function requireSuperAdmin(): Promise<TSession['user']> {
    return requireSuperAdminSessionUser(options);
  };
}

async function requireSuperAdminSessionUser<TSession extends SuperAdminSession>(
  options: CreateSuperAdminPageOptions<TSession>,
): Promise<TSession['user']> {
  const loginPath = options.access?.loginPath ?? '/login';
  const fallbackPath = options.access?.fallbackPath ?? '/dashboard';
  const allowedEmails = parseAllowedEmails(
    options.access?.allowedEmailsEnv ?? 'SUPER_ADMIN_EMAILS',
    options.access?.allowedEmails,
  );
  const session = await options.session.getSession();

  if (!session || !session.user) {
    redirect(loginPath);
    throw new Error('Super admin session required.');
  }

  if (!allowedEmails.has(session.user.email.trim().toLowerCase())) {
    redirect(fallbackPath);
    throw new Error('Super admin access denied.');
  }

  return session.user;
}

let configuredActionOptions: CreateSuperAdminPageOptions<SuperAdminSession> | null = null;

function configureSuperAdminActionOptions<TSession extends SuperAdminSession>(
  options: CreateSuperAdminPageOptions<TSession>,
): void {
  configuredActionOptions = options as CreateSuperAdminPageOptions<SuperAdminSession>;
}

function getConfiguredActionOptions(): CreateSuperAdminPageOptions<SuperAdminSession> {
  if (!configuredActionOptions) {
    throw new Error('Super admin actions are not configured.');
  }

  return configuredActionOptions;
}

async function userHasActiveMembership(
  workos: WorkosClient,
  userId: string,
  organizationId: string,
): Promise<boolean> {
  const memberships = await workos.userManagement.listOrganizationMemberships({
    organizationId,
    statuses: ['active'],
    userId,
  });

  return memberships.data.some((membership) => membership.organizationId === organizationId);
}

async function getExistingMembershipId(
  workos: WorkosClient,
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

async function organizationRequiresSso(
  workos: WorkosClient,
  organizationId: string,
): Promise<boolean> {
  const organization = await workos.organizations.getOrganization(organizationId);
  return organization.domains?.some((domain) => domain.state === 'verified') ?? false;
}

async function isValidRole(
  workos: WorkosClient,
  organizationId: string,
  roleSlug: string,
): Promise<boolean> {
  const roles = await workos.organizations.listOrganizationRoles({ organizationId });
  return roles.data.some((role) => role.slug === roleSlug);
}

function createActions<TSession extends SuperAdminSession>(
  options: CreateSuperAdminPageOptions<TSession>,
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
  deleteOrganization: (
    previousState: SuperAdminActionState,
    formData: FormData,
  ) => Promise<SuperAdminActionState>;
} {
  configureSuperAdminActionOptions(options);

  return {
    addSelfToApplication: addSelfToApplicationAction,
    deleteOrganization: deleteOrganizationAction,
    enterApplication: enterApplicationAction,
    inviteApplicationUser: inviteApplicationUserAction,
  };
}

async function addSelfToApplicationAction(
  _previousState: SuperAdminActionState,
  formData: FormData,
): Promise<SuperAdminActionState> {
  'use server';

  const options = getConfiguredActionOptions();
  const workos = options.workos as WorkosClient;
  const admin = await requireSuperAdminSessionUser(options);
  const organizationId = getString(formData, 'organizationId');

  if (!organizationId) {
    return { error: 'Invalid application.' };
  }

  try {
    const roleSlug = await getBestOrganizationAdminRoleSlug(workos, organizationId);
    const existingMembership = await getExistingMembershipId(workos, admin.id, organizationId);

    if (existingMembership) {
      if (existingMembership.status !== 'active') {
        await workos.userManagement.reactivateOrganizationMembership(existingMembership.id);
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

    return { success: roleSlug ? `Added as ${roleSlug}.` : 'Added to the application.' };
  } catch (error) {
    console.error('Failed to add super-admin to application:', error);
    return { error: 'Unable to add you to the application.' };
  }
}

async function enterApplicationAction(formData: FormData): Promise<void> {
  'use server';

  const options = getConfiguredActionOptions();
  const workos = options.workos as WorkosClient;
  const admin = await requireSuperAdminSessionUser(options);
  const organizationId = getString(formData, 'organizationId');
  const session = await options.session.getSession();

  if (!session || !session.user || !organizationId) {
    redirect(`${options.basePath ?? '/super-admin'}/applications`);
    return;
  }

  if (!(await userHasActiveMembership(workos, admin.id, organizationId))) {
    redirect(`${options.basePath ?? '/super-admin'}/applications/${organizationId}`);
    return;
  }

  if (await organizationRequiresSso(workos, organizationId)) {
    redirect(
      workos.userManagement.getAuthorizationUrl({
        clientId: options.workosClientId,
        organizationId,
        redirectUri: await options.getRedirectUri(),
      }),
    );
    return;
  }

  await options.session.createSession({
    ...session,
    organizationId,
  });

  await options.syncUser?.(session.user, organizationId);

  redirect(options.enterPath ?? '/dashboard/home');
}

async function inviteApplicationUserAction(
  _previousState: SuperAdminActionState,
  formData: FormData,
): Promise<SuperAdminActionState> {
  'use server';

  const options = getConfiguredActionOptions();
  const workos = options.workos as WorkosClient;
  const admin = await requireSuperAdminSessionUser(options);
  const email = getString(formData, 'email').toLowerCase();
  const organizationId = getString(formData, 'organizationId');
  const roleSlug = getString(formData, 'roleSlug');

  if (!email) {
    return { error: "Enter the user's email address to invite them." };
  }

  if (!organizationId) {
    return { error: 'Invalid application.' };
  }

  if (roleSlug && !(await isValidRole(workos, organizationId, roleSlug))) {
    return { error: 'The selected role is not available in this organization.' };
  }

  try {
    await workos.userManagement.sendInvitation({
      email,
      organizationId,
      roleSlug: roleSlug || undefined,
    });

    revalidatePath(`${options.basePath ?? '/super-admin'}/applications/${organizationId}`);

    return {
      success: `Invitation sent to ${email} by ${admin.email}.`,
    };
  } catch (error) {
    console.error('Failed to send super-admin invitation:', error);
    return { error: 'Unable to send the invitation.' };
  }
}

async function deleteOrganizationAction(
  _previousState: SuperAdminActionState,
  formData: FormData,
): Promise<SuperAdminActionState> {
  'use server';

  const options = getConfiguredActionOptions();
  const workos = options.workos as WorkosClient;
  await requireSuperAdminSessionUser(options);

  const organizationId = getString(formData, 'organizationId');
  const confirmationName = getString(formData, 'confirmationName');

  if (!organizationId) {
    return { error: 'Invalid application.' };
  }

  try {
    const organization = await workos.organizations.getOrganization(organizationId);

    if (confirmationName !== organization.name) {
      return { error: 'Type the organization name exactly to delete it.' };
    }

    await workos.organizations.deleteOrganization(organizationId);
  } catch (error) {
    console.error('Failed to delete organization:', error);
    return { error: 'Unable to delete the organization.' };
  }

  revalidatePath(`${options.basePath ?? '/super-admin'}/applications`);
  redirect(`${options.basePath ?? '/super-admin'}/applications`);
  return { success: 'Organization deleted.' };
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
  const actions = createActions(options);

  return async function SuperAdminCatchAllPage({
    params,
  }: SuperAdminCatchAllPageProps): Promise<React.ReactElement> {
    const { path } = await params;
    const segments = normalizeSegments(path);
    const currentPath = `${basePath}/${segments.join('/')}`;
    const [admin, data] = await Promise.all([requireSuperAdmin(), getSuperAdminData()]);
    const userName = formatUserName(admin);
    const extraNavItems: SuperAdminExtraNavItem[] = (options.extensions ?? []).map((extension) => ({
      key: extension.path,
      label: extension.label,
      href: `${basePath}/${extension.path}`,
      activeMatch: 'prefix' as const,
    }));
    let extensionContent: React.ReactNode;

    if (segments[0] === 'applications' && segments[1] && !getApplicationById(data, segments[1]) && !data.error) {
      notFound();
    }

    if (!['dashboard', 'applications', 'companies', 'users'].includes(segments[0] ?? '')) {
      const extension = (options.extensions ?? []).find(
        (item) => item.path === segments[0] || item.path === segments.join('/'),
      );

      if (!extension) {
        notFound();
      }

      extensionContent = await extension.render({ admin, data, segments });
    }

    return (
      <SuperAdminClientPage
        actions={actions}
        admin={admin}
        basePath={basePath}
        currentPath={currentPath}
        data={data}
        extensionContent={extensionContent}
        extraNavItems={extraNavItems}
        renderShell={options.renderShell}
        segments={segments}
        userName={userName}
      />
    );
  };
}
