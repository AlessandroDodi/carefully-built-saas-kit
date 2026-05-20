# @carefully-built/convex-platform

Reusable Convex SaaS platform helpers for org-scoped CRUD, entity associations, and multitenant apps.

## Install

```bash
bun add @carefully-built/convex-platform
```

For local development in an app inside the same parent workspace, use the packed tarball or workspace link already used by the consuming app.

## Import Paths

- `@carefully-built/convex-platform`

## Helper Usage

```ts
import { archiveEntityRelationsForEntity } from '@carefully-built/convex-platform';
```

Helpers in this package:

- `archiveEntityRelationsForEntity`
- `archiveEntityRelationsForEntity`
- `associationEntityTypes`
- `associationEntityTypes`
- `buildAssociationValue`
- `buildAssociationValue`
- `getAssociationLabel`
- `getAssociationLabel`
- `getAssociationTypeLabel`
- `getAssociationTypeLabel`
- `getStringField`
- `getStringField`
- `listAssociationLabelsByValue`
- `listAssociationLabelsByValue`
- `listAssociationOptions`
- `listAssociationOptions`
- `listEntityAssociations`
- `listEntityAssociations`
- `selectActiveRelationsForEntity`
- `selectActiveRelationsForEntity`
- `syncAttachedEntityAssociations`
- `syncAttachedEntityAssociations`

## Types And Schemas

- `AssociationEntityType`
- `AssociationInput`
- `AssociationRecord`
- `ConvexPlatformCtx`
- `EntityAssociationRelation`
- `EntityRelationArchiveCandidate`
- `EntityRelationArchiveTarget`
- `ListEntityAssociationsOptions`
- `SyncAttachedEntityAssociationsArgs`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `archiveEntityRelationsForEntity` | Convex helper | `packages/convex-platform/src/entity-associations.ts` |
| `archiveEntityRelationsForEntity` | Convex helper | `packages/convex-platform/src/index.ts` |
| `associationEntityTypes` | Convex helper | `packages/convex-platform/src/entity-associations.ts` |
| `associationEntityTypes` | Convex helper | `packages/convex-platform/src/index.ts` |
| `buildAssociationValue` | Convex helper | `packages/convex-platform/src/entity-associations.ts` |
| `buildAssociationValue` | Convex helper | `packages/convex-platform/src/index.ts` |
| `getAssociationLabel` | Convex helper | `packages/convex-platform/src/entity-associations.ts` |
| `getAssociationLabel` | Convex helper | `packages/convex-platform/src/index.ts` |
| `getAssociationTypeLabel` | Convex helper | `packages/convex-platform/src/entity-associations.ts` |
| `getAssociationTypeLabel` | Convex helper | `packages/convex-platform/src/index.ts` |
| `getStringField` | Convex helper | `packages/convex-platform/src/entity-associations.ts` |
| `getStringField` | Convex helper | `packages/convex-platform/src/index.ts` |
| `listAssociationLabelsByValue` | Convex helper | `packages/convex-platform/src/entity-associations.ts` |
| `listAssociationLabelsByValue` | Convex helper | `packages/convex-platform/src/index.ts` |
| `listAssociationOptions` | Convex helper | `packages/convex-platform/src/entity-associations.ts` |
| `listAssociationOptions` | Convex helper | `packages/convex-platform/src/index.ts` |
| `listEntityAssociations` | Convex helper | `packages/convex-platform/src/entity-associations.ts` |
| `listEntityAssociations` | Convex helper | `packages/convex-platform/src/index.ts` |
| `selectActiveRelationsForEntity` | Convex helper | `packages/convex-platform/src/entity-associations.ts` |
| `selectActiveRelationsForEntity` | Convex helper | `packages/convex-platform/src/index.ts` |
| `syncAttachedEntityAssociations` | Convex helper | `packages/convex-platform/src/entity-associations.ts` |
| `syncAttachedEntityAssociations` | Convex helper | `packages/convex-platform/src/index.ts` |
| `AssociationEntityType` | Type | `packages/convex-platform/src/entity-associations.ts` |
| `AssociationInput` | Type | `packages/convex-platform/src/entity-associations.ts` |
| `AssociationRecord` | Type | `packages/convex-platform/src/entity-associations.ts` |
| `ConvexPlatformCtx` | Type | `packages/convex-platform/src/entity-associations.ts` |
| `EntityAssociationRelation` | Type | `packages/convex-platform/src/entity-associations.ts` |
| `EntityRelationArchiveCandidate` | Type | `packages/convex-platform/src/entity-associations.ts` |
| `EntityRelationArchiveTarget` | Type | `packages/convex-platform/src/entity-associations.ts` |
| `ListEntityAssociationsOptions` | Type | `packages/convex-platform/src/entity-associations.ts` |
| `SyncAttachedEntityAssociationsArgs` | Type | `packages/convex-platform/src/entity-associations.ts` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
