"use client";

import { CrudDataTable } from "./crud-data-table";
import { useCrudDataTableController } from "./use-crud-data-table-controller";

import type { CrudDataTableProps } from "./types";
import type { SortState } from "@carefully-built/ui";

export interface CrudListTableProps<TItem> extends Omit<
  CrudDataTableProps<TItem>,
  "data" | "columns" | "sortState" | "onSortChange" | "pagination"
> {
  readonly data: readonly TItem[];
  readonly columns: CrudDataTableProps<TItem>["columns"];
  readonly pageSize?: number;
  readonly pageParam?: string;
  readonly initialSortState?: SortState;
}

export function CrudListTable<TItem extends object>({
  data,
  columns,
  pageSize,
  pageParam,
  initialSortState,
  ...tableProps
}: CrudListTableProps<TItem>): React.ReactElement {
  const { paginatedData, sortState, setSortState, pagination } =
    useCrudDataTableController({
      data,
      columns,
      pageSize,
      pageParam,
      initialSortState,
    });

  return (
    <CrudDataTable
      {...tableProps}
      data={paginatedData}
      columns={columns}
      sortState={sortState}
      onSortChange={setSortState}
      pagination={pagination}
    />
  );
}
