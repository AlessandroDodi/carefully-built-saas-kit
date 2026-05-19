'use client';

import { DesktopView } from './DesktopView';
import { MobileView } from './MobileView';

import type { SmartTableProps } from './types';

import { cn } from '../utils/cn';
import { useIsMobile } from '../utils/use-media-query';

export function SmartTable<T>({
  data,
  columns,
  isLoading,
  skeletonRows = 5,
  actions,
  actionHandlers,
  renderActions,
  noDataMessage = 'No data available',
  noDataContent,
  getRowKey = (item) => {
    // Default: try _id, id, or index
    const record = item as Record<string, unknown>;
    if ('_id' in record) return String(record._id);
    if ('id' in record) return String(record.id);
    return data.indexOf(item);
  },
  onRowClick,
  renderMobileCard,
  pagination,
  stickyHeader,
  maxHeight,
  fullHeight,
  sortState,
  onSortChange,
}: SmartTableProps<T>): React.ReactElement {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className={cn('min-w-0', fullHeight && 'flex min-h-0 flex-1 flex-col')}>
        <MobileView
          data={data}
          columns={columns}
          isLoading={isLoading}
          skeletonRows={skeletonRows}
          actions={actions}
          actionHandlers={actionHandlers}
          renderActions={renderActions}
          noDataMessage={noDataMessage}
          noDataContent={noDataContent}
          getRowKey={getRowKey}
          onRowClick={onRowClick}
          renderMobileCard={renderMobileCard}
          pagination={pagination}
          fullHeight={fullHeight}
        />
      </div>
    );
  }

  return (
    <div className={cn('min-w-0', fullHeight && 'flex min-h-0 flex-1 flex-col')}>
      <DesktopView
        data={data}
        columns={columns}
        isLoading={isLoading}
        skeletonRows={skeletonRows}
        actions={actions}
        actionHandlers={actionHandlers}
        renderActions={renderActions}
        noDataMessage={noDataMessage}
        noDataContent={noDataContent}
        getRowKey={getRowKey}
        onRowClick={onRowClick}
        pagination={pagination}
        stickyHeader={stickyHeader}
        maxHeight={maxHeight}
        fullHeight={fullHeight}
        sortState={sortState}
        onSortChange={onSortChange}
      />
    </div>
  );
}
