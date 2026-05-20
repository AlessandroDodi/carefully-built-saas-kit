'use client';

import { useCallback, useMemo, useState } from 'react';

export type ResourceId = string | number;

export interface UseResourceSheetStateOptions<TItem, TId extends ResourceId = ResourceId> {
  readonly items: readonly TItem[];
  readonly getItemId: (item: TItem) => TId;
  readonly isSameId?: (left: TId, right: TId) => boolean;
}

export interface ResourceSheetState<TItem, TId extends ResourceId = ResourceId> {
  readonly isOpen: boolean;
  readonly editingId: TId | null;
  readonly editingItem: TItem | null;
  readonly setOpen: (open: boolean) => void;
  readonly setEditingId: (id: TId | null) => void;
  readonly openCreate: () => void;
  readonly openEdit: (id: TId) => void;
  readonly close: () => void;
  readonly syncOpen: (open: boolean) => void;
}

export function useResourceSheetState<TItem, TId extends ResourceId = ResourceId>({
  items,
  getItemId,
  isSameId,
}: UseResourceSheetStateOptions<TItem, TId>): ResourceSheetState<TItem, TId> {
  const [isOpen, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<TId | null>(null);
  const compareIds = useMemo(
    () => isSameId ?? ((left: TId, right: TId) => Object.is(left, right)),
    [isSameId],
  );

  const editingItem = useMemo(() => {
    if (editingId === null) {
      return null;
    }

    return items.find((item) => compareIds(getItemId(item), editingId)) ?? null;
  }, [compareIds, editingId, getItemId, items]);

  const close = useCallback(() => {
    setEditingId(null);
    setOpen(false);
  }, []);

  const openCreate = useCallback(() => {
    setEditingId(null);
    setOpen(true);
  }, []);

  const openEdit = useCallback((id: TId) => {
    setEditingId(id);
    setOpen(true);
  }, []);

  const syncOpen = useCallback((open: boolean) => {
    if (!open) {
      setEditingId(null);
    }

    setOpen(open);
  }, []);

  return {
    isOpen,
    editingId,
    editingItem,
    setOpen,
    setEditingId,
    openCreate,
    openEdit,
    close,
    syncOpen,
  };
}
