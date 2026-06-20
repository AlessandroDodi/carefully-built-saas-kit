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
}: DocumentSheetBaseProps<TUserId, TDocumentId, TTagId>): React.ReactElement {
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
      toast.error('Organization context is not available');
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
          toast.error('Document is not available');
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

        toast.success('Document updated');
      } else if (values.mode === 'manual') {
        if (!selectedFile) {
          toast.error('Select a file before continuing');
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

        toast.success('Document added');
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
        toast.success('Link created and copied');
      }

      onOpenChange(false);
      setSelectedFile(null);
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong while saving.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCopyLinkPreview(): Promise<void> {
    try {
      await navigator.clipboard.writeText(publicUploadUrl);
      toast.success('Link copied. Save the document to activate it.');
    } catch (error) {
      console.error(error);
      toast.error('Could not copy the link.');
    }
  }

  return (
    <ResponsiveSheet
      open={open}
      onOpenChange={onOpenChange}
      title={isEditMode ? 'Edit document' : 'Add document'}
      onCancel={() => onOpenChange(false)}
      onConfirm={submitDocumentForm}
      confirmLabel={isEditMode ? 'Save' : 'Add'}
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
