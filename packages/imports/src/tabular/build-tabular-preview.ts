import type { TabularImportError } from '../import-types';
import type {
  TabularFileContent,
  TabularImportDefinition,
  TabularImportFieldFor,
  TabularImportMapping,
  TabularImportPayload,
  TabularImportPreviewRow,
  TabularImportSummary,
} from './tabular-import-types';

export interface TabularPreviewMessages {
  readonly required: (fieldLabel: string) => string;
}

interface NormalizedRow<TRecord extends object> {
  readonly record: TRecord | null;
  readonly errors: TabularImportError[];
}

/**
 * Turns one row of cells into the host's record. Empty optional cells are left
 * out of the record; fields without `normalize` get the trimmed text.
 */
function normalizeRow<TRecord extends object>(
  cells: readonly string[],
  mapping: TabularImportMapping,
  fields: readonly TabularImportFieldFor<TRecord>[],
  messages: TabularPreviewMessages,
): NormalizedRow<TRecord> {
  const record: Record<string, unknown> = {};
  const errors: TabularImportError[] = [];

  for (const field of fields) {
    const columnIndex = mapping.indexOf(field.key);
    const raw = columnIndex >= 0 ? (cells[columnIndex] ?? '').trim() : '';
    if (!raw) {
      if (field.required === true) errors.push({ field: field.key, message: messages.required(field.label) });
      continue;
    }
    const result = field.normalize ? field.normalize(raw) : { value: raw };
    if ('error' in result) errors.push({ field: field.key, message: result.error });
    else record[field.key] = result.value;
  }

  return errors.length > 0 ? { record: null, errors } : { record: record as TRecord, errors };
}

/** Decides create / update / skip for a valid record, tracking values seen in the file. */
function classifyRecord<TRecord extends object>(
  record: TRecord,
  definition: TabularImportDefinition<TRecord>,
  updateExisting: boolean,
  seen: Set<string>,
): Pick<TabularImportPreviewRow<TRecord>, 'action' | 'skipReason' | 'existingId'> {
  if (!definition.dedupeKey) return { action: 'create' };

  const raw: unknown = record[definition.dedupeKey];
  const value = typeof raw === 'string' || typeof raw === 'number' ? String(raw) : '';
  if (!value) return { action: 'create' };
  if (seen.has(value)) return { action: 'skip', skipReason: 'duplicate-in-file' };
  seen.add(value);

  const existingId = definition.existing?.get(value);
  if (!existingId) return { action: 'create' };
  return updateExisting
    ? { action: 'update', existingId }
    : { action: 'skip', skipReason: 'existing', existingId };
}

export function buildTabularPreview<TRecord extends object>(
  content: TabularFileContent,
  mapping: TabularImportMapping,
  definition: TabularImportDefinition<TRecord>,
  updateExisting: boolean,
  messages: TabularPreviewMessages,
): TabularImportPreviewRow<TRecord>[] {
  const seen = new Set<string>();

  return content.rows.map((cells, index) => {
    const rowNumber = index + 2;
    const { record, errors } = normalizeRow(cells, mapping, definition.fields, messages);
    if (!record) return { rowNumber, action: 'reject', record: null, errors };
    return { rowNumber, record, errors, ...classifyRecord(record, definition, updateExisting, seen) };
  });
}

export function summarizeTabularPreview<TRecord extends object>(
  rows: readonly TabularImportPreviewRow<TRecord>[],
): TabularImportSummary {
  const summary = { create: 0, update: 0, skip: 0, reject: 0 };
  for (const row of rows) summary[row.action] += 1;
  return summary;
}

/** What the host writes: new records, and updates keyed by the existing id. */
export function buildTabularPayload<TRecord extends object>(
  rows: readonly TabularImportPreviewRow<TRecord>[],
): TabularImportPayload<TRecord> {
  const creates: TRecord[] = [];
  const updates: { id: string; record: TRecord }[] = [];

  for (const row of rows) {
    if (!row.record) continue;
    if (row.action === 'create') creates.push(row.record);
    if (row.action === 'update' && row.existingId) updates.push({ id: row.existingId, record: row.record });
  }

  return { creates, updates };
}
