'use client';

import { Download, FileSpreadsheet } from 'lucide-react';
import { useMemo } from 'react';

import {
  Button,
  DisplayDate,
  FileDropzone,
  SmartTable,
  useTableSorting,
} from '@carefully-built/ui';
import type { Column } from '@carefully-built/ui';

import { EntityImportSheet } from '../entity-import-sheet';
import type { ImportPreviewRow } from '../import-types';
import type { NormalizedImportedContactRow } from './contact-import-schema';

export type ContactImportPreviewRow = ImportPreviewRow<NormalizedImportedContactRow>;

export interface ContactImportSummary {
  readonly total: number;
  readonly create: number;
  readonly update: number;
  readonly skip: number;
  readonly reject: number;
}

export function summarizeContactImportPreview(summary: ContactImportSummary) {
  return [
    { key: 'total', label: 'Totali', value: summary.total },
    { key: 'create', label: 'Nuovi', value: summary.create },
    { key: 'update', label: 'Aggiornati', value: summary.update },
    { key: 'skip', label: 'Saltati', value: summary.skip },
    { key: 'reject', label: 'Scartati', value: summary.reject },
  ] as const;
}

export function buildContactImportMutationPayload(rows: ContactImportPreviewRow[]) {
  return {
    creates: rows
      .filter(
        (row): row is ContactImportPreviewRow & {
          readonly normalized: NormalizedImportedContactRow;
        } => row.action === 'create' && row.normalized !== null,
      )
      .map((row) => row.normalized),
    updates: rows
      .filter(
        (row): row is ContactImportPreviewRow & {
          readonly normalized: NormalizedImportedContactRow;
          readonly matchedContactId: string;
        } =>
          row.action === 'update' &&
          row.normalized !== null &&
          typeof row.matchedContactId === 'string',
      )
      .map((row) => ({
        id: row.matchedContactId,
        data: row.normalized,
      })),
  };
}

function formatRoles(roles: readonly ('buyer' | 'seller')[] | undefined): string {
  if (!roles || roles.length === 0) {
    return '-';
  }

  return roles.map((role) => (role === 'buyer' ? 'Buyer' : 'Seller')).join(', ');
}

function getActionLabel(action: ContactImportPreviewRow['action']): string {
  switch (action) {
    case 'create':
      return 'Nuovo';
    case 'update':
      return 'Aggiorna';
    case 'skip':
      return 'Salta';
    case 'reject':
      return 'Scarta';
    default:
      return action;
  }
}

function getActionClassName(action: ContactImportPreviewRow['action']): string {
  switch (action) {
    case 'create':
      return 'bg-[#dffaf1] text-[#0a8f68]';
    case 'update':
      return 'bg-[#eef2ff] text-[#4338ca]';
    case 'skip':
      return 'bg-[#fff3d6] text-[#b97700]';
    case 'reject':
      return 'bg-[#fde8e8] text-[#c81e1e]';
    default:
      return 'bg-muted text-foreground';
  }
}

function defaultFormatPhoneDisplay(phone: string | undefined): string {
  return phone?.trim() || '-';
}

export interface ContactsImportSheetProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly overwriteExisting: boolean;
  readonly onOverwriteExistingChange: (value: boolean) => void;
  readonly onDownloadTemplate: () => void;
  readonly onFileSelected: (file: File) => void;
  readonly onConfirmImport: () => void;
  readonly previewSummary: ContactImportSummary | null;
  readonly fileName: string | null;
  readonly isParsing: boolean;
  readonly isImporting: boolean;
  readonly rows: ContactImportPreviewRow[];
  readonly fileError?: string | null;
  readonly formatPhoneDisplay?: (phone: string | undefined) => string;
}

