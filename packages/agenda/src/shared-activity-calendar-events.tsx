'use client';

import { CalendarRange } from 'lucide-react';

import type { ActivityListItem } from './activity-helpers';

import { formatCalendarWidgetTime, isActivityPast } from './activity-calendar-widget';
import { useKitTexts } from '@carefully-built/ui';
import { WidgetEmptyState } from '@carefully-built/widgets';

import { agendaTexts } from './agenda-texts';

function cn(...classes: readonly (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function SharedActivityCalendarEvents({
  activities,
}: {
  readonly activities: readonly ActivityListItem[];
}): React.ReactElement {
  const { localeCode, widget } = useKitTexts(agendaTexts);

  if (activities.length === 0) {
    return (
      <WidgetEmptyState
        icon={CalendarRange}
        title={widget.emptyTitle}
        description={widget.emptyDescription}
        minHeightClassName="min-h-[180px]"
      />
    );
  }

  return (
    <div className="max-h-[15.5rem] space-y-2.5 overflow-y-auto pr-1">
      {activities.map((activity) => {
        const isPast = isActivityPast(activity, new Date());

        return (
          <div key={activity._id} className="flex items-start gap-2.5">
            <span
              className={cn('mt-0.5 h-8 w-1 shrink-0 rounded-full', isPast && 'opacity-45')}
              style={{ backgroundColor: activity.activityTypeColor }}
            />
            <div className="min-w-0 space-y-0.5">
              <p className="text-muted-foreground text-[11px] font-medium">
                {formatCalendarWidgetTime(activity, localeCode) ?? widget.noTime}
              </p>
              <p
                className={cn(
                  'truncate text-[15px] leading-snug font-semibold tracking-normal',
                  isPast && 'text-muted-foreground line-through'
                )}
              >
                {activity.title}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
