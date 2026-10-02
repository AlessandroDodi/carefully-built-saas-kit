import { describe, expect, test } from 'bun:test';

import {
  DEFAULT_UNSAVED_CHANGES_DIALOG_COPY,
  isUnsavedChangesGuardDirty,
  resolveUnsavedChangesDialogCopy,
  shouldConfirmUnsavedChangesClose,
} from '../src/overlays/unsaved-changes';

describe('isUnsavedChangesGuardDirty', () => {
  test('treats a missing guard as clean', () => {
    expect(isUnsavedChangesGuardDirty(undefined)).toBeFalse();
  });

  test('accepts the boolean shorthand', () => {
    expect(isUnsavedChangesGuardDirty(true)).toBeTrue();
    expect(isUnsavedChangesGuardDirty(false)).toBeFalse();
  });

  test('reads dirty off the object form', () => {
    expect(isUnsavedChangesGuardDirty({ dirty: true })).toBeTrue();
    expect(isUnsavedChangesGuardDirty({ dirty: false })).toBeFalse();
  });
});

describe('shouldConfirmUnsavedChangesClose', () => {
  test('only ever intercepts a close, never an open', () => {
    expect(
      shouldConfirmUnsavedChangesClose({ confirmCloseWhenDirty: true, nextOpen: true }),
    ).toBeFalse();
    expect(
      shouldConfirmUnsavedChangesClose({ confirmCloseWhenDirty: true, nextOpen: false }),
    ).toBeTrue();
  });

  test('lets a clean surface close straight through', () => {
    expect(
      shouldConfirmUnsavedChangesClose({ confirmCloseWhenDirty: { dirty: false }, nextOpen: false }),
    ).toBeFalse();
    expect(
      shouldConfirmUnsavedChangesClose({ confirmCloseWhenDirty: undefined, nextOpen: false }),
    ).toBeFalse();
  });
});

describe('resolveUnsavedChangesDialogCopy', () => {
  test('defaults every line to English', () => {
    expect(resolveUnsavedChangesDialogCopy(undefined)).toEqual({
      title: 'Unsaved changes',
      description: 'If you close now you will lose your unsaved changes.',
      discardLabel: 'Close without saving',
      stayLabel: 'Keep editing',
      closeLabel: 'Close',
    });
  });

  test('the boolean shorthand keeps the default copy', () => {
    expect(resolveUnsavedChangesDialogCopy(true)).toEqual(DEFAULT_UNSAVED_CHANGES_DIALOG_COPY);
  });

  test('overrides only what the app passes', () => {
    const copy = resolveUnsavedChangesDialogCopy({
      dirty: true,
      title: 'Modifiche non salvate',
      discardLabel: 'Chiudi senza salvare',
    });

    expect(copy.title).toBe('Modifiche non salvate');
    expect(copy.discardLabel).toBe('Chiudi senza salvare');
    expect(copy.stayLabel).toBe('Keep editing');
    expect(copy.closeLabel).toBe('Close');
  });
});
