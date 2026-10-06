'use client';

import { Lock, LockOpen } from 'lucide-react';
import { z } from 'zod';

import {
  CustomForm,
  CustomInputField,
  CustomSegmentedToggleField,
} from '@carefully-built/forms';
import {
  hasRichTextContent,
  parseRichTextContent,
  stringifyRichTextContent,
} from '@carefully-built/rich-text';
import type { SegmentedToggleOption } from '@carefully-built/ui';

export const noteFormSchema = z.object({
  title: z.string().trim().min(1, 'Il nome della nota e obbligatorio'),
  body: z.string().refine(hasRichTextContent, 'La descrizione e obbligatoria'),
  associations: z.array(z.string()),
  tagIds: z.array(z.string()),
  visibility: z.union([z.literal('public'), z.literal('private')]),
});

export type NoteFormValues = z.infer<typeof noteFormSchema>;

type FormFieldIcon = React.ComponentType<{ className?: string }>;

const noteVisibilityOptions = [
  { value: 'public', label: 'Pubblica', icon: <LockOpen className="size-4" /> },
  { value: 'private', label: 'Privata', icon: <Lock className="size-4" /> },
] as const satisfies readonly SegmentedToggleOption<'public' | 'private'>[];

export interface NoteFormShellProps {
  readonly defaultValues?: Partial<NoteFormValues>;
  readonly formId?: string;
  readonly titleIcon?: FormFieldIcon;
  readonly renderAssociationField: () => React.ReactNode;
  readonly renderTagField: () => React.ReactNode;
  readonly renderBodyField: () => React.ReactNode;
  readonly onSubmit: (data: NoteFormValues) => void;
}

export function NoteFormShell({
  defaultValues,
  formId = 'note-form',
  titleIcon,
  renderAssociationField,
  renderTagField,
  renderBodyField,
  onSubmit,
}: NoteFormShellProps): React.ReactElement {
  const initialValues: NoteFormValues = {
    title: defaultValues?.title ?? '',
    body: stringifyRichTextContent(parseRichTextContent(defaultValues?.body)),
    associations: defaultValues?.associations ?? [],
    tagIds: defaultValues?.tagIds ?? [],
    visibility: defaultValues?.visibility ?? 'public',
  };

  return (
    <CustomForm
      id={formId}
      schema={noteFormSchema}
      defaultValues={initialValues}
      onSubmit={onSubmit}
      className="flex flex-col"
    >
      <div className="space-y-6 pb-4">
        <CustomInputField<NoteFormValues>
          name="title"
          label="Nome nota"
          labelIcon={titleIcon as never}
          placeholder="Nome documento"
        />
        {renderAssociationField()}
        {renderTagField()}
        <CustomSegmentedToggleField<NoteFormValues, 'public' | 'private'>
          name="visibility"
          label="Visibilità"
          options={noteVisibilityOptions}
        />
        {renderBodyField()}
      </div>
    </CustomForm>
  );
}
