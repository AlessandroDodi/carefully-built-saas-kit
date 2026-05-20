'use client';

import { Controller, useFormContext } from 'react-hook-form';

import { FormFieldLabel } from './form-field-label';

import type { LucideIcon } from 'lucide-react';
import type { FieldValues, Path } from 'react-hook-form';

import {
  AssociationPicker,
  type AssociationPickerCreateConfig,
  type AssociationEntityType,
  type AssociationPickerOption,
} from '@carefully-built/association-picker';
import { cn } from '@carefully-built/ui';

interface CustomSingleAssociationPickerFieldProps<TValues extends FieldValues> {
  readonly name: Path<TValues>;
  readonly label?: string;
  readonly labelIcon?: LucideIcon;
  readonly placeholder?: string;
  readonly options: AssociationPickerOption[];
  readonly allowedEntityTypes?: readonly AssociationEntityType[];
  readonly excludedEntityTypes?: readonly AssociationEntityType[];
  readonly disabled?: boolean;
  readonly className?: string;
  readonly createConfig?: AssociationPickerCreateConfig;
}

export function CustomSingleAssociationPickerField<TValues extends FieldValues>({
  name,
  label,
  labelIcon,
  placeholder,
  options,
  allowedEntityTypes,
  excludedEntityTypes,
  disabled = false,
  className,
  createConfig,
}: CustomSingleAssociationPickerFieldProps<TValues>): React.ReactElement {
  const { control } = useFormContext<TValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className={cn('space-y-2', className)}>
          {label ? (
            <FormFieldLabel htmlFor={name} label={label} icon={labelIcon} hasError={Boolean(error)} />
          ) : null}
          <AssociationPicker
            options={options}
            value={typeof field.value === 'string' && field.value.length > 0 ? [field.value] : []}
            onChange={(value) => {
              field.onChange(value[0] ?? '');
              field.onBlur();
            }}
            maxSelections={1}
            allowedEntityTypes={allowedEntityTypes}
            excludedEntityTypes={excludedEntityTypes}
            placeholder={placeholder}
            disabled={disabled}
            createConfig={createConfig}
          />
          {error?.message ? <p className="text-sm text-destructive">{error.message}</p> : null}
        </div>
      )}
    />
  );
}
