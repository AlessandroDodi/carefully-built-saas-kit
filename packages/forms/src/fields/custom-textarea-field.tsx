'use client';

import { Controller, useFormContext } from 'react-hook-form';

import type { LucideIcon } from 'lucide-react';
import type { FieldValues, Path } from 'react-hook-form';

import { Textarea, cn } from '@carefully-built/ui';

import { FieldMessage } from './field-message';
import { FormFieldLabel } from './form-field-label';

interface CustomTextareaFieldProps<TValues extends FieldValues> {
  readonly name: Path<TValues>;
  readonly label?: string;
  readonly labelIcon?: LucideIcon;
  readonly placeholder?: string;
  readonly disabled?: boolean;
  readonly autoFocus?: boolean;
  readonly rows?: number;
  readonly className?: string;
}

export function CustomTextareaField<TValues extends FieldValues>({
  name,
  label,
  labelIcon,
  placeholder,
  disabled = false,
  autoFocus = false,
  rows = 4,
  className,
}: CustomTextareaFieldProps<TValues>): React.ReactElement {
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
          <Textarea
            {...field}
            id={name}
            placeholder={placeholder}
            disabled={disabled}
            autoFocus={autoFocus}
            rows={rows}
            className={error ? 'border-destructive' : ''}
            value={field.value ?? ''}
          />
          <FieldMessage message={error?.message} />
        </div>
      )}
    />
  );
}
