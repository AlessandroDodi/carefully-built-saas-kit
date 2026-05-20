export interface ConvexDbReader {
  readonly get: (...args: readonly any[]) => Promise<unknown>;
  readonly query: (...args: readonly any[]) => {
    withIndex: (...args: readonly any[]) => {
      unique: () => Promise<unknown>;
      first: () => Promise<unknown>;
    };
  };
}

export interface ConvexMultitenantCtx {
  readonly db: ConvexDbReader;
}

interface OrganizationScopedRecord {
  readonly _id?: unknown;
  readonly organizationId?: string | null;
  readonly archivedAt?: number | null;
}

interface WorkosUserRecord extends OrganizationScopedRecord {
  readonly workosId?: string | null;
}

type QueryBuilder = {
  eq: (fieldName: string, value: unknown) => QueryBuilder;
};

function isOrganizationScopedRecord(record: unknown): record is OrganizationScopedRecord {
  return Boolean(record && typeof record === 'object');
}

function isWorkosUserRecord(record: unknown): record is WorkosUserRecord {
  return isOrganizationScopedRecord(record);
}

export async function requireUserInOrganization(
  ctx: ConvexMultitenantCtx,
  userId: unknown,
  organizationId: string,
): Promise<void> {
  const user = await (ctx.db.get as (id: unknown) => Promise<unknown>)(userId);

  if (
    !isOrganizationScopedRecord(user) ||
    user.organizationId !== organizationId ||
    user.archivedAt
  ) {
    throw new Error('User not found in organization');
  }
}

export async function findCurrentUserByWorkosId<TUser extends WorkosUserRecord>(
  ctx: ConvexMultitenantCtx,
  organizationId: string,
  currentWorkosUserId: string,
): Promise<TUser> {
  const queryUsers = ctx.db.query as (tableName: string) => {
    withIndex: (
      indexName: string,
      callback: (query: QueryBuilder) => QueryBuilder,
    ) => {
      unique: () => Promise<unknown>;
      first: () => Promise<unknown>;
    };
  };
  const scopedUser =
    (await queryUsers('users')
      .withIndex('by_workos_id_and_organization', (query) =>
        query.eq('workosId', currentWorkosUserId).eq('organizationId', organizationId),
      )
      .unique()) ??
    (await queryUsers('users')
      .withIndex('by_workos_id', (query) => query.eq('workosId', currentWorkosUserId))
      .first());

  if (!isWorkosUserRecord(scopedUser)) {
    throw new Error('User not synced');
  }

  return scopedUser as TUser;
}
