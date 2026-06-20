'use client';

import { useEffect, useState } from 'react';

import { getAssociationTypeChipMeta, type AssociationEntityType } from './associationTypeMeta';

import type { AssociationPickerCreateConfig, AssociationPickerCreateResult } from './types';

import { ResponsiveSheet } from '@carefully-built/ui';

interface AssociationPickerCreateSheetProps {
  readonly createConfig?: AssociationPickerCreateConfig;
  readonly creatingType: AssociationEntityType | null;
  readonly handleCreated: (result: AssociationPickerCreateResult) => void;
  readonly setCreatingType: (value: AssociationEntityType | null) => void;
}

export function AssociationPickerCreateSheet({
  createConfig,
  creatingType,
  handleCreated,
  setCreatingType,
}: AssociationPickerCreateSheetProps): React.ReactElement | null {
  const activeHandler = creatingType ? createConfig?.handlers[creatingType] : undefined;
  const [confirmDisabled, setConfirmDisabled] = useState(activeHandler?.confirmDisabled ?? false);

  useEffect(() => {
    setConfirmDisabled(activeHandler?.confirmDisabled ?? false);
  }, [activeHandler]);

  if (!creatingType || !activeHandler) {
    return null;
  }

  const title = `Create ${getAssociationTypeChipMeta(creatingType).label.toLowerCase()}`;

  return (
    <ResponsiveSheet
      open
      onOpenChange={(open) => {
        if (!open) {
          setCreatingType(null);
        }
      }}
      title={title}
      confirmLabel={activeHandler.confirmLabel ?? 'Add'}
      confirmDisabled={confirmDisabled}
      onCancel={() => {
        setCreatingType(null);
      }}
      onConfirm={() => {
        if (!activeHandler.formId) {
          return;
        }

        const form = document.getElementById(activeHandler.formId);
        if (form instanceof HTMLFormElement) {
          form.requestSubmit();
        }
      }}
      width={560}
    >
      <div data-association-create-sheet="true" className="flex min-h-0 flex-1 flex-col">
        {activeHandler.render({
          onCancel: () => {
            setCreatingType(null);
          },
          onCreated: (result) => {
            handleCreated(result);
            setCreatingType(null);
          },
          setConfirmDisabled,
        })}
      </div>
    </ResponsiveSheet>
  );
}
