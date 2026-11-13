'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import { defineKitTexts, useKitTexts } from '../locale/kit-texts';
import { Button } from '../primitives/button';
import { cn } from '../utils/cn';

const paginationTexts = defineKitTexts({
  en: {
    noItems: 'No items',
    showing: 'Showing',
    of: 'of',
    rows: 'Rows:',
    page: 'Page',
    firstPage: 'First page',
    previousPage: 'Previous page',
    nextPage: 'Next page',
    lastPage: 'Last page',
  },
  it: {
    noItems: 'Nessun elemento',
    showing: '',
    of: 'di',
    rows: 'Righe:',
    page: 'Pagina',
    firstPage: 'Prima pagina',
    previousPage: 'Pagina precedente',
    nextPage: 'Pagina successiva',
    lastPage: 'Ultima pagina',
  },
});

export interface PaginationProps {
  /** Current page (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Total number of items */
  totalItems: number;
  /** Items per page */
  pageSize: number;
  /** Start index of current page items (1-indexed for display) */
  startIndex: number;
  /** End index of current page items */
  endIndex: number;
  /** Go to specific page */
  onPageChange: (page: number) => void;
  /** Optional: page size options */
  pageSizeOptions?: number[];
  /** Optional: callback when page size changes */
  onPageSizeChange?: (size: number) => void;
  /** Optional: custom className */
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  startIndex,
  endIndex,
  onPageChange,
  pageSizeOptions,
  onPageSizeChange,
  className,
}: PaginationProps): React.ReactElement | null {
  if (totalPages <= 1) {
    return null;
  }

  const texts = useKitTexts(paginationTexts);
  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <div className={cn('flex items-center justify-between gap-3 py-3', className)}>
      {/* Items info */}
      <div className="text-xs text-muted-foreground">
        {totalItems === 0 ? (
          texts.noItems
        ) : (
          <>
            {texts.showing ? `${texts.showing} ` : null}
            <span className="font-medium">{startIndex + 1}</span>–<span className="font-medium">{endIndex}</span> {texts.of}{' '}
            <span className="font-medium">{totalItems}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        {/* Page size selector */}
        {pageSizeOptions && onPageSizeChange && (
          <div className="hidden items-center gap-1.5 sm:flex">
            <span className="text-xs text-muted-foreground">{texts.rows}</span>
            <select
              value={String(pageSize)}
              onChange={(event) => {
                onPageSizeChange(Number(event.target.value));
              }}
              className="border-input bg-background h-7 w-[64px] rounded-md border px-2 text-xs"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={String(size)}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Page info */}
        <div className="hidden text-xs text-muted-foreground sm:block">
          {texts.page} {currentPage} {texts.of} {totalPages}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center gap-0.5">
          <Button
            variant="outline"
            size="icon"
            className="size-7"
            onClick={() => { onPageChange(1); }}
            disabled={!hasPrevPage}
          >
            <ChevronsLeft className="size-3.5" />
            <span className="sr-only">{texts.firstPage}</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-7"
            onClick={() => { onPageChange(currentPage - 1); }}
            disabled={!hasPrevPage}
          >
            <ChevronLeft className="size-3.5" />
            <span className="sr-only">{texts.previousPage}</span>
          </Button>

          {/* Mobile page indicator */}
          <span className="px-1.5 text-xs sm:hidden">
            {currentPage}/{totalPages}
          </span>

          <Button
            variant="outline"
            size="icon"
            className="size-7"
            onClick={() => { onPageChange(currentPage + 1); }}
            disabled={!hasNextPage}
          >
            <ChevronRight className="size-3.5" />
            <span className="sr-only">{texts.nextPage}</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-7"
            onClick={() => { onPageChange(totalPages); }}
            disabled={!hasNextPage}
          >
            <ChevronsRight className="size-3.5" />
            <span className="sr-only">{texts.lastPage}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
