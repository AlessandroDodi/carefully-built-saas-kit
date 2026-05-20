# Widgets

Planned package: `@carefully-built/widgets`.

Reusable dashboard widget basics for SaaS home pages and admin dashboards.

## Components To Build

- `WidgetShell`: icon, title, subtitle, action slot, body, footer.
- `WidgetLoadingState`: body skeletons while icon/title remain visible.
- `MetricWidget`: KPI number, label, trend, comparison chip, icon.
- `ListWidget`: recent items/tasks/notifications with loading and empty states.
- `WidgetGrid`: responsive dashboard widget layout.

## Target Props

```tsx
<WidgetShell
  icon={Users}
  title="Active users"
  subtitle="Last 30 days"
  isLoading={isLoading}
  actions={<TimeRangeSelect value={range} onChange={setRange} />}
>
  <MetricWidget.Value value={activeUsers} trend={trend} />
</WidgetShell>
```

## Rules

- Loading states should not hide the icon/title.
- Skeletons should cover only the data/content area.
- Empty states should be compact and useful, not marketing copy.
- The package owns widget chrome; the app owns the actual query and domain rendering.
