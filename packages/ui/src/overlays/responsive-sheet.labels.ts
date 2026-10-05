import type { ReactNode } from 'react';

/**
 * Every user-visible string in the overlay family is a prop: the kit ships no
 * i18n of its own, so an app that omits one gets the English default below.
 * Keeping the defaults here (rather than inline in each component) is what lets
 * a test assert them, and `@carefully-built/ui` already follows this shape with
 * `resolveTableToolbarLabels`.
 */
export interface ResponsiveSheetLabels {
  readonly cancelLabel: ReactNode;
  readonly confirmLabel: ReactNode;
  readonly confirmLoadingLabel: ReactNode;
  readonly closeLabel: ReactNode;
}

export type ResponsiveSheetLabelsInput = Partial<ResponsiveSheetLabels>;

export function resolveResponsiveSheetLabels(
  labels: ResponsiveSheetLabelsInput = {},
): ResponsiveSheetLabels {
  return {
    cancelLabel: labels.cancelLabel ?? 'Cancel',
    confirmLabel: labels.confirmLabel ?? 'Save',
    confirmLoadingLabel: labels.confirmLoadingLabel ?? 'Saving...',
    closeLabel: labels.closeLabel ?? 'Close',
  };
}

/** Accessible name of the icon-only close button on dialogs and sheets. */
export function resolveOverlayCloseLabel(closeLabel?: ReactNode): ReactNode {
  return closeLabel ?? 'Close';
}
