'use client';

import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';

import { SmartTableActions } from './SmartTableActions';
import { getColumnSortKey, getNextSortState } from './sorting';
import { TruncatedContent } from './TruncatedContent';
import { getColumnTooltipText, renderColumnValue } from './utils';

import type {
  ActionHandlers,
  ActionLabels,
  ActionType,
  Column,
  PaginationConfig,
  SortDirection,
  SortState,
} from './types';
import type { ReactNode } from 'react';

import { Pagination } from '../primitives/pagination';
import { Skeleton } from '../primitives/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../primitives/table';
import { cn } from '../utils/cn';

interface DesktopViewProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading: boolean;
  skeletonRows: number;
  actions?: ActionType[];
  actionLabels?: ActionLabels;
  actionHandlers?: ActionHandlers<T>;
  renderActions?: (item: T) => ReactNode;
  noDataMessage: string;
  noDataContent?: ReactNode;
  getRowKey: (item: T) => string | number;
  onRowClick?: (item: T) => void;
  pagination?: PaginationConfig;
  stickyHeader?: boolean;
  maxHeight?: string;
  fullHeight?: boolean;
  sortState?: SortState;
  onSortChange?: (state: SortState) => void;
}

const ACTION_COLUMN_WIDTH_PX = 112;
const ACTION_CELL_CLASS_NAME = 'w-28 min-w-28 overflow-visible whitespace-nowrap text-right';

function SortIcon({
  activeDirection,
}: {
  readonly activeDirection?: SortDirection;
}): React.ReactElement {
  if (activeDirection === 'asc') {
    return <ArrowUp className="size-3.5" aria-hidden="true" />;
  }

  if (activeDirection === 'desc') {
    return <ArrowDown className="size-3.5" aria-hidden="true" />;
  }

  return <ChevronsUpDown className="size-3.5 opacity-45" aria-hidden="true" />;
}

function SortableHeaderContent<T>({
  column,
  sortState,
  onSortChange,
}: {
  readonly column: Column<T>;
  readonly sortState?: SortState;
  readonly onSortChange?: (state: SortState) => void;
}): React.ReactElement {
  const sortKey = getColumnSortKey(column);
  const activeDirection = sortState?.key === sortKey ? sortState.direction : undefined;

  if (!sortKey || !onSortChange) {
    return <>{column.header}</>;
  }

  return (
    <button
      type="button"
      className={cn(
        'hover:text-foreground focus-visible:ring-ring inline-flex max-w-full items-center gap-1.5 rounded-sm text-left font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        column.align === 'right' && 'ml-auto',
        column.align === 'center' && 'mx-auto',
      )}
      aria-label={`Sort by ${column.header}`}
      onClick={() => {
        onSortChange(getNextSortState(sortState ?? null, sortKey));
      }}
    >
      <span className="truncate">{column.header}</span>
      <SortIcon activeDirection={activeDirection} />
    </button>
  );
}

