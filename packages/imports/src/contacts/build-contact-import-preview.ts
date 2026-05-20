import type {
  ImportPreviewRow,
  ParsedTabularImportRow,
} from '../import-types';
import type { NormalizedImportedContactRow } from './contact-import-schema';

interface ExistingContactMatch {
  readonly _id: string;
  readonly email?: string;
  readonly phone?: string;
}

export interface ContactImportPreviewResult {
  readonly summary: {
    readonly total: number;
    readonly create: number;
    readonly update: number;
    readonly skip: number;
    readonly reject: number;
  };
  readonly rows: Array<ImportPreviewRow<NormalizedImportedContactRow>>;
}

function normalizeKey(value: string | undefined): string {
  return value?.trim().toLocaleLowerCase() ?? '';
}

export function buildContactImportPreview({
  rows,
  existingContacts,
  overwriteExisting,
}: {
  readonly rows: Array<
    ParsedTabularImportRow<Record<string, string>, NormalizedImportedContactRow>
  >;
  readonly existingContacts: readonly ExistingContactMatch[];
  readonly overwriteExisting: boolean;
}): ContactImportPreviewResult {
  const previewRows = rows.map<ImportPreviewRow<NormalizedImportedContactRow>>((row) => {
    if (row.errors.length > 0 || row.normalized === null) {
      return {
        rowNumber: row.rowNumber,
        normalized: row.normalized,
        action: 'reject',
        reason: row.errors.map((error) => error.message).join('; '),
      };
    }

    const emailMatches =
      row.normalized.email.length > 0
        ? existingContacts.filter(
            (contact) =>
              normalizeKey(contact.email) === normalizeKey(row.normalized?.email)
          )
        : [];
    const phoneMatches =
      row.normalized.phone.length > 0
        ? existingContacts.filter(
            (contact) =>
              normalizeKey(contact.phone) === normalizeKey(row.normalized?.phone)
          )
        : [];

    const matchedContacts = Array.from(
      new Map(
        [...emailMatches, ...phoneMatches].map((contact) => [contact._id, contact])
      ).values()
    );

    if (matchedContacts.length > 1) {
      return {
        rowNumber: row.rowNumber,
        normalized: row.normalized,
        action: 'reject',
        reason: 'Match ambiguo: email e telefono puntano a contatti diversi',
      };
    }

    if (matchedContacts.length === 1) {
      const matchedContactId = matchedContacts[0]?._id;
      return {
        rowNumber: row.rowNumber,
        normalized: row.normalized,
        action: overwriteExisting ? 'update' : 'skip',
        reason: overwriteExisting
          ? 'Contatto esistente aggiornabile via email o telefono'
          : 'Contatto esistente trovato via email o telefono',
        matchedContactId,
      };
    }

    return {
      rowNumber: row.rowNumber,
      normalized: row.normalized,
      action: 'create',
    };
  });

  return {
    summary: {
      total: previewRows.length,
      create: previewRows.filter((row) => row.action === 'create').length,
      update: previewRows.filter((row) => row.action === 'update').length,
      skip: previewRows.filter((row) => row.action === 'skip').length,
      reject: previewRows.filter((row) => row.action === 'reject').length,
    },
    rows: previewRows,
  };
}
