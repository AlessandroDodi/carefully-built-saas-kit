"use client";

import { useMemo } from "react";

import { useUrlStringFilters } from "./use-url-string-filters";

import type {
  UrlStringFilterDefinition,
  UrlStringFiltersState,
} from "./use-url-string-filters";
import type { CrudEmptyState } from "./types";

type UrlFilterValues<
  TDefinitions extends readonly UrlStringFilterDefinition[],
> = UrlStringFiltersState<TDefinitions>["values"];

export interface CrudUrlListStateOptions<
  TItem,
  TFilters extends object,
  TDefinitions extends readonly UrlStringFilterDefinition[],
> {
  readonly items: readonly TItem[];
  readonly urlFilters: TDefinitions;
  readonly buildFilters: (values: UrlFilterValues<TDefinitions>) => TFilters;
  readonly filterItems: (args: {
    readonly items: readonly TItem[];
    readonly search: string;
    readonly filters: TFilters;
    readonly values: UrlFilterValues<TDefinitions>;
  }) => readonly TItem[];
  readonly hasActiveFilters: (filters: TFilters) => boolean;
  readonly searchKey?: keyof UrlFilterValues<TDefinitions> & string;
  readonly normalizeDraftValues?: (
    draftValues: Record<string, string>,
    currentValues: UrlFilterValues<TDefinitions>,
  ) => Record<string, string>;
  readonly isDraftCountDisabled?: boolean;
}

export interface CrudUrlListState<
  TItem,
  TFilters extends object,
  TDefinitions extends readonly UrlStringFilterDefinition[],
> {
  readonly items: readonly TItem[];
  readonly values: UrlFilterValues<TDefinitions>;
  readonly filters: TFilters;
  readonly search: string;
  readonly emptyState: CrudEmptyState;
  readonly hasActiveFilters: boolean;
  readonly urlFilters: UrlStringFiltersState<TDefinitions>;
  readonly setSearch: (value: string) => void;
  readonly setFilter: (key: keyof TFilters & string, value: string) => void;
  readonly clearFilters: () => void;
  readonly getDraftFilterResultCount: (
    draftValues: Record<string, string>,
  ) => number | undefined;
}

export function useCrudUrlListState<
  TItem,
  TFilters extends object,
  const TDefinitions extends readonly UrlStringFilterDefinition[],
>({
  items,
  urlFilters: definitions,
  buildFilters,
  filterItems,
  hasActiveFilters: checkActiveFilters,
  searchKey = "search" as keyof UrlFilterValues<TDefinitions> & string,
  normalizeDraftValues,
  isDraftCountDisabled = false,
}: CrudUrlListStateOptions<TItem, TFilters, TDefinitions>): CrudUrlListState<
  TItem,
  TFilters,
  TDefinitions
> {
  const urlFilters = useUrlStringFilters(definitions);
  const values = urlFilters.values;
  const search = String(values[searchKey] ?? "");
  const filters = useMemo(() => buildFilters(values), [buildFilters, values]);
  const filteredItems = useMemo(
    () =>
      filterItems({
        items,
        search,
        filters,
        values,
      }),
    [filterItems, filters, items, search, values],
  );
  const hasActiveFilters = checkActiveFilters(filters);
  const emptyState: CrudEmptyState =
    search.trim().length > 0 || hasActiveFilters ? "no-results" : "initial";

  function getDraftFilterResultCount(
    draftValues: Record<string, string>,
  ): number | undefined {
    if (isDraftCountDisabled) {
      return undefined;
    }

    const normalizedDraftValues =
      normalizeDraftValues?.(draftValues, values) ?? draftValues;
    const draftFilterValues = urlFilters.getDraftValues(normalizedDraftValues);
    const draftSearch = String(draftFilterValues[searchKey] ?? search);
    const draftFilters = buildFilters(draftFilterValues);

    return filterItems({
      items,
      search: draftSearch,
      filters: draftFilters,
      values: draftFilterValues,
    }).length;
  }

  return {
    items: filteredItems,
    values,
    filters,
    search,
    emptyState,
    hasActiveFilters: search.trim().length > 0 || hasActiveFilters,
    urlFilters,
    setSearch: (value) => {
      urlFilters.setValue(searchKey, value);
    },
    setFilter: (key, value) => {
      urlFilters.setValue(key as TDefinitions[number]["key"], value);
    },
    clearFilters: urlFilters.clear,
    getDraftFilterResultCount,
  };
}
