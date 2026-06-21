import type { ReactNode } from 'react';

export type ColumnAlign = 'left' | 'center' | 'right';
export type SortDirection = 'asc' | 'desc';
export type SortValue = string | number | Date | boolean | null | undefined;
export type SortState = { key: string; direction: SortDirection } | null;

export interface Column<T> {
  /** Column header text */
  header: string;
  /** Optional label override for mobile cards */
  mobileLabel?: string;
  /** Key to access data (supports nested paths like 'user.name') */
  accessor?: keyof T | string;
  /** Column width */
  width?: string | number;
  /** Text alignment */
  align?: ColumnAlign;
  /** Custom render function */
  render?: (value: unknown, row: T) => ReactNode;
  /** Enable header sorting for this column (defaults to true when an accessor or sortKey exists) */
  sortable?: boolean;
  /** Stable sort key when the accessor is not a string */
  sortKey?: string;
  /** Custom value used for sorting */
  sortAccessor?: (row: T) => SortValue;
  /** Enable text truncation wrapper in table cells (default: true) */
  truncate?: boolean;
  /** Hide this column on mobile cards */
  hideOnMobile?: boolean;
}

export type ActionType = 'view' | 'edit' | 'delete';

export interface ActionHandlers<T> {
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

export interface PaginationConfig {
  /** Current page (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Total number of items */
  totalItems: number;
  /** Items per page */
  pageSize: number;
  /** Start index (0-indexed) */
  startIndex: number;
  /** End index (exclusive) */
  endIndex: number;
  /** Go to specific page */
  onPageChange: (page: number) => void;
}

export interface SmartTableProps<T> {
  /** Data array to display */
  data: T[];
  /** Column definitions */
  columns: Column<T>[];
  /** Loading state - shows skeletons */
  isLoading: boolean;
  /** Number of skeleton rows to show when loading */
  skeletonRows?: number;
  /** Actions to show (will render action buttons) */
  actions?: ActionType[];
  /** Action handlers */
  actionHandlers?: ActionHandlers<T>;
  /** Custom actions renderer (overrides actions prop) */
  renderActions?: (item: T) => ReactNode;
  /** Message when no data */
  noDataMessage?: string;
  /** Custom content when no data */
  noDataContent?: ReactNode;
  /** Function to get unique key for each row */
  getRowKey?: (item: T) => string | number;
  /** Make rows clickable */
  onRowClick?: (item: T) => void;
  /** Custom mobile card renderer */
  renderMobileCard?: (item: T) => ReactNode;
  /** Enable pagination */
  pagination?: PaginationConfig;
  /** Enable sticky header with scrollable body */
  stickyHeader?: boolean;
  /** Max height for scrollable table (default: 'calc(100vh - 300px)') */
  maxHeight?: string;
  /** Fill remaining height of parent container (requires parent with flex and height set) */
  fullHeight?: boolean;
  /** Active sort state for sortable columns */
  sortState?: SortState;
  /** Called when a sortable column header is selected */
  onSortChange?: (state: SortState) => void;
}
