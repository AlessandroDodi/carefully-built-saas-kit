'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button, useKitTexts } from '@carefully-built/ui';

import { agendaTexts } from './agenda-texts';

interface SharedActivityCalendarHeaderProps {
  readonly selectedDate: Date;
  readonly today: Date;
  readonly onPreviousDay: () => void;
  readonly onNextDay: () => void;
  readonly previousDayAriaLabel?: string;
  readonly nextDayAriaLabel?: string;
}

function formatHeaderMonth(date: Date, localeCode: string): string {
  return new Intl.DateTimeFormat(localeCode, {
    month: 'long',
  }).format(date);
}

function formatHeaderContext(
  date: Date,
  today: Date,
  localeCode: string,
  todayLabel: string,
): string {
  const weekday = new Intl.DateTimeFormat(localeCode, {
    weekday: 'long',
  }).format(date);

  return date.toDateString() === today.toDateString() ? `${todayLabel}, ${weekday}` : weekday;
}

export function SharedActivityCalendarHeader({
  selectedDate,
  today,
  onPreviousDay,
  onNextDay,
  previousDayAriaLabel,
  nextDayAriaLabel,
}: SharedActivityCalendarHeaderProps): React.ReactElement {
  const { localeCode, widget } = useKitTexts(agendaTexts);

  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-start gap-2">
        <div className="text-foreground text-[34px] leading-none font-semibold tracking-normal">
          {selectedDate.getDate()}
        </div>
        <div className="min-w-0 pt-0.5">
          <p className="text-foreground truncate text-[18px] leading-tight font-semibold capitalize">
            {formatHeaderMonth(selectedDate, localeCode)}
          </p>
          <p className="text-muted-foreground truncate pt-0.5 text-[11px] font-medium capitalize">
            {formatHeaderContext(selectedDate, today, localeCode, widget.today)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="icon-xs"
          className="rounded-full"
          aria-label={previousDayAriaLabel ?? widget.previousDay}
          onClick={onPreviousDay}
        >
          <ChevronLeft className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-xs"
          className="rounded-full"
          aria-label={nextDayAriaLabel ?? widget.nextDay}
          onClick={onNextDay}
        >
          <ChevronRight className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
