export interface ConvexCrudCtx {
  readonly db: {
    readonly get: (...args: readonly any[]) => Promise<unknown>;
    readonly insert: (...args: readonly any[]) => Promise<unknown>;
    readonly patch: (...args: readonly any[]) => Promise<void>;
  };
}

export interface OrganizationRecord {
  readonly _id: unknown;
  readonly organizationId?: string | null;
  readonly archivedAt?: number | null;
}

export interface AuditFields<TUserId = unknown> {
  readonly createdAt: number;
  readonly updatedAt: number;
  readonly createdBy: TUserId;
  readonly updatedBy: TUserId;
}

export interface UpdateAuditFields<TUserId = unknown> {
  readonly updatedAt: number;
  readonly updatedBy: TUserId;
}

export interface ArchiveAuditFields<TUserId = unknown> extends UpdateAuditFields<TUserId> {
  readonly archivedAt: number;
}

export interface CreateTimestampFields {
  readonly createdAt: number;
  readonly updatedAt: number;
}

export interface UpdateTimestampFields {
  readonly updatedAt: number;
}

function isOrganizationRecord(record: unknown): record is OrganizationRecord {
  return Boolean(record && typeof record === 'object' && '_id' in record);
}

export function createAuditFields<TUserId>(userId: TUserId, now = Date.now()): AuditFields<TUserId> {
  return {
    createdAt: now,
    updatedAt: now,
    createdBy: userId,
    updatedBy: userId,
  };
}

export function createTimestampFields(now = Date.now()): CreateTimestampFields {
  return {
    createdAt: now,
    updatedAt: now,
  };
}

export function updateTimestampFields(now = Date.now()): UpdateTimestampFields {
  return {
    updatedAt: now,
  };
}

export function updateAuditFields<TUserId>(
  userId: TUserId,
  now = Date.now(),
): UpdateAuditFields<TUserId> {
  return {
    updatedAt: now,
    updatedBy: userId,
  };
}

export function archiveAuditFields<TUserId>(
  userId: TUserId,
  now = Date.now(),
): ArchiveAuditFields<TUserId> {
  return {
    archivedAt: now,
    updatedAt: now,
    updatedBy: userId,
  };
}

export async function patchWithAudit(
  ctx: ConvexCrudCtx,
  id: unknown,
  value: Record<string, unknown>,
  userId: unknown,
  now = Date.now(),
): Promise<void> {
  const patchRecord = ctx.db.patch as (id: unknown, value: Record<string, unknown>) => Promise<void>;
  await patchRecord(id, {
    ...value,
    ...updateAuditFields(userId, now),
  });
}

export async function insertWithAudit(
  ctx: ConvexCrudCtx,
  tableName: string,
  value: Record<string, unknown>,
  userId: unknown,
  now = Date.now(),
): Promise<unknown> {
  const insert = ctx.db.insert as (
    tableName: string,
    value: Record<string, unknown>,
  ) => Promise<unknown>;
  return await insert(tableName, {
    ...value,
    ...createAuditFields(userId, now),
  });
}

export async function archiveWithAudit(
  ctx: ConvexCrudCtx,
  id: unknown,
  userId: unknown,
  now = Date.now(),
): Promise<void> {
  const patch = ctx.db.patch as (id: unknown, value: Record<string, unknown>) => Promise<void>;
  await patch(id, { ...archiveAuditFields(userId, now) });
}

export async function getActiveOrgRecord<TRecord extends OrganizationRecord>(
  ctx: ConvexCrudCtx,
  id: unknown,
  organizationId: string,
  notFoundMessage = 'Record not found',
): Promise<TRecord> {
  const get = ctx.db.get as (id: unknown) => Promise<unknown>;
  const record = await get(id);

  if (
    !isOrganizationRecord(record) ||
    record.organizationId !== organizationId ||
    record.archivedAt
  ) {
    throw new Error(notFoundMessage);
  }

  return record as TRecord;
}

