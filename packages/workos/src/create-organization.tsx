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
}

interface CreateOrganizationSheetProps {
  readonly dialog: ReturnType<typeof useCreateOrganizationDialog>;
}

interface CreateOrganizationTriggerProps {
  readonly children?: React.ReactNode;
  readonly onOpen: () => void;
}

function CreateOrganizationTrigger({
  children,
  onOpen,
}: CreateOrganizationTriggerProps): React.ReactElement {
  return (
    children ? (
      <Slot onClick={onOpen}>
        {children}
      </Slot>
    ) : (
      <Button variant="outline" onClick={onOpen}>
        Crea organizzazione
      </Button>
    )
  );
}

function CreateOrganizationSheet({ dialog }: CreateOrganizationSheetProps): React.ReactElement {
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
      title="Crea organizzazione"
      description="Crea una nuova organizzazione per invitare il team e collaborare."
      confirmLabel="Crea"
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
}: CreateOrganizationProps): React.ReactElement {
  const dialog = useCreateOrganizationDialog({ createOrganization, onCreated, uploadLogo });

  return (
    <>
      <CreateOrganizationTrigger
        children={children}
        onOpen={() => {
          dialog.setOpen(true);
        }}
      />
      <CreateOrganizationSheet dialog={dialog} />
    </>
  );
}
