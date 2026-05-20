import { z } from 'zod';
import type { ParsedTabularImportRow } from '../import-types';

function isValidDateParts(year: number, month: number, day: number): boolean {
  const date = new Date(year, month - 1, day);

  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function normalizeContactBirthdayInput(value: string | undefined): string | undefined {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    return undefined;
  }

  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(normalizedValue);
  const localizedMatch = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(normalizedValue);
  const year = isoMatch ? Number(isoMatch[1]) : localizedMatch ? Number(localizedMatch[3]) : NaN;
  const month = isoMatch ? Number(isoMatch[2]) : localizedMatch ? Number(localizedMatch[2]) : NaN;
  const day = isoMatch ? Number(isoMatch[3]) : localizedMatch ? Number(localizedMatch[1]) : NaN;

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day) || !isValidDateParts(year, month, day)) {
    throw new Error('Compleanno non valido');
  }

  return [
    String(year).padStart(4, '0'),
    String(month).padStart(2, '0'),
    String(day).padStart(2, '0'),
  ].join('-');
}

export const CONTACT_IMPORT_HEADERS = [
  'nome',
  'cognome',
  'email',
  'telefono',
  'ruoli',
  'note',
  'compleanno',
] as const;

const CONTACT_ROLE_LABELS = {
  Acquirente: 'buyer',
  Venditore: 'seller',
} as const;

const importedContactRowSchema = z.object({
  nome: z.string().trim().min(1, 'Il nome è obbligatorio'),
  cognome: z.string().trim().optional().default(''),
  email: z.string().trim().optional().default(''),
  telefono: z.string().trim().optional().default(''),
  ruoli: z.string().trim().min(1, 'I ruoli sono obbligatori'),
  note: z.string().trim().optional().default(''),
  compleanno: z.string().trim().optional().default(''),
});

export type ImportedContactRoles = 'buyer' | 'seller';

export interface NormalizedImportedContactRow {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly phone: string;
  readonly roles: ImportedContactRoles[];
  readonly notes: string;
  readonly birthday: string;
}

function normalizeContactImportValue(value: string): string {
  return value.trim();
}

export function parseImportedContactRoles(value: string): ImportedContactRoles[] {
  const labels = value
    .split(';')
    .map((entry) => normalizeContactImportValue(entry))
    .filter((entry) => entry.length > 0);

  const unsupportedLabels = labels.filter(
    (label) => !(label in CONTACT_ROLE_LABELS)
  );

  if (unsupportedLabels.length > 0) {
    throw new Error(`Ruoli non supportati: ${unsupportedLabels.join(', ')}`);
  }

  return Array.from(
    new Set(
      labels.map(
        (label) => CONTACT_ROLE_LABELS[label as keyof typeof CONTACT_ROLE_LABELS]
      )
    )
  ).sort();
}

export function normalizeImportedContactRow(
  row: Record<string, string>
): NormalizedImportedContactRow {
  const parsed = importedContactRowSchema.parse(row);

  return {
    firstName: parsed.nome,
    lastName: parsed.cognome || '',
    email: parsed.email || '',
    phone: parsed.telefono || '',
    roles: parseImportedContactRoles(parsed.ruoli),
    notes: parsed.note || '',
    birthday: normalizeContactBirthdayInput(parsed.compleanno) ?? '',
  };
}

export function parseImportedContactRow(
  row: Record<string, string>,
  rowNumber: number
): ParsedTabularImportRow<Record<string, string>, NormalizedImportedContactRow> {
  const safeParsed = importedContactRowSchema.safeParse(row);

  if (!safeParsed.success) {
    return {
      rowNumber,
      raw: row,
      normalized: null,
      errors: safeParsed.error.issues.map((issue) => ({
        field: issue.path[0]?.toString(),
        message: issue.message,
      })),
    };
  }

  try {
    return {
      rowNumber,
      raw: row,
      normalized: normalizeImportedContactRow(row),
      errors: [],
    };
  } catch (error) {
    return {
      rowNumber,
      raw: row,
      normalized: null,
      errors: [
        {
          message: error instanceof Error ? error.message : String(error),
        },
      ],
    };
  }
}
