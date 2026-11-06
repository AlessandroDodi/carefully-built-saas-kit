'use client';

import { Button, ResponsiveSheet, defineKitTexts, useKitTexts } from '@carefully-built/ui';
import { Pencil } from 'lucide-react';
import { useState } from 'react';

import { SettingsSectionCard } from './settings-section-card';

import type { ReactNode } from 'react';

const texts = defineKitTexts({
  en: { edit: 'Edit', save: 'Save', saving: 'Saving…', cancel: 'Cancel' },
  it: { edit: 'Modifica', save: 'Salva', saving: 'Salvataggio…', cancel: 'Annulla' },
});

export interface EditableSettingsSectionProps {
  readonly title: ReactNode;
  readonly subtitle?: ReactNode;
  /** The read-only view of the section. */
  readonly children: ReactNode;
  readonly contentClassName?: string;
  readonly editLabel?: ReactNode;
  readonly editDisabled?: boolean;
  readonly sheetTitle?: ReactNode;
  readonly sheetDescription?: ReactNode;
  readonly sheetWidth?: number;
  /** Id of the `<form>` rendered by `renderForm`; the sheet's Save submits it. */
  readonly formId: string;
  readonly saving?: boolean;
  /** The form shown in the sheet; call `close` after a successful save. */
  readonly renderForm: (close: () => void) => ReactNode;
}

/**
 * A settings section that is read-only on the page and edited in a side
 * sheet: one visualization, one explicit "Edit", Cancel and Save.
 */
export function EditableSettingsSection({
  title,
  subtitle,
  children,
  contentClassName,
  editLabel,
  editDisabled = false,
  sheetTitle,
  sheetDescription,
  sheetWidth,
  formId,
  saving = false,
  renderForm,
}: EditableSettingsSectionProps): React.ReactElement {
  const t = useKitTexts(texts);
  const [open, setOpen] = useState(false);
  const close = (): void => { setOpen(false); };
  const submit = (): void => {
    const form = document.getElementById(formId);
    if (form instanceof HTMLFormElement) form.requestSubmit();
  };

  return (
    <>
      <SettingsSectionCard
        title={title}
        subtitle={subtitle}
        contentClassName={contentClassName}
        action={
          <Button type="button" variant="outline" disabled={editDisabled} onClick={() => { setOpen(true); }}>
            <Pencil />
            {editLabel ?? t.edit}
          </Button>
        }
      >
        {children}
      </SettingsSectionCard>
      <ResponsiveSheet
        open={open}
        onOpenChange={setOpen}
        title={sheetTitle ?? title}
        description={sheetDescription ?? subtitle}
        width={sheetWidth}
        onCancel={close}
        cancelLabel={t.cancel}
        onConfirm={submit}
        confirmLabel={t.save}
        confirmLoading={saving}
        confirmLoadingLabel={t.saving}
      >
        {open ? renderForm(close) : null}
      </ResponsiveSheet>
    </>
  );
}
