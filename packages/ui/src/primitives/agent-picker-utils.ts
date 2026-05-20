export interface AgentPickerOption {
  readonly value: string;
  readonly label?: string | null;
  readonly email?: string | null;
  readonly imageUrl?: string | null;
  readonly archived?: boolean;
  readonly searchText?: string;
}

export function formatAgentDisplayName(agent: AgentPickerOption): string {
  const label = agent.label?.trim();
  if (label) {
    return label;
  }

  const email = agent.email?.trim();
  if (email) {
    return email;
  }

  return 'Utente';
}

export function buildAgentInitials(agent: AgentPickerOption): string {
  const displayName = formatAgentDisplayName(agent);
  const nameParts = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (nameParts.length > 1) {
    return nameParts.map((part) => part[0]?.toUpperCase()).join('');
  }

  return displayName[0]?.toUpperCase() ?? 'U';
}

export function filterSelectableAgents(
  agents: readonly AgentPickerOption[],
  selectedValues: readonly string[],
): AgentPickerOption[] {
  const selectedValueSet = new Set(selectedValues);

  return agents.filter((agent) => !agent.archived || selectedValueSet.has(agent.value));
}

export function filterAgentsBySearch(
  agents: readonly AgentPickerOption[],
  search: string,
): AgentPickerOption[] {
  const normalizedSearch = search.trim().toLowerCase();

  if (!normalizedSearch) {
    return [...agents];
  }

  return agents.filter((agent) => {
    const searchableText = [
      formatAgentDisplayName(agent),
      agent.email,
      agent.searchText,
    ].filter(Boolean).join(' ').toLowerCase();

    return searchableText.includes(normalizedSearch);
  });
}

export function toggleAgentSelection(
  selectedValues: readonly string[],
  toggledValue: string,
): string[] {
  if (selectedValues.includes(toggledValue)) {
    return selectedValues.filter((value) => value !== toggledValue);
  }

  return [...selectedValues, toggledValue];
}
