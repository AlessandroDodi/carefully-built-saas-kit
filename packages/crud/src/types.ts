import type {
  ActionHandlers,
  ActionType,
  Column,
  FilterConfig,
  SortState,
  TableToolbarLabelsInput,
} from "@carefully-built/ui";
import type { ReactNode } from "react";

import type { CrudPaginationState } from "./pagination";

export type CrudEmptyState = "initial" | "no-results";

export interface CrudFilterDefinition<TItem> {
  readonly key: Extract<keyof TItem, string>;
  readonly config: FilterConfig;
  readonly allowAll?: boolean;
  readonly allOptionLabel?: string;
  readonly clearable?: boolean;
}

export interface UseCrudTableStateOptions<TItem> {
  readonly data: readonly TItem[];
  readonly columns: readonly Column<TItem>[];
  readonly searchFields?: readonly Extract<keyof TItem, string>[];
  readonly filters?: readonly CrudFilterDefinition<TItem>[];
  readonly pageSize?: number;
  readonly initialSortState?: SortState;
}

export interface CrudTableState<TItem> {
  readonly filteredData: TItem[];
  readonly sortedData: TItem[];
  readonly paginatedData: TItem[];
  readonly search: string;
  readonly setSearch: (value: string) => void;
  readonly filters: Record<string, string>;
  readonly setFilter: (key: string, value: string) => void;
  readonly clearAll: () => void;
  readonly getDraftFilterResultCount: (
    draftValues: Record<string, string>,
  ) => number;
  readonly hasSearch: boolean;
  readonly hasFilters: boolean;
  readonly emptyState: CrudEmptyState;
  readonly sortState: SortState;
  readonly setSortState: (state: SortState) => void;
  readonly pagination: CrudPaginationState;
}

export interface CrudTableViewProps<TItem> {
  readonly state: CrudTableState<TItem>;
  readonly columns: readonly Column<TItem>[];
  readonly isLoading: boolean;
  readonly searchPlaceholder?: string;
  readonly toolbarLabels?: TableToolbarLabelsInput;
  readonly filters?: readonly CrudFilterDefinition<TItem>[];
  readonly actions?: readonly ActionType[];
  readonly actionLabels?: Partial<Record<ActionType, string>>;
  readonly actionHandlers?: ActionHandlers<TItem>;
  readonly renderActions?: (item: TItem) => ReactNode;
  readonly noDataMessage?: string;
  readonly initialEmptyContent?: ReactNode;
  readonly noResultsContent?: ReactNode;
  readonly getRowKey?: (item: TItem) => string | number;
  readonly onRowClick?: (item: TItem) => void;
  readonly renderMobileCard?: (item: TItem) => ReactNode;
  readonly stickyHeader?: boolean;
  readonly fullHeight?: boolean;
  readonly maxHeight?: string;
}

export interface CrudDataTableProps<TItem> {
  readonly data: readonly TItem[];
  readonly columns: readonly Column<TItem>[];
  readonly isLoading: boolean;
  readonly actions?: readonly ActionType[];
  readonly actionLabels?: Partial<Record<ActionType, string>>;
  readonly actionHandlers?: ActionHandlers<TItem>;
  readonly renderActions?: (item: TItem) => ReactNode;
  readonly noDataMessage?: string;
  readonly noDataContent?: ReactNode;
  readonly getRowKey?: (item: TItem) => string | number;
  readonly onRowClick?: (item: TItem) => void;
  readonly renderMobileCard?: (item: TItem) => ReactNode;
  readonly stickyHeader?: boolean;
  readonly fullHeight?: boolean;
  readonly maxHeight?: string;
  readonly sortState?: SortState;
  readonly onSortChange?: (state: SortState) => void;
  readonly pagination?: CrudPaginationState;
}
