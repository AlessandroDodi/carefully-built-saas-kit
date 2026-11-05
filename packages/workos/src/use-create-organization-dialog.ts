'use client';

import { useKitTexts } from '@carefully-built/ui';
import { useState } from 'react';

import { useOrganizationLogoInput } from './use-organization-logo-input';
import { createOrganizationTexts } from './workos-texts';

interface UseCreateOrganizationDialogArgs {
  readonly createOrganization?: (name: string) => Promise<string>;
  readonly onCreated?: (orgId: string) => void;
  readonly uploadLogo?: (args: { file: File; organizationId: string }) => Promise<void>;
}

interface UseCreateOrganizationDialogResult {
  readonly clearLogo: () => void;
  readonly error: string | null;
  readonly handleLogoSelect: (file: File) => Promise<void>;
  readonly handleSubmit: (event: React.SyntheticEvent<HTMLFormElement>) => Promise<void>;
  readonly loading: boolean;
  readonly logoPreview: string | null;
  readonly name: string;
  readonly open: boolean;
  readonly resetForm: () => void;
  readonly setName: (name: string) => void;
  readonly setOpen: (open: boolean) => void;
}

async function createOrganizationWithDefaultApi(name: string, fallbackError: string): Promise<string> {
  const response = await fetch('/api/organizations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    const data = (await response.json()) as { error?: string };
    throw new Error(data.error ?? fallbackError);
  }

  const { organizationId } = (await response.json()) as { organizationId: string };
  return organizationId;
}

export function useCreateOrganizationDialog({
  createOrganization,
  onCreated,
  uploadLogo,
}: UseCreateOrganizationDialogArgs): UseCreateOrganizationDialogResult {
  const { createError, genericError } = useKitTexts(createOrganizationTexts);
  const create =
    createOrganization ?? ((name: string): Promise<string> => createOrganizationWithDefaultApi(name, createError));
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const { clearLogo, handleLogoSelect, logoFile, logoPreview, resetLogoInput } = useOrganizationLogoInput();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = (): void => {
    setName(''); resetLogoInput(); setError(null);
  };

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const organizationId = await create(name);

      if (logoFile && uploadLogo) {
        await uploadLogo({ file: logoFile, organizationId });
      }

      setOpen(false);
      resetForm();
      onCreated?.(organizationId);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : genericError);
    } finally {
      setLoading(false);
    }
  };

  return { clearLogo, error, handleLogoSelect, handleSubmit, loading, logoPreview, name, open, resetForm, setName, setOpen };
}
