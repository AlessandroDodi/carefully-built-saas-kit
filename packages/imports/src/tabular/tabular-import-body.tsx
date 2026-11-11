'use client';

import { Button, FileDropzone } from '@carefully-built/ui';
import { Download, FileSpreadsheet } from 'lucide-react';

import { downloadTabularTemplate } from './download-tabular-template';

import { TabularMappingStep } from './tabular-mapping-step';
import { TabularPreviewStep } from './tabular-preview-step';

import type { TabularImportTexts } from './tabular-import-texts';
import type { TabularImportDefinition, TabularImportState } from './tabular-import-types';

interface TabularImportBodyProps<TRecord extends object> {
  readonly state: TabularImportState<TRecord>;
  readonly definition: TabularImportDefinition<TRecord>;
  readonly texts: TabularImportTexts;
  readonly isPreviewing: boolean;
  readonly fileStepExtra?: React.ReactNode;
}

/** Content of the current step of `TabularImportSheet`. */
export function TabularImportBody<TRecord extends object>({
  state,
  definition,
  texts,
  isPreviewing,
  fileStepExtra,
}: TabularImportBodyProps<TRecord>): React.ReactElement {
  if (state.headers.length === 0) {
    return (
      <div className="space-y-3">
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
        <div className="border-border flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3">
          <p className="text-muted-foreground min-w-0 flex-1 text-sm">{texts.templateHelper}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              void downloadTabularTemplate(
                definition.fields,
                definition.templateFileName ?? texts.templateFileName,
                texts.requiredMark,
              )
            }
          >
            <Download className="size-4" />
            {texts.templateLabel}
          </Button>
        </div>
        {fileStepExtra}
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
