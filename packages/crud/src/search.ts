function normalizeSearchText(value: string): string {
  return value
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

export function buildCrudSearchText(values: readonly unknown[]): string {
  return normalizeSearchText(
    values
      .filter(
        (value): value is string | number =>
          typeof value === "string" || typeof value === "number",
      )
      .map(String)
      .join(" "),
  );
}

export function matchesCrudSearch(searchText: string, query: string): boolean {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return true;
  }

  return normalizedQuery
    .split(/\s+/)
    .every((token) => searchText.includes(token));
}
