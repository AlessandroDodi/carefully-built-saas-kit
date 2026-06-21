# @carefully-built/cli

Add Carefully Built SaaS components to apps as editable source, with package imports when you want managed upgrades.

## Install

```bash
bun add @carefully-built/cli
```

For local development in an app inside the same parent workspace, use the packed tarball or workspace link already used by the consuming app.

## Import Paths

- `@carefully-built/cli`

## Helper Usage

```ts
import { addComponent } from '@carefully-built/cli';
```

Helpers in this package:

- `addComponent`
- `cn`
- `getRegistryComponent`
- `listRegistryComponents`
- `runCli`

## Types And Schemas

- `AddComponentOptions`
- `AddComponentResult`
- `RegistryComponent`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `addComponent` | Helper | `packages/cli/src/add.ts` |
| `cn` | Helper | `packages/cli/src/add.test.ts` |
| `getRegistryComponent` | Helper | `packages/cli/src/registry.ts` |
| `listRegistryComponents` | Helper | `packages/cli/src/registry.ts` |
| `runCli` | Helper | `packages/cli/src/index.ts` |
| `AddComponentOptions` | Type | `packages/cli/src/add.ts` |
| `AddComponentResult` | Type | `packages/cli/src/add.ts` |
| `RegistryComponent` | Type | `packages/cli/src/registry.ts` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
