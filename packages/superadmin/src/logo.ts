export function normalizeOrganizationLogoUrl(value: string | null | undefined): string | null {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    return null;
  }

  return normalizedValue;
}

export function getOrganizationInitials(name: string): string {
  const meaningfulWords = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .filter((word) => !['di', 'del', 'della', 'in', 'srl', 'spa'].includes(word.toLowerCase()));
  const sourceWords = meaningfulWords.length ? meaningfulWords : name.trim().split(/\s+/);
  const initials = sourceWords
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return initials || '?';
}
