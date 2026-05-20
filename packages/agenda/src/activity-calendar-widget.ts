import type { ActivityListItem } from './activity-helpers';

type CalendarWidgetActivity = Pick<ActivityListItem, '_id' | 'startAt' | 'dueAt' | 'endAt'> & {
  title?: string;
};

export function startOfLocalDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function addLocalDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return startOfLocalDay(next);
}

export function isSameLocalDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear()
    && left.getMonth() === right.getMonth()
    && left.getDate() === right.getDate()
  );
}

export function getVisibleWeekDays(windowStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, index) => addLocalDays(windowStart, index));
}

export function getScheduledTimestamp(activity: CalendarWidgetActivity): number | null {
  return activity.startAt ?? activity.dueAt ?? null;
}

export function getActivitiesForDay<T extends CalendarWidgetActivity>(
  activities: readonly T[],
  selectedDay: Date,
): T[] {
  return [...activities]
    .filter((activity) => {
      const scheduledAt = getScheduledTimestamp(activity);

      if (!scheduledAt) {
        return false;
      }

      return isSameLocalDay(new Date(scheduledAt), selectedDay);
    })
    .sort((left, right) => {
      const leftTimestamp = getScheduledTimestamp(left) ?? 0;
      const rightTimestamp = getScheduledTimestamp(right) ?? 0;
      return leftTimestamp - rightTimestamp;
    });
}

export function isActivityPast(activity: CalendarWidgetActivity, now: Date): boolean {
  const referenceTimestamp = activity.endAt ?? activity.startAt ?? activity.dueAt;

  if (!referenceTimestamp) {
    return false;
  }

  return referenceTimestamp < now.getTime();
}

export function formatCalendarWidgetTime(activity: CalendarWidgetActivity): string | null {
  const scheduledAt = getScheduledTimestamp(activity);

  if (!scheduledAt) {
    return null;
  }

  const timeFormatter = new Intl.DateTimeFormat('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const startLabel = timeFormatter.format(new Date(scheduledAt));

  if (!activity.endAt) {
    return startLabel;
  }

  return `${startLabel} - ${timeFormatter.format(new Date(activity.endAt))}`;
}
