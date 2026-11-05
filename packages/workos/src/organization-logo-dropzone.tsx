'use client';

import { FileDropzone, useKitTexts } from '@carefully-built/ui';

import { ORGANIZATION_LOGO_ACCEPT } from './organization-logo';
import { organizationLogoTexts } from './workos-texts';

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
  const texts = useKitTexts(organizationLogoTexts);

  return (
    <div className="space-y-2">
      <FileDropzone
        accept={ORGANIZATION_LOGO_ACCEPT}
        currentPreviewUrl={previewUrl}
        helperText={texts.helperText}
        previewAlt={texts.previewAlt}
        onFileSelect={onFileSelect}
        onRemove={onRemove}
      />
      <p className="text-xs text-muted-foreground">{texts.caption}</p>
    </div>
  );
}
