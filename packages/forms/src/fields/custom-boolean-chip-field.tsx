'use client';

import { CustomChipSelectField } from './custom-chip-select-field';

import type { LucideIcon } from 'lucide-react';
import type { FieldValues, Path } from 'react-hook-form';

const BOOLEAN_CHIP_OPTIONS = [
  { value: 'yes', label: 'Si' },
  { value: 'no', label: 'No' },
] as const;

interface CustomBooleanChipFieldProps<TValues extends FieldValues> {
  readonly name: Path<TValues>;
  readonly label?: string;
  readonly labelIcon?: LucideIcon;
  readonly disabled?: boolean;
  readonly className?: string;
}

export function CustomBooleanChipField<TValues extends FieldValues>({
  name,
  label,
  labelIcon,
  disabled = false,
  className,
}: CustomBooleanChipFieldProps<TValues>): React.ReactElement {
  return (
    <CustomChipSelectField<TValues>
      name={name}
      label={label}
      labelIcon={labelIcon}
      disabled={disabled}
      className={className}
      options={BOOLEAN_CHIP_OPTIONS}
    />
  );
}
