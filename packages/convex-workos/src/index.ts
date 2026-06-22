export interface WorkosProfile {
  readonly workosId: string;
  readonly email: string;
  readonly firstName?: string | null;
  readonly lastName?: string | null;
  readonly imageUrl?: string | null;
}

export interface ConvexWorkosCtx {
  readonly db: {
    readonly query: (...args: readonly any[]) => {
      withIndex: (...args: readonly any[]) => {
        unique: () => Promise<unknown>;
        first: () => Promise<unknown>;
        collect: () => Promise<unknown[]>;
      };
    };
    readonly insert: (...args: readonly any[]) => Promise<unknown>;
    readonly patch: (...args: readonly any[]) => Promise<void>;
    readonly delete: (...args: readonly any[]) => Promise<void>;
  };
}

export interface WorkosUserRecord {
  readonly _id: unknown;
  readonly workosId: string;
  readonly email: string;
  readonly firstName?: string | null;
  readonly lastName?: string | null;
  readonly imageUrl?: string | null;
  readonly organizationId?: string;
  readonly role?: unknown;
}

type QueryBuilder = {
  eq: (fieldName: string, value: unknown) => QueryBuilder;
};

function getName(user: WorkosProfile): string | undefined {
  return [user.firstName, user.lastName].filter(Boolean).join(' ') || undefined;
}

function getWorkosUserFields(user: WorkosProfile): Record<string, unknown> {
  return {
    workosId: user.workosId,
    email: user.email,
    name: getName(user),
    firstName: user.firstName ?? undefined,
    lastName: user.lastName ?? undefined,
    imageUrl: user.imageUrl ?? undefined,
  };
}

function queryUsers(ctx: ConvexWorkosCtx, tableName: string) {
  return ctx.db.query(tableName) as {
    withIndex: (
      indexName: string,
      callback: (query: QueryBuilder) => QueryBuilder,
    ) => {
      unique: () => Promise<unknown>;
      first: () => Promise<unknown>;
      collect: () => Promise<unknown[]>;
    };
  };
}

async function getBaseUser(
  ctx: ConvexWorkosCtx,
  tableName: string,
  workosId: string,
): Promise<WorkosUserRecord | undefined> {
  const users = await queryUsers(ctx, tableName)
    .withIndex('by_workos_id', (query) => query.eq('workosId', workosId))
    .collect();
  return users.find((user): user is WorkosUserRecord =>
    Boolean(user && typeof user === 'object' && !('organizationId' in user)),
  );
}

export async function upsertWorkosUserRecord(args: {
  readonly ctx: ConvexWorkosCtx;
  readonly tableName: string;
  readonly user: WorkosProfile;
  readonly organizationId?: string;
  readonly role?: unknown;
  readonly now?: number;
}): Promise<unknown> {
  const existing = args.organizationId
    ? await queryUsers(args.ctx, args.tableName)
        .withIndex('by_workos_id_and_organization', (query) =>
          query.eq('workosId', args.user.workosId).eq('organizationId', args.organizationId),
        )
        .unique()
    : await getBaseUser(args.ctx, args.tableName, args.user.workosId);
  const updatedAt = args.now ?? Date.now();
  const record = {
    ...getWorkosUserFields(args.user),
    organizationId: args.organizationId,
    role: (existing as WorkosUserRecord | undefined)?.role ?? args.role,
    updatedAt,
  };

  if (existing && typeof existing === 'object' && '_id' in existing) {
    await args.ctx.db.patch(existing._id, record);
    return existing._id;
  }

  return await args.ctx.db.insert(args.tableName, {
    ...record,
    createdAt: updatedAt,
  });
}

export async function patchWorkosUserRecords(args: {
  readonly ctx: ConvexWorkosCtx;
  readonly tableName: string;
  readonly user: WorkosProfile;
  readonly now?: number;
}): Promise<void> {
  const users = await queryUsers(args.ctx, args.tableName)
    .withIndex('by_workos_id', (query) => query.eq('workosId', args.user.workosId))
    .collect();

  if (users.length === 0) {
    await upsertWorkosUserRecord(args);
    return;
  }

  const patch = {
    ...getWorkosUserFields(args.user),
    updatedAt: args.now ?? Date.now(),
  };

  await Promise.all(
    users.map(async (record) => {
      if (record && typeof record === 'object' && '_id' in record) {
        await args.ctx.db.patch(record._id, patch);
      }
    }),
  );
}

export async function deleteWorkosUserRecords(args: {
  readonly ctx: ConvexWorkosCtx;
  readonly tableName: string;
  readonly workosId: string;
}): Promise<void> {
  const users = await queryUsers(args.ctx, args.tableName)
    .withIndex('by_workos_id', (query) => query.eq('workosId', args.workosId))
    .collect();

  await Promise.all(
    users.map(async (user) => {
      if (user && typeof user === 'object' && '_id' in user) {
        await args.ctx.db.delete(user._id);
      }
    }),
  );
}

export * from '../../workos/src/index.js';
