# @carefully-built/convex-workos

Reusable Convex helpers for syncing WorkOS users across base and organization-scoped records.

## Install

```bash
bun add @carefully-built/convex-workos
```

For local development in an app inside the same parent workspace, use the packed tarball or workspace link already used by the consuming app.

## Import Paths

- `@carefully-built/convex-workos`

## Helper Usage

```ts
import { deleteWorkosUserRecords } from '@carefully-built/convex-workos';
```

Helpers in this package:

- `deleteWorkosUserRecords`
- `patchWorkosUserRecords`
- `upsertWorkosUserRecord`

## Types And Schemas

- `ConvexWorkosCtx`
- `WorkosProfile`
- `WorkosUserRecord`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `deleteWorkosUserRecords` | Convex helper | `packages/convex-workos/src/index.ts` |
| `patchWorkosUserRecords` | Convex helper | `packages/convex-workos/src/index.ts` |
| `upsertWorkosUserRecord` | Convex helper | `packages/convex-workos/src/index.ts` |
| `ConvexWorkosCtx` | Type | `packages/convex-workos/src/index.ts` |
| `WorkosProfile` | Type | `packages/convex-workos/src/index.ts` |
| `WorkosUserRecord` | Type | `packages/convex-workos/src/index.ts` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
