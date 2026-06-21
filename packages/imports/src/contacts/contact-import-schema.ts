import type { ParsedTabularImportRow } from '../import-types';
import { z } from 'zod';

export const CONTACT_IMPORT_HEADERS = [
  'name',
  'company',
  'email',
  'phone',
  'role',
  'owner',
  'status',
  'value',
  'notes',
] as const;

const CONTACT_STATUS_VALUES = ['new', 'qualified', 'proposal', 'customer'] as const;

const importedContactRowSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  company: z.string().trim().min(1, 'Company is required'),
  email: z.string().trim().optional().default(''),
  phone: z.string().trim().optional().default(''),
  role: z.string().trim().optional().default(''),
  owner: z.string().trim().optional().default(''),
  status: z.string().trim().optional().default('new'),
  value: z.string().trim().optional().default(''),
  notes: z.string().trim().optional().default(''),
});

export type ImportedContactStatus = (typeof CONTACT_STATUS_VALUES)[number];

export interface NormalizedImportedContactRow {
  readonly name: string;
  readonly company: string;
  readonly email: string;
  readonly phone: string;
  readonly role: string;
  readonly owner: string;
  readonly status: ImportedContactStatus;
  readonly value?: number;
  readonly notes: string;
}

function normalizeContactImportValue(value: string): string {
  return value.trim();
}

function normalizeStatus(value: string): ImportedContactStatus {
  const normalizedStatus = normalizeContactImportValue(value).toLowerCase().replace(/\s+/g, '_');

  if (!normalizedStatus) {
    return 'new';
  }

  if (!CONTACT_STATUS_VALUES.includes(normalizedStatus as ImportedContactStatus)) {
    throw new Error(`Unsupported status: ${value}`);
  }

  return normalizedStatus as ImportedContactStatus;
}

function normalizeValue(value: string): number | undefined {
  const normalizedValue = normalizeContactImportValue(value).replaceAll(',', '');
  if (!normalizedValue) {
    return undefined;
  }

  const parsedValue = Number(normalizedValue);
  if (!Number.isFinite(parsedValue)) {
    throw new Error(`Invalid value: ${value}`);
  }

  return parsedValue;
}

export function normalizeImportedContactRow(
  row: Record<string, string>
): NormalizedImportedContactRow {
  const parsed = importedContactRowSchema.parse(row);

  return {
    name: parsed.name,
    company: parsed.company,
    email: parsed.email || '',
    phone: parsed.phone || '',
    role: parsed.role || '',
    owner: parsed.owner || '',
    status: normalizeStatus(parsed.status),
    value: normalizeValue(parsed.value),
    notes: parsed.notes || '',
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
