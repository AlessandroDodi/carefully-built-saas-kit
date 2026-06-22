'use client';

import { SettingsFormSheet } from '@carefully-built/settings-ui/client';
import { Button, Card, CardContent, Input, Label } from '@carefully-built/ui';
import { Building2, Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { OrganizationLogoDropzone } from './organization-logo-dropzone';
import { useOrganizationLogoInput } from './use-organization-logo-input';

export interface OrganizationProfileSettingsOrganization {
  readonly id: string;
  readonly name: string;
  readonly role?: string | null;
}

export interface OrganizationProfileSettingsSaveArgs {
  readonly logoFile: File | null;
  readonly name: string;
  readonly removeLogo: boolean;
}

export interface OrganizationProfileSettingsLabels {
  readonly description?: string;
  readonly editButton?: string;
  readonly logoAlt?: string;
  readonly logoLabel?: string;
  readonly nameLabel?: string;
  readonly roleFallback?: string;
  readonly saveButton?: string;
  readonly saveError?: string;
  readonly saveSuccess?: string;
  readonly title?: string;
}

export interface OrganizationProfileSettingsProps {
  readonly canEdit?: boolean;
  readonly labels?: OrganizationProfileSettingsLabels;
  readonly logoUrl?: string | null;
  readonly onSave: (args: OrganizationProfileSettingsSaveArgs) => Promise<void>;
  readonly onUpdated?: () => void;
  readonly organization: OrganizationProfileSettingsOrganization;
}

const defaultLabels = {
  description: 'Update your organization details.',
  editButton: 'Edit',
  logoAlt: 'Organization logo',
  logoLabel: 'Organization logo',
  nameLabel: 'Organization name',
  roleFallback: 'Member',
  saveButton: 'Save changes',
  saveError: 'Unable to update the organization',
  saveSuccess: 'Organization updated',
  title: 'Edit organization',
} satisfies Required<OrganizationProfileSettingsLabels>;

function getDisplayRole(role: string | null | undefined, fallback: string): string {
  return role?.trim() ? role : fallback;
}

interface EditFormProps {
  readonly currentLogoUrl: string | null;
  readonly labels: Required<OrganizationProfileSettingsLabels>;
  readonly logoPreview: string | null;
  readonly name: string;
  readonly onLogoRemove: () => void;
  readonly onLogoSelect: (file: File) => void;
  readonly setName: (name: string) => void;
}

function EditForm({
  currentLogoUrl,
  labels,
  logoPreview,
  name,
  onLogoRemove,
  onLogoSelect,
  setName,
}: EditFormProps): React.ReactElement {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="organization-profile-name">{labels.nameLabel}</Label>
        <Input
          id="organization-profile-name"
          value={name}
          onChange={(event): void => {
            setName(event.target.value);
          }}
        />
      </div>

      <div className="space-y-2">
        <Label>{labels.logoLabel}</Label>
        <OrganizationLogoDropzone
          previewUrl={logoPreview ?? currentLogoUrl}
          onFileSelect={onLogoSelect}
          onRemove={onLogoRemove}
        />
      </div>
    </div>
  );
}

interface OrganizationInfoProps {
  readonly labels: Required<OrganizationProfileSettingsLabels>;
  readonly logoUrl: string | null;
  readonly name: string;
  readonly role?: string | null;
}

function OrganizationInfo({
  labels,
  logoUrl,
  name,
  role,
}: OrganizationInfoProps): React.ReactElement {
  return (
    <>
      <div className="bg-muted relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border">
        {logoUrl ? (
          <img src={logoUrl} alt={labels.logoAlt} className="size-full object-cover" />
        ) : (
          <Building2 className="text-muted-foreground size-6" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-medium">{name}</h3>
        <p className="text-muted-foreground text-sm capitalize">
          {getDisplayRole(role, labels.roleFallback)}
        </p>
      </div>
    </>
  );
}

export function OrganizationProfileSettings({
  canEdit = true,
  labels,
  logoUrl = null,
  onSave,
  onUpdated,
  organization,
}: OrganizationProfileSettingsProps): React.ReactElement {
  const mergedLabels = { ...defaultLabels, ...labels };
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState(organization.name);
  const [removeCurrentLogo, setRemoveCurrentLogo] = useState(false);
  const { clearLogo, handleLogoSelect, logoFile, logoPreview, resetLogoInput } =
    useOrganizationLogoInput();

  useEffect(() => {
    setName(organization.name);
  }, [organization.name]);

  const currentLogoUrl = removeCurrentLogo ? null : logoUrl;
  const trimmedName = name.trim();
  const hasChanges =
    trimmedName !== organization.name ||
    logoFile !== null ||
    (removeCurrentLogo && logoUrl !== null);

  const handleOpenChange = (open: boolean): void => {
    setIsOpen(open);

    if (open) {
      setName(organization.name);
      resetLogoInput();
      setRemoveCurrentLogo(false);
    }
  };

  const handleLogoRemove = (): void => {
    clearLogo();
    setRemoveCurrentLogo(true);
  };

  const handleSave = async (): Promise<void> => {
    if (!canEdit || !trimmedName || !hasChanges) {
      return;
    }

    setIsSaving(true);

    try {
      await onSave({ logoFile, name: trimmedName, removeLogo: removeCurrentLogo });
      toast.success(mergedLabels.saveSuccess);
      resetLogoInput();
      setRemoveCurrentLogo(false);
      setIsOpen(false);
      onUpdated?.();
    } catch {
      toast.error(mergedLabels.saveError);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden py-0">
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            <OrganizationInfo
              labels={mergedLabels}
              logoUrl={logoUrl}
              name={organization.name}
              role={organization.role}
            />
            {canEdit ? (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => {
                  handleOpenChange(true);
                }}
              >
                <Pencil className="size-3.5" />
                {mergedLabels.editButton}
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <SettingsFormSheet
        open={isOpen}
        onOpenChange={handleOpenChange}
        title={mergedLabels.title}
        description={mergedLabels.description}
        onSave={() => {
          void handleSave();
        }}
        confirmLabel={mergedLabels.saveButton}
        confirmDisabled={isSaving || !trimmedName || !hasChanges}
        loading={isSaving}
      >
        <EditForm
          currentLogoUrl={currentLogoUrl}
          labels={mergedLabels}
          logoPreview={logoPreview}
          name={name}
          onLogoSelect={(file): void => {
            void handleLogoSelect(file).then(() => {
              setRemoveCurrentLogo(false);
            });
          }}
          onLogoRemove={handleLogoRemove}
          setName={setName}
        />
      </SettingsFormSheet>
    </>
  );
}
