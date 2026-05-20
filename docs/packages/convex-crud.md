# @carefully-built/convex-crud

Reusable Convex CRUD audit, archive, and organization-record helpers.

## Install

```bash
bun add @carefully-built/convex-crud
```

For local development in an app inside the same parent workspace, use the packed tarball or workspace link already used by the consuming app.

## Import Paths

- `@carefully-built/convex-crud`

## Helper Usage

```ts
import { archiveAuditFields } from '@carefully-built/convex-crud';
```

Helpers in this package:

- `archiveAuditFields`
- `archiveWithAudit`
- `createAssociatedEntityMutationSet`
- `createAuditFields`
- `createCustomFieldMutationSet`
- `createTagMutationSet`
- `createTimestampFields`
- `getActiveOrgRecord`
- `insertWithAudit`
- `normalizeTagName`
- `patchWithAudit`
- `trimTagName`
- `updateAuditFields`
- `updateTimestampFields`
- `upsertOrganizationRecord`

## Types And Schemas

- `ArchiveAuditFields`
- `AssociatedEntityMutationFactoryArgs`
- `AuditFields`
- `ConvexCrudCtx`
- `CreateTimestampFields`
- `OrganizationRecord`
- `TagMutationFactoryArgs`
- `UpdateAuditFields`
- `UpdateTimestampFields`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `archiveAuditFields` | Convex helper | `packages/convex-crud/src/index.ts` |
| `archiveWithAudit` | Convex helper | `packages/convex-crud/src/index.ts` |
| `createAssociatedEntityMutationSet` | Convex helper | `packages/convex-crud/src/index.ts` |
| `createAuditFields` | Convex helper | `packages/convex-crud/src/index.ts` |
| `createCustomFieldMutationSet` | Convex helper | `packages/convex-crud/src/index.ts` |
| `createTagMutationSet` | Convex helper | `packages/convex-crud/src/index.ts` |
| `createTimestampFields` | Convex helper | `packages/convex-crud/src/index.ts` |
| `getActiveOrgRecord` | Convex helper | `packages/convex-crud/src/index.ts` |
| `insertWithAudit` | Convex helper | `packages/convex-crud/src/index.ts` |
| `normalizeTagName` | Convex helper | `packages/convex-crud/src/index.ts` |
| `patchWithAudit` | Convex helper | `packages/convex-crud/src/index.ts` |
| `trimTagName` | Convex helper | `packages/convex-crud/src/index.ts` |
| `updateAuditFields` | Convex helper | `packages/convex-crud/src/index.ts` |
| `updateTimestampFields` | Convex helper | `packages/convex-crud/src/index.ts` |
| `upsertOrganizationRecord` | Convex helper | `packages/convex-crud/src/index.ts` |
| `ArchiveAuditFields` | Type | `packages/convex-crud/src/index.ts` |
| `AssociatedEntityMutationFactoryArgs` | Type | `packages/convex-crud/src/index.ts` |
| `AuditFields` | Type | `packages/convex-crud/src/index.ts` |
| `ConvexCrudCtx` | Type | `packages/convex-crud/src/index.ts` |
| `CreateTimestampFields` | Type | `packages/convex-crud/src/index.ts` |
| `OrganizationRecord` | Type | `packages/convex-crud/src/index.ts` |
| `TagMutationFactoryArgs` | Type | `packages/convex-crud/src/index.ts` |
| `UpdateAuditFields` | Type | `packages/convex-crud/src/index.ts` |
| `UpdateTimestampFields` | Type | `packages/convex-crud/src/index.ts` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
