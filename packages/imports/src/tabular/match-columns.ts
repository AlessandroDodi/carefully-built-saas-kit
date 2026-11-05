import type { TabularImportFieldFor, TabularImportMapping } from './tabular-import-types';

/** "Cellulare (WhatsApp)" and "cellulare whatsapp" compare equal. */
export function normalizeHeader(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/**
 * First guess of the mapping: a column goes to the field whose key, label or
 * alias matches its header. A field is assigned to one column at most.
 */
export function autoMapColumns<TRecord extends object>(
  headers: readonly string[],
  fields: readonly TabularImportFieldFor<TRecord>[],
): TabularImportMapping {
  const used = new Set<string>();

  return headers.map((header) => {
    const normalized = normalizeHeader(header);
    const match = fields.find(
      (field) =>
        !used.has(field.key) &&
        [field.key, field.label, ...(field.aliases ?? [])].some(
          (candidate) => normalizeHeader(candidate) === normalized,
        ),
    );
    if (!match) return null;
    used.add(match.key);
    return match.key;
  });
}

/** Assigns a field to a column, taking it away from any other column first. */
export function assignColumn(
  mapping: TabularImportMapping,
  columnIndex: number,
  fieldKey: string | null,
): TabularImportMapping {
  return mapping.map((current, index) => {
    if (index === columnIndex) return fieldKey;
    return fieldKey !== null && current === fieldKey ? null : current;
  });
}

/** Required fields that no column feeds yet: the import cannot proceed. */
export function findUnmappedRequiredFields<TRecord extends object>(
  mapping: TabularImportMapping,
  fields: readonly TabularImportFieldFor<TRecord>[],
): TabularImportFieldFor<TRecord>[] {
  return fields.filter((field) => field.required === true && !mapping.includes(field.key));
}
