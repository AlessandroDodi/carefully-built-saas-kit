'use client';

import { ChipButton, Input, cn } from '@carefully-built/ui';
import { Plus, X } from 'lucide-react';

import {
  addRange,
  rangesForDay,
  removeRange,
  toggleDay,
  updateRange,
  type Weekday,
  type WeeklyHoursRange,
} from './weekly-hours';

interface WeeklyHoursDayProps {
  readonly weekday: Weekday;
  readonly label: string;
  readonly value: readonly WeeklyHoursRange[];
  readonly onChange: (value: WeeklyHoursRange[]) => void;
  readonly disabled: boolean;
  readonly addLabel: string;
  readonly removeLabel: string;
  readonly closedLabel: string;
}

/** One row of the weekly hours field: the day chip and its time ranges. */
export function WeeklyHoursDay({
  weekday,
  label,
  value,
  onChange,
  disabled,
  addLabel,
  removeLabel,
  closedLabel,
}: WeeklyHoursDayProps): React.ReactElement {
  const ranges = rangesForDay(value, weekday);
  const isOn = ranges.length > 0;

  return (
    <div className="flex items-start gap-3">
      <ChipButton
        selected={isOn}
        disabled={disabled}
        className="w-14 justify-center"
        onClick={() => onChange(toggleDay(value, weekday, { start: '09:00', end: '18:00' }))}
      >
        {label}
      </ChipButton>
      <div className={cn('flex min-w-0 flex-1 flex-col gap-2', !isOn && 'justify-center')}>
        {!isOn ? <p className="text-muted-foreground py-1 text-sm">{closedLabel}</p> : null}
        {ranges.map((range, index) => (
          <div key={`${String(range.weekday)}-${String(index)}`} className="flex items-center gap-2">
            <Input
              type="time"
              value={range.start}
              disabled={disabled}
              aria-label={`${label} ${range.start}`}
              className="w-28"
              onChange={(event) => onChange(updateRange(value, range, { start: event.target.value }))}
            />
            <span className="text-muted-foreground text-sm">–</span>
            <Input
              type="time"
              value={range.end}
              disabled={disabled}
              aria-label={`${label} ${range.end}`}
              className="w-28"
              onChange={(event) => onChange(updateRange(value, range, { end: event.target.value }))}
            />
            <button
              type="button"
              aria-label={removeLabel}
              disabled={disabled}
              className="text-muted-foreground hover:text-foreground rounded-full p-1"
              onClick={() => onChange(removeRange(value, range))}
            >
              <X className="size-4" />
            </button>
            {index === ranges.length - 1 ? (
              <button
                type="button"
                aria-label={addLabel}
                disabled={disabled}
                className="text-muted-foreground hover:text-foreground rounded-full p-1"
                onClick={() => onChange(addRange(value, weekday))}
              >
                <Plus className="size-4" />
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