export async function upsertOrganizationRecord(args: {
  readonly ctx: ConvexCrudCtx;
  readonly tableName: string;
  readonly organizationId: string;
  readonly currentUserId: unknown;
  readonly existing?: OrganizationRecord | null;
  readonly create: Record<string, unknown>;
  readonly update?: Record<string, unknown>;
  readonly now?: number;
}): Promise<unknown> {
  const now = args.now ?? Date.now();

  if (args.existing) {
    const patch = args.ctx.db.patch as (
      id: unknown,
      value: Record<string, unknown>,
    ) => Promise<void>;
    await patch(args.existing._id, {
      ...(args.update ?? args.create),
      ...updateAuditFields(args.currentUserId, now),
    });

    return args.existing._id;
  }

  const insert = args.ctx.db.insert as (
    tableName: string,
    value: Record<string, unknown>,
  ) => Promise<unknown>;
  return await insert(args.tableName, {
    organizationId: args.organizationId,
    ...args.create,
    ...createAuditFields(args.currentUserId, now),
  });
}

type CustomFieldMutationFactoryArgs = {
  readonly mutation: (definition: { args: Record<string, unknown>; handler: (ctx: any, args: any) => Promise<unknown> }) => unknown;
  readonly v: {
    id: (tableName: string) => unknown;
    optional: (validator: unknown) => unknown;
    string: () => unknown;
    number: () => unknown;
    boolean: () => unknown;
    array: (validator: unknown) => unknown;
    object: (shape: Record<string, unknown>) => unknown;
    any: () => unknown;
  };
  readonly entityTypeValidator: unknown;
  readonly customFieldTypeValidator: unknown;
  readonly resolveCurrentUser: (
    ctx: any,
    organizationId: string,
    currentUserId?: string,
    currentWorkosUserId?: string,
  ) => Promise<{ readonly _id: unknown }>;
};

type ConvexMutationBuilder = (definition: {
  args: Record<string, unknown>;
  handler: (ctx: any, args: any) => Promise<unknown>;
}) => unknown;

type ConvexValidatorBuilder = {
  id: (tableName: string) => unknown;
  string: () => unknown;
};

export type AssociatedEntityMutationFactoryArgs = {
  readonly mutation: ConvexMutationBuilder;
  readonly v: ConvexValidatorBuilder;
  readonly tableName: string;
  readonly idTableName?: string;
  readonly createDataValidator: unknown;
  readonly updateDataValidator: unknown;
  readonly requireAccess: (
    ctx: any,
    args: { readonly currentUserId: unknown; readonly organizationId: string },
  ) => Promise<void>;
  readonly getScopedRecord: (
    ctx: any,
    id: unknown,
    organizationId: string,
  ) => Promise<unknown>;
  readonly beforeCreate?: (
    ctx: any,
    args: { readonly currentUserId: unknown; readonly organizationId: string; readonly data: any },
  ) => Promise<void>;
  readonly beforeUpdate?: (
    ctx: any,
    args: {
      readonly id: unknown;
      readonly currentUserId: unknown;
      readonly organizationId: string;
      readonly data: any;
      readonly existing: unknown;
    },
  ) => Promise<void>;
  readonly buildCreateRecord: (args: {
    readonly data: any;
    readonly currentUserId: unknown;
    readonly organizationId: string;
    readonly now: number;
  }) => Record<string, unknown>;
  readonly buildUpdatePatch: (args: {
    readonly data: any;
    readonly existing: unknown;
    readonly currentUserId: unknown;
    readonly organizationId: string;
    readonly now: number;
  }) => Record<string, unknown>;
  readonly getAssociations?: (data: any) => readonly unknown[] | undefined;
  readonly syncAssociations?: (
    ctx: any,
    args: {
      readonly id: unknown;
      readonly currentUserId: unknown;
      readonly organizationId: string;
      readonly associations: readonly unknown[];
    },
  ) => Promise<void>;
  readonly archiveAssociations?: (
    ctx: any,
    args: {
      readonly id: unknown;
      readonly currentUserId: unknown;
      readonly organizationId: string;
    },
  ) => Promise<void>;
};

