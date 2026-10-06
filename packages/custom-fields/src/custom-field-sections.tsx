'use client';

import { CustomDateField, FormFieldLabel } from '@carefully-built/forms';
import {
  FieldDetailRow,
  Input,
  SearchableSelect,
  Textarea,
  TruncatedContent,
  cn,
} from '@carefully-built/ui';
import { ListChecks } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import {
  areCustomFieldFormValuesEqual,
  formatCustomFieldDisplayValue,
  mapCustomFieldValuesToFormValues,
  type CustomFieldDefinition,
  type CustomFieldFormValues,
  type CustomFieldValue,
} from './index';

type CustomFieldSectionDefinition<TId = unknown> = CustomFieldDefinition<TId> & {
  readonly isActive?: boolean;
  readonly label: string;
  readonly options?: readonly string[];
};

interface CustomFieldSectionCopy {
  readonly sectionLabel?: string;
  readonly trueLabel?: string;
  readonly falseLabel?: string;
  readonly selectPlaceholder?: string;
  readonly emptyValue?: string;
}

interface CustomFieldSectionBaseProps<TId = unknown> extends CustomFieldSectionCopy {
  readonly definitions: readonly CustomFieldSectionDefinition<TId>[] | undefined;
  readonly savedValues?: readonly CustomFieldValue<unknown>[] | undefined;
  readonly entityId?: string | null;
}

export interface CustomFieldsFormSectionProps<TId = unknown>
  extends CustomFieldSectionBaseProps<TId> {
  readonly fieldName?: string;
}

export interface CustomFieldsStateSectionProps<TId = unknown>
  extends CustomFieldSectionBaseProps<TId> {
  readonly values: CustomFieldFormValues;
  readonly onChange: (values: CustomFieldFormValues) => void;
}

export interface CustomFieldsDetailRowsProps<TId = unknown> extends CustomFieldSectionCopy {
  readonly definitions: readonly CustomFieldSectionDefinition<TId>[] | undefined;
  readonly values: readonly CustomFieldValue<unknown>[] | undefined;
  readonly labelColumnClassName?: string;
}

function getActiveDefinitions<TId>(
  definitions: readonly CustomFieldSectionDefinition<TId>[] | undefined,
): readonly CustomFieldSectionDefinition<TId>[] {
  return (definitions ?? []).filter((definition) => definition.isActive !== false);
}

function getBooleanLabel(value: boolean, copy: CustomFieldSectionCopy): string {
  return value ? copy.trueLabel ?? 'Yes' : copy.falseLabel ?? 'No';
}

