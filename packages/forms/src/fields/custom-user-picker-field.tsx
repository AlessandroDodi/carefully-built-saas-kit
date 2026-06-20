'use client';

import { Controller, useFormContext } from 'react-hook-form';

import { FormFieldLabel } from './form-field-label';

import type { LucideIcon } from 'lucide-react';
import type { FieldValues, Path } from 'react-hook-form';

import { UserPicker, type UserPickerCopy, type UserPickerOption } from '@carefully-built/user-picker';
import { cn } from '@carefully-built/ui';

interface CustomUserPickerFieldProps<TValues extends FieldValues> {
  readonly name: Path<TValues>;
  readonly label?: string;
  readonly labelIcon?: LucideIcon;
  readonly mode: 'single' | 'multiple';
  readonly options: readonly UserPickerOption[];
  readonly placeholder?: string;
  readonly pickerCopy?: UserPickerCopy;
  readonly disabled?: boolean;
  readonly className?: string;
}

export function CustomUserPickerField<TValues extends FieldValues>({
  name,
  label,
  labelIcon,
  mode,
  options,
  placeholder,
  pickerCopy,
  disabled = false,
  className,
}: CustomUserPickerFieldProps<TValues>): React.ReactElement {
  const { control } = useFormContext<TValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const fieldClassName = cn(error && 'border-destructive');

        return (
          <div className={cn('space-y-2', className)}>
            {label ? (
              <FormFieldLabel
                htmlFor={name}
                label={label}
                icon={labelIcon}
                hasError={Boolean(error)}
              />
            ) : null}
            {mode === 'single' ? (
              <UserPicker
                mode="single"
                value={(field.value as string | undefined) ?? undefined}
                onValueChange={(nextValue) => {
                  field.onChange(nextValue ?? '');
                  field.onBlur();
                }}
                options={options}
                placeholder={placeholder}
                copy={pickerCopy}
                disabled={disabled}
                triggerClassName={fieldClassName}
              />
            ) : (
              <UserPicker
                mode="multiple"
                value={Array.isArray(field.value) ? (field.value as string[]) : []}
                onValueChange={(nextValue) => {
                  field.onChange(nextValue);
                  field.onBlur();
                }}
                options={options}
                placeholder={placeholder}
                copy={pickerCopy}
                disabled={disabled}
                triggerClassName={fieldClassName}
              />
            )}
            {error?.message ? <p className="text-sm text-destructive">{error.message}</p> : null}
          </div>
        );
      }}
    />
  );
}
