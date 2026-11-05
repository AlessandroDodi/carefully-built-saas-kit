import { describe, expect, test } from 'bun:test';

import { defineKitTexts, resolveKitTexts } from '../src/locale/kit-texts';
import { resolveResponsiveSheetLabels } from '../src/overlays/responsive-sheet.labels';
import { resolveUnsavedChangesDialogCopy } from '../src/overlays/unsaved-changes';
import { resolveTableToolbarLabels } from '../src/table-toolbar/table-toolbar.labels';

const texts = defineKitTexts({
  en: { save: 'Save', cancel: 'Cancel' },
  it: { save: 'Salva', cancel: 'Annulla' },
});

describe('resolveKitTexts', () => {
  test('picks the locale defaults', () => {
    expect(resolveKitTexts(texts, 'it')).toEqual({ save: 'Salva', cancel: 'Annulla' });
  });

  test('defined overrides win, undefined ones keep the default', () => {
    expect(resolveKitTexts(texts, 'it', { save: 'Conferma', cancel: undefined })).toEqual({
      save: 'Conferma',
      cancel: 'Annulla',
    });
  });
});

describe('Italian kit defaults', () => {
  test('overlay labels', () => {
    expect(resolveResponsiveSheetLabels({}, 'it')).toEqual({
      cancelLabel: 'Annulla',
      confirmLabel: 'Salva',
      confirmLoadingLabel: 'Salvataggio…',
      closeLabel: 'Chiudi',
    });
  });

  test('unsaved changes copy keeps app overrides', () => {
    const copy = resolveUnsavedChangesDialogCopy({ dirty: true, title: 'Bozza' }, 'it');
    expect(copy.title).toBe('Bozza');
    expect(copy.stayLabel).toBe('Continua a modificare');
  });

  test('table toolbar result count', () => {
    expect(resolveTableToolbarLabels({}, 'it').showResultsLabel(12000)).toBe(
      'Mostra 12.000 risultati',
    );
    expect(resolveTableToolbarLabels({}, 'en').showResultsLabel(1)).toBe('Show 1 result');
  });
});
