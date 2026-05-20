'use client';

import { useMemo, useState } from 'react';

import { buildContactImportPreview } from './contacts/build-contact-import-preview';
import {
  CONTACT_IMPORT_HEADERS,
  parseImportedContactRow,
  type NormalizedImportedContactRow,
} from './contacts/contact-import-schema';
import { buildContactImportCsvTemplate } from './contacts/contact-import-template';
import type { ImportPreviewRow, ParsedTabularImportRow } from './import-types';
import { parseTabularImportRows } from './parse-tabular-import-file';

export interface ContactImportPreviewSummary {
  readonly total: number;
  readonly create: number;
  readonly update: number;
  readonly skip: number;
  readonly reject: number;
}

interface UseContactImportStateOptions {
  readonly existingContacts: readonly {
    readonly _id: string;
    readonly email?: string;
    readonly phone?: string;
  }[];
  readonly onErrorMessage: (error: unknown) => string;
}

export interface ContactImportState {
  readonly importFileError: string | null;
  readonly importPreviewRows: ImportPreviewRow<NormalizedImportedContactRow>[];
  readonly importPreviewSummary: ContactImportPreviewSummary | null;
  readonly isImportSheetOpen: boolean;
  readonly isParsingImportFile: boolean;
  readonly overwriteExisting: boolean;
  readonly selectedImportFileName: string | null;
  readonly closeImportSheet: () => void;
  readonly downloadCsvTemplate: () => void;
  readonly parseImportFile: (file: File) => Promise<void>;
  readonly setIsImportSheetOpen: (open: boolean) => void;
  readonly setOverwriteExisting: (value: boolean) => void;
  readonly syncImportSheetOpen: (open: boolean) => void;
}

function downloadBlob(filename: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function summarizeImportPreview(
  rows: readonly ImportPreviewRow<NormalizedImportedContactRow>[],
): ContactImportPreviewSummary | null {
  if (rows.length === 0) {
    return null;
  }

  return {
    total: rows.length,
    create: rows.filter((row) => row.action === 'create').length,
    update: rows.filter((row) => row.action === 'update').length,
    skip: rows.filter((row) => row.action === 'skip').length,
    reject: rows.filter((row) => row.action === 'reject').length,
  };
}

export function useContactImportState({
  existingContacts,
  onErrorMessage,
}: UseContactImportStateOptions): ContactImportState {
  const [isImportSheetOpen, setIsImportSheetOpen] = useState(false);
  const [selectedImportFileName, setSelectedImportFileName] = useState<string | null>(null);
  const [overwriteExisting, setOverwriteExistingState] = useState(false);
  const [isParsingImportFile, setIsParsingImportFile] = useState(false);
  const [importFileError, setImportFileError] = useState<string | null>(null);
  const [parsedImportRows, setParsedImportRows] = useState<
    ParsedTabularImportRow<Record<string, string>, NormalizedImportedContactRow>[]
  >([]);
  const [importPreviewRows, setImportPreviewRows] = useState<
    ImportPreviewRow<NormalizedImportedContactRow>[]
  >([]);
  const importPreviewSummary = useMemo(
    () => summarizeImportPreview(importPreviewRows),
    [importPreviewRows],
  );

  function resetImportState(): void {
    setSelectedImportFileName(null);
    setParsedImportRows([]);
    setImportPreviewRows([]);
    setImportFileError(null);
  }

  function rebuildImportPreview(
    rows: ParsedTabularImportRow<Record<string, string>, NormalizedImportedContactRow>[],
    nextOverwriteExisting: boolean,
  ): void {
    const preview = buildContactImportPreview({
      rows,
      existingContacts,
      overwriteExisting: nextOverwriteExisting,
    });

    setImportPreviewRows(preview.rows);
  }

  async function parseImportFile(file: File): Promise<void> {
    setSelectedImportFileName(file.name);
    setImportFileError(null);
    setIsParsingImportFile(true);

    try {
      const parsedFile = await parseTabularImportRows(file);
      const missingHeaders = CONTACT_IMPORT_HEADERS.filter(
        (header) => !parsedFile.headers.includes(header),
      );

      if (missingHeaders.length > 0) {
        throw new Error(`Intestazioni mancanti: ${missingHeaders.join(', ')}`);
      }

      const rows = parsedFile.rows.map((row, index) => parseImportedContactRow(row, index + 2));

      setParsedImportRows(rows);
      rebuildImportPreview(rows, overwriteExisting);
    } catch (error) {
      console.error(error);
      setParsedImportRows([]);
      setImportPreviewRows([]);
      setImportFileError(onErrorMessage(error));
    } finally {
      setIsParsingImportFile(false);
    }
  }

  return {
    importFileError,
    importPreviewRows,
    importPreviewSummary,
    isImportSheetOpen,
    isParsingImportFile,
    overwriteExisting,
    selectedImportFileName,
    closeImportSheet: () => {
      setIsImportSheetOpen(false);
      resetImportState();
    },
    downloadCsvTemplate: () => {
      downloadBlob(
        'template-import-contatti.csv',
        new Blob([buildContactImportCsvTemplate()], {
          type: 'text/csv;charset=utf-8',
        }),
      );
    },
    parseImportFile,
    setIsImportSheetOpen,
    setOverwriteExisting: (value) => {
      setOverwriteExistingState(value);
      rebuildImportPreview(parsedImportRows, value);
    },
    syncImportSheetOpen: (open) => {
      if (!open) {
        resetImportState();
      }

      setIsImportSheetOpen(open);
    },
  };
}
