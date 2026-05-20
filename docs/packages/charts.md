# @carefully-built/charts

Reusable chart widgets, cards, and legends for Carefully Built SaaS apps.

## Install

```bash
bun add @carefully-built/charts
```

For local development in an app inside the same parent workspace, use the packed tarball or workspace link already used by the consuming app.

## Import Paths

- `@carefully-built/charts`

## Component Usage

```tsx
import { BarDistributionWidget } from '@carefully-built/charts';

// Check the API catalog below for the component source and prop types.
// Most components are controlled shells: pass app data, handlers, and slot content from the consuming app.
```

Components in this package:

- `BarDistributionWidget`: import from `@carefully-built/charts`.
- `ChartLegend`: import from `@carefully-built/charts`.
- `DonutChartWidget`: import from `@carefully-built/charts`.

## Helper Usage

```ts
import { BarDistributionWidget } from '@carefully-built/charts';
```

Helpers in this package:

- `BarDistributionWidget`
- `ChartLegend`
- `DonutChartWidget`

## Types And Schemas

- `BarDistributionWidgetProps`
- `ChartLegendEntry`
- `ChartLegendProps`
- `DonutChartWidgetProps`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `BarDistributionWidget` | Component | `packages/charts/src/bar-distribution-widget.tsx` |
| `ChartLegend` | Component | `packages/charts/src/chart-legend.tsx` |
| `DonutChartWidget` | Component | `packages/charts/src/donut-chart-widget.tsx` |
| `BarDistributionWidget` | Helper | `packages/charts/src/index.ts` |
| `ChartLegend` | Helper | `packages/charts/src/index.ts` |
| `DonutChartWidget` | Helper | `packages/charts/src/index.ts` |
| `BarDistributionWidgetProps` | Type | `packages/charts/src/bar-distribution-widget.tsx` |
| `ChartLegendEntry` | Type | `packages/charts/src/chart-legend.tsx` |
| `ChartLegendProps` | Type | `packages/charts/src/chart-legend.tsx` |
| `DonutChartWidgetProps` | Type | `packages/charts/src/donut-chart-widget.tsx` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
