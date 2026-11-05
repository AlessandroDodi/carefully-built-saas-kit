'use client';

import { Chip, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, cn } from '@carefully-built/ui';

import type { TabularImportAction } from '../import-types';
import type { TabularImportTexts } from './tabular-import-texts';
import type { TabularImportFieldFor, TabularImportPreviewRow, TabularImportState } from './tabular-import-types';

// Enough to spot problems; the import itself always covers every row.
const PREVIEW_LIMIT = 50;
const ACTIONS: readonly TabularImportAction[] = ['create', 'update', 'skip', 'reject'];

interface TabularPreviewStepProps<TRecord extends object> {
  readonly state: TabularImportState<TRecord>;
  readonly fields: readonly TabularImportFieldFor<TRecord>[];
  readonly texts: TabularImportTexts;
}

function describeRow<TRecord extends object>(
  row: TabularImportPreviewRow<TRecord>,
  texts: TabularImportTexts,
): string {
  if (row.errors.length > 0) return row.errors.map((error) => error.message).join(' · ');
  return row.skipReason ? texts.skipReasons[row.skipReason] : '';
}

function formatCell(value: unknown): string {
  return typeof value === 'string' || typeof value === 'number' ? String(value) : '';
}

export function TabularPreviewStep<TRecord extends object>({
  state,
  fields,
  texts,
}: TabularPreviewStepProps<TRecord>): React.ReactElement {
  const mappedFields = fields.filter((field) => state.mapping.includes(field.key));
  const visibleRows = state.rows.slice(0, PREVIEW_LIMIT);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {ACTIONS.map((action) => (
          <Chip key={action}>{`${texts.summary[action]}: ${String(state.summary[action])}`}</Chip>
        ))}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-14">{texts.rowHeader}</TableHead>
            {mappedFields.map((field) => (
              <TableHead key={field.key}>{field.label}</TableHead>
            ))}
            <TableHead>{texts.statusHeader}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visibleRows.map((row) => (
            <TableRow key={row.rowNumber}>
              <TableCell className="text-muted-foreground">{row.rowNumber}</TableCell>
              {mappedFields.map((field) => (
                <TableCell key={field.key} className="max-w-40 truncate">
                  {formatCell(row.record?.[field.key])}
                </TableCell>
              ))}
              <TableCell className="space-y-1">
                <Chip className={cn(row.action === 'reject' && 'text-destructive')}>
                  {texts.actions[row.action]}
                </Chip>
                <p className="text-muted-foreground text-xs">{describeRow(row, texts)}</p>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {state.rows.length > PREVIEW_LIMIT ? (
        <p className="text-muted-foreground text-xs">
          {texts.previewLimit(PREVIEW_LIMIT, state.rows.length)}
        </p>
      ) : null}
    </div>
  );
}
