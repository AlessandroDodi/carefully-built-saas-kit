'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import {
  buildDocumentAssociationValue,
  mapAssociationValuesToDocumentAssociations,
  mapAssociationValuesToDocumentPayload,
} from './document-helpers';
import { DocumentFormShell, type DocumentFormValues } from './document-form-shell';

import { ResponsiveSheet } from '@carefully-built/ui';

export interface DocumentSheetAssociationOption {
  readonly entityId: string;
  readonly entityType: string;
  readonly label: string;
  readonly value: string;
}

export interface DocumentSheetDocument<TId = string, TTagId = string> {
  readonly _id: TId;
  readonly associationId?: string | null;
  readonly associationLabel?: string | null;
  readonly associationType?: string | null;
  readonly associations?: readonly { readonly value: string }[];
  readonly sourceType: 'external_link' | string;
  readonly tagIds?: readonly TTagId[];
  readonly title?: string | null;
}

export interface DocumentSheetBaseProps<TUserId, TDocumentId = string, TTagId = string> {
  readonly associationOptions: readonly DocumentSheetAssociationOption[];
  readonly buildClientToken?: () => string;
  readonly buildPublicOrigin: () => string;
  readonly createManualDocument: (payload: {
    readonly associationId?: string;
    readonly associationLabel?: string;
    readonly associationType?: string;
    readonly associations: readonly { readonly entityType: string; readonly entityId: string }[];
    readonly currentUserId: TUserId;
    readonly fileName: string;
    readonly mimeType: string;
    readonly organizationId: string;
    readonly size: number;
    readonly storageId: string;
    readonly tagIds: readonly TTagId[];
    readonly title: string;
  }) => Promise<unknown>;
  readonly createPublicRequest: (payload: {
    readonly associationId?: string;
    readonly associationLabel?: string;
    readonly associationType?: string;
    readonly associations: readonly { readonly entityType: string; readonly entityId: string }[];
    readonly currentUserId: TUserId;
    readonly organizationId: string;
    readonly publicOrigin: string;
    readonly tagIds: readonly TTagId[];
    readonly title: string;
    readonly token: string;
  }) => Promise<unknown>;
  readonly currentUserId: TUserId | null | undefined;
  readonly defaultAssociations?: readonly string[];
  readonly document?: DocumentSheetDocument<TDocumentId, TTagId> | null;
  readonly generateUploadUrl: () => Promise<string>;
  readonly mode?: 'create' | 'edit';
  readonly onOpenChange: (open: boolean) => void;
  readonly open: boolean;
  readonly organizationId: string | null | undefined;
  readonly renderAssociationField: () => React.ReactNode;
  readonly renderTagField: () => React.ReactNode;
  readonly updateDocument: (payload: {
    readonly id: TDocumentId;
    readonly associationId?: string;
    readonly associationLabel?: string;
    readonly associationType?: string;
    readonly associations: readonly { readonly entityType: string; readonly entityId: string }[];
    readonly currentUserId: TUserId;
    readonly organizationId: string;
    readonly tagIds: readonly TTagId[];
    readonly title: string;
  }) => Promise<unknown>;
  readonly uploadFileToStorage: (payload: {
    readonly file: File;
    readonly generateUploadUrl: () => Promise<string>;
  }) => Promise<string>;
  readonly labels?: DocumentSheetLabelsInput;
}

export interface DocumentSheetLabels {
  readonly addTitle: string;
  readonly editTitle: string;
  readonly addConfirmLabel: string;
  readonly editConfirmLabel: string;
  readonly organizationUnavailableError: string;
  readonly documentUnavailableError: string;
  readonly documentUpdatedSuccess: string;
  readonly selectFileError: string;
  readonly documentAddedSuccess: string;
  readonly linkCreatedSuccess: string;
  readonly saveError: string;
  readonly linkCopiedSuccess: string;
  readonly linkCopyError: string;
}

export type DocumentSheetLabelsInput = Partial<DocumentSheetLabels>;

function resolveDocumentSheetLabels(labels: DocumentSheetLabelsInput = {}): DocumentSheetLabels {
  return {
    addTitle: labels.addTitle ?? 'Add document',
    editTitle: labels.editTitle ?? 'Edit document',
    addConfirmLabel: labels.addConfirmLabel ?? 'Add',
    editConfirmLabel: labels.editConfirmLabel ?? 'Save',
    organizationUnavailableError: labels.organizationUnavailableError ?? 'Organization context is not available',
    documentUnavailableError: labels.documentUnavailableError ?? 'Document is not available',
    documentUpdatedSuccess: labels.documentUpdatedSuccess ?? 'Document updated',
    selectFileError: labels.selectFileError ?? 'Select a file before continuing',
    documentAddedSuccess: labels.documentAddedSuccess ?? 'Document added',
    linkCreatedSuccess: labels.linkCreatedSuccess ?? 'Link created and copied',
    saveError: labels.saveError ?? 'Something went wrong while saving.',
    linkCopiedSuccess: labels.linkCopiedSuccess ?? 'Link copied. Save the document to activate it.',
    linkCopyError: labels.linkCopyError ?? 'Could not copy the link.',
  };
}

