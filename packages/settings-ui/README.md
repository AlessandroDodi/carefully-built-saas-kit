# `@carefully-built/settings-ui`

Reusable settings UI for SaaS apps.

## What It Includes

- `SettingsTabs` for common SaaS settings pages.
- `resolveSettingsTab` and `SettingsTab` for URL-safe settings tab handling.
- `SettingsSectionCard` for repeated settings sections with title, subtitle, and action slot.
- `ProgressMetricCard` for compact quota/progress rows.

## Example

```tsx
import { SettingsTabs, resolveSettingsTab } from "@carefully-built/settings-ui";

const initialTab = resolveSettingsTab(searchParams.tab, Boolean(organization));

<SettingsTabs
  hasOrganization={Boolean(organization)}
  initialTab={initialTab}
  generalContent={<GeneralSection />}
  accountContent={<AccountSection />}
/>;
```
