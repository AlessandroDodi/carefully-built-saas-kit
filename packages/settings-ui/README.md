# `@carefully-built/settings-ui`

Reusable settings UI for SaaS apps.

## What It Includes

- `SettingsTabs` for URL-aware, horizontally scrollable settings tabs.
- `resolveSettingsTab` and `SettingsTab` for validating app-defined settings tabs.
- `SettingsSectionCard` for repeated settings sections with title, subtitle, and action slot.
- `ProgressMetricCard` for compact quota/progress rows.

## Example

```tsx
import { SettingsTabs, resolveSettingsTab } from "@carefully-built/settings-ui";

const tabs = [
  { value: "general", label: "General", content: <GeneralSection /> },
  { value: "account", label: "Account", content: <AccountSection /> },
] as const;
const initialTab = resolveSettingsTab(searchParams.tab, tabs);

<SettingsTabs
  initialTab={initialTab}
  tabs={tabs}
/>;
```