export function createAssociatedEntityMutationSet(factory: AssociatedEntityMutationFactoryArgs) {
  const { mutation, v } = factory;
  const idTableName = factory.idTableName ?? factory.tableName;

  return {
    create: mutation({
      args: {
        currentUserId: v.id('users'),
        organizationId: v.string(),
        data: factory.createDataValidator,
      },
      handler: async (ctx, args) => {
        await factory.requireAccess(ctx, args);
        await factory.beforeCreate?.(ctx, args);
        const now = Date.now();
        const id = await insertWithAudit(
          ctx,
          factory.tableName,
          {
            organizationId: args.organizationId,
            ...factory.buildCreateRecord({
              data: args.data,
              currentUserId: args.currentUserId,
              organizationId: args.organizationId,
              now,
            }),
          },
          args.currentUserId,
          now,
        );

        const associations = factory.getAssociations?.(args.data);
        if (associations && factory.syncAssociations) {
          await factory.syncAssociations(ctx, {
            id,
            currentUserId: args.currentUserId,
            organizationId: args.organizationId,
            associations,
          });
        }

        return id;
      },
    }),
    update: mutation({
      args: {
        id: v.id(idTableName),
        currentUserId: v.id('users'),
        organizationId: v.string(),
        data: factory.updateDataValidator,
      },
      handler: async (ctx, args) => {
        await factory.requireAccess(ctx, args);
        const existing = await factory.getScopedRecord(ctx, args.id, args.organizationId);
        await factory.beforeUpdate?.(ctx, { ...args, existing });
        const now = Date.now();

        await patchWithAudit(
          ctx,
          args.id,
          factory.buildUpdatePatch({
            data: args.data,
            existing,
            currentUserId: args.currentUserId,
            organizationId: args.organizationId,
            now,
          }),
          args.currentUserId,
          now,
        );

        const associations = factory.getAssociations?.(args.data);
        if (associations && factory.syncAssociations) {
          await factory.syncAssociations(ctx, {
            id: args.id,
            currentUserId: args.currentUserId,
            organizationId: args.organizationId,
            associations,
          });
        }

        return await ctx.db.get(args.id);
      },
    }),
    archive: mutation({
      args: {
        id: v.id(idTableName),
        currentUserId: v.id('users'),
        organizationId: v.string(),
      },
      handler: async (ctx, args) => {
        await factory.requireAccess(ctx, args);
        await factory.getScopedRecord(ctx, args.id, args.organizationId);
        await archiveWithAudit(ctx, args.id, args.currentUserId);
        await factory.archiveAssociations?.(ctx, {
          id: args.id,
          currentUserId: args.currentUserId,
          organizationId: args.organizationId,
        });
      },
    }),
  };
}

export type TagMutationFactoryArgs = {
  readonly mutation: ConvexMutationBuilder;
  readonly v: ConvexValidatorBuilder;
  readonly entityTypeValidator: unknown;
  readonly resolveCurrentUser: (
    ctx: any,
    organizationId: string,
    currentWorkosUserId: string,
  ) => Promise<{ readonly _id: unknown }>;
  readonly findExistingTag: (
    ctx: any,
    args: {
      readonly organizationId: string;
      readonly entityType: string;
      readonly normalizedName: string;
    },
  ) => Promise<{ readonly _id: unknown } | null>;
  readonly countUsage: (
    ctx: any,
    args: {
      readonly organizationId: string;
      readonly entityType: string;
      readonly tagId: unknown;
    },
  ) => Promise<number>;
};

export function normalizeTagName(name: string): string {
  return name.trim().toLocaleLowerCase();
}

export function trimTagName(name: string): string {
  return name.trim();
}

