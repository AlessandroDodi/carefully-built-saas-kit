import Papa from 'papaparse';

export interface ParsedTabularFile {
  readonly headers: string[];
  readonly rows: Record<string, string>[];
}

function normalizeHeaderValue(value: unknown): string {
  return String(value ?? '').trim().toLocaleLowerCase();
}

function parseCsvText(text: string): ParsedTabularFile {
  const result = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: normalizeHeaderValue,
    transform: (value) => value.trim(),
  });

  if (result.errors.length > 0) {
    throw new Error(`CSV non valido: ${result.errors[0]?.message ?? 'errore sconosciuto'}`);
  }

  const headers = (result.meta.fields ?? []).map(normalizeHeaderValue);

  if (headers.length === 0 || headers.every((header) => header.length === 0)) {
    throw new Error('Intestazioni non trovate nel file importato.');
  }

  return {
    headers,
    rows: result.data.map((row) =>
      headers.reduce<Record<string, string>>((accumulator, header) => {
        accumulator[header] = String(row[header] ?? '').trim();
        return accumulator;
      }, {})
    ),
  };
}

export async function parseTabularImportRows(file: File): Promise<ParsedTabularFile> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension !== 'csv') {
    throw new Error('Formato file non supportato. Usa un file .csv.');
  }

  return parseCsvText(await file.text());
}
