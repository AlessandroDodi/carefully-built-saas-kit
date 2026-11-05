'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  TableCell,
  TableRow,
} from '@carefully-built/ui';

import type { TabularImportTexts } from './tabular-import-texts';
import type { TabularImportFieldFor, TabularImportState } from './tabular-import-types';

// Radix Select cannot hold an empty value, so "ignore" needs its own token.
const IGNORE_VALUE = '__ignore__';

export interface MappingRowProps<TRecord extends object> {
  readonly state: TabularImportState<TRecord>;
  readonly fields: readonly TabularImportFieldFor<TRecord>[];
  readonly texts: TabularImportTexts;
  readonly header: string;
  readonly columnIndex: number;
}

export function MappingRow<TRecord extends object>({
  state,
  fields,
  texts,
  header,
  columnIndex,
}: MappingRowProps<TRecord>): React.ReactElement {
  return (
    <TableRow>
      <TableCell className="font-medium">{header}</TableCell>
      <TableCell className="text-muted-foreground max-w-40 truncate">
        {state.sampleRow[columnIndex] ?? ''}
      </TableCell>
      <TableCell>
        <Select
          value={state.mapping[columnIndex] ?? IGNORE_VALUE}
          onValueChange={(value) => {
            state.setColumnField(columnIndex, value === IGNORE_VALUE ? null : value);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={IGNORE_VALUE}>{texts.ignoreOption}</SelectItem>
            {fields.map((field) => (
              <SelectItem key={field.key} value={field.key}>
                {field.required === true ? `${field.label} *` : field.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
    </TableRow>
  );
}

