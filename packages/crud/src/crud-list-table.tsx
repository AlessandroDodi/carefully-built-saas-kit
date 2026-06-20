"use client";

import { CrudDataTable } from "./crud-data-table";
import type { CrudDataTableProps } from "./types";

export type CrudListTableProps<TItem extends object> = CrudDataTableProps<TItem>;

export function CrudListTable<TItem extends object>(
  props: CrudListTableProps<TItem>,
): React.ReactElement {
  return <CrudDataTable {...props} />;
}
