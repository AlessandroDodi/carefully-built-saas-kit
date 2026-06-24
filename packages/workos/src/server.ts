import { NextResponse } from 'next/server';

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

export type WorkOSPipesConnectionState =
  | 'connected'
  | 'needs_reauthorization'
  | 'disconnected';

export type WorkOSPipesAccessTokenError = 'not_installed' | 'needs_reauthorization';

export interface WorkOSPipesAccessTokenResult {
  readonly accessToken: string | null;
  readonly error?: WorkOSPipesAccessTokenError;
}

export interface WorkOSPipesAccessTokenResponse {
  readonly active: boolean;
  readonly accessToken?: {
    readonly accessToken: string;
  };
  readonly error?: WorkOSPipesAccessTokenError;
}

export interface WorkOSProviderConnection {
  readonly state?: WorkOSPipesConnectionState;
}

export interface WorkOSDataProvider {
  readonly slug?: string;
  readonly connected_account?: WorkOSProviderConnection | null;
}

export interface WorkOSListDataProvidersResponse {
  readonly data?: readonly WorkOSDataProvider[];
}

export interface WorkOSPipesUserContext {
  readonly userId: string;
  readonly organizationId?: string;
}

export interface WorkOSPipesProviderContext extends WorkOSPipesUserContext {
  readonly provider: string;
}

export interface WorkOSPipesAccessTokenOptions extends WorkOSPipesProviderContext {
  readonly getAccessToken: (
    args: WorkOSPipesProviderContext,
  ) => Promise<WorkOSPipesAccessTokenResponse>;
}

export interface WorkOSPipesConnectionStateOptions extends WorkOSPipesProviderContext {
  readonly apiKey?: string;
  readonly fetchImpl?: typeof fetch;
}

export interface WorkOSPipesAuthorizeUrlOptions {
  readonly provider: string;
  readonly authorizationToken: string;
  readonly widgetsVersion: string;
  readonly errorMessage: string;
  readonly logContext?: string;
  readonly requireHandoff?: boolean;
  readonly fetchImpl?: typeof fetch;
}

export interface WorkOSPipesConnectionStateRouteOptions {
  readonly getSession: () => Promise<WidgetTokenSession | null | undefined>;
  readonly getConnectionState: (args: WorkOSPipesUserContext) => Promise<WorkOSPipesConnectionState>;
  readonly messages: {
    readonly unauthorized: string;
    readonly fetchFailed: string;
  };
}

type WorkOSWidgetTokenResult =
  | {
      readonly token: string;
    }
  | {
      readonly response: NextResponse;
    };

const ADMIN_ROLE_SLUG_HINTS = [
  'owner',
  'admin',
  'organization_admin',
  'org_admin',
  'super_admin',
] as const;
const WORKOS_API_BASE_URL = 'https://api.workos.com';

export async function getWorkOSWidgetToken({
  logContext,
  errorMessage,
  getSession,
  getToken,
}: WorkOSWidgetTokenOptions): Promise<WorkOSWidgetTokenResult> {
  const session = await getSession();

  if (!session?.user) {
    return {
      response: NextResponse.json({ error: 'Non autorizzato' }, { status: 401 }),
    };
  }

  if (!session.organizationId) {
    return {
      response: NextResponse.json(
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
      response: NextResponse.json({ error: errorMessage }, { status: 500 }),
    };
  }
}

export async function createWorkOSWidgetTokenResponse(
  options: WorkOSWidgetTokenOptions,
): Promise<NextResponse> {
  const result = await getWorkOSWidgetToken(options);

  if ('response' in result) {
    return result.response;
  }

  return NextResponse.json({ token: result.token });
}

export async function getWorkOSPipesAccessToken({
  provider,
  userId,
  organizationId,
  getAccessToken,
}: WorkOSPipesAccessTokenOptions): Promise<WorkOSPipesAccessTokenResult> {
  const response = await getAccessToken({
    provider,
    userId,
    organizationId,
  });

  if (!response.active) {
    return {
      accessToken: null,
      error: response.error,
    };
  }

  return {
    accessToken: response.accessToken?.accessToken ?? null,
  };
}

export async function getWorkOSPipesConnectionState({
  provider,
  userId,
  organizationId,
  apiKey = process.env.WORKOS_API_KEY,
  fetchImpl = fetch,
}: WorkOSPipesConnectionStateOptions): Promise<WorkOSPipesConnectionState> {
  if (!apiKey) {
    throw new Error('WORKOS_API_KEY not set');
  }

  const searchParams = new URLSearchParams();
  if (organizationId) {
    searchParams.set('organization_id', organizationId);
  }

  const response = await fetchImpl(
    `${WORKOS_API_BASE_URL}/user_management/users/${userId}/data_providers?${searchParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      cache: 'no-store',
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to list WorkOS providers (${String(response.status)})`);
  }

  const payload = (await response.json()) as WorkOSListDataProvidersResponse;
  const dataProvider = payload.data?.find((entry) => entry.slug === provider);

  return dataProvider?.connected_account?.state ?? 'disconnected';
}

export async function createWorkOSPipesAuthorizeUrlResponse({
  provider,
  authorizationToken,
  widgetsVersion,
  errorMessage,
  logContext = `get ${provider} authorize URL`,
  requireHandoff,
  fetchImpl = fetch,
}: WorkOSPipesAuthorizeUrlOptions): Promise<NextResponse> {
  try {
    const searchParams = new URLSearchParams();
    if (typeof requireHandoff === 'boolean') {
      searchParams.set('require_handoff', String(requireHandoff));
    }

    const authorizeUrl = new URL(
      `/_widgets/DataIntegrations/${provider}/authorize`,
      WORKOS_API_BASE_URL,
    );
    authorizeUrl.search = searchParams.toString();

    const response = await fetchImpl(authorizeUrl, {
      headers: {
        Authorization: `Bearer ${authorizationToken}`,
        'Content-Type': 'application/json',
        'WorkOS-Widgets-Type': 'pipes',
        'WorkOS-Widgets-Version': widgetsVersion,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`Failed to ${logContext}:`, body);
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    const data = (await response.json()) as { url?: string };

    if (!data.url) {
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

    return NextResponse.json({ url: data.url });
  } catch (error) {
    console.error(`Failed to ${logContext}:`, error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export function createWorkOSPipesConnectionStateGetHandler({
  getSession,
  getConnectionState,
  messages,
}: WorkOSPipesConnectionStateRouteOptions): () => Promise<NextResponse> {
  return async function GET(): Promise<NextResponse> {
    try {
      const session = await getSession();

      if (!session?.user) {
        return NextResponse.json({ error: messages.unauthorized }, { status: 401 });
      }

      const connectionState = await getConnectionState({
        userId: session.user.id,
        organizationId: session.organizationId ?? undefined,
      });

      return NextResponse.json({ connectionState });
    } catch (error) {
      console.error('Failed to fetch WorkOS Pipes connection state:', error);
      return NextResponse.json({ error: messages.fetchFailed }, { status: 500 });
    }
  };
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
