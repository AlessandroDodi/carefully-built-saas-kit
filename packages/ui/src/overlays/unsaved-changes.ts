import { defineKitTexts, resolveKitTexts } from '../locale/kit-texts';

import type { KitLocale } from '../locale/kit-locale';
import type { ReactNode } from 'react';

/**
 * "Confirm before closing a surface with unsaved edits" guard.
 *
 * Pass `confirmCloseWhenDirty` to `ResponsiveSheet` (or anything built on it)
 * and a close attempt - Escape, an outside click, the X, or Cancel - is held
 * back and turned into a confirmation instead.
 *
 * Every line of the copy is overridable; when it is not, the default comes
 * from the active kit locale.
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

export const unsavedChangesDialogTexts = defineKitTexts<UnsavedChangesDialogCopy>({
  en: {
    title: 'Unsaved changes',
    description: 'If you close now you will lose your unsaved changes.',
    discardLabel: 'Close without saving',
    stayLabel: 'Keep editing',
    closeLabel: 'Close',
  },
  it: {
    title: 'Modifiche non salvate',
    description: 'Chiudendo ora le modifiche non salvate andranno perse.',
    discardLabel: 'Chiudi senza salvare',
    stayLabel: 'Continua a modificare',
    closeLabel: 'Chiudi',
  },
});

/** English copy, kept for apps that imported the constant directly. */
export const DEFAULT_UNSAVED_CHANGES_DIALOG_COPY: UnsavedChangesDialogCopy =
  unsavedChangesDialogTexts.en;

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
  locale: KitLocale = 'en',
): UnsavedChangesDialogCopy {
  if (!copy || typeof copy === 'boolean') {
    return unsavedChangesDialogTexts[locale];
  }

  return resolveKitTexts(unsavedChangesDialogTexts, locale, {
    title: copy.title,
    description: copy.description,
    discardLabel: copy.discardLabel,
    stayLabel: copy.stayLabel,
    closeLabel: copy.closeLabel,
  });
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
