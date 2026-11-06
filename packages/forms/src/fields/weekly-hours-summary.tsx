'use client';

import { useKitTexts } from '@carefully-built/ui';

import { weeklyHoursFieldTexts } from './field-texts';
import { WEEKDAYS, rangesForDay, type Weekday, type WeeklyHoursRange } from './weekly-hours';

export interface WeeklyHoursGroup {
  readonly weekdays: readonly Weekday[];
  readonly ranges: readonly { start: string; end: string }[];
}

function dayKey(value: readonly WeeklyHoursRange[], weekday: Weekday): string {
  return rangesForDay(value, weekday).map((range) => `${range.start}-${range.end}`).sort().join(',');
}

/** Consecutive days with identical ranges collapse into one group; closed days are left out. */
export function groupWeeklyHours(value: readonly WeeklyHoursRange[]): WeeklyHoursGroup[] {
  const groups: { weekdays: Weekday[]; key: string; ranges: WeeklyHoursGroup['ranges'] }[] = [];
  for (const weekday of WEEKDAYS) {
    const key = dayKey(value, weekday);
    if (!key) continue;
    const last = groups.at(-1);
    if (last && last.key === key && last.weekdays.at(-1) === weekday - 1) {
      last.weekdays.push(weekday);
    } else {
      groups.push({ weekdays: [weekday], key, ranges: rangesForDay(value, weekday).map(({ start, end }) => ({ start, end })) });
    }
  }
  return groups.map(({ weekdays, ranges }) => ({ weekdays, ranges }));
}

export interface WeeklyHoursSummaryProps {
  readonly value: readonly WeeklyHoursRange[];
  readonly emptyLabel?: string;
  readonly className?: string;
}

/** Read-only summary of weekly hours, e.g. "Lun – Ven 09:30–19:00". */
export function WeeklyHoursSummary({ value, emptyLabel, className }: WeeklyHoursSummaryProps): React.ReactElement {
  const texts = useKitTexts(weeklyHoursFieldTexts);
  const label = (weekday: Weekday): string => (texts.weekdays[weekday - 1] ?? String(weekday)).slice(0, 3);
  const groups = groupWeeklyHours(value);
  if (groups.length === 0) {
    return <p className={className ?? 'text-muted-foreground text-sm italic'}>{emptyLabel ?? texts.closedLabel}</p>;
  }
  return (
    <dl className={className ?? 'grid gap-1.5 text-sm'}>
      {groups.map((group) => (
        <div key={group.weekdays.join('-')} className="flex gap-3">
          <dt className="text-foreground w-24 shrink-0 font-medium">
            {group.weekdays.length > 1 ? `${label(group.weekdays[0] as Weekday)} – ${label(group.weekdays.at(-1) as Weekday)}` : label(group.weekdays[0] as Weekday)}
          </dt>
          <dd className="text-muted-foreground">{group.ranges.map((range) => `${range.start}–${range.end}`).join(', ')}</dd>
        </div>
      ))}
    </dl>
  );
}
