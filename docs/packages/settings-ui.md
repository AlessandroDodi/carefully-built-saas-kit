# @carefully-built/settings-ui

Reusable SaaS settings tabs, section cards, and settings metrics for Carefully Built apps.

## Install

```bash
bun add @carefully-built/settings-ui
```

For local development in an app inside the same parent workspace, use the packed tarball or workspace link already used by the consuming app.

## Import Paths

- `@carefully-built/settings-ui`
- `@carefully-built/settings-ui/client`

## Component Usage

```tsx
import { ProgressMetricCard } from '@carefully-built/settings-ui';

// Check the API catalog below for the component source and prop types.
// Most components are controlled shells: pass app data, handlers, and slot content from the consuming app.
```

Components in this package:

- `ProgressMetricCard`: import from `@carefully-built/settings-ui`.
- `SettingsAddButton`: import from `@carefully-built/settings-ui`.
- `SettingsEditDeleteActions`: import from `@carefully-built/settings-ui`.
- `SettingsFormSheet`: import from `@carefully-built/settings-ui`.
- `SettingsHelpTitle`: import from `@carefully-built/settings-ui`.
- `SettingsPipesWidgetPanel`: import from `@carefully-built/settings-ui`.
- `SettingsSectionCard`: import from `@carefully-built/settings-ui`.
- `SettingsSwitchRow`: import from `@carefully-built/settings-ui`.
- `SettingsTabs`: import from `@carefully-built/settings-ui`.

## Helper Usage

```ts
import { ProgressMetricCard } from '@carefully-built/settings-ui';
```

Helpers in this package:

- `ProgressMetricCard`
- `resolveSettingsTab`
- `resolveSettingsTab`
- `SettingsAddButton`
- `SettingsEditDeleteActions`
- `SettingsFormSheet`
- `SettingsHelpTitle`
- `SettingsPipesWidgetPanel`
- `SettingsSectionCard`
- `SettingsSwitchRow`
- `SettingsTabs`

## Types And Schemas

- `ProgressMetricCardProps`
- `SettingsSectionCardProps`
- `SettingsTab`
- `SettingsTabDefinition`
- `SettingsTabItem`
- `SettingsTabsProps`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `ProgressMetricCard` | Component | `packages/settings-ui/src/progress-metric-card.tsx` |
| `SettingsAddButton` | Component | `packages/settings-ui/src/settings-controls.tsx` |
| `SettingsEditDeleteActions` | Component | `packages/settings-ui/src/settings-controls.tsx` |
| `SettingsFormSheet` | Component | `packages/settings-ui/src/settings-controls.tsx` |
| `SettingsHelpTitle` | Component | `packages/settings-ui/src/settings-controls.tsx` |
| `SettingsPipesWidgetPanel` | Component | `packages/settings-ui/src/settings-controls.tsx` |
| `SettingsSectionCard` | Component | `packages/settings-ui/src/settings-section-card.tsx` |
| `SettingsSwitchRow` | Component | `packages/settings-ui/src/settings-controls.tsx` |
| `SettingsTabs` | Component | `packages/settings-ui/src/settings-tabs.tsx` |
| `ProgressMetricCard` | Helper | `packages/settings-ui/src/client.ts` |
| `resolveSettingsTab` | Helper | `packages/settings-ui/src/index.ts` |
| `resolveSettingsTab` | Helper | `packages/settings-ui/src/settings-tabs.model.ts` |
| `SettingsAddButton` | Helper | `packages/settings-ui/src/client.ts` |
| `SettingsEditDeleteActions` | Helper | `packages/settings-ui/src/client.ts` |
| `SettingsFormSheet` | Helper | `packages/settings-ui/src/client.ts` |
| `SettingsHelpTitle` | Helper | `packages/settings-ui/src/client.ts` |
| `SettingsPipesWidgetPanel` | Helper | `packages/settings-ui/src/client.ts` |
| `SettingsSectionCard` | Helper | `packages/settings-ui/src/index.ts` |
| `SettingsSwitchRow` | Helper | `packages/settings-ui/src/client.ts` |
| `SettingsTabs` | Helper | `packages/settings-ui/src/client.ts` |
| `ProgressMetricCardProps` | Type | `packages/settings-ui/src/progress-metric-card.tsx` |
| `SettingsSectionCardProps` | Type | `packages/settings-ui/src/settings-section-card.tsx` |
| `SettingsTab` | Type | `packages/settings-ui/src/settings-tabs.model.ts` |
| `SettingsTabDefinition` | Type | `packages/settings-ui/src/settings-tabs.model.ts` |
| `SettingsTabItem` | Type | `packages/settings-ui/src/settings-tabs.tsx` |
| `SettingsTabsProps` | Type | `packages/settings-ui/src/settings-tabs.tsx` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
