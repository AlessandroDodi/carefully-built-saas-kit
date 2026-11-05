'use client';

import { ResponsiveSheet, useKitTexts } from '@carefully-built/ui';
import { useState } from 'react';

import { TabularImportBody } from './tabular-import-body';
import { tabularImportTexts, type TabularImportTexts } from './tabular-import-texts';
import { useTabularImport } from './use-tabular-import';

import type { TabularImportDefinition, TabularImportPayload, TabularImportState } from './tabular-import-types';

export interface TabularImportSheetProps<TRecord extends object> {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  /** Memoize it: the preview is rebuilt whenever it changes. */
  readonly definition: TabularImportDefinition<TRecord>;
  readonly onImport: (payload: TabularImportPayload<TRecord>) => void;
  readonly importing?: boolean;
  readonly title?: string;
}

interface FooterArgs<TRecord extends object> {
  readonly state: TabularImportState<TRecord>;
  readonly texts: TabularImportTexts;
  readonly isPreviewing: boolean;
  readonly setIsPreviewing: (value: boolean) => void;
  readonly close: () => void;
  readonly onImport: (payload: TabularImportPayload<TRecord>) => void;
}

/** Footer buttons of the current step: file → mapping → preview. */
function resolveFooter<TRecord extends object>({
  state,
  texts,
  isPreviewing,
  setIsPreviewing,
  close,
  onImport,
}: FooterArgs<TRecord>): Partial<React.ComponentProps<typeof ResponsiveSheet>> {
  if (state.headers.length === 0) return { onCancel: close, cancelLabel: texts.cancelLabel };

  if (!isPreviewing) {
    return {
      onCancel: state.reset,
      cancelLabel: texts.backLabel,
      onConfirm: () => setIsPreviewing(true),
      confirmLabel: texts.continueLabel,
      confirmDisabled: state.missingRequiredLabels.length > 0,
    };
  }

  const rowsToImport = state.payload.creates.length + state.payload.updates.length;
  return {
    onCancel: () => setIsPreviewing(false),
    cancelLabel: texts.backLabel,
    onConfirm: () => onImport(state.payload),
    confirmLabel: texts.importLabel(rowsToImport),
    confirmDisabled: rowsToImport === 0,
  };
}

/**
 * Three-step import: choose a .csv/.xlsx file, match its columns to the
 * fields, check the preview and import. The host writes the payload and closes
 * the sheet; closing resets the state.
 */
export function TabularImportSheet<TRecord extends object>({
  open,
  onOpenChange,
  definition,
  onImport,
  importing = false,
  title,
}: TabularImportSheetProps<TRecord>): React.ReactElement {
  const texts = useKitTexts(tabularImportTexts, { title });
  const state = useTabularImport(definition);
  const [isPreviewing, setIsPreviewing] = useState(false);

  function handleOpenChange(nextOpen: boolean): void {
    if (!nextOpen) {
      state.reset();
      setIsPreviewing(false);
    }
    onOpenChange(nextOpen);
  }

  const footer = resolveFooter({
    state,
    texts,
    isPreviewing,
    setIsPreviewing,
    close: () => handleOpenChange(false),
    onImport,
  });

  return (
    <ResponsiveSheet
      {...footer}
      open={open}
      onOpenChange={handleOpenChange}
      title={texts.title}
      width={720}
      confirmLoading={importing}
    >
      <TabularImportBody state={state} definition={definition} texts={texts} isPreviewing={isPreviewing} />
    </ResponsiveSheet>
  );
}
