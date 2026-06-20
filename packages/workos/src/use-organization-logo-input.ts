'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { createFilePreview, validateOrganizationLogo } from './organization-logo';

interface UseOrganizationLogoInputResult {
  readonly clearLogo: () => void;
  readonly handleLogoSelect: (file: File) => Promise<void>;
  readonly logoFile: File | null;
  readonly logoPreview: string | null;
  readonly resetLogoInput: () => void;
}

export function useOrganizationLogoInput(): UseOrganizationLogoInputResult {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const clearLogo = (): void => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleLogoSelect = async (file: File): Promise<void> => {
    const validationError = validateOrganizationLogo(file);

    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      const preview = await createFilePreview(file);
      setLogoFile(file);
      setLogoPreview(preview);
    } catch (previewError) {
      toast.error(previewError instanceof Error ? previewError.message : 'Unable to read the selected file');
    }
  };

  return {
    clearLogo,
    handleLogoSelect,
    logoFile,
    logoPreview,
    resetLogoInput: clearLogo,
  };
}
