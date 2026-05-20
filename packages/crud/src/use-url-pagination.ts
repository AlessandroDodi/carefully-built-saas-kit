"use client";

import { parseAsInteger, useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";

import type { CrudPaginationState } from "./pagination";

export interface UseUrlPaginationOptions {
  readonly totalItems: number;
  readonly pageSize?: number;
  readonly pageParam?: string;
}

export interface UrlPaginationState extends CrudPaginationState {
  readonly hasPrevPage: boolean;
  readonly hasNextPage: boolean;
  readonly goToPage: (page: number) => void;
  readonly nextPage: () => void;
  readonly prevPage: () => void;
  readonly firstPage: () => void;
  readonly lastPage: () => void;
  readonly paginate: <T>(data: readonly T[]) => T[];
}

export function useUrlPagination({
  totalItems,
  pageSize = 20,
  pageParam = "page",
}: UseUrlPaginationOptions): UrlPaginationState {
  const [page, setPage] = useQueryState(
    pageParam,
    parseAsInteger.withDefault(1),
  );

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  const goToPage = useCallback(
    (newPage: number) => {
      const validPage = Math.min(Math.max(1, newPage), totalPages);
      void setPage(validPage === 1 ? null : validPage);
    },
    [setPage, totalPages],
  );

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, goToPage, hasNextPage]);

  const prevPage = useCallback(() => {
    if (hasPrevPage) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage, hasPrevPage]);

  const firstPage = useCallback(() => {
    goToPage(1);
  }, [goToPage]);

  const lastPage = useCallback(() => {
    goToPage(totalPages);
  }, [goToPage, totalPages]);

  const paginate = useCallback(
    <T,>(data: readonly T[]): T[] => data.slice(startIndex, endIndex),
    [endIndex, startIndex],
  );

  return useMemo(
    () => ({
      currentPage,
      pageSize,
      totalPages,
      totalItems,
      startIndex,
      endIndex,
      hasPrevPage,
      hasNextPage,
      goToPage,
      nextPage,
      prevPage,
      firstPage,
      lastPage,
      paginate,
      onPageChange: goToPage,
    }),
    [
      currentPage,
      endIndex,
      firstPage,
      goToPage,
      hasNextPage,
      hasPrevPage,
      lastPage,
      nextPage,
      pageSize,
      paginate,
      prevPage,
      startIndex,
      totalItems,
      totalPages,
    ],
  );
}
