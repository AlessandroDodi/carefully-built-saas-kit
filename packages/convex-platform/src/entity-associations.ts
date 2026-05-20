export interface ConvexPlatformCtx {
  // Convex generated DB readers are schema-specialized, so the package keeps this structural.
  readonly db: any;
}

export const associationEntityTypes = [
  "contact",
  "property",
  "request",
  "opportunity",
  "activity",
  "note",
  "document",
] as const;

export type AssociationEntityType = (typeof associationEntityTypes)[number];

type AssociationTable =
  | "contacts"
  | "properties"
  | "requests"
  | "opportunities"
  | "activities"
  | "notes"
  | "documents";

interface AssociationEntityConfig {
  readonly label: string;
  readonly table: AssociationTable;
  readonly getDisplayLabel: (doc: Record<string, unknown>) => string;
}

export interface AssociationInput<TEntity extends AssociationEntityType = AssociationEntityType> {
  readonly entityId: string;
  readonly entityType: TEntity;
}

export interface AssociationRecord<TEntity extends AssociationEntityType = AssociationEntityType> {
  readonly value: string;
  readonly entityId: string;
  readonly entityType: TEntity;
  readonly label: string;
  readonly typeLabel: string;
  readonly imageUrl?: string;
}

interface ListAssociationOptions<TEntity extends AssociationEntityType> {
  readonly shouldInclude?: (
    entityType: TEntity,
    doc: Record<string, unknown>,
  ) => boolean;
  readonly getImageUrl?: (
    ctx: any,
    entityType: TEntity,
    doc: Record<string, unknown>,
  ) => Promise<string | undefined>;
}

export interface EntityAssociationRelation {
  readonly toEntityId: string;
  readonly toEntityType: string;
  readonly archivedAt?: number;
  readonly relationshipType?: string;
}

export interface ListEntityAssociationsOptions<TEntity extends AssociationEntityType> {
  readonly organizationId: string;
  readonly fromEntityType: AssociationEntityType;
  readonly fromEntityId: string;
  readonly supportedEntityTypes?: readonly TEntity[];
  readonly relationshipType?: "attached_to" | "related_to";
  readonly getImageUrl?: (
    ctx: any,
    entityType: TEntity,
    doc: Record<string, unknown>,
  ) => Promise<string | undefined>;
  readonly resolveLegacyAssociation?: (
    ctx: any,
    relation: EntityAssociationRelation,
  ) => Promise<AssociationRecord<TEntity> | null>;
}

export function getStringField(doc: Record<string, unknown>, key: string): string {
  const value = doc[key];
  return typeof value === "string" ? value : "";
}

const associationEntityConfigs: Record<AssociationEntityType, AssociationEntityConfig> = {
  contact: {
    label: "Contatto",
    table: "contacts",
    getDisplayLabel: (doc) => getStringField(doc, "fullName"),
  },
  property: {
    label: "Proprietà",
    table: "properties",
    getDisplayLabel: (doc) => getStringField(doc, "title"),
  },
  request: {
    label: "Richiesta",
    table: "requests",
    getDisplayLabel: (doc) => getStringField(doc, "title"),
  },
  opportunity: {
    label: "Opportunità",
    table: "opportunities",
    getDisplayLabel: (doc) => getStringField(doc, "title"),
  },
  activity: {
    label: "Agenda",
    table: "activities",
    getDisplayLabel: (doc) => getStringField(doc, "title"),
  },
  note: {
    label: "Nota",
    table: "notes",
    getDisplayLabel: (doc) => getStringField(doc, "title") || getStringField(doc, "body"),
  },
  document: {
    label: "Documento",
    table: "documents",
    getDisplayLabel: (doc) => getStringField(doc, "title"),
  },
};

export function buildAssociationValue(entityType: AssociationEntityType, entityId: string): string {
  return `${entityType}:${entityId}`;
}

export function getAssociationTypeLabel(entityType: AssociationEntityType): string {
  return associationEntityConfigs[entityType].label;
}

function isActiveOrganizationDoc(
  doc: Record<string, unknown> | null,
  organizationId: string,
): doc is Record<string, unknown> {
  return (
    doc !== null &&
    doc.organizationId === organizationId &&
    !doc.archivedAt &&
    doc.status !== "archived"
  );
}

export async function getAssociationLabel<TEntity extends AssociationEntityType>(
  ctx: ConvexPlatformCtx,
  organizationId: string,
  association: AssociationInput<TEntity>,
): Promise<string | null> {
  const config = associationEntityConfigs[association.entityType];
  const doc = await ctx.db.get(association.entityId as never);

  if (!isActiveOrganizationDoc(doc, organizationId)) {
    return null;
  }

  return config.getDisplayLabel(doc);
}

