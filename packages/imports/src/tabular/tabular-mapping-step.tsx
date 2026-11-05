'use client';

import { Label, Switch, Table, TableBody, TableHead, TableHeader, TableRow } from '@carefully-built/ui';

import { MappingRow } from './tabular-mapping-row';

import type { TabularImportTexts } from './tabular-import-texts';
import type { TabularImportFieldFor, TabularImportState } from './tabular-import-types';

interface TabularMappingStepProps<TRecord extends object> {
  readonly state: TabularImportState<TRecord>;
  readonly fields: readonly TabularImportFieldFor<TRecord>[];
  readonly texts: TabularImportTexts;
  /** Shown only when the import can match records that already exist. */
  readonly showUpdateExisting: boolean;
}

function UpdateExistingSwitch<TRecord extends object>({
  state,
  texts,
}: Pick<TabularMappingStepProps<TRecord>, 'state' | 'texts'>): React.ReactElement {
  return (
    <div className="border-border flex items-start justify-between gap-3 rounded-lg border p-3">
      <div className="space-y-1">
        <Label htmlFor="tabular-import-update-existing">{texts.updateExistingLabel}</Label>
        <p className="text-muted-foreground text-sm">{texts.updateExistingDescription}</p>
      </div>
      <Switch
        id="tabular-import-update-existing"
        checked={state.updateExisting}
        onCheckedChange={state.setUpdateExisting}
      />
    </div>
  );
}

export function TabularMappingStep<TRecord extends object>({
  state,
  fields,
  texts,
  showUpdateExisting,
}: TabularMappingStepProps<TRecord>): React.ReactElement {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">{texts.mappingDescription}</p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{texts.columnHeader}</TableHead>
            <TableHead>{texts.sampleHeader}</TableHead>
            <TableHead className="w-48">{texts.fieldHeader}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {state.headers.map((header, columnIndex) => (
            <MappingRow
              key={`${String(columnIndex)}-${header}`}
              state={state}
              fields={fields}
              texts={texts}
              header={header}
              columnIndex={columnIndex}
            />
          ))}
        </TableBody>
      </Table>
      {state.missingRequiredLabels.length > 0 ? (
        <p className="text-destructive text-sm">
          {texts.missingRequired(state.missingRequiredLabels.join(', '))}
        </p>
      ) : null}
      {showUpdateExisting ? <UpdateExistingSwitch state={state} texts={texts} /> : null}
    </div>
  );
}
