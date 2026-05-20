export interface CsvExportColumn<TRow> {
  readonly header: string;
  readonly value: (row: TRow) => string | number | boolean | null | undefined;
}

function escapeCsvCell(value: string | number | boolean | null | undefined): string {
  const text = value === null || value === undefined ? '' : String(value);

  if (!/[",\n\r]/.test(text)) {
    return text;
  }

  return `"${text.replaceAll('"', '""')}"`;
}

export function buildCsvExport<TRow>(
  rows: readonly TRow[],
  columns: readonly CsvExportColumn<TRow>[],
): string {
  const header = columns.map((column) => escapeCsvCell(column.header)).join(',');
  const body = rows.map((row) =>
    columns.map((column) => escapeCsvCell(column.value(row))).join(','),
  );

  return [header, ...body].join('\n');
}
