# @carefully-built/kanban

Reusable Kanban board and card primitives for SaaS pipelines.

## Install

```bash
bun add @carefully-built/kanban
```

For local development in an app inside the same parent workspace, use the packed tarball or workspace link already used by the consuming app.

## Import Paths

- `@carefully-built/kanban`

## Component Usage

```tsx
import { KanbanBoard } from '@carefully-built/kanban';

// Check the API catalog below for the component source and prop types.
// Most components are controlled shells: pass app data, handlers, and slot content from the consuming app.
```

Components in this package:

- `KanbanBoard`: import from `@carefully-built/kanban`.
- `KanbanCard`: import from `@carefully-built/kanban`.
- `KanbanStageBadge`: import from `@carefully-built/kanban`.

## Helper Usage

```ts
import { buildKanbanColumns } from '@carefully-built/kanban';
```

Helpers in this package:

- `buildKanbanColumns`
- `buildKanbanColumns`
- `formatKanbanCurrencyDisplay`
- `formatKanbanCurrencyDisplay`
- `formatKanbanStatusLabel`
- `formatKanbanStatusLabel`
- `getKanbanStatusColor`
- `getKanbanStatusColor`
- `KANBAN_STATUS_OPTIONS`
- `KANBAN_STATUS_OPTIONS`
- `KanbanBoard`
- `KanbanCard`
- `KanbanStageBadge`
- `resolveKanbanSelection`
- `resolveKanbanSelection`

## Types And Schemas

- `getKanbanItemNotes`
- `getKanbanItemNotes`
- `KanbanColumn`
- `KanbanItem`
- `KanbanPipelineConfig`
- `KanbanStage`
- `KanbanStatus`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `KanbanBoard` | Component | `packages/kanban/src/kanban-board.tsx` |
| `KanbanCard` | Component | `packages/kanban/src/kanban-card.tsx` |
| `KanbanStageBadge` | Component | `packages/kanban/src/kanban-stage-badge.tsx` |
| `buildKanbanColumns` | Helper | `packages/kanban/src/index.ts` |
| `buildKanbanColumns` | Helper | `packages/kanban/src/kanban-helpers.ts` |
| `formatKanbanCurrencyDisplay` | Helper | `packages/kanban/src/index.ts` |
| `formatKanbanCurrencyDisplay` | Helper | `packages/kanban/src/kanban-helpers.ts` |
| `formatKanbanStatusLabel` | Helper | `packages/kanban/src/index.ts` |
| `formatKanbanStatusLabel` | Helper | `packages/kanban/src/kanban-helpers.ts` |
| `getKanbanStatusColor` | Helper | `packages/kanban/src/index.ts` |
| `getKanbanStatusColor` | Helper | `packages/kanban/src/kanban-helpers.ts` |
| `KANBAN_STATUS_OPTIONS` | Helper | `packages/kanban/src/index.ts` |
| `KANBAN_STATUS_OPTIONS` | Helper | `packages/kanban/src/kanban-helpers.ts` |
| `KanbanBoard` | Helper | `packages/kanban/src/index.ts` |
| `KanbanCard` | Helper | `packages/kanban/src/index.ts` |
| `KanbanStageBadge` | Helper | `packages/kanban/src/index.ts` |
| `resolveKanbanSelection` | Helper | `packages/kanban/src/index.ts` |
| `resolveKanbanSelection` | Helper | `packages/kanban/src/kanban-helpers.ts` |
| `getKanbanItemNotes` | Type | `packages/kanban/src/index.ts` |
| `getKanbanItemNotes` | Type | `packages/kanban/src/kanban-helpers.ts` |
| `KanbanColumn` | Type | `packages/kanban/src/types.ts` |
| `KanbanItem` | Type | `packages/kanban/src/types.ts` |
| `KanbanPipelineConfig` | Type | `packages/kanban/src/types.ts` |
| `KanbanStage` | Type | `packages/kanban/src/types.ts` |
| `KanbanStatus` | Type | `packages/kanban/src/types.ts` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
