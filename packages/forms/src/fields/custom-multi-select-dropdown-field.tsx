'use client';

import { ChevronDown } from 'lucide-react';
import { Controller, useFormContext } from 'react-hook-form';

import { FormFieldLabel } from './form-field-label';

import type { LucideIcon } from 'lucide-react';
import type { FieldValues, Path } from 'react-hook-form';

import { Button } from '@carefully-built/ui';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@carefully-built/ui';
import { cn } from '@carefully-built/ui';

interface MultiSelectDropdownOption {
  readonly value: string;
  readonly label: string;
}

interface CustomMultiSelectDropdownFieldProps<TValues extends FieldValues> {
  readonly name: Path<TValues>;
  readonly label?: string;
  readonly labelIcon?: LucideIcon;
  readonly options: readonly MultiSelectDropdownOption[];
  readonly placeholder?: string;
  readonly disabled?: boolean;
  readonly className?: string;
}

function getTriggerLabel(args: {
  readonly values: string[];
  readonly options: readonly MultiSelectDropdownOption[];
  readonly placeholder: string;
}): string {
  if (args.values.length === 0) {
    return args.placeholder;
  }

  const selectedLabels = args.options
    .filter((option) => args.values.includes(option.value))
    .map((option) => option.label);

  if (selectedLabels.length <= 2) {
    return selectedLabels.join(', ');
  }

  return `${selectedLabels.slice(0, 2).join(', ')} +${String(selectedLabels.length - 2)}`;
}

export function CustomMultiSelectDropdownField<TValues extends FieldValues>({
  name,
  label,
  labelIcon,
  options,
  placeholder = 'Seleziona opzioni',
  disabled = false,
  className,
}: CustomMultiSelectDropdownFieldProps<TValues>): React.ReactElement {
  const { control } = useFormContext<TValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const currentValue = (Array.isArray(field.value) ? field.value : []) as string[];

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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={disabled}
                  className={cn(
                    'w-full justify-between rounded-[14px] border-[#e7e8eb] bg-white px-4 py-3 font-normal text-left',
                    !currentValue.length && 'text-muted-foreground',
                    error && 'border-destructive'
                  )}
                >
                  <span className="truncate">
                    {getTriggerLabel({
                      values: currentValue,
                      options,
                      placeholder,
                    })}
                  </span>
                  <ChevronDown className="size-4 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[var(--radix-dropdown-menu-trigger-width)]">
                {options.map((option) => {
                  const checked = currentValue.includes(option.value);

                  return (
                    <DropdownMenuCheckboxItem
                      key={option.value}
                      checked={checked}
                      onCheckedChange={(nextChecked) => {
                        const nextValue = nextChecked
                          ? [...currentValue, option.value]
                          : currentValue.filter((value) => value !== option.value);

                        field.onChange(nextValue);
                        field.onBlur();
                      }}
                    >
                      <span className="truncate">{option.label}</span>
                    </DropdownMenuCheckboxItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {error?.message ? <p className="text-sm text-destructive">{error.message}</p> : null}
          </div>
        );
      }}
    />
  );
}
