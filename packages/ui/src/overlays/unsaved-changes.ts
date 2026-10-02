import type { ReactNode } from 'react';

/**
 * "Confirm before closing a surface with unsaved edits" guard.
 *
 * Pass `confirmCloseWhenDirty` to `ResponsiveSheet` (or anything built on it)
 * and a close attempt - Escape, an outside click, the X, or Cancel - is held
 * back and turned into a confirmation instead.
 *
 * As everywhere else in the kit, there is no i18n here: the copy below is the
 * English fallback and every line of it is overridable.
 */
export interface UnsavedChangesDialogCopy {
  readonly title: ReactNode;
  readonly description: ReactNode;
  readonly discardLabel: ReactNode;
  readonly stayLabel: ReactNode;
  readonly closeLabel: ReactNode;
}

export interface UnsavedChangesGuard {
  readonly dirty: boolean;
  readonly title?: ReactNode;
  readonly description?: ReactNode;
  readonly discardLabel?: ReactNode;
  readonly stayLabel?: ReactNode;
  readonly closeLabel?: ReactNode;
  readonly onDiscard?: () => void;
}

/** `true` guards with the default copy; an object guards and overrides copy. */
export type ConfirmCloseWhenDirty = boolean | UnsavedChangesGuard;

export const DEFAULT_UNSAVED_CHANGES_DIALOG_COPY: UnsavedChangesDialogCopy = {
  title: 'Unsaved changes',
  description: 'If you close now you will lose your unsaved changes.',
  discardLabel: 'Close without saving',
  stayLabel: 'Keep editing',
  closeLabel: 'Close',
};

export function isUnsavedChangesGuardDirty(
  confirmCloseWhenDirty: ConfirmCloseWhenDirty | undefined,
): boolean {
  if (typeof confirmCloseWhenDirty === 'boolean') {
    return confirmCloseWhenDirty;
  }

  return Boolean(confirmCloseWhenDirty?.dirty);
}

export function resolveUnsavedChangesDialogCopy(
  copy: Partial<UnsavedChangesDialogCopy> | ConfirmCloseWhenDirty | undefined,
): UnsavedChangesDialogCopy {
  if (!copy || typeof copy === 'boolean') {
    return DEFAULT_UNSAVED_CHANGES_DIALOG_COPY;
  }

  return {
    title: copy.title ?? DEFAULT_UNSAVED_CHANGES_DIALOG_COPY.title,
    description: copy.description ?? DEFAULT_UNSAVED_CHANGES_DIALOG_COPY.description,
    discardLabel: copy.discardLabel ?? DEFAULT_UNSAVED_CHANGES_DIALOG_COPY.discardLabel,
    stayLabel: copy.stayLabel ?? DEFAULT_UNSAVED_CHANGES_DIALOG_COPY.stayLabel,
    closeLabel: copy.closeLabel ?? DEFAULT_UNSAVED_CHANGES_DIALOG_COPY.closeLabel,
  };
}

export function shouldConfirmUnsavedChangesClose({
  confirmCloseWhenDirty,
  nextOpen,
}: {
  readonly confirmCloseWhenDirty: ConfirmCloseWhenDirty | undefined;
  readonly nextOpen: boolean;
}): boolean {
  return !nextOpen && isUnsavedChangesGuardDirty(confirmCloseWhenDirty);
}
