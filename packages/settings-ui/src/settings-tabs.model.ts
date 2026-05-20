export const DEFAULT_SETTINGS_TAB = "general" as const;

const settingsTabsWithoutOrganization = ["general", "account"] as const;
const settingsTabsWithOrganization = [
  "general",
  "match",
  "organization",
  "account",
  "integrations",
  "pipeline",
  "website",
  "valuator",
  "documentation",
  "reports",
  "tags",
  "custom-fields",
] as const;

export type SettingsTab =
  | (typeof settingsTabsWithoutOrganization)[number]
  | (typeof settingsTabsWithOrganization)[number];

export function getAvailableSettingsTabs(hasOrganization: boolean): SettingsTab[] {
  return hasOrganization
    ? [...settingsTabsWithOrganization]
    : [...settingsTabsWithoutOrganization];
}

export function resolveSettingsTab(
  requestedTab: string | null | undefined,
  hasOrganization: boolean,
): SettingsTab {
  const availableTabs = getAvailableSettingsTabs(hasOrganization);

  if (requestedTab && availableTabs.includes(requestedTab as SettingsTab)) {
    return requestedTab as SettingsTab;
  }

  return DEFAULT_SETTINGS_TAB;
}