export function CustomFieldsFormSection<TId = unknown>({
  definitions,
  savedValues,
  entityId,
  fieldName = 'customFields',
  sectionLabel = 'Custom fields',
  trueLabel,
  falseLabel,
  selectPlaceholder = 'Select...',
}: CustomFieldsFormSectionProps<TId>): React.ReactElement | null {
  const { control, setValue } = useFormContext<Record<string, CustomFieldFormValues>>();

  useEffect(() => {
    if (!entityId || !savedValues) {
      return;
    }

    setValue(fieldName, mapCustomFieldValuesToFormValues(savedValues), {
      shouldDirty: false,
      shouldValidate: false,
    });
  }, [entityId, fieldName, savedValues, setValue]);

  const activeDefinitions = getActiveDefinitions(definitions);
  if (activeDefinitions.length === 0) {
    return null;
  }

  const copy = { trueLabel, falseLabel };

  return (
    <div className="space-y-4 border-t border-border/70 pt-5">
      <FormFieldLabel label={sectionLabel} icon={ListChecks} />
      <div className="space-y-4">
        {activeDefinitions.map((definition) => {
          const name = `${fieldName}.${String(definition._id)}` as const;

          if (definition.fieldType === 'number') {
            return (
              <Controller
                key={String(definition._id)}
                name={name}
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <div className="space-y-2">
                    <FormFieldLabel htmlFor={name} label={definition.label} hasError={Boolean(error)} />
                    <Input
                      id={name}
                      type="number"
                      inputMode="decimal"
                      value={(field.value as number | string | undefined) ?? ''}
                      onChange={(event) => {
                        field.onChange(event.target.value === '' ? undefined : Number(event.target.value));
                      }}
                      className={error ? 'border-destructive' : ''}
                    />
                  </div>
                )}
              />
            );
          }

          if (definition.fieldType === 'boolean') {
            return (
              <Controller
                key={String(definition._id)}
                name={name}
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <FormFieldLabel label={definition.label} />
                    <div className="flex flex-wrap gap-2">
                      {[true, false].map((value) => {
                        const selected = field.value === value;
                        return (
                          <button
                            key={String(value)}
                            type="button"
                            onClick={() => {
                              field.onChange(selected ? undefined : value);
                            }}
                            className={cn(
                              'inline-flex h-8 items-center rounded-md border px-3 text-sm transition-colors',
                              selected
                                ? 'border-primary/30 bg-primary/10 text-primary'
                                : 'border-border bg-background text-muted-foreground hover:bg-muted/40',
                            )}
                          >
                            {getBooleanLabel(value, copy)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              />
            );
          }

          if (definition.fieldType === 'date') {
            return (
              <Controller
                key={String(definition._id)}
                name={name}
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <div className="space-y-2">
                    <FormFieldLabel htmlFor={name} label={definition.label} hasError={Boolean(error)} />
                    <CustomDateField
                      id={name}
                      value={typeof field.value === 'string' ? field.value : ''}
                      onChange={field.onChange}
                      hasError={Boolean(error)}
                    />
                  </div>
                )}
              />
            );
          }

          if (definition.fieldType === 'single_select') {
            return (
              <Controller
                key={String(definition._id)}
                name={name}
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <FormFieldLabel htmlFor={name} label={definition.label} />
                    <SearchableSelect
                      value={typeof field.value === 'string' ? field.value : ''}
                      onValueChange={field.onChange}
                      placeholder={selectPlaceholder}
                      options={(definition.options ?? []).map((option) => ({
                        value: option,
                        label: option,
                      }))}
                    />
                  </div>
                )}
              />
            );
          }

          if (definition.fieldType === 'long_text') {
            return (
              <Controller
                key={String(definition._id)}
                name={name}
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <FormFieldLabel htmlFor={name} label={definition.label} />
                    <Textarea
                      id={name}
                      value={typeof field.value === 'string' ? field.value : ''}
                      onChange={field.onChange}
                      rows={4}
                    />
                  </div>
                )}
              />
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}

export function CustomFieldsStateSection<TId = unknown>({
  definitions,
  savedValues,
  entityId,
  values,
  onChange,
  sectionLabel = 'Custom fields',
  trueLabel,
  falseLabel,
  selectPlaceholder = 'Select...',
}: CustomFieldsStateSectionProps<TId>): React.ReactElement | null {
  useEffect(() => {
    if (!entityId || !savedValues) {
      return;
    }

    const nextValues = mapCustomFieldValuesToFormValues(savedValues);

    if (!areCustomFieldFormValuesEqual(values, nextValues)) {
      onChange(nextValues);
    }
  }, [entityId, onChange, savedValues, values]);

  const activeDefinitions = getActiveDefinitions(definitions);
  if (activeDefinitions.length === 0) {
    return null;
  }

  const updateValue = (fieldId: string, value: unknown): void => {
    onChange({ ...values, [fieldId]: value });
  };
  const copy = { trueLabel, falseLabel };

  return (
    <div className="space-y-4 border-t border-border/70 pt-5">
      <FormFieldLabel label={sectionLabel} icon={ListChecks} />
      {activeDefinitions.map((definition) => {
        const fieldId = String(definition._id);
        const value = values[fieldId];

        if (definition.fieldType === 'number') {
          return (
            <div key={fieldId} className="space-y-2">
              <FormFieldLabel label={definition.label} />
              <Input
                type="number"
                inputMode="decimal"
                value={(value as number | string | undefined) ?? ''}
                onChange={(event) => {
                  updateValue(fieldId, event.target.value === '' ? undefined : Number(event.target.value));
                }}
              />
            </div>
          );
        }

        if (definition.fieldType === 'boolean') {
          return (
            <div key={fieldId} className="space-y-2">
              <FormFieldLabel label={definition.label} />
              <div className="flex flex-wrap gap-2">
                {[true, false].map((option) => {
                  const selected = value === option;
                  return (
                    <button
                      key={String(option)}
                      type="button"
                      onClick={() => {
                        updateValue(fieldId, selected ? undefined : option);
                      }}
                      className={cn(
                        'inline-flex h-8 items-center rounded-md border px-3 text-sm transition-colors',
                        selected
                          ? 'border-primary/30 bg-primary/10 text-primary'
                          : 'border-border bg-background text-muted-foreground hover:bg-muted/40',
                      )}
                    >
                      {getBooleanLabel(option, copy)}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        }

        if (definition.fieldType === 'single_select') {
          return (
            <div key={fieldId} className="space-y-2">
              <FormFieldLabel label={definition.label} />
              <SearchableSelect
                value={typeof value === 'string' ? value : ''}
                onValueChange={(nextValue) => {
                  updateValue(fieldId, nextValue);
                }}
                options={(definition.options ?? []).map((option) => ({ value: option, label: option }))}
                placeholder={selectPlaceholder}
              />
            </div>
          );
        }

        if (definition.fieldType === 'date') {
          return (
            <div key={fieldId} className="space-y-2">
              <FormFieldLabel label={definition.label} />
              <CustomDateField
                value={typeof value === 'string' ? value : ''}
                onChange={(nextValue) => {
                  updateValue(fieldId, nextValue);
                }}
              />
            </div>
          );
        }

        return (
          <div key={fieldId} className="space-y-2">
            <FormFieldLabel label={definition.label} />
            <Textarea
              value={typeof value === 'string' ? value : ''}
              onChange={(event) => {
                updateValue(fieldId, event.target.value);
              }}
              rows={4}
            />
          </div>
        );
      })}
    </div>
  );
}

export function CustomFieldsDetailRows<TId = unknown>({
  definitions,
  values,
  emptyValue = '--',
  labelColumnClassName,
}: CustomFieldsDetailRowsProps<TId>): React.ReactElement | null {
  const valuesByDefinitionId = useMemo(
    () => new Map((values ?? []).map((value) => [String(value.fieldDefinitionId), value])),
    [values],
  );
  const activeDefinitions = getActiveDefinitions(definitions);

  if (activeDefinitions.length === 0) {
    return null;
  }

  return (
    <>
      {activeDefinitions.map((definition) => {
        const displayValue = formatCustomFieldDisplayValue(
          definition,
          valuesByDefinitionId.get(String(definition._id)),
          emptyValue,
        );

        return (
          <FieldDetailRow
            key={String(definition._id)}
            icon={ListChecks}
            label={definition.label}
            labelColumnClassName={labelColumnClassName}
            value={(
              <TruncatedContent tooltip={displayValue} className="text-left">
                {displayValue}
              </TruncatedContent>
            )}
          />
        );
      })}
    </>
  );
}
