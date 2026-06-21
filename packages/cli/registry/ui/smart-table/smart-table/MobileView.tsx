'use client';

import { SmartTableActions } from '@/components/ui/smart-table/SmartTableActions';
import { TruncatedContent } from '@/components/ui/smart-table/TruncatedContent';
import { getColumnTooltipText, renderColumnValue } from '@/components/ui/smart-table/utils';

import type { ActionHandlers, ActionType, Column, PaginationConfig } from '@/components/ui/smart-table/types';
import type { ReactNode } from 'react';

import { Pagination } from '@/components/ui/pagination';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface MobileViewProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading: boolean;
  skeletonRows: number;
  actions?: ActionType[];
  actionHandlers?: ActionHandlers<T>;
  renderActions?: (item: T) => ReactNode;
  noDataMessage: string;
  noDataContent?: ReactNode;
  getRowKey: (item: T) => string | number;
  onRowClick?: (item: T) => void;
  renderMobileCard?: (item: T) => ReactNode;
  pagination?: PaginationConfig;
  fullHeight?: boolean;
}

export function MobileView<T>({
  data,
  columns,
  isLoading,
  skeletonRows,
  actions,
  actionHandlers,
  renderActions,
  noDataMessage,
  noDataContent,
  getRowKey,
  onRowClick,
  renderMobileCard,
  pagination,
  fullHeight = false,
}: MobileViewProps<T>): React.ReactElement {
  const resolvedNoDataContent = noDataContent ?? noDataMessage;
  const visibleColumns = columns.filter((col) => !col.hideOnMobile);
  const hasActions = (actions?.length ?? 0) > 0 || renderActions !== undefined;

  const paginationComponent = pagination && (
    <Pagination
      currentPage={pagination.currentPage}
      totalPages={pagination.totalPages}
      totalItems={pagination.totalItems}
      pageSize={pagination.pageSize}
      startIndex={pagination.startIndex}
      endIndex={pagination.endIndex}
      onPageChange={pagination.onPageChange}
    />
  );

  if (isLoading) {
    return (
      <div className={cn('flex flex-col', fullHeight && 'flex-1 min-h-0')}>
        <div className={cn('space-y-2', fullHeight && 'flex-1 min-h-0 overflow-auto px-px')}>
          {Array.from({ length: skeletonRows }).map((_, i) => (
            <Card key={i} size="sm" className="border border-border/80 shadow-none ring-0">
              <CardContent className="px-3">
                <div className="space-y-2">
                  {visibleColumns.map((column) => (
                    <div key={column.header} className="flex items-center gap-3">
                      <Skeleton className="h-3.5 w-20 shrink-0" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                  {hasActions ? (
                    <div className="flex justify-end border-t pt-3">
                      <Skeleton className="h-8 w-24" />
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {paginationComponent}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={cn('flex flex-col', fullHeight && 'flex-1 min-h-0')}>
        <div className="w-full py-0">
          {typeof resolvedNoDataContent === 'string' ? (
            <div className="text-muted-foreground">{resolvedNoDataContent}</div>
          ) : (
            resolvedNoDataContent
          )}
        </div>
        {pagination && pagination.totalItems > 0 && paginationComponent}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col', fullHeight && 'flex-1 min-h-0')}>
      <div className={cn('space-y-2', fullHeight && 'flex-1 min-h-0 overflow-auto px-px')}>
        {data.map((item) => (
          <Card
            key={getRowKey(item)}
            size="sm"
            className={cn(
              'border border-border/80 shadow-none ring-0',
              onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''
            )}
            onClick={() => onRowClick?.(item)}
          >
            <CardContent className="px-3">
              {renderMobileCard ? (
                renderMobileCard(item)
              ) : (
                <div className="space-y-2.5">
                  {visibleColumns.map((col) => (
                    <div
                      key={col.header}
                      className="flex items-center gap-3 overflow-hidden"
                    >
                      <span className="w-20 shrink-0 truncate text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        {col.mobileLabel ?? col.header}
                      </span>
                      <div className="min-w-0 flex-1 text-sm">
                        {col.truncate === false ? (
                          <div className="block min-w-0 w-full text-right text-sm">
                            {renderColumnValue(col, item)}
                          </div>
                        ) : (
                          <TruncatedContent
                            align="right"
                            tooltip={getColumnTooltipText(col, item)}
                            className="text-sm"
                          >
                            {renderColumnValue(col, item)}
                          </TruncatedContent>
                        )}
                      </div>
                    </div>
                  ))}
                  {hasActions ? (
                    <div className="mt-3 flex justify-end border-t pt-2.5">
                      <SmartTableActions
                        item={item}
                        actions={actions}
                        actionHandlers={actionHandlers}
                        renderActions={renderActions}
                      />
                    </div>
                  ) : null}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      {paginationComponent}
    </div>
  );
}