export function DesktopView<T>({
  data,
  columns,
  isLoading,
  skeletonRows,
  actions,
  actionLabels,
  actionHandlers,
  renderActions,
  noDataMessage,
  noDataContent,
  getRowKey,
  onRowClick,
  pagination,
  stickyHeader = false,
  maxHeight = 'calc(100vh - 300px)',
  fullHeight = false,
  sortState,
  onSortChange,
}: DesktopViewProps<T>): React.ReactElement {
  const resolvedNoDataContent = noDataContent ?? noDataMessage;
  const hasActions = (actions?.length ?? 0) > 0 || renderActions !== undefined;
  const actionColumnWidth = hasActions ? `${String(ACTION_COLUMN_WIDTH_PX)}px` : undefined;
  const specifiedPercentageWidth = columns.reduce((total, column) => {
    if (typeof column.width === 'string' && column.width.endsWith('%')) {
      const parsedWidth = Number.parseFloat(column.width);
      return Number.isNaN(parsedWidth) ? total : total + parsedWidth;
    }

    return total;
  }, 0);
  const actionWidthPercentage = 0;
  const remainingPercentageForDataColumns = Math.max(
    0,
    100 - specifiedPercentageWidth - actionWidthPercentage,
  );
  const columnsWithoutWidth = columns.filter((column) => column.width === undefined).length;
  const defaultPercentageWidth =
    columnsWithoutWidth > 0 && remainingPercentageForDataColumns > 0
      ? `${String(remainingPercentageForDataColumns / columnsWithoutWidth)}%`
      : undefined;

  const columnGroup = (
    <colgroup>
      {columns.map((column) => (
        <col key={column.header} style={{ width: column.width ?? defaultPercentageWidth }} />
      ))}
      {hasActions && actionColumnWidth ? (
        <col style={{ width: actionColumnWidth, minWidth: actionColumnWidth }} />
      ) : null}
    </colgroup>
  );

  const tableHeader = (
    <TableHeader className={cn(stickyHeader && 'bg-muted/50 sticky top-0 z-10 backdrop-blur-sm')}>
      <TableRow>
        {columns.map((col) => (
          <TableHead
            key={col.header}
            style={{ width: col.width }}
            aria-sort={
              sortState?.key === getColumnSortKey(col)
                ? sortState.direction === 'asc'
                  ? 'ascending'
                  : 'descending'
                : undefined
            }
            className={
              col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''
            }
          >
            <SortableHeaderContent column={col} sortState={sortState} onSortChange={onSortChange} />
          </TableHead>
        ))}
        {hasActions ? (
          <TableHead
            style={
              actionColumnWidth
                ? { width: actionColumnWidth, minWidth: actionColumnWidth }
                : undefined
            }
            className="w-28 min-w-28 overflow-visible text-right whitespace-nowrap"
          >
            Actions
          </TableHead>
        ) : null}
      </TableRow>
    </TableHeader>
  );

  // Determine scrollable container styles
  const scrollContainerClass = cn(
    'min-w-0 rounded-lg border overflow-x-auto',
    fullHeight && 'flex-1 min-h-0 overflow-y-auto',
    !fullHeight && stickyHeader && 'overflow-y-auto',
  );
  const scrollContainerStyle = !fullHeight && stickyHeader ? { maxHeight } : undefined;

  if (isLoading) {
    return (
      <div className={cn('flex flex-col', fullHeight && 'min-h-0 flex-1')}>
        <div className={scrollContainerClass} style={scrollContainerStyle}>
          <Table className="table-fixed">
            {columnGroup}
            {tableHeader}
            <TableBody>
              {Array.from({ length: skeletonRows }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={col.header}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                  {hasActions ? (
                    <TableCell className={ACTION_CELL_CLASS_NAME}>
                      <div className="flex w-full justify-end">
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </TableCell>
                  ) : null}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {pagination && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            pageSize={pagination.pageSize}
            startIndex={pagination.startIndex}
            endIndex={pagination.endIndex}
            onPageChange={pagination.onPageChange}
          />
        )}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={cn('flex flex-col', fullHeight && 'min-h-0 flex-1')}>
        <div className="w-full py-0">
          {typeof resolvedNoDataContent === 'string' ? (
            <div className="text-muted-foreground">{resolvedNoDataContent}</div>
          ) : (
            resolvedNoDataContent
          )}
        </div>
        {pagination && pagination.totalItems > 0 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            pageSize={pagination.pageSize}
            startIndex={pagination.startIndex}
            endIndex={pagination.endIndex}
            onPageChange={pagination.onPageChange}
          />
        )}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col', fullHeight && 'min-h-0 flex-1')}>
      <div className={scrollContainerClass} style={scrollContainerStyle}>
        <Table className="table-fixed">
          {columnGroup}
          {tableHeader}
          <TableBody>
            {data.map((item) => (
              <TableRow
                key={getRowKey(item)}
                className={onRowClick ? 'hover:bg-muted/50 cursor-pointer' : ''}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((col) => (
                  <TableCell
                    key={col.header}
                    className={cn(
                      'max-w-0',
                      col.align === 'right'
                        ? 'text-right'
                        : col.align === 'center'
                          ? 'text-center'
                          : '',
                    )}
                  >
                    {col.truncate === false ? (
                      <div
                        className={cn(
                          'block w-full min-w-0',
                          col.align === 'right'
                            ? 'text-right'
                            : col.align === 'center'
                              ? 'text-center'
                              : 'text-left',
                        )}
                      >
                        {renderColumnValue(col, item)}
                      </div>
                    ) : (
                      <TruncatedContent align={col.align} tooltip={getColumnTooltipText(col, item)}>
                        {renderColumnValue(col, item)}
                      </TruncatedContent>
                    )}
                  </TableCell>
                ))}
                {hasActions ? (
                  <TableCell className={ACTION_CELL_CLASS_NAME}>
                    <SmartTableActions
                      item={item}
                      actions={actions}
                      actionLabels={actionLabels}
                      actionHandlers={actionHandlers}
                      renderActions={renderActions}
                    />
                  </TableCell>
                ) : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          pageSize={pagination.pageSize}
          startIndex={pagination.startIndex}
          endIndex={pagination.endIndex}
          onPageChange={pagination.onPageChange}
        />
      )}
    </div>
  );
}
