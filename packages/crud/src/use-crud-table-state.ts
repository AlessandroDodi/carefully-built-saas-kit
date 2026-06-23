"use client";

import { useCallback, useMemo } from "react";

import type { UseCrudTableStateOptions, CrudTableState } from "./types";

import { useTableSorting } from "@carefully-built/ui";

import { buildCrudSearchText, matchesCrudSearch } from "./search";
import { useUrlPagination } from "./use-url-pagination";
import { useUrlStringFilters, type UrlStringFilterDefinition } from "./use-url-string-filters";

function buildInitialFilters<TItem>(
  filters: readonly { readonly key: Extract<keyof TItem, string> }[],
): Record<string, string> {
  return Object.fromEntries(filters.map((filter) => [filter.key, "all"]));
}

function itemMatchesFilters<TItem extends object>(
  item: TItem,
  filters: Record<string, string>,
): boolean {
  const record = item as Record<string, unknown>;

  return Object.entries(filters).every(([key, filterValue]) => {
    if (!filterValue || filterValue === "all") {
      return true;
    }

    return record[key] === filterValue;
  });
}

function filterCrudData<TItem extends object>(
  data: readonly TItem[],
  search: string,
  filters: Record<string, string>,
  searchFields: readonly Extract<keyof TItem, string>[],
): TItem[] {
  return data.filter((item) => {
    if (!itemMatchesFilters(item, filters)) {
      return false;
    }

    const record = item as Record<string, unknown>;
    const searchText = buildCrudSearchText(
      searchFields.map((field) => record[field]),
    );
    return matchesCrudSearch(searchText, search);
  });
}

export function useCrudTableState<TItem extends object>({
  data,
  columns,
  searchFields = [],
  filters: filterDefinitions = [],
  pageSize = 20,
  initialSortState = null,
}: UseCrudTableStateOptions<TItem>): CrudTableState<TItem> {
  const urlFilterDefinitions = useMemo(
    () =>
      [
        { key: "search", defaultValue: "", clearValue: "" },
        ...filterDefinitions.map((filter) => ({
          key: filter.key,
          defaultValue: "all",
          clearValue: "all",
        })),
      ] satisfies readonly UrlStringFilterDefinition[],
    [filterDefinitions],
  );
  const urlFilters = useUrlStringFilters(urlFilterDefinitions);
  const search = urlFilters.values.search ?? "";
  const filters = useMemo(
    () => ({
      ...buildInitialFilters(filterDefinitions),
      ...Object.fromEntries(
        filterDefinitions.map((filter) => [filter.key, urlFilters.values[filter.key] ?? "all"]),
      ),
    }),
    [filterDefinitions, urlFilters.values],
  );

  const filteredData = useMemo(
    () => filterCrudData(data, search, filters, searchFields),
    [data, filters, search, searchFields],
  );
  const pagination = useUrlPagination({
    totalItems: filteredData.length,
    pageSize,
  });
  const setCurrentPage = pagination.onPageChange;
  const { sortedData, sortState, setSortState } = useTableSorting({
    data: filteredData,
    columns,
    initialSortState,
  });

  const paginatedData = useMemo(
    () => pagination.paginate(sortedData),
    [pagination, sortedData],
  );

  const setFilter = useCallback((key: string, value: string) => {
    urlFilters.setValue(key, value);
    void setCurrentPage(1);
  }, [setCurrentPage, urlFilters]);

  const updateSearch = useCallback((value: string) => {
    urlFilters.setValue("search", value);
    void setCurrentPage(1);
  }, [setCurrentPage, urlFilters]);

  const clearAll = useCallback(() => {
    urlFilters.clear();
    void setCurrentPage(1);
  }, [setCurrentPage, urlFilters]);

  const getDraftFilterResultCount = useCallback(
    (draftValues: Record<string, string>) =>
      filterCrudData(
        data,
        search,
        {
          ...filters,
          ...draftValues,
        },
        searchFields,
      ).length,
    [data, filters, search, searchFields],
  );

  const hasSearch = search.trim().length > 0;
  const hasFilters = Object.values(filters).some(
    (value) => value && value !== "all",
  );

  return {
    filteredData,
    sortedData,
    paginatedData,
    search,
    setSearch: updateSearch,
    filters,
    setFilter,
    clearAll,
    getDraftFilterResultCount,
    hasSearch,
    hasFilters,
    emptyState: hasSearch || hasFilters ? "no-results" : "initial",
    sortState,
    setSortState,
    pagination,
  };
}
