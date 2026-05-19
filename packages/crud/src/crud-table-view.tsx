"use client";

import type { CrudTableViewProps } from "./types";

import { SmartTable, TableToolbar } from "@carefully-built/ui";

export function CrudTableView<TItem extends object>({
  state,
  columns,
  isLoading,
  searchPlaceholder = "Cerca...",
  filters = [],
  actions,
  actionHandlers,
  renderActions,
  noDataMessage,
  initialEmptyContent,
  noResultsContent,
  getRowKey,
  onRowClick,
  renderMobileCard,
  stickyHeader = true,
  fullHeight = true,
  maxHeight,
}: CrudTableViewProps<TItem>): React.ReactElement {
  const emptyContent =
    state.emptyState === "no-results" ? noResultsContent : initialEmptyContent;

  return (
    <>
      <div className="shrink-0">
        <TableToolbar
          search={{
            value: state.search,
            onChange: state.setSearch,
            placeholder: searchPlaceholder,
          }}
          filters={filters.map((filter) => ({
            config: filter.config,
            value: state.filters[filter.key] ?? "all",
            onChange: (value) => {
              state.setFilter(filter.key, value);
            },
            allowAll: filter.allowAll,
            clearable: filter.clearable,
          }))}
          onClearAll={state.clearAll}
          getDraftResultCount={state.getDraftFilterResultCount}
        />
      </div>

      <SmartTable
        data={state.paginatedData}
        columns={[...columns]}
        isLoading={isLoading}
        actions={actions ? [...actions] : undefined}
        actionHandlers={actionHandlers}
        renderActions={renderActions}
        noDataMessage={noDataMessage}
        noDataContent={emptyContent}
        getRowKey={getRowKey}
        onRowClick={onRowClick}
        renderMobileCard={renderMobileCard}
        stickyHeader={stickyHeader}
        fullHeight={fullHeight}
        maxHeight={maxHeight}
        sortState={state.sortState}
        onSortChange={state.setSortState}
        pagination={state.pagination}
      />
    </>
  );
}
