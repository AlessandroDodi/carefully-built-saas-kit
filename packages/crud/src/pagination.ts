export interface CrudPaginationState {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly totalItems: number;
  readonly pageSize: number;
  readonly startIndex: number;
  readonly endIndex: number;
  readonly onPageChange: (page: number) => void;
}

export function getValidPage(page: number, totalPages: number): number {
  return Math.min(Math.max(1, page), totalPages);
}

export function paginateCrudData<T>(
  data: readonly T[],
  currentPage: number,
  pageSize: number,
): T[] {
  const startIndex = (currentPage - 1) * pageSize;
  return data.slice(startIndex, startIndex + pageSize);
}
