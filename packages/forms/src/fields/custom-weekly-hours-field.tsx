'use client';

import { cn, useKitTexts } from '@carefully-built/ui';
import { Controller, useFormContext } from 'react-hook-form';

import type { LucideIcon } from 'lucide-react';
import type { FieldValues, Path } from 'react-hook-form';

import { FieldMessage } from './field-message';
import { weeklyHoursFieldTexts } from './field-texts';
import { FormFieldLabel } from './form-field-label';
import { WEEKDAYS, type WeeklyHoursRange } from './weekly-hours';
import { WeeklyHoursDay } from './weekly-hours-day';

interface CustomWeeklyHoursFieldProps<TValues extends FieldValues> {
  readonly name: Path<TValues>;
  readonly label?: string;
  readonly labelIcon?: LucideIcon;
  readonly disabled?: boolean;
  readonly className?: string;
}

/**
 * Days of the week with one or more time ranges each (availability, call
 * windows, opening hours). The value is a flat `WeeklyHoursRange[]`, see
 * `weeklyHoursSchema`.
 */
export function CustomWeeklyHoursField<TValues extends FieldValues>({
  name,
  label,
  labelIcon,
  disabled = false,
  className,
}: CustomWeeklyHoursFieldProps<TValues>): React.ReactElement {
  const { control } = useFormContext<TValues>();
  const texts = useKitTexts(weeklyHoursFieldTexts);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const value = (field.value ?? []) as readonly WeeklyHoursRange[];
        return (
          <div className={cn('space-y-2', className)}>
            {label ? <FormFieldLabel label={label} icon={labelIcon} hasError={Boolean(error)} /> : null}
            <div className="divide-y rounded-xl border px-3">
              {WEEKDAYS.map((weekday) => (
                <WeeklyHoursDay
                  key={weekday}
                  weekday={weekday}
                  label={texts.weekdays[weekday - 1] ?? String(weekday)}
                  value={value}
                  onChange={field.onChange}
                  disabled={disabled}
                  addLabel={texts.addRangeLabel}
                  removeLabel={texts.removeRangeLabel}
                  closedLabel={texts.closedLabel}
                />
              ))}
            </div>
            <FieldMessage message={error ? texts.invalidRangeMessage : undefined} />
          </div>
        );
      }}
    />
  );
}
