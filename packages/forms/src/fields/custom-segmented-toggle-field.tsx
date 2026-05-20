'use client';

import { Controller, useFormContext } from 'react-hook-form';

import type { FieldValues, Path } from 'react-hook-form';

import {
  SegmentedToggle,
  type SegmentedToggleOption,
} from '@carefully-built/ui';
import { Label } from '@carefully-built/ui';
import { cn } from '@carefully-built/ui';

interface CustomSegmentedToggleFieldProps<
  TValues extends FieldValues,
  TValue extends string,
> {
  readonly name: Path<TValues>;
  readonly label?: string;
  readonly options: readonly SegmentedToggleOption<TValue>[];
  readonly disabled?: boolean;
  readonly className?: string;
}

export function CustomSegmentedToggleField<
  TValues extends FieldValues,
  TValue extends string,
>({
  name,
  label,
  options,
  disabled = false,
  className,
}: CustomSegmentedToggleFieldProps<TValues, TValue>): React.ReactElement {
  const { control } = useFormContext<TValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className={cn('space-y-2', className)}>
          {label ? (
            <Label htmlFor={name} className={error ? 'text-destructive' : ''}>
              {label}
            </Label>
          ) : null}
          <SegmentedToggle
            value={field.value as TValue}
            onChange={field.onChange}
            options={options}
            disabled={disabled}
          />
          {error?.message ? <p className="text-sm text-destructive">{error.message}</p> : null}
        </div>
      )}
    />
  );
}
