export interface UserPickerOption {
  readonly value: string;
  readonly label?: string | null;
  readonly email?: string | null;
  readonly imageUrl?: string | null;
  readonly archived?: boolean;
  readonly searchText?: string;
}

export interface UserPickerCopy {
  readonly fallbackName?: string;
  readonly singlePlaceholder?: string;
  readonly multiplePlaceholder?: string;
  readonly searchPlaceholder?: string;
  readonly emptyMessage?: string;
  readonly selectedSingleLabel?: string;
  readonly selectedPluralLabel?: string;
  readonly formatSelectedCount?: (count: number) => string;
}

export function formatUserDisplayName(
  user: UserPickerOption,
  fallbackName = 'User',
): string {
  const label = user.label?.trim();
  if (label) {
    return label;
  }

  const email = user.email?.trim();
  if (email) {
    return email;
  }

  return fallbackName;
}

export function formatSelectedUserSummary(
  selectedUsers: readonly UserPickerOption[],
  copy: UserPickerCopy = {},
): string {
  const selectedNames = selectedUsers
    .slice(0, 2)
    .map((user) => formatUserDisplayName(user, copy.fallbackName));
  const remainingCount = selectedUsers.length - selectedNames.length;

  if (remainingCount <= 0) {
    return selectedNames.join(', ');
  }

  const remainingLabel =
    remainingCount === 1
      ? copy.selectedSingleLabel ?? 'person'
      : copy.selectedPluralLabel ?? 'people';

  return `${selectedNames.join(', ')} +${String(remainingCount)} ${remainingLabel}`;
}

export function buildUserInitials(user: UserPickerOption, fallbackName?: string): string {
  const displayName = formatUserDisplayName(user, fallbackName);
  const nameParts = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (nameParts.length > 1) {
    return nameParts.map((part) => part[0]?.toUpperCase()).join('');
  }

  return displayName[0]?.toUpperCase() ?? 'U';
}

export function filterSelectableUsers(
  users: readonly UserPickerOption[],
  selectedValues: readonly string[],
): UserPickerOption[] {
  const selectedValueSet = new Set(selectedValues);

  return users.filter((user) => !user.archived || selectedValueSet.has(user.value));
}

export function filterUsersBySearch(
  users: readonly UserPickerOption[],
  search: string,
  fallbackName?: string,
): UserPickerOption[] {
  const normalizedSearch = search.trim().toLowerCase();

  if (!normalizedSearch) {
    return [...users];
  }

  return users.filter((user) => {
    const searchableText = [
      formatUserDisplayName(user, fallbackName),
      user.email,
      user.searchText,
    ].filter(Boolean).join(' ').toLowerCase();

    return searchableText.includes(normalizedSearch);
  });
}

export function toggleUserSelection(
  selectedValues: readonly string[],
  toggledValue: string,
): string[] {
  if (selectedValues.includes(toggledValue)) {
    return selectedValues.filter((value) => value !== toggledValue);
  }

  return [...selectedValues, toggledValue];
}
