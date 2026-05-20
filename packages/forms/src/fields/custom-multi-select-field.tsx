'use client';

import { Controller, useFormContext } from 'react-hook-form';

import { FormFieldLabel } from './form-field-label';

import type { LucideIcon } from 'lucide-react';
import type { FieldValues, Path } from 'react-hook-form';

import { ChipButton } from '@carefully-built/ui';
import { cn } from '@carefully-built/ui';

interface MultiSelectOption {
  readonly value: string;
  readonly label: string;
}

interface CustomMultiSelectFieldProps<TValues extends FieldValues> {
  readonly name: Path<TValues>;
  readonly label?: string;
  readonly labelIcon?: LucideIcon;
  readonly options: readonly MultiSelectOption[];
  readonly disabled?: boolean;
  readonly className?: string;
}

export function CustomMultiSelectField<TValues extends FieldValues>({
  name,
  label,
  labelIcon,
  options,
  disabled = false,
  className,
}: CustomMultiSelectFieldProps<TValues>): React.ReactElement {
  const { control } = useFormContext<TValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const selectedValues = Array.isArray(field.value) ? (field.value as string[]) : [];

        return (
          <div className={cn('space-y-2', className)}>
            {label ? (
              <FormFieldLabel htmlFor={name} label={label} icon={labelIcon} hasError={Boolean(error)} />
            ) : null}

            <div className="flex flex-wrap gap-2">
              {options.map((option) => {
                const isSelected = selectedValues.includes(option.value);

                return (
                  <ChipButton
                    key={option.value}
                    disabled={disabled}
                    selected={isSelected}
                    onClick={() => {
                      const nextValue = isSelected
                        ? selectedValues.filter((value: string) => value !== option.value)
                        : [...selectedValues, option.value];

                      field.onChange(nextValue);
                      field.onBlur();
                    }}
                    className={cn(
                      'tracking-[-0.28px] transition-colors',
                      error && !isSelected && 'shadow-[inset_0_0_0_1px_theme(colors.destructive)]'
                    )}
                    style={isSelected ? { backgroundColor: '#f3eeff', borderColor: '#d9cdfd', color: '#713dff' } : undefined}
                  >
                    {option.label}
                  </ChipButton>
                );
              })}
            </div>

            {error?.message ? <p className="text-sm text-destructive">{error.message}</p> : null}
          </div>
        );
      }}
    />
  );
}
