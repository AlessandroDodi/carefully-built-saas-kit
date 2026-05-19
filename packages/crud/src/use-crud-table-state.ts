"use client";

import { useCallback, useMemo, useState } from "react";

import type { UseCrudTableStateOptions, CrudTableState } from "./types";

import { useTableSorting } from "@carefully-built/ui";

import { buildCrudSearchText, matchesCrudSearch } from "./search";
import { getValidPage, paginateCrudData } from "./pagination";

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
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>(() =>
    buildInitialFilters(filterDefinitions),
  );
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(
    () => filterCrudData(data, search, filters, searchFields),
    [data, filters, search, searchFields],
  );
  const { sortedData, sortState, setSortState } = useTableSorting({
    data: filteredData,
    columns,
    initialSortState,
  });

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const validCurrentPage = getValidPage(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredData.length);
  const paginatedData = useMemo(
    () => paginateCrudData(sortedData, validCurrentPage, pageSize),
    [pageSize, sortedData, validCurrentPage],
  );

  const setFilter = useCallback((key: string, value: string) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }));
    setCurrentPage(1);
  }, []);

  const updateSearch = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  const clearAll = useCallback(() => {
    setSearch("");
    setFilters(buildInitialFilters(filterDefinitions));
    setCurrentPage(1);
  }, [filterDefinitions]);

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
    pagination: {
      currentPage: validCurrentPage,
      totalPages,
      totalItems: filteredData.length,
      pageSize,
      startIndex,
      endIndex,
      onPageChange: setCurrentPage,
    },
  };
}
