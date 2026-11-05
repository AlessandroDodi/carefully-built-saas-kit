import { defineKitTexts, resolveKitTexts } from '../locale/kit-texts';

import type { KitLocale } from '../locale/kit-locale';
import type { ReactNode } from 'react';

/**
 * Every user-visible string in the overlay family is a prop. When the app
 * omits one, the default comes from the active kit locale (English without a
 * `KitLocaleProvider`). Keeping the defaults here, rather than inline in each
 * component, is what lets a test assert them.
 */
export interface ResponsiveSheetLabels {
  readonly cancelLabel: ReactNode;
  readonly confirmLabel: ReactNode;
  readonly confirmLoadingLabel: ReactNode;
  readonly closeLabel: ReactNode;
}

export type ResponsiveSheetLabelsInput = Partial<ResponsiveSheetLabels>;

export const responsiveSheetTexts = defineKitTexts<ResponsiveSheetLabels>({
  en: {
    cancelLabel: 'Cancel',
    confirmLabel: 'Save',
    confirmLoadingLabel: 'Saving...',
    closeLabel: 'Close',
  },
  it: {
    cancelLabel: 'Annulla',
    confirmLabel: 'Salva',
    confirmLoadingLabel: 'Salvataggio…',
    closeLabel: 'Chiudi',
  },
});

export function resolveResponsiveSheetLabels(
  labels: ResponsiveSheetLabelsInput = {},
  locale: KitLocale = 'en',
): ResponsiveSheetLabels {
  return resolveKitTexts(responsiveSheetTexts, locale, labels);
}

/** Accessible name of the icon-only close button on dialogs and sheets. */
export function resolveOverlayCloseLabel(closeLabel?: ReactNode, locale: KitLocale = 'en'): ReactNode {
  return closeLabel ?? responsiveSheetTexts[locale].closeLabel;
}
