'use client';

import { Copy, Link2, Upload } from 'lucide-react';
import { z } from 'zod';

import { CustomForm, CustomInputField } from '@carefully-built/forms';
import { Button, FileDropzone, cn } from '@carefully-built/ui';

export const documentFormSchema = z.object({
  mode: z.enum(['manual', 'link']),
  title: z.string().trim().min(1, 'Il nome del documento e obbligatorio'),
  associations: z.array(z.string()),
  tagIds: z.array(z.string()),
});

export type DocumentFormValues = z.infer<typeof documentFormSchema>;

const modeOptions = [
  { value: 'manual', label: 'Aggiunta manuale' },
  { value: 'link', label: 'Aggiunta con Link' },
] as const;

interface DocumentFormShellProps {
  readonly defaultValues?: Partial<DocumentFormValues>;
  readonly selectedFile: File | null;
  readonly filePreviewUrl: string | null;
  readonly publicUploadUrl: string;
  readonly variant?: 'create' | 'edit';
  readonly formId?: string;
  readonly renderAssociationField: () => React.ReactNode;
  readonly renderTagField: () => React.ReactNode;
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
  onFileSelect,
  onSubmit,
  onCopyLinkPreview,
}: DocumentFormShellProps): React.ReactElement {
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
                      {option.label}
                    </Button>
                  );
                })}
              </div>
            ) : null}

            <CustomInputField<DocumentFormValues>
              name="title"
              label="Nome documento"
              placeholder="Nome documento"
            />

            {renderAssociationField()}
            {renderTagField()}

            {isEdit ? null : mode === 'manual' ? (
              <div className="space-y-2">
                <FileDropzone
                  accept=".pdf,image/*"
                  title="Lascia qui o esplora file"
                  helperText="Formati: PDF, JPG, PNG"
                  browseLabel="Esplora"
                  currentPreviewUrl={
                    selectedFile?.type.startsWith('image/') ? filePreviewUrl : null
                  }
                  emptyIcon={<Upload className="size-6" />}
                  previewAlt={selectedFile?.name ?? 'Anteprima documento'}
                  onFileSelect={onFileSelect}
                />
                {selectedFile ? (
                  <p className="text-muted-foreground text-xs">
                    File selezionato: {selectedFile.name}
                  </p>
                ) : null}
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
                    Il link diventera attivo dopo aver cliccato Aggiungi. A quel
                    punto verra copiato automaticamente e aprira la pagina con il
                    dropzone pubblico.
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
