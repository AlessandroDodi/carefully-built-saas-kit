'use client';

import { useEffect, useState } from 'react';

import { FileDropzone, ResponsiveSheet } from '@carefully-built/ui';
import { Upload } from 'lucide-react';

interface FileUploadSheetProps {
  readonly accept?: string;
  readonly confirmLabel?: string;
  readonly browseLabel?: string;
  readonly dropzoneTitle?: string;
  readonly previewAlt?: string;
  readonly helperText?: string;
  readonly associationField?: React.ReactNode;
  readonly onOpenChange: (open: boolean) => void;
  readonly onUpload: (file: File) => Promise<void> | void;
  readonly open: boolean;
  readonly title?: string;
}

export function FileUploadSheet({
  accept = '.pdf,image/*',
  associationField,
  browseLabel = 'Browse',
  confirmLabel = 'Upload',
  dropzoneTitle = 'Drop a file here or browse',
  helperText = 'PDF, JPG, PNG',
  onOpenChange,
  onUpload,
  open,
  previewAlt,
  title = 'Upload file',
}: FileUploadSheetProps): React.ReactElement {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!file?.type.startsWith('image/')) {
      setPreviewUrl(null);
      return undefined;
    }

    const nextPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(nextPreviewUrl);

    return () => {
      URL.revokeObjectURL(nextPreviewUrl);
    };
  }, [file]);

  useEffect(() => {
    if (!open) {
      setFile(null);
    }
  }, [open]);

  async function handleUpload(): Promise<void> {
    if (!file) {
      return;
    }

    setIsUploading(true);
    try {
      await onUpload(file);
      onOpenChange(false);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <ResponsiveSheet
      confirmDisabled={!file || isUploading}
      confirmLabel={confirmLabel}
      confirmLoading={isUploading}
      onCancel={() => onOpenChange(false)}
      onConfirm={() => {
        void handleUpload();
      }}
      onOpenChange={onOpenChange}
      open={open}
      title={title}
    >
      <div className="space-y-2 pb-4">
        <FileDropzone
          accept={accept}
          browseLabel={browseLabel}
          currentPreviewUrl={file?.type.startsWith('image/') ? previewUrl : null}
          emptyIcon={<Upload className="size-6" />}
          helperText={helperText}
          onFileSelect={setFile}
          previewAlt={file?.name ?? previewAlt ?? 'File preview'}
          title={dropzoneTitle}
        />
        {associationField ? <div className="pt-3">{associationField}</div> : null}
      </div>
    </ResponsiveSheet>
  );
}
