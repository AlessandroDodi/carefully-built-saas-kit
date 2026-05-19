'use client';

import { Controller, useFormContext } from 'react-hook-form';

import type { LucideIcon } from 'lucide-react';
import type { InputHTMLAttributes } from 'react';
import type { FieldValues, Path } from 'react-hook-form';

import { Input, cn } from '@carefully-built/ui';

import { FieldMessage } from './field-message';
import { FormFieldLabel } from './form-field-label';

interface CustomInputFieldProps<TValues extends FieldValues> {
  readonly name: Path<TValues>;
  readonly label?: string;
  readonly labelIcon?: LucideIcon;
  readonly placeholder?: string;
  readonly type?: string;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number | 'any';
  readonly inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode'];
  readonly disabled?: boolean;
  readonly autoFocus?: boolean;
  readonly autoComplete?: InputHTMLAttributes<HTMLInputElement>['autoComplete'];
  readonly className?: string;
}

function shouldPreventNegativeNumberInput(
  type: string,
  min: number | undefined,
  key: string,
): boolean {
  return type === 'number' && min !== undefined && min >= 0 && key === '-';
}

export function CustomInputField<TValues extends FieldValues>({
  name,
  label,
  labelIcon,
  placeholder,
  type = 'text',
  min,
  max,
  step,
  inputMode,
  disabled = false,
  autoFocus = false,
  autoComplete,
  className,
}: CustomInputFieldProps<TValues>): React.ReactElement {
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
          <Input
            {...field}
            id={name}
            type={type}
            placeholder={placeholder}
            min={min}
            max={max}
            step={step}
            inputMode={inputMode}
            disabled={disabled}
            autoFocus={autoFocus}
            autoComplete={autoComplete}
            className={error ? 'border-destructive' : ''}
            value={typeof field.value === 'string' || typeof field.value === 'number' ? field.value : ''}
            onKeyDown={(event) => {
              if (shouldPreventNegativeNumberInput(type, min, event.key)) {
                event.preventDefault();
              }
            }}
          />
          <FieldMessage message={error?.message} />
        </div>
      )}
    />
  );
}