export function createTagMutationSet(factory: TagMutationFactoryArgs) {
  const { mutation, v } = factory;

  return {
    create: mutation({
      args: {
        organizationId: v.string(),
        currentWorkosUserId: v.string(),
        entityType: factory.entityTypeValidator,
        name: v.string(),
      },
      handler: async (ctx, args) => {
        const currentUser = await factory.resolveCurrentUser(
          ctx,
          args.organizationId,
          args.currentWorkosUserId,
        );
        const normalizedName = normalizeTagName(args.name);
        const name = trimTagName(args.name);

        if (!name) {
          throw new Error('Tag name is required');
        }

        const existing = await factory.findExistingTag(ctx, {
          organizationId: args.organizationId,
          entityType: args.entityType,
          normalizedName,
        });
        if (existing) {
          throw new Error('A tag with this name already exists for the selected entity type');
        }

        return await ctx.db.insert('tags', {
          organizationId: args.organizationId,
          entityType: args.entityType,
          name,
          nameNormalized: normalizedName,
          ...createAuditFields(currentUser._id),
        });
      },
    }),
    update: mutation({
      args: {
        tagId: v.id('tags'),
        organizationId: v.string(),
        currentWorkosUserId: v.string(),
        name: v.string(),
      },
      handler: async (ctx, args) => {
        const currentUser = await factory.resolveCurrentUser(
          ctx,
          args.organizationId,
          args.currentWorkosUserId,
        );
        const tag = await ctx.db.get(args.tagId);

        if (!tag || tag.organizationId !== args.organizationId || tag.archivedAt) {
          throw new Error('Tag not found');
        }

        const normalizedName = normalizeTagName(args.name);
        const name = trimTagName(args.name);

        if (!name) {
          throw new Error('Tag name is required');
        }

        const existing = await factory.findExistingTag(ctx, {
          organizationId: args.organizationId,
          entityType: tag.entityType,
          normalizedName,
        });
        if (existing && existing._id !== tag._id) {
          throw new Error('A tag with this name already exists for the selected entity type');
        }

        await patchWithAudit(
          ctx,
          tag._id,
          {
            name,
            nameNormalized: normalizedName,
          },
          currentUser._id,
        );

        return tag._id;
      },
    }),
    remove: mutation({
      args: {
        tagId: v.id('tags'),
        organizationId: v.string(),
        currentWorkosUserId: v.string(),
      },
      handler: async (ctx, args) => {
        const currentUser = await factory.resolveCurrentUser(
          ctx,
          args.organizationId,
          args.currentWorkosUserId,
        );
        const tag = await ctx.db.get(args.tagId);

        if (!tag || tag.organizationId !== args.organizationId || tag.archivedAt) {
          throw new Error('Tag not found');
        }

        const usageCount = await factory.countUsage(ctx, {
          organizationId: args.organizationId,
          entityType: tag.entityType,
          tagId: tag._id,
        });
        if (usageCount > 0) {
          throw new Error('Cannot delete a tag that is already assigned');
        }

        await archiveWithAudit(ctx, tag._id, currentUser._id);

        return tag._id;
      },
    }),
  };
}

function normalizeFieldKey(label: string): string {
  return (
    label
      .trim()
      .toLocaleLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '') || `campo_${String(Date.now())}`
  );
}

async function ensureUniqueCustomFieldKey(args: {
  readonly ctx: any;
  readonly organizationId: string;
  readonly entityType: string;
  readonly key: string;
  readonly currentDefinitionId?: string;
}): Promise<void> {
  const existing = await args.ctx.db
    .query('customFieldDefinitions')
    .withIndex('by_entity_key', (query: any) =>
      query
        .eq('organizationId', args.organizationId)
        .eq('entityType', args.entityType)
        .eq('key', args.key),
    )
    .first();

  if (existing && String(existing._id) !== args.currentDefinitionId && !existing.archivedAt) {
    throw new Error('A custom field with this name already exists for the selected entity');
  }
}

