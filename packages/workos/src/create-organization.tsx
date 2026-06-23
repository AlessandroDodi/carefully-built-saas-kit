'use client';

import { Slot } from '@radix-ui/react-slot';
import { useRef } from 'react';

import { CreateOrganizationFormContent } from './create-organization-form-content';
import { useCreateOrganizationDialog } from './use-create-organization-dialog';

import { ResponsiveSheet } from '@carefully-built/ui';
import { Button } from '@carefully-built/ui';

interface CreateOrganizationProps {
  readonly children?: React.ReactNode;
  readonly createOrganization?: (name: string) => Promise<string>;
  readonly onCreated?: (orgId: string) => void;
  readonly uploadLogo?: (args: { file: File; organizationId: string }) => Promise<void>;
  readonly labels?: CreateOrganizationLabelsInput;
}

interface CreateOrganizationSheetProps {
  readonly dialog: ReturnType<typeof useCreateOrganizationDialog>;
  readonly labels: CreateOrganizationLabels;
}

interface CreateOrganizationTriggerProps {
  readonly children?: React.ReactNode;
  readonly onOpen: () => void;
  readonly labels: CreateOrganizationLabels;
}

export interface CreateOrganizationLabels {
  readonly triggerLabel: string;
  readonly title: string;
  readonly description: string;
  readonly confirmLabel: string;
}

export type CreateOrganizationLabelsInput = Partial<CreateOrganizationLabels>;

function resolveCreateOrganizationLabels(
  labels: CreateOrganizationLabelsInput = {},
): CreateOrganizationLabels {
  return {
    triggerLabel: labels.triggerLabel ?? 'Create organization',
    title: labels.title ?? 'Create organization',
    description: labels.description ?? 'Create a new organization to invite your team and collaborate.',
    confirmLabel: labels.confirmLabel ?? 'Create',
  };
}

function CreateOrganizationTrigger({
  children,
  onOpen,
  labels,
}: CreateOrganizationTriggerProps): React.ReactElement {
  return (
    children ? (
      <Slot onClick={onOpen}>
        {children}
      </Slot>
    ) : (
      <Button variant="outline" onClick={onOpen}>
        {labels.triggerLabel}
      </Button>
    )
  );
}

function CreateOrganizationSheet({ dialog, labels }: CreateOrganizationSheetProps): React.ReactElement {
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleClose = (): void => {
    dialog.setOpen(false);
    dialog.resetForm();
  };

  return (
    <ResponsiveSheet
      open={dialog.open}
      onOpenChange={(nextOpen): void => {
        if (nextOpen) {
          dialog.setOpen(true);
          return;
        }

        handleClose();
      }}
      title={labels.title}
      description={labels.description}
      confirmLabel={labels.confirmLabel}
      onCancel={handleClose}
      onConfirm={(): void => {
        formRef.current?.requestSubmit();
      }}
      confirmLoading={dialog.loading}
      confirmDisabled={dialog.loading || !dialog.name.trim()}
      width={480}
    >
        <form
          ref={formRef}
          onSubmit={(e): void => {
            void dialog.handleSubmit(e);
          }}
        >
          <CreateOrganizationFormContent
            error={dialog.error}
            logoPreview={dialog.logoPreview}
            name={dialog.name}
            onClearLogo={dialog.clearLogo}
            onLogoSelect={(file): void => {
              void dialog.handleLogoSelect(file);
            }}
            onNameChange={dialog.setName}
          />
        </form>
    </ResponsiveSheet>
  );
}

export function CreateOrganization({
  children,
  createOrganization,
  onCreated,
  uploadLogo,
  labels,
}: CreateOrganizationProps): React.ReactElement {
  const dialog = useCreateOrganizationDialog({ createOrganization, onCreated, uploadLogo });
  const resolvedLabels = resolveCreateOrganizationLabels(labels);

  return (
    <>
      <CreateOrganizationTrigger
        children={children}
        labels={resolvedLabels}
        onOpen={() => {
          dialog.setOpen(true);
        }}
      />
      <CreateOrganizationSheet dialog={dialog} labels={resolvedLabels} />
    </>
  );
}
