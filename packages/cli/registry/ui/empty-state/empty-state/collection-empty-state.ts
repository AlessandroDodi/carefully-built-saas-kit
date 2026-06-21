export type CollectionEmptyState = "none" | "initial" | "no-results";

export interface ResolveCollectionEmptyStateOptions {
  readonly totalCount: number;
  readonly filteredCount: number;
  readonly hasSearch?: boolean;
  readonly hasFilters?: boolean;
}

export function resolveCollectionEmptyState({
  totalCount,
  filteredCount,
  hasSearch = false,
  hasFilters = false,
}: ResolveCollectionEmptyStateOptions): CollectionEmptyState {
  if (filteredCount > 0) {
    return "none";
  }

  if (totalCount === 0) {
    return "initial";
  }

  if (hasSearch || hasFilters) {
    return "no-results";
  }

  return "initial";
}
