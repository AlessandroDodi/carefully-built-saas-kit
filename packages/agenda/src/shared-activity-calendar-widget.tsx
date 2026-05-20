'use client';

import { CalendarRange } from 'lucide-react';
import { useMemo, useState } from 'react';

import { SharedActivityCalendarDayPicker } from './shared-activity-calendar-day-picker';
import { SharedActivityCalendarEvents } from './shared-activity-calendar-events';
import { SharedActivityCalendarHeader } from './shared-activity-calendar-header';

import type { ActivityListItem } from './activity-helpers';

import { DashboardWidget } from '@carefully-built/widgets';
import {
  addLocalDays,
  getActivitiesForDay,
  getVisibleWeekDays,
  startOfLocalDay,
} from './activity-calendar-widget';

function cn(...classes: readonly (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

interface SharedActivityCalendarWidgetProps {
  readonly activities: readonly ActivityListItem[];
  readonly className?: string;
  readonly isLoading?: boolean;
}

export function SharedActivityCalendarWidget({
  activities,
  className,
  isLoading = false,
}: SharedActivityCalendarWidgetProps): React.ReactElement {
  const today = useMemo(() => startOfLocalDay(new Date()), []);
  const [selectedDate, setSelectedDate] = useState(today);
  const [windowStart, setWindowStart] = useState(today);

  const visibleDays = useMemo(() => getVisibleWeekDays(windowStart), [windowStart]);
  const selectedDayActivities = useMemo(
    () => getActivitiesForDay(activities, selectedDate),
    [activities, selectedDate],
  );

  function moveSelection(offset: number): void {
    const nextSelectedDate = addLocalDays(selectedDate, offset);
    const currentWindowEnd = addLocalDays(windowStart, 6);

    setSelectedDate(nextSelectedDate);

    if (nextSelectedDate.getTime() < windowStart.getTime()) {
      setWindowStart(nextSelectedDate);
      return;
    }

    if (nextSelectedDate.getTime() > currentWindowEnd.getTime()) {
      setWindowStart(addLocalDays(windowStart, offset));
    }
  }

  return (
    <DashboardWidget
      icon={CalendarRange}
      title="Agenda"
      className={cn('min-h-[23.5rem]', className)}
      isLoading={isLoading}
      loadingFallback={<div className="bg-muted h-[19rem] w-full animate-pulse rounded-[10px]" />}
    >
      <div className="flex h-full flex-col gap-3 px-1.5 pt-0.5 pb-1.5">
        <SharedActivityCalendarHeader
          selectedDate={selectedDate}
          today={today}
          onPreviousDay={() => {
            moveSelection(-1);
          }}
          onNextDay={() => {
            moveSelection(1);
          }}
        />
        <SharedActivityCalendarDayPicker
          visibleDays={visibleDays}
          selectedDate={selectedDate}
          onSelectDay={setSelectedDate}
        />

        <div className="bg-border/80 h-px w-full" />

        <div className="flex flex-1 flex-col">
          <SharedActivityCalendarEvents activities={selectedDayActivities} />
        </div>
      </div>
    </DashboardWidget>
  );
}
