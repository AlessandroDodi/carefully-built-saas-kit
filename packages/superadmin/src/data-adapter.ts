import { normalizeOrganizationLogoUrl } from './logo';
import type {
  SuperAdminApplication,
  SuperAdminData,
  SuperAdminFeatureFlag,
  SuperAdminPlan,
  SuperAdminRole,
  SuperAdminStatus,
  SuperAdminUser,
  SuperAdminUserOrganization,
} from './types';

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
  readonly metadata?: Record<string, string>;
}

interface WorkosOrganizationMembership {
  readonly userId: string;
  readonly status: string;
  readonly role: {
    readonly slug: string;
  };
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

interface WorkosRole {
  readonly name: string;
  readonly slug: string;
}

interface SuperAdminWorkosClient {
  readonly organizations: {
    listOrganizations: (args: { limit: number }) => Promise<{ data: WorkosOrganization[] }>;
    listOrganizationFeatureFlags: (args: {
      organizationId: string;
      limit: number;
    }) => Promise<{ data: WorkosFeatureFlag[] }>;
    listOrganizationRoles: (args: { organizationId: string }) => Promise<{ data: WorkosRole[] }>;
  };
  readonly userManagement: {
    listUsers: (args: { limit: number }) => Promise<{ data: WorkosUser[] }>;
    listOrganizationMemberships: (args: {
      organizationId: string;
      limit: number;
    }) => Promise<{ data: WorkosOrganizationMembership[] }>;
    getUser: (userId: string) => Promise<WorkosUser>;
  };
}

interface SuperAdminOrganizationDetails {
  readonly featureFlags: SuperAdminFeatureFlag[];
  readonly logoUrl: string | null;
  readonly roles: SuperAdminRole[];
  readonly users: SuperAdminUser[];
}

interface CreateSuperAdminDataLoaderOptions {
  readonly workos: SuperAdminWorkosClient;
  readonly getOrganizationLogoUrl?: (organizationId: string) => Promise<string | null>;
  readonly errorMessage?: string;
}

const emptyOrganizationDetails: SuperAdminOrganizationDetails = {
  featureFlags: [],
  logoUrl: null,
  roles: [],
  users: [],
};

function getMetadataValue(
  metadata: Record<string, string> | undefined,
  keys: readonly string[],
): string | undefined {
  return keys.map((key) => metadata?.[key]?.trim()).find(Boolean);
}

function normalizePlan(value: string | undefined): SuperAdminPlan | null {
  if (
    value === 'enterprise' ||
    value === 'professional' ||
    value === 'starter' ||
    value === 'free'
  ) {
    return value;
  }

  return null;
}

function normalizeStatus(value: string | undefined): SuperAdminStatus | null {
  if (value === 'attivo' || value === 'active') {
    return 'attivo';
  }

  if (value === 'prova' || value === 'trial') {
    return 'prova';
  }

  if (value === 'sospeso' || value === 'suspended') {
    return 'sospeso';
  }

  return null;
}

function formatUserName(user: Pick<WorkosUser, 'email' | 'firstName' | 'lastName'>): string {
  return `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email;
}

function buildUserOrganizations(
  userId: string,
  applications: readonly SuperAdminApplication[],
): SuperAdminUserOrganization[] {
  return applications.flatMap((application) => {
    const membership = application.users.find((user) => user.id === userId);

    if (!membership) {
      return [];
    }

    return [
      {
        id: application.id,
        logoUrl: application.logoUrl,
        name: application.companyName,
        role: membership.role,
      },
    ];
  });
}

export function buildWeeklyUserRegistrations(
  users: readonly SuperAdminUser[],
): { label: string; rangeLabel: string; value: number }[] {
  const shortFormatter = new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: 'short',
  });
  const longFormatter = new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const today = new Date();
  const weeks = Array.from({ length: 8 }, (_, index) => {
    const weekStart = new Date(today);
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(today.getDate() - (7 - index) * 7);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    return {
      end: weekEnd,
      label: `${shortFormatter.format(weekStart)} - ${shortFormatter.format(
        new Date(weekEnd.getTime() - 1),
      )}`,
      rangeLabel: `${longFormatter.format(weekStart)} - ${longFormatter.format(
        new Date(weekEnd.getTime() - 1),
      )}`,
      start: weekStart,
      value: 0,
    };
  });

  users.forEach((user) => {
    const createdAt = new Date(user.createdAt);
    const week = weeks.find((item) => createdAt >= item.start && createdAt < item.end);

    if (week) {
      week.value += 1;
    }
  });

  return weeks.map(({ label, rangeLabel, value }) => ({ label, rangeLabel, value }));
}

export function getApplicationById(
  data: SuperAdminData,
  applicationId: string,
): SuperAdminApplication | null {
  return data.applications.find((application) => application.id === applicationId) ?? null;
}

export function createSuperAdminDataLoader({
  workos,
  getOrganizationLogoUrl,
  errorMessage = 'Impossibile caricare i dati WorkOS in questo momento.',
}: CreateSuperAdminDataLoaderOptions): () => Promise<SuperAdminData> {
  async function listOrganizationUsers(organizationId: string): Promise<SuperAdminUser[]> {
    const memberships = await workos.userManagement.listOrganizationMemberships({
      organizationId,
      limit: 100,
    });

    const activeMemberships = memberships.data.filter((membership) => membership.status === 'active');

    return await Promise.all(
      activeMemberships.map(async (membership) => {
        const user = await workos.userManagement.getUser(membership.userId);

        return {
          id: user.id,
          name: formatUserName(user),
          email: user.email,
          role: membership.role.slug,
          organizationId,
          createdAt: user.createdAt,
        };
      }),
    );
  }

  async function listOrganizationFeatureFlags(
    organizationId: string,
  ): Promise<SuperAdminFeatureFlag[]> {
    const featureFlags = await workos.organizations.listOrganizationFeatureFlags({
      organizationId,
      limit: 100,
    });

    return featureFlags.data.map((featureFlag) => ({
      id: featureFlag.id,
      name: featureFlag.name,
      slug: featureFlag.slug,
      description: featureFlag.description,
      enabled: featureFlag.enabled,
      createdAt: featureFlag.createdAt,
      updatedAt: featureFlag.updatedAt,
    }));
  }

  async function listOrganizationRoles(organizationId: string): Promise<SuperAdminRole[]> {
    const roles = await workos.organizations.listOrganizationRoles({ organizationId });

    return roles.data.map((role) => ({
      name: role.name,
      slug: role.slug,
    }));
  }

  return async function getSuperAdminData(): Promise<SuperAdminData> {
    try {
      const [organizationsResult, usersResult] = await Promise.all([
        workos.organizations.listOrganizations({ limit: 50 }),
        workos.userManagement.listUsers({ limit: 100 }),
      ]);

      const organizationDetails: SuperAdminOrganizationDetails[] = await Promise.all(
        organizationsResult.data.map(async (organization) => ({
          featureFlags: await listOrganizationFeatureFlags(organization.id).catch(
            () => [] as SuperAdminFeatureFlag[],
          ),
          logoUrl: normalizeOrganizationLogoUrl(
            (await getOrganizationLogoUrl?.(organization.id).catch(() => null)) ??
              getMetadataValue(organization.metadata, ['logoUrl', 'logo', 'organizationLogoUrl']) ??
              null,
          ),
          roles: await listOrganizationRoles(organization.id).catch(() => [] as SuperAdminRole[]),
          users: await listOrganizationUsers(organization.id).catch(() => [] as SuperAdminUser[]),
        })),
      );

      const applications = organizationsResult.data.map((organization, index) => {
        const plan = normalizePlan(
          getMetadataValue(organization.metadata, ['plan', 'subscriptionPlan', 'tier']),
        );
        const status = normalizeStatus(
          getMetadataValue(organization.metadata, ['status', 'subscriptionStatus']),
        );
        const details = organizationDetails[index] ?? emptyOrganizationDetails;

        return {
          id: organization.id,
          name:
            getMetadataValue(organization.metadata, ['applicationName', 'appName']) ??
            organization.name,
          companyName: organization.name,
          logoUrl: details.logoUrl,
          plan,
          status,
          userCount: details.users.length,
          adminCount: details.users.filter((user) => user.role === 'admin').length,
          createdAt: organization.createdAt,
          roles: details.roles,
          featureFlags: details.featureFlags,
          users: details.users,
        };
      });

      const users = usersResult.data.map((user) => ({
        id: user.id,
        name: formatUserName(user),
        email: user.email,
        organizations: buildUserOrganizations(user.id, applications),
        role: 'user',
        createdAt: user.createdAt,
      }));

      return { applications, users };
    } catch (error) {
      console.error('Unable to load super-admin data:', error);
      return {
        applications: [],
        users: [],
        error: errorMessage,
      };
    }
  };
}
