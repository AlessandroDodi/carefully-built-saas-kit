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
- `CoverageGrid`: import from `@carefully-built/charts`.
- `DeltaBadge`: import from `@carefully-built/charts`.
- `DonutChartWidget`: import from `@carefully-built/charts`.
- `SparkBars`: import from `@carefully-built/charts`.
- `TrendAreaChart`: import from `@carefully-built/charts`.

## Helper Usage

```ts
import { BarDistributionWidget } from '@carefully-built/charts';
```

Helpers in this package:

- `BarDistributionWidget`
- `ChartLegend`
- `CoverageGrid`
- `DeltaBadge`
- `DonutChartWidget`
- `SparkBars`
- `TrendAreaChart`

## Types And Schemas

- `BarDistributionWidgetProps`
- `ChartLegendEntry`
- `ChartLegendProps`
- `CoverageGridProps`
- `CoverageGridSlot`
- `CoverageLevel`
- `DeltaBadgeProps`
- `DonutChartWidgetProps`
- `SparkBarsProps`
- `TrendAreaChartProps`
- `TrendPoint`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `BarDistributionWidget` | Component | `packages/charts/src/bar-distribution-widget.tsx` |
| `ChartLegend` | Component | `packages/charts/src/chart-legend.tsx` |
| `CoverageGrid` | Component | `packages/charts/src/coverage-grid.tsx` |
| `DeltaBadge` | Component | `packages/charts/src/delta-badge.tsx` |
| `DonutChartWidget` | Component | `packages/charts/src/donut-chart-widget.tsx` |
| `SparkBars` | Component | `packages/charts/src/spark-bars.tsx` |
| `TrendAreaChart` | Component | `packages/charts/src/trend-area-chart.tsx` |
| `BarDistributionWidget` | Helper | `packages/charts/src/index.ts` |
| `ChartLegend` | Helper | `packages/charts/src/index.ts` |
| `CoverageGrid` | Helper | `packages/charts/src/index.ts` |
| `DeltaBadge` | Helper | `packages/charts/src/index.ts` |
| `DonutChartWidget` | Helper | `packages/charts/src/index.ts` |
| `SparkBars` | Helper | `packages/charts/src/index.ts` |
| `TrendAreaChart` | Helper | `packages/charts/src/index.ts` |
| `BarDistributionWidgetProps` | Type | `packages/charts/src/bar-distribution-widget.tsx` |
| `ChartLegendEntry` | Type | `packages/charts/src/chart-legend.tsx` |
| `ChartLegendProps` | Type | `packages/charts/src/chart-legend.tsx` |
| `CoverageGridProps` | Type | `packages/charts/src/coverage-grid.tsx` |
| `CoverageGridSlot` | Type | `packages/charts/src/coverage-grid.tsx` |
| `CoverageLevel` | Type | `packages/charts/src/coverage-grid.tsx` |
| `DeltaBadgeProps` | Type | `packages/charts/src/delta-badge.tsx` |
| `DonutChartWidgetProps` | Type | `packages/charts/src/donut-chart-widget.tsx` |
| `SparkBarsProps` | Type | `packages/charts/src/spark-bars.tsx` |
| `TrendAreaChartProps` | Type | `packages/charts/src/trend-area-chart.tsx` |
| `TrendPoint` | Type | `packages/charts/src/trend-area-chart.tsx` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