export function createCustomFieldMutationSet(factory: CustomFieldMutationFactoryArgs) {
  const { mutation, v } = factory;
  const customFieldValueInputValidator = v.object({
    fieldDefinitionId: v.id('customFieldDefinitions'),
    valueType: factory.customFieldTypeValidator,
    textValue: v.optional(v.string()),
    numberValue: v.optional(v.number()),
    booleanValue: v.optional(v.boolean()),
    dateValue: v.optional(v.number()),
    stringListValue: v.optional(v.array(v.string())),
    jsonValue: v.optional(v.any()),
  });

  return {
    createDefinition: mutation({
      args: {
        currentUserId: v.optional(v.id('users')),
        currentWorkosUserId: v.optional(v.string()),
        organizationId: v.string(),
        entityType: factory.entityTypeValidator,
        key: v.optional(v.string()),
        label: v.string(),
        fieldType: factory.customFieldTypeValidator,
        options: v.optional(v.array(v.string())),
        config: v.optional(v.any()),
        sortOrder: v.optional(v.number()),
      },
      handler: async (ctx, args) => {
        const currentUser = await factory.resolveCurrentUser(
          ctx,
          args.organizationId,
          args.currentUserId,
          args.currentWorkosUserId,
        );
        const label = args.label.trim();

        if (!label) {
          throw new Error('Custom field label is required');
        }

        const key = args.key?.trim() || normalizeFieldKey(label);
        await ensureUniqueCustomFieldKey({
          ctx,
          organizationId: args.organizationId,
          entityType: args.entityType,
          key,
        });

        return await ctx.db.insert('customFieldDefinitions', {
          organizationId: args.organizationId,
          entityType: args.entityType,
          key,
          label,
          fieldType: args.fieldType,
          options: args.options?.map((option: string) => option.trim()).filter(Boolean) ?? [],
          config: args.config,
          isActive: true,
          sortOrder: args.sortOrder,
          ...createAuditFields(currentUser._id),
          schemaVersion: 1,
        });
      },
    }),
    updateDefinition: mutation({
      args: {
        definitionId: v.id('customFieldDefinitions'),
        currentUserId: v.optional(v.id('users')),
        currentWorkosUserId: v.optional(v.string()),
        organizationId: v.string(),
        entityType: factory.entityTypeValidator,
        label: v.string(),
        fieldType: factory.customFieldTypeValidator,
        options: v.optional(v.array(v.string())),
        config: v.optional(v.any()),
        sortOrder: v.optional(v.number()),
        isActive: v.optional(v.boolean()),
      },
      handler: async (ctx, args) => {
        const currentUser = await factory.resolveCurrentUser(
          ctx,
          args.organizationId,
          args.currentUserId,
          args.currentWorkosUserId,
        );
        const definition = await ctx.db.get(args.definitionId);

        if (definition?.organizationId !== args.organizationId || definition.archivedAt) {
          throw new Error('Custom field not found');
        }

        const config = (definition.config ?? {}) as { readonly isSystem?: boolean };
        if (config.isSystem && definition.entityType !== args.entityType) {
          throw new Error('System custom fields cannot change association');
        }

        const label = args.label.trim();
        if (!label) {
          throw new Error('Custom field label is required');
        }

        const key = normalizeFieldKey(label);
        await ensureUniqueCustomFieldKey({
          ctx,
          organizationId: args.organizationId,
          entityType: args.entityType,
          key,
          currentDefinitionId: String(definition._id),
        });

        await ctx.db.patch(definition._id, {
          entityType: args.entityType,
          key,
          label,
          fieldType: args.fieldType,
          options: args.options?.map((option: string) => option.trim()).filter(Boolean) ?? [],
          config: {
            ...(definition.config ?? {}),
            ...(args.config ?? {}),
          },
          sortOrder: args.sortOrder,
          isActive: args.isActive ?? definition.isActive,
          ...updateAuditFields(currentUser._id),
        });

        return definition._id;
      },
    }),
    removeDefinition: mutation({
      args: {
        definitionId: v.id('customFieldDefinitions'),
        currentUserId: v.optional(v.id('users')),
        currentWorkosUserId: v.optional(v.string()),
        organizationId: v.string(),
      },
      handler: async (ctx, args) => {
        const currentUser = await factory.resolveCurrentUser(
          ctx,
          args.organizationId,
          args.currentUserId,
          args.currentWorkosUserId,
        );
        const definition = await ctx.db.get(args.definitionId);

        if (definition?.organizationId !== args.organizationId || definition.archivedAt) {
          throw new Error('Custom field not found');
        }

        const config = (definition.config ?? {}) as { readonly isSystem?: boolean };
        if (config.isSystem) {
          throw new Error('System custom fields cannot be deleted');
        }

        const values = await ctx.db
          .query('customFieldValues')
          .withIndex('by_definition', (query: any) =>
            query.eq('organizationId', args.organizationId).eq('fieldDefinitionId', definition._id),
          )
          .collect();

        if (values.filter((value: { archivedAt?: number }) => !value.archivedAt).length > 0) {
          throw new Error('Cannot delete a custom field that already has values');
        }

        await ctx.db.patch(definition._id, {
          isActive: false,
          ...archiveAuditFields(currentUser._id),
        });

        return definition._id;
      },
    }),
    setValue: mutation({
      args: {
        currentUserId: v.optional(v.id('users')),
        currentWorkosUserId: v.optional(v.string()),
        organizationId: v.string(),
        entityType: factory.entityTypeValidator,
        entityId: v.string(),
        fieldDefinitionId: v.id('customFieldDefinitions'),
        valueType: factory.customFieldTypeValidator,
        textValue: v.optional(v.string()),
        numberValue: v.optional(v.number()),
        booleanValue: v.optional(v.boolean()),
        dateValue: v.optional(v.number()),
        stringListValue: v.optional(v.array(v.string())),
        jsonValue: v.optional(v.any()),
      },
      handler: async (ctx, args) => {
        const currentUser = await factory.resolveCurrentUser(
          ctx,
          args.organizationId,
          args.currentUserId,
          args.currentWorkosUserId,
        );
        const existing = await ctx.db
          .query('customFieldValues')
          .withIndex('by_definition', (query: any) =>
            query.eq('organizationId', args.organizationId).eq('fieldDefinitionId', args.fieldDefinitionId),
          )
          .collect();
        const current = existing.find((value: any) =>
          value.entityType === args.entityType && value.entityId === args.entityId,
        );
        const now = Date.now();
        const nextValue = {
          organizationId: args.organizationId,
          entityType: args.entityType,
          entityId: args.entityId,
          fieldDefinitionId: args.fieldDefinitionId,
          valueType: args.valueType,
          textValue: args.textValue,
          numberValue: args.numberValue,
          booleanValue: args.booleanValue,
          dateValue: args.dateValue,
          stringListValue: args.stringListValue,
          jsonValue: args.jsonValue,
          ...updateAuditFields(currentUser._id, now),
        };

        if (current) {
          await ctx.db.patch(current._id, nextValue);
          return await ctx.db.get(current._id);
        }

        const id = await ctx.db.insert('customFieldValues', {
          ...nextValue,
          ...createAuditFields(currentUser._id, now),
          schemaVersion: 1,
        });

        return await ctx.db.get(id);
      },
    }),
    setValuesForEntity: mutation({
      args: {
        currentUserId: v.optional(v.id('users')),
        currentWorkosUserId: v.optional(v.string()),
        organizationId: v.string(),
        entityType: factory.entityTypeValidator,
        entityId: v.string(),
        values: v.array(customFieldValueInputValidator),
      },
      handler: async (ctx, args) => {
        const currentUser = await factory.resolveCurrentUser(
          ctx,
          args.organizationId,
          args.currentUserId,
          args.currentWorkosUserId,
        );
        const now = Date.now();
        const savedIds = [];

        for (const value of args.values) {
          const definition = await ctx.db.get(value.fieldDefinitionId);
          if (
            definition?.organizationId !== args.organizationId ||
            definition.entityType !== args.entityType ||
            definition.archivedAt
          ) {
            throw new Error('Custom field definition not found');
          }

          const existing = await ctx.db
            .query('customFieldValues')
            .withIndex('by_definition', (query: any) =>
              query.eq('organizationId', args.organizationId).eq('fieldDefinitionId', value.fieldDefinitionId),
            )
            .collect();
          const current = existing.find((candidate: any) =>
            candidate.entityType === args.entityType && candidate.entityId === args.entityId,
          );
          const nextValue = {
            organizationId: args.organizationId,
            entityType: args.entityType,
            entityId: args.entityId,
            fieldDefinitionId: value.fieldDefinitionId,
            valueType: value.valueType,
            textValue: value.textValue,
            numberValue: value.numberValue,
            booleanValue: value.booleanValue,
            dateValue: value.dateValue,
            stringListValue: value.stringListValue,
            jsonValue: value.jsonValue,
            archivedAt: undefined,
            ...updateAuditFields(currentUser._id, now),
          };

          if (current) {
            await ctx.db.patch(current._id, nextValue);
            savedIds.push(current._id);
            continue;
          }

          savedIds.push(await ctx.db.insert('customFieldValues', {
            ...nextValue,
            ...createAuditFields(currentUser._id, now),
            schemaVersion: 1,
          }));
        }

        return savedIds;
      },
    }),
  };
}
