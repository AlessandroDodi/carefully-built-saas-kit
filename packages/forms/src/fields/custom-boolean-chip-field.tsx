'use client';

import { CustomChipSelectField } from './custom-chip-select-field';

import type { LucideIcon } from 'lucide-react';
import type { FieldValues, Path } from 'react-hook-form';

interface CustomBooleanChipFieldProps<TValues extends FieldValues> {
  readonly name: Path<TValues>;
  readonly label?: string;
  readonly labelIcon?: LucideIcon;
  readonly yesLabel?: string;
  readonly noLabel?: string;
  readonly disabled?: boolean;
  readonly className?: string;
}

export function CustomBooleanChipField<TValues extends FieldValues>({
  name,
  label,
  labelIcon,
  yesLabel = 'Yes',
  noLabel = 'No',
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
      options={[
        { value: 'yes', label: yesLabel },
        { value: 'no', label: noLabel },
      ]}
    />
  );
}
