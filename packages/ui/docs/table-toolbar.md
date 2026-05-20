# TableToolbar

Search and filter toolbar for resource lists. It supports inline desktop controls and a responsive filter sheet/drawer with draft apply behavior.

## Import

```tsx
import { TableToolbar, type FilterConfig } from '@carefully-built/ui';
```

## Props

- `search`: `{ value, onChange, placeholder }`.
- `filters`: select filters backed by `FilterConfig`.
- `textFilters`: simple text filters.
- `rangeFilters`: min/max or date range filters.
- `customFilters`: app-rendered filters that still join the clear/apply flow.
- `renderRangeInput`: override for custom range input rendering.
- `inlineControls`: buttons or selectors beside search.
- `onClearAll`: reset search/filter state.
- `getDraftResultCount`: calculates the result count before applying mobile/sheet filters.
- `children`: extra toolbar content.

## Basic Example

```tsx
const STATUS_FILTER = {
  key: 'status',
  label: 'Status',
  options: [
    { value: 'active', label: 'Active' },
    { value: 'archived', label: 'Archived' },
  ],
} satisfies FilterConfig;

<TableToolbar
  search={{ value: search, onChange: setSearch, placeholder: 'Search contacts...' }}
  filters={[
    {
      config: STATUS_FILTER,
      value: status,
      onChange: setStatus,
    },
  ]}
  onClearAll={clearAll}
/>;
```

## Package Owns

- Search input styling and clear button.
- Filter button, active count, and draft state.
- Desktop/mobile responsive filter surface.
- Clear-all behavior contract.

## App Owns

- The actual filter state.
- Filtering logic, unless using `@carefully-built/crud`.
- Custom filter renderers for domain pickers.

## Open Decisions

- Extract a standalone `SearchBar` package-level component.
- Add saved filter presets.
- Add URL query-state adapters.
