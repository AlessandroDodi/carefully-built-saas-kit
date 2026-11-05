'use client';

import { Button, Input, Switch, cn } from '@carefully-built/ui';
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

/**
 * One row of the weekly hours field: a switch turns the day on or off, the
 * ranges sit next to it. Only a second range gets a remove button, so the
 * common case (one range per day) shows no extra controls.
 */
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
  const switchId = `weekly-hours-${String(weekday)}`;

  return (
    <div className="flex min-h-9 items-start gap-4 py-2">
      <label htmlFor={switchId} className="flex w-32 shrink-0 items-center gap-3 pt-1.5">
        <Switch
          id={switchId}
          checked={isOn}
          disabled={disabled}
          onCheckedChange={() => onChange(toggleDay(value, weekday, { start: '09:00', end: '18:00' }))}
        />
        <span className={cn('text-sm', !isOn && 'text-muted-foreground')}>{label}</span>
      </label>
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-1 gap-y-2">
        {!isOn ? <p className="text-muted-foreground pt-1.5 text-sm">{closedLabel}</p> : null}
        {ranges.map((range, index) => (
          <div key={`${String(range.weekday)}-${String(index)}`} className="flex items-center gap-1.5">
            <TimeInput value={range.start} label={label} disabled={disabled} onChange={(start) => onChange(updateRange(value, range, { start }))} />
            <span className="text-muted-foreground text-sm">–</span>
            <TimeInput value={range.end} label={label} disabled={disabled} onChange={(end) => onChange(updateRange(value, range, { end }))} />
            {ranges.length > 1 ? (
              <Button type="button" variant="ghost" size="icon-xs" aria-label={removeLabel} disabled={disabled} onClick={() => onChange(removeRange(value, range))}>
                <X />
              </Button>
            ) : null}
          </div>
        ))}
        {isOn && ranges.length < 3 ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label={addLabel}
            title={addLabel}
            disabled={disabled}
            onClick={() => onChange(addRange(value, weekday))}
          >
            <Plus />
          </Button>
        ) : null}
      </div>
    </div>
  );
}

interface TimeInputProps {
  readonly value: string;
  readonly label: string;
  readonly disabled: boolean;
  readonly onChange: (value: string) => void;
}

function TimeInput({ value, label, disabled, onChange }: TimeInputProps): React.ReactElement {
  return (
    <Input
      type="time"
      value={value}
      disabled={disabled}
      aria-label={`${label} ${value}`}
      className="h-8 w-[6.5rem] text-center tabular-nums"
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
