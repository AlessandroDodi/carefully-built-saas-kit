'use client';

import { useKitTexts } from '@carefully-built/ui';
import { useMemo, useState } from 'react';

import { buildTabularPayload, buildTabularPreview, summarizeTabularPreview } from './build-tabular-preview';
import { assignColumn, autoMapColumns, findUnmappedRequiredFields } from './match-columns';
import { readTabularFile, TabularFileError, type TabularFileErrorCode } from './read-tabular-file';
import { tabularImportTexts } from './tabular-import-texts';

import type {
  TabularFileContent,
  TabularImportDefinition,
  TabularImportMapping,
  TabularImportState,
} from './tabular-import-types';

const EMPTY_CONTENT: TabularFileContent = { headers: [], rows: [] };

interface TabularFileState {
  readonly content: TabularFileContent;
  readonly fileName: string | null;
  readonly fileError: string | null;
  readonly isParsing: boolean;
  readonly mapping: TabularImportMapping;
  readonly setMapping: (update: (current: TabularImportMapping) => TabularImportMapping) => void;
  readonly selectFile: (file: File) => Promise<void>;
  readonly reset: () => void;
}

/** Reads the chosen file and proposes the first mapping from the headers. */
function useTabularFile<TRecord extends object>(
  fields: TabularImportDefinition<TRecord>['fields'],
  fileErrors: Readonly<Record<TabularFileErrorCode, string>>,
): TabularFileState {
  const [content, setContent] = useState<TabularFileContent>(EMPTY_CONTENT);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [mapping, setMapping] = useState<TabularImportMapping>([]);

  async function selectFile(file: File): Promise<void> {
    setIsParsing(true);
    setFileError(null);
    setFileName(file.name);
    try {
      const parsed = await readTabularFile(file);
      setContent(parsed);
      setMapping(autoMapColumns(parsed.headers, fields));
    } catch (error) {
      setFileError(fileErrors[error instanceof TabularFileError ? error.code : 'unreadable']);
      setContent(EMPTY_CONTENT);
    } finally {
      setIsParsing(false);
    }
  }

  function reset(): void {
    setContent(EMPTY_CONTENT);
    setMapping([]);
    setFileName(null);
    setFileError(null);
  }

  return { content, fileName, fileError, isParsing, mapping, setMapping, selectFile, reset };
}

/**
 * State of an import: file → automatic mapping (editable) → preview rows with
 * their action → payload. Pass a memoized `definition`: the preview is rebuilt
 * whenever it changes.
 */
export function useTabularImport<TRecord extends object>(
  definition: TabularImportDefinition<TRecord>,
): TabularImportState<TRecord> {
  const texts = useKitTexts(tabularImportTexts);
  const file = useTabularFile(definition.fields, texts.fileErrors);
  const [updateExisting, setUpdateExisting] = useState(definition.updateExisting ?? true);
  const { content, mapping } = file;

  const rows = useMemo(
    () => buildTabularPreview(content, mapping, definition, updateExisting, { required: texts.required }),
    [content, mapping, definition, updateExisting, texts.required],
  );

  return {
    fileName: file.fileName,
    isParsing: file.isParsing,
    fileError: file.fileError,
    headers: content.headers,
    sampleRow: content.rows[0] ?? [],
    mapping,
    missingRequiredLabels: findUnmappedRequiredFields(mapping, definition.fields).map((field) => field.label),
    rows,
    summary: summarizeTabularPreview(rows),
    payload: buildTabularPayload(rows),
    updateExisting,
    selectFile: file.selectFile,
    setColumnField: (columnIndex, fieldKey) =>
      file.setMapping((current) => assignColumn(current, columnIndex, fieldKey)),
    setUpdateExisting,
    reset: file.reset,
  };
}
