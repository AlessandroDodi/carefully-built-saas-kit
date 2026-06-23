import { describe, expect, test } from 'bun:test';

import {
  buildAllFilterOptionLabel,
  resolveTableToolbarLabels,
} from '../src/table-toolbar/table-toolbar';

describe('buildAllFilterOptionLabel', () => {
  test('defaults all-filter labels to English', () => {
    expect(buildAllFilterOptionLabel('Contact')).toBe('All: Contact');
  });

  test('uses an app-provided localized all-filter label', () => {
    expect(buildAllFilterOptionLabel('Contact', 'Everything: Contact')).toBe('Everything: Contact');
  });

  test('resolves localized toolbar labels without losing defaults', () => {
    const labels = resolveTableToolbarLabels({
      clearFiltersLabel: 'Reset',
      filtersButtonLabel: 'Filtri',
    });

    expect(labels.clearFiltersLabel).toBe('Reset');
    expect(labels.filtersButtonLabel).toBe('Filtri');
    expect(labels.showResultsLabel(2)).toBe('Show 2 results');
  });
});
