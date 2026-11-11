import type { TabularImportFieldFor } from './tabular-import-types';

/**
 * A ready-to-fill .xlsx: one column per field, headed by its label (which the
 * import matches automatically), required columns marked, plus a sample row
 * from the fields' `example` values. The writer loads only on click.
 */
export async function downloadTabularTemplate<TRecord extends object>(
  fields: readonly TabularImportFieldFor<TRecord>[],
  fileName: string,
  requiredMark: string,
): Promise<void> {
  const { default: writeExcelFile } = await import('write-excel-file/browser');
  const header = fields.map((field) => ({
    value: field.required ? `${field.label} ${requiredMark}` : field.label,
    fontWeight: 'bold' as const,
  }));
  const rows = fields.some((field) => field.example) ? [fields.map((field) => field.example ?? '')] : [];
  await writeExcelFile([header, ...rows], {
    columns: fields.map((field) => ({ width: Math.max(14, field.label.length + 6, (field.example ?? '').length + 2) })),
  }).toFile(fileName);
}
