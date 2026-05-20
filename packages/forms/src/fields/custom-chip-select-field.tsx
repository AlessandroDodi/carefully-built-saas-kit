'use client';

import { Controller, useFormContext } from 'react-hook-form';

import { FormFieldLabel } from './form-field-label';

import type { LucideIcon } from 'lucide-react';
import type { FieldValues, Path } from 'react-hook-form';

import { ChipButton } from '@carefully-built/ui';
import { cn } from '@carefully-built/ui';

interface ChipOption {
  readonly value: string;
  readonly label: string;
}

interface CustomChipSelectFieldProps<TValues extends FieldValues> {
  readonly name: Path<TValues>;
  readonly label?: string;
  readonly labelIcon?: LucideIcon;
  readonly options: readonly ChipOption[];
  readonly disabled?: boolean;
  readonly allowDeselect?: boolean;
  readonly multiple?: boolean;
  readonly className?: string;
  readonly getOptionStyle?: (args: { value: string; index: number }) => React.CSSProperties;
}

function getCurrentValues(value: unknown): string[] {
  return Array.isArray(value) ? (value as string[]) : [];
}

function getNextMultipleValue({
  currentValues,
  optionValue,
  isSelected,
}: {
  readonly currentValues: readonly string[];
  readonly optionValue: string;
  readonly isSelected: boolean;
}): string[] {
  return isSelected
    ? currentValues.filter((value) => value !== optionValue)
    : [...currentValues, optionValue];
}

export function CustomChipSelectField<TValues extends FieldValues>({
  name,
  label,
  labelIcon,
  options,
  disabled = false,
  allowDeselect = true,
  multiple = false,
  className,
  getOptionStyle,
}: CustomChipSelectFieldProps<TValues>): React.ReactElement {
  const { control } = useFormContext<TValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const currentValues = getCurrentValues(field.value);
        const allOptionValues = options.map((option) => option.value);
        const hasAllOptionsSelected =
          multiple &&
          allOptionValues.length > 0 &&
          allOptionValues.every((optionValue) => currentValues.includes(optionValue));

        return (
          <div className={cn('space-y-2', className)}>
            {label ? (
              <FormFieldLabel htmlFor={name} label={label} icon={labelIcon} hasError={Boolean(error)} />
            ) : null}

            <div className="flex flex-wrap gap-2">
              {multiple ? (
                <ChipButton
                  disabled={disabled || options.length === 0}
                  selected={hasAllOptionsSelected}
                  onClick={() => {
                    field.onChange(hasAllOptionsSelected ? [] : allOptionValues);
                    field.onBlur();
                  }}
                  className={cn(
                    error && !hasAllOptionsSelected && 'shadow-[inset_0_0_0_1px_theme(colors.destructive)]'
                  )}
                >
                  Tutti
                </ChipButton>
              ) : null}

              {options.map((option, index) => {
                const isSelected = multiple
                  ? currentValues.includes(option.value)
                  : field.value === option.value;
                const selectedStyle = getOptionStyle?.({
                  value: option.value,
                  index,
                });

                return (
                  <ChipButton
                    key={option.value}
                    disabled={disabled}
                    selected={isSelected}
                    onClick={() => {
                      if (isSelected && !allowDeselect) {
                        field.onBlur();
                        return;
                      }

                      field.onChange(
                        multiple
                          ? getNextMultipleValue({
                              currentValues,
                              optionValue: option.value,
                              isSelected,
                            })
                          : isSelected ? '' : option.value
                      );
                      field.onBlur();
                    }}
                    className={cn(
                      error && !isSelected && 'shadow-[inset_0_0_0_1px_theme(colors.destructive)]'
                    )}
                    style={isSelected ? selectedStyle : undefined}
                  >
                    {option.label}
                  </ChipButton>
                );
              })}
            </div>

            {error?.message ? (
              <p className="text-sm text-destructive">{error.message}</p>
            ) : null}
          </div>
        );
      }}
    />
  );
}
