'use client';

import { Controller, useFormContext } from 'react-hook-form';

import { FormFieldLabel } from './form-field-label';

import type { LucideIcon } from 'lucide-react';
import type { FieldValues, Path } from 'react-hook-form';

import { AgentPicker, type AgentPickerOption } from '@carefully-built/agent-picker';
import { cn } from '@carefully-built/ui';

interface CustomAgentPickerFieldProps<TValues extends FieldValues> {
  readonly name: Path<TValues>;
  readonly label?: string;
  readonly labelIcon?: LucideIcon;
  readonly mode: 'single' | 'multiple';
  readonly options: readonly AgentPickerOption[];
  readonly placeholder?: string;
  readonly disabled?: boolean;
  readonly className?: string;
}

export function CustomAgentPickerField<TValues extends FieldValues>({
  name,
  label,
  labelIcon,
  mode,
  options,
  placeholder,
  disabled = false,
  className,
}: CustomAgentPickerFieldProps<TValues>): React.ReactElement {
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
              <AgentPicker
                mode="single"
                value={(field.value as string | undefined) ?? undefined}
                onValueChange={(nextValue) => {
                  field.onChange(nextValue ?? '');
                  field.onBlur();
                }}
                options={options}
                placeholder={placeholder}
                disabled={disabled}
                triggerClassName={fieldClassName}
              />
            ) : (
              <AgentPicker
                mode="multiple"
                value={Array.isArray(field.value) ? (field.value as string[]) : []}
                onValueChange={(nextValue) => {
                  field.onChange(nextValue);
                  field.onBlur();
                }}
                options={options}
                placeholder={placeholder}
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
