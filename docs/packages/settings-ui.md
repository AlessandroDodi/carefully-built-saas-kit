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
import { EditableSettingsSection } from '@carefully-built/settings-ui';

// Check the API catalog below for the component source and prop types.
// Most components are controlled shells: pass app data, handlers, and slot content from the consuming app.
```

Components in this package:

- `EditableSettingsSection`: import from `@carefully-built/settings-ui`.
- `OrganizationMembersPanel`: import from `@carefully-built/settings-ui`.
- `ProgressMetricCard`: import from `@carefully-built/settings-ui`.
- `SettingsAddButton`: import from `@carefully-built/settings-ui`.
- `SettingsDetailGrid`: import from `@carefully-built/settings-ui`.
- `SettingsEditDeleteActions`: import from `@carefully-built/settings-ui`.
- `SettingsEmailPreviewPanel`: import from `@carefully-built/settings-ui`.
- `SettingsFormSheet`: import from `@carefully-built/settings-ui`.
- `SettingsHelpTitle`: import from `@carefully-built/settings-ui`.
- `SettingsIntegrationRow`: import from `@carefully-built/settings-ui`.
- `SettingsListSection`: import from `@carefully-built/settings-ui`.
- `SettingsPanel`: import from `@carefully-built/settings-ui`.
- `SettingsPipesWidgetPanel`: import from `@carefully-built/settings-ui`.
- `SettingsPipesWidgetPanel`: import from `@carefully-built/settings-ui`.
- `SettingsReorderableList`: import from `@carefully-built/settings-ui`.
- `SettingsSectionCard`: import from `@carefully-built/settings-ui`.
- `SettingsStatusPill`: import from `@carefully-built/settings-ui`.
- `SettingsSwitchRow`: import from `@carefully-built/settings-ui`.
- `SettingsTabs`: import from `@carefully-built/settings-ui`.
- `SettingsText`: import from `@carefully-built/settings-ui`.

## Helper Usage

```ts
import { countUnreconciledMembers } from '@carefully-built/settings-ui';
```

Helpers in this package:

- `countUnreconciledMembers`
- `countUnreconciledMembers`
- `DEFAULT_ORGANIZATION_MEMBERS_PANEL_LABELS`
- `DEFAULT_ORGANIZATION_MEMBERS_PANEL_LABELS`
- `DEFAULT_ORGANIZATION_MEMBERS_PANEL_TEST_IDS`
- `DEFAULT_ORGANIZATION_MEMBERS_PANEL_TEST_IDS`
- `EditableSettingsSection`
- `memberDisplayName`
- `memberDisplayName`
- `OrganizationMembersPanel`
- `ProgressMetricCard`
- `resolveOrganizationMembersPanelLabels`
- `resolveOrganizationMembersPanelLabels`
- `resolveOrganizationMembersPanelTestIds`
- `resolveOrganizationMembersPanelTestIds`
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
- `SettingsText`

## Types And Schemas

- `EditableSettingsSectionProps`
- `memberSortValue`
- `memberSortValue`
- `OrganizationMember`
- `OrganizationMembersPanelLabels`
- `OrganizationMembersPanelProps`
- `OrganizationMembersPanelTestIds`
- `ProgressMetricCardProps`
- `SettingsDetailItem`
- `SettingsEmailPreviewItem`
- `SettingsEmailPreviewPanelCopy`
- `SettingsEmailPreviewPanelProps`
- `SettingsEmptyState`
- `SettingsListSectionProps`
- `SettingsPipesWidgetPanelProps`
- `SettingsReorderableListProps`
- `SettingsSectionCardProps`
- `SettingsTab`
- `SettingsTabDefinition`
- `SettingsTabItem`
- `SettingsTabsProps`
- `SettingsTextProps`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `EditableSettingsSection` | Component | `packages/settings-ui/src/editable-settings-section.tsx` |
| `OrganizationMembersPanel` | Component | `packages/settings-ui/src/organization-members-panel.tsx` |
| `ProgressMetricCard` | Component | `packages/settings-ui/src/progress-metric-card.tsx` |
| `SettingsAddButton` | Component | `packages/settings-ui/src/settings-controls.tsx` |
| `SettingsDetailGrid` | Component | `packages/settings-ui/src/settings-details.tsx` |
| `SettingsEditDeleteActions` | Component | `packages/settings-ui/src/settings-controls.tsx` |
| `SettingsEmailPreviewPanel` | Component | `packages/settings-ui/src/integration-panels.tsx` |
| `SettingsFormSheet` | Component | `packages/settings-ui/src/settings-controls.tsx` |
| `SettingsHelpTitle` | Component | `packages/settings-ui/src/settings-controls.tsx` |
| `SettingsIntegrationRow` | Component | `packages/settings-ui/src/settings-details.tsx` |
| `SettingsListSection` | Component | `packages/settings-ui/src/settings-list-section.tsx` |
| `SettingsPanel` | Component | `packages/settings-ui/src/settings-details.tsx` |
| `SettingsPipesWidgetPanel` | Component | `packages/settings-ui/src/integration-panels.tsx` |
| `SettingsPipesWidgetPanel` | Component | `packages/settings-ui/src/settings-controls.tsx` |
| `SettingsReorderableList` | Component | `packages/settings-ui/src/settings-reorderable-list.tsx` |
| `SettingsSectionCard` | Component | `packages/settings-ui/src/settings-section-card.tsx` |
| `SettingsStatusPill` | Component | `packages/settings-ui/src/settings-details.tsx` |
| `SettingsSwitchRow` | Component | `packages/settings-ui/src/settings-controls.tsx` |
| `SettingsTabs` | Component | `packages/settings-ui/src/settings-tabs.tsx` |
| `SettingsText` | Component | `packages/settings-ui/src/settings-text.tsx` |
| `countUnreconciledMembers` | Helper | `packages/settings-ui/src/index.ts` |
| `countUnreconciledMembers` | Helper | `packages/settings-ui/src/organization-members-panel.model.ts` |
| `DEFAULT_ORGANIZATION_MEMBERS_PANEL_LABELS` | Helper | `packages/settings-ui/src/index.ts` |
| `DEFAULT_ORGANIZATION_MEMBERS_PANEL_LABELS` | Helper | `packages/settings-ui/src/organization-members-panel.model.ts` |
| `DEFAULT_ORGANIZATION_MEMBERS_PANEL_TEST_IDS` | Helper | `packages/settings-ui/src/index.ts` |
| `DEFAULT_ORGANIZATION_MEMBERS_PANEL_TEST_IDS` | Helper | `packages/settings-ui/src/organization-members-panel.model.ts` |
| `EditableSettingsSection` | Helper | `packages/settings-ui/src/index.ts` |
| `memberDisplayName` | Helper | `packages/settings-ui/src/index.ts` |
| `memberDisplayName` | Helper | `packages/settings-ui/src/organization-members-panel.model.ts` |
| `OrganizationMembersPanel` | Helper | `packages/settings-ui/src/client.ts` |
| `ProgressMetricCard` | Helper | `packages/settings-ui/src/client.ts` |
| `resolveOrganizationMembersPanelLabels` | Helper | `packages/settings-ui/src/index.ts` |
| `resolveOrganizationMembersPanelLabels` | Helper | `packages/settings-ui/src/organization-members-panel.model.ts` |
| `resolveOrganizationMembersPanelTestIds` | Helper | `packages/settings-ui/src/index.ts` |
| `resolveOrganizationMembersPanelTestIds` | Helper | `packages/settings-ui/src/organization-members-panel.model.ts` |
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
| `SettingsText` | Helper | `packages/settings-ui/src/index.ts` |
| `EditableSettingsSectionProps` | Type | `packages/settings-ui/src/editable-settings-section.tsx` |
| `memberSortValue` | Type | `packages/settings-ui/src/index.ts` |
| `memberSortValue` | Type | `packages/settings-ui/src/organization-members-panel.model.ts` |
| `OrganizationMember` | Type | `packages/settings-ui/src/organization-members-panel.model.ts` |
| `OrganizationMembersPanelLabels` | Type | `packages/settings-ui/src/organization-members-panel.model.ts` |
| `OrganizationMembersPanelProps` | Type | `packages/settings-ui/src/organization-members-panel.tsx` |
| `OrganizationMembersPanelTestIds` | Type | `packages/settings-ui/src/organization-members-panel.model.ts` |
| `ProgressMetricCardProps` | Type | `packages/settings-ui/src/progress-metric-card.tsx` |
| `SettingsDetailItem` | Type | `packages/settings-ui/src/settings-details.tsx` |
| `SettingsEmailPreviewItem` | Type | `packages/settings-ui/src/integration-panels.tsx` |
| `SettingsEmailPreviewPanelCopy` | Type | `packages/settings-ui/src/integration-panels.tsx` |
| `SettingsEmailPreviewPanelProps` | Type | `packages/settings-ui/src/integration-panels.tsx` |
| `SettingsEmptyState` | Type | `packages/settings-ui/src/settings-details.tsx` |
| `SettingsListSectionProps` | Type | `packages/settings-ui/src/settings-list-section.tsx` |
| `SettingsPipesWidgetPanelProps` | Type | `packages/settings-ui/src/integration-panels.tsx` |
| `SettingsReorderableListProps` | Type | `packages/settings-ui/src/settings-reorderable-list.tsx` |
| `SettingsSectionCardProps` | Type | `packages/settings-ui/src/settings-section-card.tsx` |
| `SettingsTab` | Type | `packages/settings-ui/src/settings-tabs.model.ts` |
| `SettingsTabDefinition` | Type | `packages/settings-ui/src/settings-tabs.model.ts` |
| `SettingsTabItem` | Type | `packages/settings-ui/src/settings-tabs.tsx` |
| `SettingsTabsProps` | Type | `packages/settings-ui/src/settings-tabs.tsx` |
| `SettingsTextProps` | Type | `packages/settings-ui/src/settings-text.tsx` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
