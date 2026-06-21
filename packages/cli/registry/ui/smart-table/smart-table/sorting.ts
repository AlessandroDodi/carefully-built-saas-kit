'use client';

import { useMemo, useState } from 'react';

import { getColumnValue } from '@/components/ui/smart-table/utils';

import type { Column, SortDirection, SortState, SortValue } from '@/components/ui/smart-table/types';

interface UseTableSortingOptions<T> {
  readonly data: readonly T[];
  readonly columns: readonly Column<T>[];
  readonly initialSortState?: SortState;
}

interface UseTableSortingResult<T> {
  readonly sortedData: T[];
  readonly sortState: SortState;
  readonly setSortState: (state: SortState) => void;
}

export function getColumnSortKey<T>(column: Column<T>): string | null {
  if (column.sortable === false) {
    return null;
  }

  if (column.sortKey) {
    return column.sortKey;
  }

  return typeof column.accessor === 'string' ? column.accessor : null;
}

export function getNextSortState(currentState: SortState, key: string): SortState {
  if (currentState?.key !== key) {
    return { key, direction: 'asc' };
  }

  if (currentState.direction === 'asc') {
    return { key, direction: 'desc' };
  }

  return null;
}

function normalizeSortValue(value: SortValue): string | number | boolean | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  return value;
}

function compareSortValues(left: SortValue, right: SortValue): number {
  const leftValue = normalizeSortValue(left);
  const rightValue = normalizeSortValue(right);

  if (leftValue === null && rightValue === null) {
    return 0;
  }

  if (leftValue === null) {
    return 1;
  }

  if (rightValue === null) {
    return -1;
  }

  if (typeof leftValue === 'number' && typeof rightValue === 'number') {
    return leftValue - rightValue;
  }

  if (typeof leftValue === 'boolean' && typeof rightValue === 'boolean') {
    return Number(leftValue) - Number(rightValue);
  }

  return String(leftValue).localeCompare(String(rightValue), 'it', {
    numeric: true,
    sensitivity: 'base',
  });
}

function getSortValue<T>(column: Column<T>, row: T): SortValue {
  if (column.sortAccessor) {
    return column.sortAccessor(row);
  }

  return getColumnValue(column, row) as SortValue;
}

function getSortColumn<T>(
  columns: readonly Column<T>[],
  sortState: SortState,
): Column<T> | null {
  if (!sortState) {
    return null;
  }

  return columns.find((column) => getColumnSortKey(column) === sortState.key) ?? null;
}

function applyDirection(value: number, direction: SortDirection): number {
  return direction === 'asc' ? value : -value;
}

function sortTableData<T>(
  data: readonly T[],
  columns: readonly Column<T>[],
  sortState: SortState,
): T[] {
  const sortColumn = getSortColumn(columns, sortState);

  if (!sortColumn || !sortState) {
    return [...data];
  }

  return data
    .map((row, index) => ({ row, index }))
    .sort((left, right) => {
      const compared = compareSortValues(
        getSortValue(sortColumn, left.row),
        getSortValue(sortColumn, right.row),
      );

      return compared === 0
        ? left.index - right.index
        : applyDirection(compared, sortState.direction);
    })
    .map(({ row }) => row);
}

export function useTableSorting<T>({
  data,
  columns,
  initialSortState = null,
}: UseTableSortingOptions<T>): UseTableSortingResult<T> {
  const [sortState, setSortState] = useState(initialSortState);
  const sortedData = useMemo(
    () => sortTableData(data, columns, sortState),
    [columns, data, sortState],
  );

  return { sortedData, sortState, setSortState };
}
