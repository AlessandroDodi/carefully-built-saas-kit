import Papa from 'papaparse';
import { readSheet } from 'read-excel-file/browser';

import type { TabularFileContent } from './tabular-import-types';

export type TabularFileErrorCode = 'unsupported-format' | 'empty' | 'unreadable';

/** A file that cannot be imported; `code` lets the UI show localized copy. */
export class TabularFileError extends Error {
  readonly code: TabularFileErrorCode;

  constructor(code: TabularFileErrorCode) {
    super(code);
    this.code = code;
  }
}

function toText(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).trim();
}

async function readCells(file: File): Promise<string[][]> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'csv') {
    // Delimiter auto-detected: Italian Excel exports use ";".
    const result = Papa.parse<string[]>(await file.text(), { skipEmptyLines: 'greedy' });
    return result.data.map((row) => row.map(toText));
  }

  if (extension === 'xlsx') {
    // parseNumber keeps numeric cells as written: phone numbers stored as
    // numbers would otherwise come back as floats.
    const sheet = await readSheet(file, { parseNumber: (text: string) => text });
    return sheet.map((row) => row.map(toText));
  }

  throw new TabularFileError('unsupported-format');
}

/** Reads the first sheet of a .csv or .xlsx file: first row = headers. */
export async function readTabularFile(file: File): Promise<TabularFileContent> {
  let cells: string[][];
  try {
    cells = await readCells(file);
  } catch (error) {
    throw error instanceof TabularFileError ? error : new TabularFileError('unreadable');
  }

  const [headerRow, ...rows] = cells;
  const dataRows = rows.filter((row) => row.some((cell) => cell.length > 0));
  if (!headerRow || dataRows.length === 0) {
    throw new TabularFileError('empty');
  }

  return { headers: headerRow, rows: dataRows };
}
