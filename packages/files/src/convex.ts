import {
  archiveAuditFields,
  createAuditFields,
  insertWithAudit,
  patchWithAudit,
} from '@carefully-built/convex-crud';

type MutationBuilder = (definition: {
  args: Record<string, unknown>;
  handler: (ctx: any, args: any) => Promise<unknown>;
}) => unknown;

type ValidatorBuilder = {
  id: (tableName: string) => unknown;
  optional: (validator: unknown) => unknown;
  string: () => unknown;
  number: () => unknown;
  array: (validator: unknown) => unknown;
};

export interface DocumentAssociationInput {
  readonly associationType?: unknown;
  readonly associationId?: string;
  readonly associationLabel?: string;
}

export function normalizeOptionalString(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function normalizeAssociationInput(input: DocumentAssociationInput): DocumentAssociationInput {
  const associationType = input.associationType;
  const associationId = normalizeOptionalString(input.associationId);
  const associationLabel = normalizeOptionalString(input.associationLabel);

  if (!associationType && !associationId && !associationLabel) {
    return {};
  }

  return { associationType, associationId, associationLabel };
}

export function buildPendingPublicUploadUrl(origin: string, token: string): string {
  const normalizedOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin;
  return `${normalizedOrigin}/documents/link/${token}`;
}

export function generatePublicUploadToken(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

export function shouldBackfillLegacyFile(document: unknown | null): boolean {
  return document === null;
}

export async function listDocumentFiles(ctx: any, document: any): Promise<any[]> {
  const files = await ctx.db
    .query('files')
    .withIndex('by_document', (query: any) => query.eq('documentId', document._id))
    .collect();

  const hasPrimaryFile = files.some((file: any) => file._id === document.primaryFileId);
  const primaryFile =
    document.primaryFileId && !hasPrimaryFile ? await ctx.db.get(document.primaryFileId) : null;
  const allFiles = primaryFile ? [primaryFile, ...files] : files;

  return allFiles.sort((left: any, right: any) => left.createdAt - right.createdAt);
}

export async function listPublicDocumentFiles(ctx: any, document: any): Promise<any[]> {
  const files = await listDocumentFiles(ctx, document);
  return await Promise.all(
    files.map(async (file: any) => ({
      _id: file._id,
      name: file.name,
      mimeType: file.mimeType,
      size: file.size,
      createdAt: file.createdAt,
      downloadUrl: await ctx.storage.getUrl(file.storageId),
    })),
  );
}

export async function buildDocumentListItems(
  ctx: any,
  document: any,
  args: {
    readonly listAssociations: (ctx: any, organizationId: string, documentId: string) => Promise<any[]>;
  },
): Promise<any[]> {
  const primaryFile = document.primaryFileId ? await ctx.db.get(document.primaryFileId) : null;
  const previewUrl = primaryFile ? await ctx.storage.getUrl(primaryFile.storageId) : null;
  const uploadedFiles = await listPublicDocumentFiles(ctx, document);
  const creator = await ctx.db.get(document.createdBy);
  const associations = await args.listAssociations(ctx, document.organizationId, String(document._id));
  const baseDocument = {
    ...document,
    cardId: String(document._id),
    fileName: primaryFile?.name ?? null,
    fileMimeType: primaryFile?.mimeType ?? null,
    fileSize: primaryFile?.size ?? null,
    fileCreatedAt: primaryFile?.createdAt ?? null,
    fileCount: uploadedFiles.length,
    collectionFileCount: uploadedFiles.length,
    uploadedFiles,
    publicUploadUrl: document.publicUploadUrl ?? document.externalUrl ?? null,
    previewUrl,
    createdByName:
      [creator?.firstName, creator?.lastName].filter(Boolean).join(' ').trim() ||
      creator?.email ||
      null,
    isPending: document.sourceType === 'external_link' && uploadedFiles.length === 0,
    isFulfilled: uploadedFiles.length > 0 || Boolean(document.fulfilledAt || document.primaryFileId),
    associations,
  };

  if (document.sourceType !== 'external_link' || uploadedFiles.length === 0) {
    return [baseDocument];
  }

  return uploadedFiles.map((file) => ({
    ...baseDocument,
    cardId: `${String(document._id)}:${String(file._id)}`,
    displayFileId: file._id,
    title: file.name,
    fileName: file.name,
    fileMimeType: file.mimeType,
    fileSize: file.size,
    fileCreatedAt: file.createdAt,
    fileCount: 1,
    collectionFileCount: uploadedFiles.length,
    uploadedFiles: [file],
    previewUrl: file.downloadUrl,
  }));
}

export async function buildPublicUploadRequestResult(
  ctx: any,
  document: any,
  args: {
    readonly getOrganizationLogoUrl: (ctx: any, organizationId: string) => Promise<string | null>;
  },
): Promise<Record<string, unknown>> {
  const creator = await ctx.db.get(document.createdBy);
  const organizationLogoUrl = await args.getOrganizationLogoUrl(ctx, document.organizationId);
  const uploadedFiles = await listPublicDocumentFiles(ctx, document);
  const requestedByName =
    [creator?.firstName, creator?.lastName].filter(Boolean).join(' ').trim() ||
    creator?.name ||
    creator?.email ||
    null;

  return {
    _id: document._id,
    title: document.title,
    description: document.description,
    associationLabel: document.associationLabel,
    publicUploadUrl: document.publicUploadUrl ?? document.externalUrl ?? null,
    uploadedFiles,
    isPending: document.sourceType === 'external_link' && uploadedFiles.length === 0,
    isFulfilled: uploadedFiles.length > 0 || Boolean(document.fulfilledAt || document.primaryFileId),
    fulfilledAt: document.fulfilledAt ?? null,
    organizationId: document.organizationId,
    organizationLogoUrl,
    requestedByName,
    requestedByImageUrl: creator?.imageUrl ?? null,
  };
}

export async function getPublicUploadFileDownload(
  ctx: any,
  args: {
    readonly token: string;
    readonly fileId: unknown;
    readonly getDocumentByPublicUploadToken: (ctx: any, token: string) => Promise<any | null>;
  },
): Promise<{ readonly name: string; readonly mimeType: string; readonly downloadUrl: string | null } | null> {
  const document = await args.getDocumentByPublicUploadToken(ctx, args.token);

  if (!document || document.status === 'archived') {
    return null;
  }

  const files = await listDocumentFiles(ctx, document);
  const file = files.find((candidate) => candidate._id === args.fileId);

  if (!file) {
    return null;
  }

  return {
    name: file.name,
    mimeType: file.mimeType,
    downloadUrl: await ctx.storage.getUrl(file.storageId),
  };
}

type DocumentMutationFactoryArgs = {
  readonly mutation: MutationBuilder;
  readonly v: ValidatorBuilder;
  readonly createDocumentValidator: unknown;
  readonly updateDocumentValidator: unknown;
  readonly documentAssociationTypeValidator: unknown;
  readonly documentAssociationIdValidator: unknown;
  readonly documentAssociationLabelValidator: unknown;
  readonly documentAssociationReferenceValidator: unknown;
  readonly documentTypeValidator: unknown;
  readonly requireAccess: (
    ctx: any,
    args: { readonly currentUserId: unknown; readonly organizationId: string },
  ) => Promise<void>;
  readonly getScopedDocument: (ctx: any, id: unknown, organizationId: string) => Promise<any>;
  readonly getDocumentByPublicUploadToken: (ctx: any, token: string) => Promise<any | null>;
  readonly syncAssociations?: (
    ctx: any,
    args: {
      readonly documentId: unknown;
      readonly currentUserId: unknown;
      readonly organizationId: string;
      readonly associations: readonly unknown[];
    },
  ) => Promise<void>;
  readonly archiveAssociations?: (
    ctx: any,
    args: {
      readonly documentId: unknown;
      readonly currentUserId: unknown;
      readonly organizationId: string;
    },
  ) => Promise<void>;
  readonly createPublicUploadNotification?: (
    ctx: any,
    args: {
      readonly document: any;
      readonly fileId: unknown;
      readonly fileName: string;
      readonly mimeType: string;
      readonly size: number;
      readonly uploadedBy: unknown;
    },
  ) => Promise<void>;
};

function buildDocumentCreateRecord(args: {
  readonly data: any;
  readonly organizationId: string;
  readonly currentUserId: unknown;
  readonly now?: number;
}) {
  const association = normalizeAssociationInput(args.data);

  return {
    title: normalizeOptionalString(args.data.title) ?? 'Documento senza nome',
    type: args.data.type ?? 'other',
    description: normalizeOptionalString(args.data.description),
    sourceType: args.data.sourceType,
    externalUrl: normalizeOptionalString(args.data.externalUrl),
    primaryFileId: args.data.primaryFileId,
    associationType: association.associationType,
    associationId: association.associationId,
    associationLabel: association.associationLabel,
    publicUploadToken: normalizeOptionalString(args.data.publicUploadToken),
    publicUploadUrl: normalizeOptionalString(args.data.publicUploadUrl),
    requestedAt: args.data.requestedAt,
    fulfilledAt: args.data.fulfilledAt,
    visibility: args.data.visibility ?? 'internal',
    status: args.data.status ?? 'active',
    tagIds: args.data.tagIds,
    metadata: args.data.metadata,
    organizationId: args.organizationId,
    ...createAuditFields(args.currentUserId, args.now),
    schemaVersion: 2,
  };
}

export function createDocumentMutationSet(factory: DocumentMutationFactoryArgs) {
  const { mutation, v } = factory;

  return {
    create: mutation({
      args: {
        currentUserId: v.id('users'),
        organizationId: v.string(),
        data: factory.createDocumentValidator,
      },
      handler: async (ctx, args) => {
        await factory.requireAccess(ctx, args);
        const documentId = await ctx.db.insert(
          'documents',
          buildDocumentCreateRecord({
            data: args.data,
            organizationId: args.organizationId,
            currentUserId: args.currentUserId,
          }),
        );

        if (args.data.associations && factory.syncAssociations) {
          await factory.syncAssociations(ctx, {
            documentId,
            currentUserId: args.currentUserId,
            organizationId: args.organizationId,
            associations: args.data.associations,
          });
        }

        return documentId;
      },
    }),
    createPublicUploadRequest: mutation({
      args: {
        currentUserId: v.id('users'),
        organizationId: v.string(),
        title: v.string(),
        associationType: factory.documentAssociationTypeValidator,
        associationId: factory.documentAssociationIdValidator,
        associationLabel: factory.documentAssociationLabelValidator,
        publicOrigin: v.string(),
        token: v.optional(v.string()),
        description: v.optional(v.string()),
        associations: v.optional(v.array(factory.documentAssociationReferenceValidator)),
        tagIds: v.optional(v.array(v.id('tags'))),
      },
      handler: async (ctx, args) => {
        await factory.requireAccess(ctx, args);
        const token = normalizeOptionalString(args.token) ?? generatePublicUploadToken();
        const requestedAt = Date.now();
        const publicUploadUrl = buildPendingPublicUploadUrl(args.publicOrigin, token);
        const association = normalizeAssociationInput(args);
        const documentId = await ctx.db.insert('documents', {
          title: normalizeOptionalString(args.title) ?? 'Documento senza nome',
          type: 'other',
          description: normalizeOptionalString(args.description),
          sourceType: 'external_link',
          externalUrl: publicUploadUrl,
          primaryFileId: undefined,
          associationType: association.associationType,
          associationId: association.associationId,
          associationLabel: association.associationLabel,
          publicUploadToken: token,
          publicUploadUrl,
          requestedAt,
          fulfilledAt: undefined,
          visibility: 'public',
          status: 'draft',
          tagIds: args.tagIds,
          metadata: { requestKind: 'public_upload' },
          organizationId: args.organizationId,
          ...createAuditFields(args.currentUserId, requestedAt),
          schemaVersion: 2,
        });

        if (args.associations && factory.syncAssociations) {
          await factory.syncAssociations(ctx, {
            documentId,
            currentUserId: args.currentUserId,
            organizationId: args.organizationId,
            associations: args.associations,
          });
        }

        return documentId;
      },
    }),
    fulfillPublicUploadRequest: mutation({
      args: {
        token: v.string(),
        storageId: v.id('_storage'),
        name: v.string(),
        mimeType: v.string(),
        size: v.number(),
      },
      handler: async (ctx, args) => {
        const document = await factory.getDocumentByPublicUploadToken(ctx, args.token);
        if (!document || document.status === 'archived') {
          throw new Error('Document request not found');
        }

        const now = Date.now();
        const uploadedBy = document.createdBy;
        const fileId = await ctx.db.insert('files', {
          storageId: args.storageId,
          name: args.name,
          mimeType: args.mimeType,
          size: args.size,
          organizationId: document.organizationId,
          uploadedBy,
          documentId: document._id,
          ...createAuditFields(uploadedBy, now),
          schemaVersion: 1,
        });

        await patchWithAudit(
          ctx,
          document._id,
          {
            primaryFileId: document.primaryFileId ?? fileId,
            fulfilledAt: document.fulfilledAt ?? now,
            status: 'active',
          },
          uploadedBy,
          now,
        );

        await factory.createPublicUploadNotification?.(ctx, {
          document,
          fileId,
          fileName: args.name,
          mimeType: args.mimeType,
          size: args.size,
          uploadedBy,
        });

        return { documentId: document._id, fileId };
      },
    }),
    update: mutation({
      args: {
        id: v.id('documents'),
        currentUserId: v.id('users'),
        organizationId: v.string(),
        data: factory.updateDocumentValidator,
      },
      handler: async (ctx, args) => {
        await factory.requireAccess(ctx, args);
        const document = await factory.getScopedDocument(ctx, args.id, args.organizationId);
        const association = normalizeAssociationInput(args.data);
        const { associations: documentAssociations, ...patchData } = args.data;

        await patchWithAudit(
          ctx,
          document._id,
          {
            ...patchData,
            title:
              args.data.title === undefined
                ? undefined
                : (normalizeOptionalString(args.data.title) ?? document.title),
            description:
              args.data.description === undefined
                ? undefined
                : normalizeOptionalString(args.data.description),
            externalUrl:
              args.data.externalUrl === undefined
                ? undefined
                : normalizeOptionalString(args.data.externalUrl),
            associationType:
              args.data.associationType === undefined ? undefined : association.associationType,
            associationId:
              args.data.associationId === undefined ? undefined : association.associationId,
            associationLabel:
              args.data.associationLabel === undefined ? undefined : association.associationLabel,
            publicUploadToken:
              args.data.publicUploadToken === undefined
                ? undefined
                : normalizeOptionalString(args.data.publicUploadToken),
            publicUploadUrl:
              args.data.publicUploadUrl === undefined
                ? undefined
                : normalizeOptionalString(args.data.publicUploadUrl),
            tagIds: args.data.tagIds,
          },
          args.currentUserId,
        );

        if (documentAssociations && factory.syncAssociations) {
          await factory.syncAssociations(ctx, {
            documentId: document._id,
            currentUserId: args.currentUserId,
            organizationId: args.organizationId,
            associations: documentAssociations,
          });
        }

        return await ctx.db.get(document._id);
      },
    }),
    archive: mutation({
      args: {
        id: v.id('documents'),
        currentUserId: v.id('users'),
        organizationId: v.string(),
      },
      handler: async (ctx, args) => {
        await factory.requireAccess(ctx, args);
        const document = await factory.getScopedDocument(ctx, args.id, args.organizationId);
        await ctx.db.patch(document._id, {
          status: 'archived',
          ...archiveAuditFields(args.currentUserId),
        });
        await factory.archiveAssociations?.(ctx, {
          documentId: document._id,
          currentUserId: args.currentUserId,
          organizationId: args.organizationId,
        });
      },
    }),
    remove: mutation({
      args: {
        id: v.id('documents'),
        organizationId: v.string(),
      },
      handler: async (ctx, args) => {
        const document = await factory.getScopedDocument(ctx, args.id, args.organizationId);
        await ctx.db.patch(document._id, {
          status: 'archived',
          ...archiveAuditFields(document.updatedBy),
        });
        await factory.archiveAssociations?.(ctx, {
          documentId: document._id,
          currentUserId: document.updatedBy,
          organizationId: args.organizationId,
        });
      },
    }),
    backfillLegacyFiles: mutation({
      args: {
        currentUserId: v.id('users'),
        organizationId: v.string(),
      },
      handler: async (ctx, args) => {
        await factory.requireAccess(ctx, args);
        const legacyFiles = await ctx.db
          .query('files')
          .withIndex('by_organization', (query: any) => query.eq('organizationId', args.organizationId))
          .collect();
        let insertedCount = 0;

        for (const legacyFile of legacyFiles) {
          const existing = await ctx.db
            .query('documents')
            .withIndex('by_primary_file', (query: any) =>
              query.eq('organizationId', args.organizationId).eq('primaryFileId', legacyFile._id),
            )
            .unique();

          if (!shouldBackfillLegacyFile(existing)) {
            continue;
          }

          await ctx.db.insert('documents', {
            title: legacyFile.name,
            type: 'other',
            description: undefined,
            sourceType: 'upload',
            externalUrl: undefined,
            primaryFileId: legacyFile._id,
            associationType: undefined,
            associationId: undefined,
            associationLabel: undefined,
            publicUploadToken: undefined,
            publicUploadUrl: undefined,
            requestedAt: undefined,
            fulfilledAt: legacyFile.createdAt,
            visibility: 'internal',
            status: 'active',
            metadata: { backfilledFromLegacyFiles: true },
            organizationId: args.organizationId,
            createdAt: legacyFile.createdAt,
            updatedAt: legacyFile.updatedAt ?? legacyFile.createdAt,
            createdBy: legacyFile.createdBy ?? legacyFile.uploadedBy,
            updatedBy: legacyFile.updatedBy ?? legacyFile.uploadedBy,
            schemaVersion: 2,
          });

          insertedCount += 1;
        }

        return { insertedCount };
      },
    }),
    createManualUploadDocument: mutation({
      args: {
        currentUserId: v.id('users'),
        organizationId: v.string(),
        title: v.string(),
        storageId: v.id('_storage'),
        fileName: v.string(),
        mimeType: v.string(),
        size: v.number(),
        associationType: factory.documentAssociationTypeValidator,
        associationId: factory.documentAssociationIdValidator,
        associationLabel: factory.documentAssociationLabelValidator,
        associations: v.optional(v.array(factory.documentAssociationReferenceValidator)),
        tagIds: v.optional(v.array(v.id('tags'))),
        description: v.optional(v.string()),
        type: v.optional(factory.documentTypeValidator),
      },
      handler: async (ctx, args) => {
        await factory.requireAccess(ctx, args);
        const now = Date.now();
        const fileId = await ctx.db.insert('files', {
          storageId: args.storageId,
          name: args.fileName,
          mimeType: args.mimeType,
          size: args.size,
          organizationId: args.organizationId,
          uploadedBy: args.currentUserId,
          documentId: undefined,
          ...createAuditFields(args.currentUserId, now),
          schemaVersion: 1,
        });
        const documentId = await ctx.db.insert(
          'documents',
          buildDocumentCreateRecord({
            data: {
              ...args,
              type: args.type ?? 'other',
              sourceType: 'upload',
              primaryFileId: fileId,
              fulfilledAt: now,
              visibility: 'internal',
              status: 'active',
              metadata: undefined,
            },
            organizationId: args.organizationId,
            currentUserId: args.currentUserId,
            now,
          }),
        );

        if (args.associations && factory.syncAssociations) {
          await factory.syncAssociations(ctx, {
            documentId,
            currentUserId: args.currentUserId,
            organizationId: args.organizationId,
            associations: args.associations,
          });
        }

        return { documentId, fileId };
      },
    }),
  };
}

export function createFileMutationSet(factory: { readonly mutation: MutationBuilder; readonly v: ValidatorBuilder }) {
  const { mutation, v } = factory;

  return {
    generateUploadUrl: mutation({
      args: {},
      handler: async (ctx) => await ctx.storage.generateUploadUrl(),
    }),
    saveFile: mutation({
      args: {
        storageId: v.id('_storage'),
        name: v.string(),
        mimeType: v.string(),
        size: v.number(),
        organizationId: v.string(),
        uploadedBy: v.id('users'),
      },
      handler: async (ctx, args) => {
        return await insertWithAudit(
          ctx,
          'files',
          {
            storageId: args.storageId,
            name: args.name,
            mimeType: args.mimeType,
            size: args.size,
            organizationId: args.organizationId,
            uploadedBy: args.uploadedBy,
            schemaVersion: 1,
          },
          args.uploadedBy,
        );
      },
    }),
    rename: mutation({
      args: {
        id: v.id('files'),
        name: v.string(),
      },
      handler: async (ctx, args) => {
        const file = await ctx.db.get(args.id);
        await patchWithAudit(ctx, args.id, { name: args.name }, file?.uploadedBy);
        return await ctx.db.get(args.id);
      },
    }),
    remove: mutation({
      args: { id: v.id('files') },
      handler: async (ctx, args) => {
        const file = await ctx.db.get(args.id);
        if (!file) {
          throw new Error('File not found');
        }

        await ctx.storage.delete(file.storageId);
        await ctx.db.delete(args.id);
      },
    }),
  };
}
