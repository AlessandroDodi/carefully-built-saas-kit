"use client";

import { SmartTable } from "@carefully-built/ui";

import type {
  CrudDataTableProps,
} from "./types";

export function CrudDataTable<TItem extends object>({
  actions,
  actionHandlers,
  columns,
  data,
  fullHeight = true,
  getRowKey,
  isLoading,
  maxHeight,
  noDataContent,
  noDataMessage,
  onRowClick,
  pagination,
  renderActions,
  renderMobileCard,
  sortState,
  stickyHeader = true,
  onSortChange,
}: CrudDataTableProps<TItem>): React.ReactElement {
  return (
    <SmartTable
      data={[...data]}
      columns={[...columns]}
      isLoading={isLoading}
      actions={actions ? [...actions] : undefined}
      actionHandlers={actionHandlers}
      renderActions={renderActions}
      noDataMessage={noDataMessage}
      noDataContent={noDataContent}
      getRowKey={getRowKey}
      onRowClick={onRowClick}
      renderMobileCard={renderMobileCard}
      stickyHeader={stickyHeader}
      fullHeight={fullHeight}
      maxHeight={maxHeight}
      sortState={sortState}
      onSortChange={onSortChange}
      pagination={pagination}
    />
  );
}
