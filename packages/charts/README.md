# @carefully-built/charts

Reusable chart widgets for SaaS dashboards.

- `ChartLegend`: scrollable legend chips generated from chart data.
- `DonutChartWidget`: widget shell + donut/pie chart + automatic legend.
- `BarDistributionWidget`: widget shell + vertical/horizontal bar chart.
- `CoverageGrid`: per-slot coverage heatmap — a grid of time-slot tiles colored by
  coverage status (assigned vs required), with an optional status legend. Built for
  scheduling/staffing surfaces but generic for any per-slot intensity grid.

```tsx
import { CoverageGrid } from '@carefully-built/charts';

<CoverageGrid
  title="Coverage"
  slots={[
    { label: '09:00', assigned: 2, required: 2 }, // met
    { label: '09:30', assigned: 1, required: 3 }, // under
    { label: '10:00', assigned: 1 },              // no requirement
  ]}
  onSlotClick={(index) => openSlot(index)}
/>;
```