export function ContactsImportSheet({
  open,
  onOpenChange,
  overwriteExisting,
  onOverwriteExistingChange,
  onDownloadTemplate,
  onFileSelected,
  onConfirmImport,
  previewSummary,
  fileName,
  isParsing,
  isImporting,
  rows,
  fileError,
  formatPhoneDisplay = defaultFormatPhoneDisplay,
}: ContactsImportSheetProps): React.ReactElement {
  const summaryItems = useMemo(
    () => (previewSummary ? summarizeContactImportPreview(previewSummary) : []),
    [previewSummary],
  );

  const columns = useMemo<Column<ContactImportPreviewRow>[]>(
    () => [
      {
        header: 'First name',
        accessor: 'normalized.firstName',
        width: '16%',
        render: (_, row) => row.normalized?.firstName ?? '-',
      },
      {
        header: 'Last name',
        accessor: 'normalized.lastName',
        width: '16%',
        render: (_, row) => row.normalized?.lastName || '-',
      },
      {
        header: 'Email',
        accessor: 'normalized.email',
        width: '20%',
        render: (_, row) => row.normalized?.email || '-',
      },
      {
        header: 'Phone',
        accessor: 'normalized.phone',
        width: '16%',
        render: (_, row) => formatPhoneDisplay(row.normalized?.phone),
      },
      {
        header: 'Roles',
        accessor: 'normalized.roles',
        width: '12%',
        render: (_, row) => formatRoles(row.normalized?.roles),
      },
      {
        header: 'Birthday',
        accessor: 'normalized.birthday',
        width: '14%',
        render: (_, row) =>
          row.normalized?.birthday ? <DisplayDate value={row.normalized.birthday} /> : '-',
      },
      {
        header: 'Esito',
        accessor: 'action',
        width: '10%',
        render: (_, row) => (
          <span
            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getActionClassName(row.action)}`}
          >
            {getActionLabel(row.action)}
          </span>
        ),
      },
      {
        header: 'Dettaglio',
        accessor: 'reason',
        width: '20%',
        render: (_, row) => row.reason || '-',
      },
    ],
    [formatPhoneDisplay],
  );
  const { sortedData, sortState, setSortState } = useTableSorting({
    data: rows,
    columns,
  });

  return (
    <EntityImportSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Importa contatti da CSV"
      confirmLabel={isImporting ? 'Importazione in corso...' : 'Importa'}
      confirmDisabled={
        isParsing ||
        isImporting ||
        !previewSummary ||
        previewSummary.create + previewSummary.update === 0
      }
      confirmLoading={isImporting}
      onConfirm={onConfirmImport}
      onCancel={() => onOpenChange(false)}
    >
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={onDownloadTemplate}>
            <Download className="size-4" />
            Scarica template CSV
          </Button>
        </div>

        <FileDropzone
          accept=".csv"
          onFileSelect={onFileSelected}
          previewAlt="File import contatti"
          title={fileName ? `File selezionato: ${fileName}` : 'Lascia qui o esplora file'}
          helperText={isParsing ? 'Parsing del file in corso...' : 'Formato supportato: .csv'}
          emptyIcon={<FileSpreadsheet className="size-8" />}
        />

        <label className="text-foreground flex items-center gap-3 text-sm font-medium">
          <input
            type="checkbox"
            checked={overwriteExisting}
            onChange={(event) => onOverwriteExistingChange(event.target.checked)}
          />
          Sovrascrivi contatti esistenti
        </label>

        {fileError ? <p className="text-destructive text-sm">{fileError}</p> : null}

        {summaryItems.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {summaryItems.map((item) => (
              <div
                key={item.key}
                className="border-border inline-flex items-center gap-2 rounded-full border px-3 py-2"
              >
                <span className="text-muted-foreground text-xs font-medium">{item.label}</span>
                <span className="text-foreground text-sm font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        ) : null}

        {rows.length > 0 ? (
          <SmartTable
            data={sortedData}
            columns={columns}
            isLoading={false}
            noDataMessage="No rows available"
            stickyHeader
            maxHeight="320px"
            sortState={sortState}
            onSortChange={setSortState}
          />
        ) : null}
      </div>
    </EntityImportSheet>
  );
}