export async function listAssociationLabelsByValue<TEntity extends AssociationEntityType>(
  ctx: ConvexPlatformCtx,
  organizationId: string,
  associations: readonly AssociationInput<TEntity>[],
): Promise<Map<string, string>> {
  const uniqueAssociations = Array.from(
    new Map(
      associations.map((association) => [
        buildAssociationValue(association.entityType, association.entityId),
        association,
      ]),
    ).values(),
  );

  const labels = await Promise.all(
    uniqueAssociations.map(async (association) => {
      const label = await getAssociationLabel(ctx, organizationId, association);
      return label
        ? ([buildAssociationValue(association.entityType, association.entityId), label] as const)
        : null;
    }),
  );

  return new Map(labels.filter((entry) => entry !== null));
}

async function listEntitiesForAssociationType<TEntity extends AssociationEntityType>(
  ctx: ConvexPlatformCtx,
  organizationId: string,
  entityType: TEntity,
  options: ListAssociationOptions<TEntity>,
): Promise<AssociationRecord<TEntity>[]> {
  const config = associationEntityConfigs[entityType];
  const docs = (await ctx.db
    .query(config.table)
    .withIndex("by_organization", (query: { eq: (field: string, value: unknown) => unknown }) =>
      query.eq("organizationId", organizationId),
    )
    .collect()) as Record<string, unknown>[];

  return await Promise.all(
    docs
      .filter((doc) => isActiveOrganizationDoc(doc, organizationId))
      .filter((doc) => options.shouldInclude?.(entityType, doc) ?? true)
      .map(async (doc) => {
        const entityId = String(doc._id);

        return {
          value: buildAssociationValue(entityType, entityId),
          entityId,
          entityType,
          label: config.getDisplayLabel(doc),
          typeLabel: config.label,
          imageUrl: await options.getImageUrl?.(ctx, entityType, doc),
        };
      }),
  );
}

export async function listAssociationOptions<TEntity extends AssociationEntityType>(
  ctx: ConvexPlatformCtx,
  organizationId: string,
  entityTypes: readonly TEntity[] = associationEntityTypes as unknown as readonly TEntity[],
  options: ListAssociationOptions<TEntity> = {},
): Promise<AssociationRecord<TEntity>[]> {
  const groups = await Promise.all(
    entityTypes.map((entityType) =>
      listEntitiesForAssociationType(ctx, organizationId, entityType, options),
    ),
  );

  return groups.flat().sort((left, right) => left.label.localeCompare(right.label, "it"));
}

export async function listEntityAssociations<TEntity extends AssociationEntityType>(
  ctx: ConvexPlatformCtx,
  options: ListEntityAssociationsOptions<TEntity>,
): Promise<AssociationRecord<TEntity>[]> {
  const supportedEntityTypes =
    options.supportedEntityTypes ?? (associationEntityTypes as unknown as readonly TEntity[]);
  const relationshipType = options.relationshipType ?? "attached_to";
  const relations = (await ctx.db
    .query("entityRelations")
    .withIndex("by_from_entity", (query: any) =>
      query
        .eq("organizationId", options.organizationId)
        .eq("fromEntityType", options.fromEntityType)
        .eq("fromEntityId", options.fromEntityId),
    )
    .collect()) as EntityAssociationRelation[];

  const associations = await Promise.all(
    relations
      .filter((relation) => !relation.archivedAt && relation.relationshipType === relationshipType)
      .map(async (relation) => {
        if (!supportedEntityTypes.includes(relation.toEntityType as TEntity)) {
          return await options.resolveLegacyAssociation?.(ctx, relation) ?? null;
        }

        const association = {
          entityId: relation.toEntityId,
          entityType: relation.toEntityType as TEntity,
        };
        const [doc, label] = await Promise.all([
          options.getImageUrl
            ? (ctx.db.get(association.entityId as never) as Promise<Record<string, unknown> | null>)
            : Promise.resolve(null),
          getAssociationLabel(ctx, options.organizationId, association),
        ]);

        if (!label || (options.getImageUrl && !doc)) {
          return null;
        }

        return {
          value: buildAssociationValue(association.entityType, association.entityId),
          entityId: association.entityId,
          entityType: association.entityType,
          label,
          typeLabel: getAssociationTypeLabel(association.entityType),
          imageUrl: doc
            ? await options.getImageUrl?.(ctx, association.entityType, doc)
            : undefined,
        };
      }),
  );

  return associations.filter((association) => association !== null);
}

export interface SyncAttachedEntityAssociationsArgs<
  TEntity extends AssociationEntityType = AssociationEntityType,