function buildDefaultClientToken(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function submitDocumentForm(): void {
  const form = document.getElementById('document-form');
  if (form instanceof HTMLFormElement) {
    form.requestSubmit();
  }
}

export function DocumentSheetBase<TUserId, TDocumentId = string, TTagId = string>({
  associationOptions,
  buildClientToken = buildDefaultClientToken,
  buildPublicOrigin,
  createManualDocument,
  createPublicRequest,
  currentUserId,
  defaultAssociations,
  document,
  generateUploadUrl,
  mode = 'create',
  onOpenChange,
  open,
  organizationId,
  renderAssociationField,
  renderTagField,
  updateDocument,
  uploadFileToStorage,
  labels,
}: DocumentSheetBaseProps<TUserId, TDocumentId, TTagId>): React.ReactElement {
  const resolvedLabels = resolveDocumentSheetLabels(labels);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publicToken, setPublicToken] = useState(buildClientToken());

  useEffect(() => {
    if (!selectedFile?.type.startsWith('image/')) {
      setFilePreviewUrl(null);
      return undefined;
    }

    const previewUrl = URL.createObjectURL(selectedFile);
    setFilePreviewUrl(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [selectedFile]);

  useEffect(() => {
    if (open) {
      setPublicToken(buildClientToken());
      setSelectedFile(null);
    }
  }, [buildClientToken, open]);

  const publicOrigin = buildPublicOrigin();
  const publicUploadUrl = `${publicOrigin}/documents/link/${publicToken}`;
  const isEditMode = mode === 'edit';
  const documentAssociations = document?.associations ?? [];
  const defaultAssociationValue = document
    ? buildDocumentAssociationValue(document.associationType, document.associationId)
    : null;
  const defaultValues: Partial<DocumentFormValues> | undefined = isEditMode
    ? {
        mode: document?.sourceType === 'external_link' ? 'link' : 'manual',
        title: document?.title ?? '',
        associations:
          documentAssociations.length > 0
            ? documentAssociations.map((association) => association.value)
            : defaultAssociationValue
              ? [defaultAssociationValue]
              : ([...(defaultAssociations ?? [])] as string[]),
        tagIds: [...(document?.tagIds ?? [])].map(String),
      }
    : {
        associations: [...(defaultAssociations ?? [])],
        tagIds: [],
      };

  async function handleSubmit(values: DocumentFormValues): Promise<void> {
    if (!organizationId || !currentUserId) {
      toast.error(resolvedLabels.organizationUnavailableError);
      return;
    }

    const associationPayload = mapAssociationValuesToDocumentPayload(
      values.associations,
      [...associationOptions],
    );
    const associationsPayload = mapAssociationValuesToDocumentAssociations(
      values.associations,
      [...associationOptions],
    );

    setIsSubmitting(true);

    try {
      if (isEditMode) {
        if (!document) {
          toast.error(resolvedLabels.documentUnavailableError);
          return;
        }

        await updateDocument({
          id: document._id,
          currentUserId,
          organizationId,
          title: values.title,
          associationType: associationPayload.associationType,
          associationId: associationPayload.associationId,
          associationLabel: associationPayload.associationLabel,
          associations: associationsPayload,
          tagIds: values.tagIds as TTagId[],
        });

        toast.success(resolvedLabels.documentUpdatedSuccess);
      } else if (values.mode === 'manual') {
        if (!selectedFile) {
          toast.error(resolvedLabels.selectFileError);
          return;
        }

        const storageId = await uploadFileToStorage({ file: selectedFile, generateUploadUrl });

        await createManualDocument({
          currentUserId,
          organizationId,
          title: values.title,
          storageId,
          fileName: selectedFile.name,
          mimeType: selectedFile.type,
          size: selectedFile.size,
          associationType: associationPayload.associationType,
          associationId: associationPayload.associationId,
          associationLabel: associationPayload.associationLabel,
          associations: associationsPayload,
          tagIds: values.tagIds as TTagId[],
        });

        toast.success(resolvedLabels.documentAddedSuccess);
      } else {
        await createPublicRequest({
          currentUserId,
          organizationId,
          title: values.title,
          associationType: associationPayload.associationType,
          associationId: associationPayload.associationId,
          associationLabel: associationPayload.associationLabel,
          associations: associationsPayload,
          tagIds: values.tagIds as TTagId[],
          publicOrigin,
          token: publicToken,
        });

        await navigator.clipboard.writeText(publicUploadUrl);
        toast.success(resolvedLabels.linkCreatedSuccess);
      }

      onOpenChange(false);
      setSelectedFile(null);
    } catch (error) {
      console.error(error);
      toast.error(resolvedLabels.saveError);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCopyLinkPreview(): Promise<void> {
    try {
      await navigator.clipboard.writeText(publicUploadUrl);
      toast.success(resolvedLabels.linkCopiedSuccess);
    } catch (error) {
      console.error(error);
      toast.error(resolvedLabels.linkCopyError);
    }
  }

  return (
    <ResponsiveSheet
      open={open}
      onOpenChange={onOpenChange}
      title={isEditMode ? resolvedLabels.editTitle : resolvedLabels.addTitle}
      onCancel={() => onOpenChange(false)}
      onConfirm={submitDocumentForm}
      confirmLabel={isEditMode ? resolvedLabels.editConfirmLabel : resolvedLabels.addConfirmLabel}
      confirmDisabled={!organizationId || !currentUserId || isSubmitting}
      confirmLoading={isSubmitting}
    >
      <DocumentFormShell
        defaultValues={defaultValues}
        selectedFile={selectedFile}
        filePreviewUrl={filePreviewUrl}
        publicUploadUrl={publicUploadUrl}
        variant={isEditMode ? 'edit' : 'create'}
        formId="document-form"
        onFileSelect={setSelectedFile}
        onCopyLinkPreview={() => {
          void handleCopyLinkPreview();
        }}
        onSubmit={(data) => {
          void handleSubmit(data);
        }}
        renderAssociationField={renderAssociationField}
        renderTagField={renderTagField}
      />
    </ResponsiveSheet>
  );
}
