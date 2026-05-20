# Charts

Planned package: `@carefully-built/charts`.

Reusable chart cards with icon/title headers, automatic legend chips, loading states, empty states, and optional selectors.

## Components To Build

- `ChartCard`: icon, title, subtitle, selector slot, chart body, footer.
- `LegendChips`: generated from data.
- `DonutChartCard`: donut chart plus legend chips.
- `BarChartCard`: bar chart plus legend chips.
- `LineChartCard`: line chart with optional series legend.

## Target Props

```tsx
<DonutChartCard
  icon={ChartPie}
  title="Tipologia opportunita"
  data={[
    { key: 'sale', label: 'Vendita', value: 42, color: 'var(--chart-1)' },
    { key: 'rent', label: 'Affitto', value: 18, color: 'var(--chart-2)' },
  ]}
  selector={<PipelineSelect value={pipelineId} onChange={setPipelineId} />}
  isLoading={isLoading}
/>
```

## Rules

- Legend chips should be automatic from chart data.
- Optional top selector must be a first-class slot.
- Loading should preserve icon/title and skeleton only the chart/data area.
- Chart data shape should stay generic enough for other SaaS apps.
