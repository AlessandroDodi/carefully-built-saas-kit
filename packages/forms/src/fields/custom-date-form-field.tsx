'use client';

import { Controller, useFormContext } from 'react-hook-form';

import { CustomDateField } from './custom-date-field';
import { FormFieldLabel } from './form-field-label';

import type { LucideIcon } from 'lucide-react';
import type { FieldValues, Path } from 'react-hook-form';

import { cn } from '@carefully-built/ui';

interface CustomDateFormFieldProps<TValues extends FieldValues> {
  readonly name: Path<TValues>;
  readonly label?: string;
  readonly labelIcon?: LucideIcon;
  readonly placeholder?: string;
  readonly disabled?: boolean;
  readonly className?: string;
}

export function CustomDateFormField<TValues extends FieldValues>({
  name,
  label,
  labelIcon,
  placeholder,
  disabled = false,
  className,
}: CustomDateFormFieldProps<TValues>): React.ReactElement {
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
          <CustomDateField
            id={name}
            value={typeof field.value === 'string' ? field.value : ''}
            onChange={(nextValue) => {
              field.onChange(nextValue ?? '');
            }}
            placeholder={placeholder}
            hasError={Boolean(error)}
            disabled={disabled}
          />
          {error?.message ? (
            <p className="text-sm text-destructive">{error.message}</p>
          ) : null}
        </div>
      )}
    />
  );
}
