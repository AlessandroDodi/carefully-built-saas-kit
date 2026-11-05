import { defineKitTexts, resolveKitTexts } from '../locale/kit-texts';

import type { KitLocale } from '../locale/kit-locale';
import type { ReactNode } from 'react';

export interface TableToolbarLabels {
  readonly filtersButtonLabel: string;
  readonly filtersTitle: ReactNode;
  readonly filtersDescription?: ReactNode;
  readonly clearFiltersLabel: ReactNode;
  /** Accessible name for the search field's icon-only clear control. */
  readonly clearSearchLabel: string;
  /** Accessible name of the filter sheet's close button. */
  readonly closeFiltersLabel: string;
  readonly showResultsLabel: (resultCount?: number) => ReactNode;
  readonly rangeMinPlaceholder: string;
  readonly rangeMaxPlaceholder: string;
}

export type TableToolbarLabelsInput = Partial<TableToolbarLabels>;

/** Copy of the toolbar controls that are not part of `TableToolbarLabels`. */
export interface TableToolbarControlTexts {
  readonly searchPlaceholder: string;
  readonly allOptionLabel: (label: string) => string;
  readonly searchOptionsPlaceholder: (label: string) => string;
}

function formatResults(
  resultCount: number | undefined,
  locale: string,
  one: string,
  many: string,
  fallback: string,
): string {
  if (typeof resultCount !== 'number') return fallback;
  return `${resultCount.toLocaleString(locale)} ${resultCount === 1 ? one : many}`;
}

const tableToolbarTexts = defineKitTexts<TableToolbarLabels>({
  en: {
    filtersButtonLabel: 'Filters',
    filtersTitle: 'Filters',
    filtersDescription: 'Narrow the list using the available criteria.',
    clearFiltersLabel: 'Clear',
    clearSearchLabel: 'Clear search',
    closeFiltersLabel: 'Close',
    showResultsLabel: (resultCount) =>
      typeof resultCount === 'number'
        ? `Show ${formatResults(resultCount, 'en-US', 'result', 'results', '')}`
        : 'Show results',
    rangeMinPlaceholder: 'Min',
    rangeMaxPlaceholder: 'Max',
  },
  it: {
    filtersButtonLabel: 'Filtri',
    filtersTitle: 'Filtri',
    filtersDescription: 'Restringi l’elenco con i criteri disponibili.',
    clearFiltersLabel: 'Azzera',
    clearSearchLabel: 'Cancella ricerca',
    closeFiltersLabel: 'Chiudi',
    showResultsLabel: (resultCount) =>
      typeof resultCount === 'number'
        ? `Mostra ${formatResults(resultCount, 'it-IT', 'risultato', 'risultati', '')}`
        : 'Mostra i risultati',
    rangeMinPlaceholder: 'Min',
    rangeMaxPlaceholder: 'Max',
  },
});

export const tableToolbarControlTexts = defineKitTexts<TableToolbarControlTexts>({
  en: {
    searchPlaceholder: 'Search...',
    allOptionLabel: (label) => `All: ${label}`,
    searchOptionsPlaceholder: (label) => `Search ${label.toLocaleLowerCase()}...`,
  },
  it: {
    searchPlaceholder: 'Cerca…',
    allOptionLabel: (label) => `Tutti: ${label}`,
    searchOptionsPlaceholder: (label) => `Cerca ${label.toLocaleLowerCase('it-IT')}…`,
  },
});

export function resolveTableToolbarLabels(
  labels: TableToolbarLabelsInput = {},
  locale: KitLocale = 'en',
): TableToolbarLabels {
  return resolveKitTexts(tableToolbarTexts, locale, labels);
}

export function buildAllFilterOptionLabel(
  label: string,
  allOptionLabel?: string,
  locale: KitLocale = 'en',
): string {
  return allOptionLabel ?? tableToolbarControlTexts[locale].allOptionLabel(label);
}
