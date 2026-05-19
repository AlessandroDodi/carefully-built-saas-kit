'use client';

import { Controller, useFormContext } from 'react-hook-form';

import type { LucideIcon } from 'lucide-react';
import type { FieldValues, Path } from 'react-hook-form';

import { SearchableSelect, cn } from '@carefully-built/ui';

import { FieldMessage } from './field-message';
import { FormFieldLabel } from './form-field-label';

interface SelectOption {
  readonly value: string;
  readonly label: string;
}

interface CustomSelectFieldProps<TValues extends FieldValues> {
  readonly name: Path<TValues>;
  readonly label?: string;
  readonly labelIcon?: LucideIcon;
  readonly placeholder?: string;
  readonly options: readonly SelectOption[];
  readonly disabled?: boolean;
  readonly className?: string;
}

export function CustomSelectField<TValues extends FieldValues>({
  name,
  label,
  labelIcon,
  placeholder = 'Seleziona...',
  options,
  disabled = false,
  className,
}: CustomSelectFieldProps<TValues>): React.ReactElement {
  const { control } = useFormContext<TValues>();
  const validOptions = options.filter((option) => option.value !== '');

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className={cn('space-y-2', className)}>
          {label ? (
            <FormFieldLabel htmlFor={name} label={label} icon={labelIcon} hasError={Boolean(error)} />
          ) : null}
          <SearchableSelect
            value={(field.value as string) ?? ''}
            onValueChange={field.onChange}
            disabled={disabled}
            placeholder={placeholder}
            options={validOptions}
            className={cn('w-full', error ? 'border-destructive' : '')}
          />
          <FieldMessage message={error?.message} />
        </div>
      )}
    />
  );
}
