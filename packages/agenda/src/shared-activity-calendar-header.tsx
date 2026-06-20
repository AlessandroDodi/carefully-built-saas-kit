'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@carefully-built/ui';

interface SharedActivityCalendarHeaderProps {
  readonly selectedDate: Date;
  readonly today: Date;
  readonly onPreviousDay: () => void;
  readonly onNextDay: () => void;
}

function formatHeaderMonth(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
  }).format(date);
}

function formatHeaderContext(date: Date, today: Date): string {
  const weekday = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
  }).format(date);

  return date.toDateString() === today.toDateString() ? `Today, ${weekday}` : weekday;
}

export function SharedActivityCalendarHeader({
  selectedDate,
  today,
  onPreviousDay,
  onNextDay,
}: SharedActivityCalendarHeaderProps): React.ReactElement {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-start gap-2">
        <div className="text-foreground text-[34px] leading-none font-semibold tracking-normal">
          {selectedDate.getDate()}
        </div>
        <div className="min-w-0 pt-0.5">
          <p className="text-foreground truncate text-[18px] leading-tight font-semibold capitalize">
            {formatHeaderMonth(selectedDate)}
          </p>
          <p className="text-muted-foreground truncate pt-0.5 text-[11px] font-medium capitalize">
            {formatHeaderContext(selectedDate, today)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="icon-xs"
          className="rounded-full"
          aria-label="Giorno precedente"
          onClick={onPreviousDay}
        >
          <ChevronLeft className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-xs"
          className="rounded-full"
          aria-label="Giorno successivo"
          onClick={onNextDay}
        >
          <ChevronRight className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
