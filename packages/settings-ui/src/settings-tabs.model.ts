export type SettingsTab = string;

export interface SettingsTabDefinition {
  readonly value: SettingsTab;
}

export function resolveSettingsTab(
  requestedTab: string | null | undefined,
  tabs: readonly SettingsTabDefinition[],
  fallbackTab: SettingsTab = tabs[0]?.value ?? "",
): SettingsTab {
  const availableTabs = tabs.map((tab) => tab.value);

  if (requestedTab && availableTabs.includes(requestedTab)) {
    return requestedTab;
  }

  return fallbackTab;
}
