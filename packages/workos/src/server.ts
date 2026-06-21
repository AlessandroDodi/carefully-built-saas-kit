export type WidgetScopes =
  | 'widgets:users-table:manage'
  | 'widgets:sso:manage'
  | 'widgets:domain-verification:manage'
  | 'widgets:api-keys:manage';

export interface WidgetTokenSession {
  readonly user?: {
    readonly id: string;
  } | null;
  readonly organizationId?: string | null;
}

export interface WidgetTokenArgs {
  readonly userId: string;
  readonly organizationId: string;
}

export interface WorkOSWidgetTokenOptions {
  readonly logContext: string;
  readonly errorMessage: string;
  readonly getSession: () => Promise<WidgetTokenSession | null | undefined>;
  readonly getToken: (args: WidgetTokenArgs) => Promise<string>;
}

type WorkOSWidgetTokenResult =
  | {
      readonly token: string;
    }
  | {
      readonly response: Response;
    };

const ADMIN_ROLE_SLUG_HINTS = [
  'owner',
  'admin',
  'organization_admin',
  'org_admin',
  'super_admin',
] as const;

export async function getWorkOSWidgetToken({
  logContext,
  errorMessage,
  getSession,
  getToken,
}: WorkOSWidgetTokenOptions): Promise<WorkOSWidgetTokenResult> {
  const session = await getSession();

  if (!session?.user) {
    return {
      response: Response.json({ error: 'Non autorizzato' }, { status: 401 }),
    };
  }

  if (!session.organizationId) {
    return {
      response: Response.json(
        { error: 'Organizzazione non disponibile nella sessione' },
        { status: 400 },
      ),
    };
  }

  try {
    const token = await getToken({
      userId: session.user.id,
      organizationId: session.organizationId,
    });

    return { token };
  } catch (error) {
    console.error(`Failed to ${logContext}:`, error);
    return {
      response: Response.json({ error: errorMessage }, { status: 500 }),
    };
  }
}

export async function createWorkOSWidgetTokenResponse(
  options: WorkOSWidgetTokenOptions,
): Promise<Response> {
  const result = await getWorkOSWidgetToken(options);

  if ('response' in result) {
    return result.response;
  }

  return Response.json({ token: result.token });
}

export interface WorkOSOrganizationRole {
  readonly slug: string;
  readonly permissions: readonly string[];
}

export async function getBestOrganizationAdminRoleSlug({
  organizationId,
  listOrganizationRoles,
}: {
  readonly organizationId: string;
  readonly listOrganizationRoles: (args: {
    readonly organizationId: string;
  }) => Promise<{ readonly data: readonly WorkOSOrganizationRole[] }>;
}): Promise<string | null> {
  try {
    const roles = await listOrganizationRoles({ organizationId });

    if (!roles.data.length) {
      return null;
    }

    const hintedRole = roles.data.find((role) =>
      ADMIN_ROLE_SLUG_HINTS.some((hint) => role.slug.toLowerCase().includes(hint)),
    );

    if (hintedRole) {
      return hintedRole.slug;
    }

    const usersWidgetRole = roles.data.find((role) =>
      role.permissions.includes('widgets:users-table:manage'),
    );

    if (usersWidgetRole) {
      return usersWidgetRole.slug;
    }

    const roleWithMostPermissions = [...roles.data].sort(
      (a, b) => b.permissions.length - a.permissions.length,
    )[0];

    return roleWithMostPermissions?.slug ?? null;
  } catch (error) {
    console.error('Failed to list organization roles:', error);
    return null;
  }
}
