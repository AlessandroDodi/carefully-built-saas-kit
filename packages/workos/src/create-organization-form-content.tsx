'use client';

import { OrganizationLogoDropzone } from './organization-logo-dropzone';
import { Input } from '@carefully-built/ui';
import { Label } from '@carefully-built/ui';

interface CreateOrganizationFormContentProps {
  readonly error: string | null;
  readonly logoPreview: string | null;
  readonly name: string;
  readonly onClearLogo: () => void;
  readonly onLogoSelect: (file: File) => void;
  readonly onNameChange: (name: string) => void;
}

export function CreateOrganizationFormContent({
  error,
  logoPreview,
  name,
  onClearLogo,
  onLogoSelect,
  onNameChange,
}: CreateOrganizationFormContentProps): React.ReactElement {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label>Organization logo</Label>
        <OrganizationLogoDropzone
          previewUrl={logoPreview}
          onFileSelect={onLogoSelect}
          onRemove={onClearLogo}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="name">Organization name</Label>
        <Input
          id="name"
          placeholder="Immobiliare in Cloud"
          required
          value={name}
          onChange={(event): void => {
            onNameChange(event.target.value);
          }}
        />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
