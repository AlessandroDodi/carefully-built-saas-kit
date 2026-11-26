# @carefully-built/widgets

Reusable SaaS dashboard and detail widgets for Carefully Built apps.

## Install

```bash
bun add @carefully-built/widgets
```

For local development in an app inside the same parent workspace, use the packed tarball or workspace link already used by the consuming app.

## Import Paths

- `@carefully-built/widgets`

## Component Usage

```tsx
import { DashboardWidget } from '@carefully-built/widgets';

// Check the API catalog below for the component source and prop types.
// Most components are controlled shells: pass app data, handlers, and slot content from the consuming app.
```

Components in this package:

- `DashboardWidget`: import from `@carefully-built/widgets`.
- `EntityInfoWidget`: import from `@carefully-built/widgets`.
- `GrowBar`: import from `@carefully-built/widgets`.
- `LockedContent`: import from `@carefully-built/widgets`.
- `PeriodSelect`: import from `@carefully-built/widgets`.
- `Reveal`: import from `@carefully-built/widgets`.

## Helper Usage

```ts
import { DashboardWidget } from '@carefully-built/widgets';
```

Helpers in this package:

- `DashboardWidget`
- `EntityInfoWidget`
- `GrowBar`
- `isPeriodPreset`
- `isPeriodPreset`
- `LockedContent`
- `PERIOD_PRESETS`
- `PERIOD_PRESETS`
- `PeriodSelect`
- `resolvePeriodRange`
- `resolvePeriodRange`
- `Reveal`

## Types And Schemas

- `DashboardWidgetProps`
- `EntityInfoWidgetProps`
- `GrowBarProps`
- `LockedContentProps`
- `PeriodPreset`
- `PeriodRange`
- `RevealProps`
- `WidgetEmptyState`
- `WidgetEmptyState`
- `WidgetEmptyStateAction`
- `WidgetEmptyStateConfig`
- `WidgetEmptyStateProps`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `DashboardWidget` | Component | `packages/widgets/src/dashboard-widget.tsx` |
| `EntityInfoWidget` | Component | `packages/widgets/src/entity-info-widget.tsx` |
| `GrowBar` | Component | `packages/widgets/src/reveal.tsx` |
| `LockedContent` | Component | `packages/widgets/src/locked-content.tsx` |
| `PeriodSelect` | Component | `packages/widgets/src/period-select.tsx` |
| `Reveal` | Component | `packages/widgets/src/reveal.tsx` |
| `DashboardWidget` | Helper | `packages/widgets/src/index.ts` |
| `EntityInfoWidget` | Helper | `packages/widgets/src/index.ts` |
| `GrowBar` | Helper | `packages/widgets/src/index.ts` |
| `isPeriodPreset` | Helper | `packages/widgets/src/index.ts` |
| `isPeriodPreset` | Helper | `packages/widgets/src/period-select.tsx` |
| `LockedContent` | Helper | `packages/widgets/src/index.ts` |
| `PERIOD_PRESETS` | Helper | `packages/widgets/src/index.ts` |
| `PERIOD_PRESETS` | Helper | `packages/widgets/src/period-select.tsx` |
| `PeriodSelect` | Helper | `packages/widgets/src/index.ts` |
| `resolvePeriodRange` | Helper | `packages/widgets/src/index.ts` |
| `resolvePeriodRange` | Helper | `packages/widgets/src/period-select.tsx` |
| `Reveal` | Helper | `packages/widgets/src/index.ts` |
| `DashboardWidgetProps` | Type | `packages/widgets/src/dashboard-widget.tsx` |
| `EntityInfoWidgetProps` | Type | `packages/widgets/src/entity-info-widget.tsx` |
| `GrowBarProps` | Type | `packages/widgets/src/reveal.tsx` |
| `LockedContentProps` | Type | `packages/widgets/src/locked-content.tsx` |
| `PeriodPreset` | Type | `packages/widgets/src/period-select.tsx` |
| `PeriodRange` | Type | `packages/widgets/src/period-select.tsx` |
| `RevealProps` | Type | `packages/widgets/src/reveal.tsx` |
| `WidgetEmptyState` | Type | `packages/widgets/src/index.ts` |
| `WidgetEmptyState` | Type | `packages/widgets/src/widget-empty-state.tsx` |
| `WidgetEmptyStateAction` | Type | `packages/widgets/src/widget-empty-state.tsx` |
| `WidgetEmptyStateConfig` | Type | `packages/widgets/src/widget-empty-state.tsx` |
| `WidgetEmptyStateProps` | Type | `packages/widgets/src/widget-empty-state.tsx` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
