'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useKitLocale, useKitTexts } from '@carefully-built/ui';

import { createFilePreview, validateOrganizationLogo } from './organization-logo';
import { organizationLogoTexts } from './workos-texts';

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
  const locale = useKitLocale();
  const { readError } = useKitTexts(organizationLogoTexts);

  const clearLogo = (): void => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleLogoSelect = async (file: File): Promise<void> => {
    const validationError = validateOrganizationLogo(file, locale);

    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      const preview = await createFilePreview(file, locale);
      setLogoFile(file);
      setLogoPreview(preview);
    } catch (previewError) {
      toast.error(previewError instanceof Error ? previewError.message : readError);
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
