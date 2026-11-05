'use client';

import {
  CustomAssociationPickerField,
  CustomDateFormField,
  CustomForm,
  CustomInputField,
  CustomSegmentedToggleField,
  CustomSelectField,
  CustomTextareaField,
  CustomUserPickerField,
  FormFieldLabel,
} from '@carefully-built/forms';
import { Input, Label, Switch, useKitLocale, useKitTexts } from '@carefully-built/ui';
import { CalendarDays, CheckCircle2, Circle, Clock, Lock, LockOpen, Text } from 'lucide-react';
import { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { z } from 'zod';

import type { AssociationPickerOption } from '@carefully-built/association-picker';
import type { SegmentedToggleOption } from '@carefully-built/ui';
import type { UserPickerOption } from '@carefully-built/user-picker';

import type { AgendaActivityFormValues } from './activity-page-state';

import {
  addOneHourToTime,
  ALL_DAY_ACTIVITY_END_TIME,
  ALL_DAY_ACTIVITY_START_TIME,
  DEFAULT_ACTIVITY_END_TIME,
  DEFAULT_ACTIVITY_START_TIME,
} from './activity-form-time';
import { agendaTexts } from './agenda-texts';

type ActivityFormTexts = (typeof agendaTexts)['en']['form'];

// Built per locale: the validation messages are user-visible copy too.
function buildActivityFormSchema(texts: ActivityFormTexts) {
  return z
    .object({
      title: z.string().trim().min(1, texts.titleRequired),
      activityTypeId: z.string().trim().min(1, texts.typeRequired),
      participantUserIds: z.array(z.string()).min(1, texts.participantsRequired),
      visibility: z.union([z.literal('public'), z.literal('private')]),
      associations: z.array(z.string()),
      tagIds: z.array(z.string()),
      date: z.string().trim().min(1, texts.dateRequired),
      allDay: z.boolean(),
      startTime: z.string().trim().optional(),
      endTime: z.string().trim().optional(),
      description: z.string().optional(),
      status: z.union([
        z.literal('todo'),
        z.literal('scheduled'),
        z.literal('done'),
        z.literal('cancelled'),
      ]),
    })
    .superRefine((values, ctx) => {
      if (values.allDay) {
        return;
      }

      if (!values.startTime?.trim()) {
        ctx.addIssue({ code: 'custom', path: ['startTime'], message: texts.startRequired });
      }

      if (!values.endTime?.trim()) {
        ctx.addIssue({ code: 'custom', path: ['endTime'], message: texts.endRequired });
      }
    });
}

interface ActivityTypeOption {
  readonly value: string;
  readonly label: string;
  readonly color?: string;
}

interface ActivityFormProps {
  readonly associationOptions: AssociationPickerOption[];
  readonly participantOptions: readonly UserPickerOption[];
  readonly activityTypeOptions: readonly ActivityTypeOption[];
  readonly defaultValues?: Partial<AgendaActivityFormValues>;
  readonly formId?: string;
  readonly onSubmit: (data: AgendaActivityFormValues) => void;
}

function buildVisibilityOptions(
  texts: ActivityFormTexts,
): readonly SegmentedToggleOption<'public' | 'private'>[] {
  return [
    { value: 'public', label: texts.visibilityPublic, icon: <LockOpen className="size-4" /> },
    { value: 'private', label: texts.visibilityPrivate, icon: <Lock className="size-4" /> },
  ];
}

const defaultActivityFormValues: AgendaActivityFormValues = {
  title: '',
  activityTypeId: '',
  participantUserIds: [],
  visibility: 'public',
  associations: [],
  tagIds: [],
  date: '',
  allDay: false,
  startTime: DEFAULT_ACTIVITY_START_TIME,
  endTime: DEFAULT_ACTIVITY_END_TIME,
  description: '',
  status: 'todo',
};

function ActivityAllDayField(): React.ReactElement {
  const { form: texts } = useKitTexts(agendaTexts);
  const { control, setValue, watch } = useFormContext<AgendaActivityFormValues>();
  const startTime = watch('startTime');

  return (
    <Controller
      name="allDay"
      control={control}
      render={({ field }) => (
        <div className="border-border bg-muted/20 flex items-start justify-between gap-3 rounded-lg border p-3">
          <div className="space-y-1">
            <Label htmlFor="activity-all-day">{texts.allDay}</Label>
            <p className="text-muted-foreground text-sm">{texts.allDayDescription}</p>
          </div>
          <Switch
            id="activity-all-day"
            checked={field.value}
            onCheckedChange={(checked) => {
              field.onChange(checked);
              setValue('startTime', checked ? ALL_DAY_ACTIVITY_START_TIME : DEFAULT_ACTIVITY_START_TIME, {
                shouldDirty: true,
                shouldValidate: true,
              });
              setValue(
                'endTime',
                checked ? ALL_DAY_ACTIVITY_END_TIME : addOneHourToTime(startTime ?? DEFAULT_ACTIVITY_START_TIME),
                { shouldDirty: true, shouldValidate: true },
              );
            }}
          />
        </div>
      )}
    />
  );
}

function ActivityTimeFields(): React.ReactElement {
  const { form: texts } = useKitTexts(agendaTexts);
  const { control, setValue, watch } = useFormContext<AgendaActivityFormValues>();
  const allDay = watch('allDay');

  if (allDay) {
    return <ActivityAllDayField />;
  }

  return (
    <div className="space-y-3">
      <ActivityAllDayField />
      <div className="grid gap-3 sm:grid-cols-2">
        <Controller
          name="startTime"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <div className="space-y-2">
              <FormFieldLabel htmlFor="activity-start-time" label={texts.start} icon={Clock} hasError={Boolean(error)} />
              <Input
                id="activity-start-time"
                type="time"
                value={field.value ?? ''}
                aria-invalid={Boolean(error)}
                onBlur={field.onBlur}
                onChange={(event) => {
                  field.onChange(event.target.value);
                  setValue('endTime', addOneHourToTime(event.target.value), {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
              />
              {error?.message ? <p className="text-destructive text-sm">{error.message}</p> : null}
            </div>
          )}
        />
        <Controller
          name="endTime"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <div className="space-y-2">
              <FormFieldLabel htmlFor="activity-end-time" label={texts.end} icon={Clock} hasError={Boolean(error)} />
              <Input
                id="activity-end-time"
                type="time"
                value={field.value ?? ''}
                aria-invalid={Boolean(error)}
                onBlur={field.onBlur}
                onChange={field.onChange}
              />
              {error?.message ? <p className="text-destructive text-sm">{error.message}</p> : null}
            </div>
          )}
        />
      </div>
    </div>
  );
}

function ActivityCompletionField(): React.ReactElement {
  const { form: texts } = useKitTexts(agendaTexts);
  const { control } = useFormContext<AgendaActivityFormValues>();

  return (
    <Controller
      name="status"
      control={control}
      render={({ field }) => {
        const isDone = field.value === 'done';
        const Icon = isDone ? CheckCircle2 : Circle;

        return (
          <button
            type="button"
            className="border-border bg-background hover:border-primary/30 flex w-full items-start gap-3 rounded-lg border p-3 text-left transition"
            aria-pressed={isDone}
            onClick={() => {
              field.onChange(isDone ? 'todo' : 'done');
            }}
          >
            <Icon className={isDone ? 'text-primary mt-0.5 size-5' : 'text-muted-foreground mt-0.5 size-5'} />
            <span className="space-y-1">
              <span className="block text-sm font-medium">
                {isDone ? texts.completed : texts.markCompleted}
              </span>
              <span className="text-muted-foreground block text-sm">{texts.completionDescription}</span>
            </span>
          </button>
        );
      }}
    />
  );
}

export function ActivityForm({
  associationOptions,
  participantOptions,
  activityTypeOptions,
  defaultValues,
  formId = 'activity-form',
  onSubmit,
}: ActivityFormProps): React.ReactElement {
  const { form: texts } = useKitTexts(agendaTexts);
  // Keyed on the locale, not on `texts` (a new object every render), so the
  // form keeps a stable schema.
  const locale = useKitLocale();
  const schema = useMemo(() => buildActivityFormSchema(agendaTexts[locale].form), [locale]);

  return (
    <CustomForm<AgendaActivityFormValues>
      id={formId}
      schema={schema}
      defaultValues={{ ...defaultActivityFormValues, ...defaultValues }}
      className="space-y-4"
      onSubmit={onSubmit}
    >
      <CustomInputField<AgendaActivityFormValues>
        name="title"
        label={texts.title}
        labelIcon={Text}
        placeholder={texts.titlePlaceholder}
        autoFocus
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <CustomSelectField<AgendaActivityFormValues>
          name="activityTypeId"
          label={texts.type}
          labelIcon={CalendarDays}
          options={activityTypeOptions}
        />
        <CustomDateFormField<AgendaActivityFormValues>
          name="date"
          label={texts.date}
          labelIcon={CalendarDays}
        />
      </div>
      <ActivityTimeFields />
      <CustomUserPickerField<AgendaActivityFormValues>
        name="participantUserIds"
        label={texts.participants}
        mode="multiple"
        options={participantOptions}
        placeholder={texts.participantsPlaceholder}
      />
      <CustomAssociationPickerField<AgendaActivityFormValues>
        name="associations"
        label={texts.associations}
        options={associationOptions}
        placeholder={texts.associationsPlaceholder}
      />
      <CustomSegmentedToggleField<AgendaActivityFormValues, 'public' | 'private'>
        name="visibility"
        label={texts.visibility}
        options={buildVisibilityOptions(texts)}
      />
      <ActivityCompletionField />
      <CustomTextareaField<AgendaActivityFormValues>
        name="description"
        label={texts.description}
        placeholder={texts.descriptionPlaceholder}
        rows={4}
      />
    </CustomForm>
  );
}
