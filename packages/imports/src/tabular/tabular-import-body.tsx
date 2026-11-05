'use client';

import { FileDropzone } from '@carefully-built/ui';
import { FileSpreadsheet } from 'lucide-react';

import { TabularMappingStep } from './tabular-mapping-step';
import { TabularPreviewStep } from './tabular-preview-step';

import type { TabularImportTexts } from './tabular-import-texts';
import type { TabularImportDefinition, TabularImportState } from './tabular-import-types';

interface TabularImportBodyProps<TRecord extends object> {
  readonly state: TabularImportState<TRecord>;
  readonly definition: TabularImportDefinition<TRecord>;
  readonly texts: TabularImportTexts;
  readonly isPreviewing: boolean;
}

/** Content of the current step of `TabularImportSheet`. */
export function TabularImportBody<TRecord extends object>({
  state,
  definition,
  texts,
  isPreviewing,
}: TabularImportBodyProps<TRecord>): React.ReactElement {
  if (state.headers.length === 0) {
    return (
      <div className="space-y-2">
        <FileDropzone
          accept=".csv,.xlsx"
          title={texts.dropTitle}
          helperText={texts.dropHelper}
          previewAlt=""
          emptyIcon={<FileSpreadsheet className="size-6" />}
          disabled={state.isParsing}
          onFileSelect={(file) => void state.selectFile(file)}
        />
        {state.fileError ? <p className="text-destructive text-sm">{state.fileError}</p> : null}
      </div>
    );
  }

  if (isPreviewing) {
    return <TabularPreviewStep state={state} fields={definition.fields} texts={texts} />;
  }

  return (
    <TabularMappingStep
      state={state}
      fields={definition.fields}
      texts={texts}
      showUpdateExisting={Boolean(definition.dedupeKey && definition.existing?.size)}
    />
  );
}
