import { describe, expect, test } from 'bun:test';

import {
  resolveOverlayCloseLabel,
  resolveResponsiveSheetLabels,
} from '../src/overlays/responsive-sheet.labels';

describe('resolveResponsiveSheetLabels', () => {
  test('defaults every footer label to English', () => {
    expect(resolveResponsiveSheetLabels()).toEqual({
      cancelLabel: 'Cancel',
      confirmLabel: 'Save',
      confirmLoadingLabel: 'Saving...',
      closeLabel: 'Close',
    });
  });

  test('uses app-provided localized labels without losing the others', () => {
    const labels = resolveResponsiveSheetLabels({
      cancelLabel: 'Annulla',
      confirmLoadingLabel: 'Salvataggio...',
    });

    expect(labels.cancelLabel).toBe('Annulla');
    expect(labels.confirmLoadingLabel).toBe('Salvataggio...');
    expect(labels.confirmLabel).toBe('Save');
    expect(labels.closeLabel).toBe('Close');
  });
});

describe('resolveOverlayCloseLabel', () => {
  test('defaults the close button accessible name to English', () => {
    expect(resolveOverlayCloseLabel()).toBe('Close');
  });

  test('uses an app-provided localized close label', () => {
    expect(resolveOverlayCloseLabel('Chiudi')).toBe('Chiudi');
  });
});
