# @carefully-built/convex-multitenant

Reusable Convex multitenant guards and organization-scoped lookup helpers.

## Install

```bash
bun add @carefully-built/convex-multitenant
```

For local development in an app inside the same parent workspace, use the packed tarball or workspace link already used by the consuming app.

## Import Paths

- `@carefully-built/convex-multitenant`

## Helper Usage

```ts
import { findCurrentUserByWorkosId } from '@carefully-built/convex-multitenant';
```

Helpers in this package:

- `findCurrentUserByWorkosId`
- `requireUserInOrganization`

## Types And Schemas

- `ConvexDbReader`
- `ConvexMultitenantCtx`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `findCurrentUserByWorkosId` | Convex helper | `packages/convex-multitenant/src/index.ts` |
| `requireUserInOrganization` | Convex helper | `packages/convex-multitenant/src/index.ts` |
| `ConvexDbReader` | Type | `packages/convex-multitenant/src/index.ts` |
| `ConvexMultitenantCtx` | Type | `packages/convex-multitenant/src/index.ts` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
