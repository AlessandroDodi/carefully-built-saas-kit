'use client';

import { Copy, Link2, Upload } from 'lucide-react';
import { z } from 'zod';

import { CustomForm, CustomInputField } from '@carefully-built/forms';
import { Button, FileDropzone, cn } from '@carefully-built/ui';

export const documentFormSchema = z.object({
  mode: z.enum(['manual', 'link']),
  title: z.string().trim().min(1, 'Document name is required'),
  associations: z.array(z.string()),
  tagIds: z.array(z.string()),
});

export type DocumentFormValues = z.infer<typeof documentFormSchema>;

const modeOptions = [
  { value: 'manual', label: 'Manual upload' },
  { value: 'link', label: 'Upload link' },
] as const;

export interface DocumentFormShellLabels {
  readonly manualModeLabel: string;
  readonly linkModeLabel: string;
  readonly titleLabel: string;
  readonly titlePlaceholder: string;
  readonly dropzoneTitle: string;
  readonly dropzoneHelperText: string;
  readonly browseLabel: string;
  readonly documentPreviewAlt: string;
  readonly linkInfo: React.ReactNode;
}

export type DocumentFormShellLabelsInput = Partial<DocumentFormShellLabels>;

function resolveDocumentFormShellLabels(
  labels: DocumentFormShellLabelsInput = {},
): DocumentFormShellLabels {
  return {
    manualModeLabel: labels.manualModeLabel ?? 'Manual upload',
    linkModeLabel: labels.linkModeLabel ?? 'Upload link',
    titleLabel: labels.titleLabel ?? 'Document name',
    titlePlaceholder: labels.titlePlaceholder ?? 'Document name',
    dropzoneTitle: labels.dropzoneTitle ?? 'Drop a file here or browse',
    dropzoneHelperText: labels.dropzoneHelperText ?? 'Formats: PDF, JPG, PNG',
    browseLabel: labels.browseLabel ?? 'Browse',
    documentPreviewAlt: labels.documentPreviewAlt ?? 'Document preview',
    linkInfo:
      labels.linkInfo ??
      'The link becomes active after you click Add. It will be copied automatically and will open the public dropzone page.',
  };
}

interface DocumentFormShellProps {
  readonly defaultValues?: Partial<DocumentFormValues>;
  readonly selectedFile: File | null;
  readonly filePreviewUrl: string | null;
  readonly publicUploadUrl: string;
  readonly variant?: 'create' | 'edit';
  readonly formId?: string;
  readonly renderAssociationField: () => React.ReactNode;
  readonly renderTagField: () => React.ReactNode;
  readonly labels?: DocumentFormShellLabelsInput;
  readonly onFileSelect: (file: File) => void;
  readonly onSubmit: (data: DocumentFormValues) => void;
  readonly onCopyLinkPreview: () => void;
}

export function DocumentFormShell({
  defaultValues,
  selectedFile,
  filePreviewUrl,
  publicUploadUrl,
  variant = 'create',
  formId = 'document-form',
  renderAssociationField,
  renderTagField,
  labels,
  onFileSelect,
  onSubmit,
  onCopyLinkPreview,
}: DocumentFormShellProps): React.ReactElement {
  const resolvedLabels = resolveDocumentFormShellLabels(labels);
  const initialValues: DocumentFormValues = {
    mode: defaultValues?.mode ?? 'manual',
    title: defaultValues?.title ?? '',
    associations: defaultValues?.associations ?? [],
    tagIds: defaultValues?.tagIds ?? [],
  };

  return (
    <CustomForm
      id={formId}
      schema={documentFormSchema}
      defaultValues={initialValues}
      onSubmit={onSubmit}
      className="flex flex-col"
    >
      {(methods) => {
        const mode = methods.watch('mode');
        const isEdit = variant === 'edit';

        return (
          <div className="space-y-6 pb-4">
            {!isEdit ? (
              <div className="flex flex-wrap gap-2">
                {modeOptions.map((option) => {
                  const isActive = mode === option.value;
                  const optionLabel =
                    option.value === 'manual'
                      ? resolvedLabels.manualModeLabel
                      : resolvedLabels.linkModeLabel;
                  return (
                    <Button
                      key={option.value}
                      type="button"
                      variant={isActive ? 'outline' : 'ghost'}
                      className={cn(
                        'h-8 rounded-lg px-3',
                        isActive && 'bg-muted text-foreground',
                      )}
                      onClick={() => {
                        methods.setValue('mode', option.value);
                      }}
                    >
                      {optionLabel}
                    </Button>
                  );
                })}
              </div>
            ) : null}

            <CustomInputField<DocumentFormValues>
              name="title"
              label={resolvedLabels.titleLabel}
              placeholder={resolvedLabels.titlePlaceholder}
            />

            {renderAssociationField()}
            {renderTagField()}

            {isEdit ? null : mode === 'manual' ? (
              <div className="space-y-2">
                <FileDropzone
                  accept=".pdf,image/*"
                  title={resolvedLabels.dropzoneTitle}
                  helperText={resolvedLabels.dropzoneHelperText}
                  browseLabel={resolvedLabels.browseLabel}
                  currentPreviewUrl={
                    selectedFile?.type.startsWith('image/') ? filePreviewUrl : null
                  }
                  emptyIcon={<Upload className="size-6" />}
                  previewAlt={selectedFile?.name ?? resolvedLabels.documentPreviewAlt}
                  onFileSelect={onFileSelect}
                />
              </div>
            ) : (
              <div className="space-y-3 rounded-lg border p-3">
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1 rounded-md border bg-background px-3 py-2 text-sm">
                    <p className="break-all">{publicUploadUrl}</p>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="shrink-0"
                    onClick={onCopyLinkPreview}
                  >
                    <Copy className="size-4" />
                  </Button>
                </div>
                <div className="flex items-start gap-2 rounded-lg bg-primary/10 px-3 py-2 text-xs text-primary">
                  <Link2 className="mt-0.5 size-4 shrink-0" />
                  <p>
                    {resolvedLabels.linkInfo}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      }}
    </CustomForm>
  );
}
