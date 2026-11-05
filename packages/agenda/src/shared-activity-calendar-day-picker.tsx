'use client';

import { useKitTexts } from '@carefully-built/ui';

import { isSameLocalDay } from './activity-calendar-widget';
import { agendaTexts } from './agenda-texts';

function cn(...classes: readonly (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

function formatChipWeekday(date: Date, localeCode: string): string {
  return new Intl.DateTimeFormat(localeCode, {
    weekday: 'short',
  })
    .format(date)
    .replace('.', '')
    .toUpperCase();
}

export function SharedActivityCalendarDayPicker({
  visibleDays,
  selectedDate,
  onSelectDay,
}: {
  readonly visibleDays: readonly Date[];
  readonly selectedDate: Date;
  readonly onSelectDay: (day: Date) => void;
}): React.ReactElement {
  const { localeCode } = useKitTexts(agendaTexts);

  return (
    <div className="grid grid-cols-7 gap-1">
      {visibleDays.map((day) => {
        const isSelected = isSameLocalDay(day, selectedDate);

        return (
          <button
            key={day.toISOString()}
            type="button"
            className={cn(
              'flex min-w-0 flex-col items-center gap-0.5 rounded-lg px-0.5 py-1.5 text-center transition-colors',
              isSelected ? 'bg-primary text-primary-foreground shadow-sm' : 'text-foreground hover:bg-muted'
            )}
            onClick={() => {
              onSelectDay(day);
            }}
          >
            <span
              className={cn(
                'text-[9px] font-semibold tracking-normal',
                isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'
              )}
            >
              {formatChipWeekday(day, localeCode)}
            </span>
            <span className="text-[13px] leading-none font-semibold">{day.getDate()}</span>
          </button>
        );
      })}
    </div>
  );
}
