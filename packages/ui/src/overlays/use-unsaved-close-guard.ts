'use client';

import { useState } from 'react';

import {
  resolveUnsavedChangesDialogCopy,
  shouldConfirmUnsavedChangesClose,
} from './unsaved-changes';

import type { ConfirmCloseWhenDirty, UnsavedChangesDialogCopy } from './unsaved-changes';

export interface UseUnsavedCloseGuardOptions {
  readonly confirmCloseWhenDirty?: ConfirmCloseWhenDirty;
  readonly onCancel?: () => void;
  readonly onOpenChange: (open: boolean) => void;
}

export interface UnsavedCloseGuardController {
  readonly copy: UnsavedChangesDialogCopy;
  readonly isDialogOpen: boolean;
  readonly requestClose: (() => void) | undefined;
  readonly handleOpenChange: (open: boolean) => void;
  readonly setIsDialogOpen: (open: boolean) => void;
  readonly discardChanges: () => void;
}

export function useUnsavedCloseGuard({
  confirmCloseWhenDirty,
  onCancel,
  onOpenChange,
}: UseUnsavedCloseGuardOptions): UnsavedCloseGuardController {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingCloseAction, setPendingCloseAction] = useState<'cancel' | 'openChange' | null>(null);
  const copy = resolveUnsavedChangesDialogCopy(confirmCloseWhenDirty);

  const queueCloseAction = (action: 'cancel' | 'openChange'): boolean => {
    if (!shouldConfirmUnsavedChangesClose({ confirmCloseWhenDirty, nextOpen: false })) {
      return false;
    }

    setPendingCloseAction(action);
    setIsDialogOpen(true);
    return true;
  };

  const requestClose = onCancel
    ? (): void => {
        if (!queueCloseAction('cancel')) {
          onCancel();
        }
      }
    : undefined;

  const handleOpenChange = (open: boolean): void => {
    if (open || !queueCloseAction('openChange')) {
      onOpenChange(open);
    }
  };

  const discardChanges = (): void => {
    if (typeof confirmCloseWhenDirty === 'object') {
      confirmCloseWhenDirty.onDiscard?.();
    }

    setIsDialogOpen(false);
    setPendingCloseAction(null);

    if (pendingCloseAction === 'cancel') {
      onCancel?.();
      return;
    }

    onOpenChange(false);
  };

  return {
    copy,
    isDialogOpen,
    requestClose,
    handleOpenChange,
    setIsDialogOpen,
    discardChanges,
  };
}
