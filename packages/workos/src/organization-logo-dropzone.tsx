'use client';

import { FileDropzone } from '@carefully-built/ui';
import {
  ORGANIZATION_LOGO_ACCEPT,
  ORGANIZATION_LOGO_CAPTION,
  ORGANIZATION_LOGO_HELPER_TEXT,
} from './organization-logo';

interface OrganizationLogoDropzoneProps {
  readonly onFileSelect: (file: File) => void;
  readonly onRemove: () => void;
  readonly previewUrl: string | null;
}

export function OrganizationLogoDropzone({
  onFileSelect,
  onRemove,
  previewUrl,
}: OrganizationLogoDropzoneProps): React.ReactElement {
  return (
    <div className="space-y-2">
      <FileDropzone
        accept={ORGANIZATION_LOGO_ACCEPT}
        currentPreviewUrl={previewUrl}
        helperText={ORGANIZATION_LOGO_HELPER_TEXT}
        previewAlt="Organization logo preview"
        onFileSelect={onFileSelect}
        onRemove={onRemove}
      />
      <p className="text-xs text-muted-foreground">{ORGANIZATION_LOGO_CAPTION}</p>
    </div>
  );
}
