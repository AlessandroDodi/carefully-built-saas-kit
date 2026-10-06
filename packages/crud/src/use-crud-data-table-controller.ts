"use client";

import { useMemo } from "react";

import { useTableSorting } from "@carefully-built/ui";

import { useUrlPagination } from "./use-url-pagination";

import type { CrudPaginationState } from "./pagination";
import type { Column, SortState } from "@carefully-built/ui";

export interface UseCrudDataTableControllerOptions<TItem> {
  readonly data: readonly TItem[];
  readonly columns: readonly Column<TItem>[];
  readonly pageSize?: number;
  readonly pageParam?: string;
  readonly initialSortState?: SortState;
}

export interface CrudDataTableController<TItem> {
  readonly sortedData: TItem[];
  readonly paginatedData: TItem[];
  readonly sortState: SortState;
  readonly setSortState: (state: SortState) => void;
  readonly pagination: CrudPaginationState;
}

export function useCrudDataTableController<TItem extends object>({
  data,
  columns,
  pageSize = 20,
  pageParam,
  initialSortState = null,
}: UseCrudDataTableControllerOptions<TItem>): CrudDataTableController<TItem> {
  const { sortedData, sortState, setSortState } = useTableSorting({
    data,
    columns,
    initialSortState,
  });
  const pagination = useUrlPagination({
    totalItems: data.length,
    pageSize,
    pageParam,
  });
  const paginatedData = useMemo(
    () => pagination.paginate(sortedData),
    [pagination, sortedData],
  );

  return {
    sortedData,
    paginatedData,
    sortState,
    setSortState,
    pagination,
  };
}