> {
  readonly organizationId: string;
  readonly currentUserId: unknown;
  readonly fromEntityType: AssociationEntityType;
  readonly fromEntityId: string;
  readonly associations: readonly AssociationInput<TEntity>[];
  readonly relationshipType?: "attached_to" | "related_to";
  readonly markFirstAsPrimary?: boolean;
}

export async function syncAttachedEntityAssociations<
  TEntity extends AssociationEntityType = AssociationEntityType,
>(
  ctx: ConvexPlatformCtx,
  args: SyncAttachedEntityAssociationsArgs<TEntity>,
): Promise<void> {
  const labels = await Promise.all(
    args.associations.map((association) =>
      getAssociationLabel(ctx, args.organizationId, association),
    ),
  );

  if (labels.some((label) => label === null)) {
    throw new Error("Association not found in organization");
  }

  const existingRelations = await ctx.db
    .query("entityRelations")
    .withIndex("by_from_entity", (query: any) =>
      query
        .eq("organizationId", args.organizationId)
        .eq("fromEntityType", args.fromEntityType)
        .eq("fromEntityId", args.fromEntityId),
    )
    .collect();

  const now = Date.now();

  await Promise.all(
    existingRelations
      .filter((relation: Record<string, unknown>) =>
        !relation.archivedAt &&
        relation.relationshipType === (args.relationshipType ?? "attached_to"),
      )
      .map((relation: Record<string, unknown>) =>
        ctx.db.patch(relation._id, {
          archivedAt: now,
          updatedAt: now,
          updatedBy: args.currentUserId,
        }),
      ),
  );

  await Promise.all(
    args.associations.map((association, index) =>
      ctx.db.insert("entityRelations", {
        organizationId: args.organizationId,
        fromEntityType: args.fromEntityType,
        fromEntityId: args.fromEntityId,
        toEntityType: association.entityType,
        toEntityId: association.entityId,
        relationshipType: args.relationshipType ?? "attached_to",
        isPrimary: args.markFirstAsPrimary ? index === 0 : undefined,
        sortOrder: index,
        createdAt: now,
        updatedAt: now,
        createdBy: args.currentUserId,
        updatedBy: args.currentUserId,
        schemaVersion: 1,
      }),
    ),
  );
}

export interface EntityRelationArchiveCandidate {
  readonly _id: unknown;
  readonly organizationId: string;
  readonly fromEntityType: AssociationEntityType;
  readonly fromEntityId: string;
  readonly toEntityType: AssociationEntityType;
  readonly toEntityId: string;
  readonly archivedAt?: number;
}

export interface EntityRelationArchiveTarget {
  readonly organizationId: string;
  readonly entityType: AssociationEntityType;
  readonly entityId: string;
}

export function selectActiveRelationsForEntity<TRelation extends EntityRelationArchiveCandidate>(
  relations: readonly TRelation[],
  target: EntityRelationArchiveTarget,
): TRelation[] {
  const selectedRelations = new Map<string, TRelation>();

  for (const relation of relations) {
    const touchesEntity =
      (relation.fromEntityType === target.entityType && relation.fromEntityId === target.entityId) ||
      (relation.toEntityType === target.entityType && relation.toEntityId === target.entityId);

    if (relation.organizationId === target.organizationId && !relation.archivedAt && touchesEntity) {
      selectedRelations.set(String(relation._id), relation);
    }
  }

  return Array.from(selectedRelations.values());
}

export async function archiveEntityRelationsForEntity(
  ctx: ConvexPlatformCtx,
  args: EntityRelationArchiveTarget & {
    readonly currentUserId: unknown;
  },
): Promise<number> {
  const [outgoingRelations, incomingRelations] = await Promise.all([
    ctx.db
      .query("entityRelations")
      .withIndex("by_from_entity", (query: any) =>
        query
          .eq("organizationId", args.organizationId)
          .eq("fromEntityType", args.entityType)
          .eq("fromEntityId", args.entityId),
      )
      .collect(),
    ctx.db
      .query("entityRelations")
      .withIndex("by_to_entity", (query: any) =>
        query
          .eq("organizationId", args.organizationId)
          .eq("toEntityType", args.entityType)
          .eq("toEntityId", args.entityId),
      )
      .collect(),
  ]);
  const now = Date.now();
  const relationsToArchive = selectActiveRelationsForEntity(
    [...outgoingRelations, ...incomingRelations],
    args,
  );

  await Promise.all(
    relationsToArchive.map((relation) =>
      ctx.db.patch(relation._id, {
        archivedAt: now,
        updatedAt: now,
        updatedBy: args.currentUserId,
      }),
    ),
  );

  return relationsToArchive.length;
}
