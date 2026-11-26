'use client';

import type { ReactNode } from 'react';

import { useKitLocale } from '../locale/kit-locale';
import { defineKitTexts, useKitTexts } from '../locale/kit-texts';
import { cn } from '../utils/cn';

const eventTimelineTexts = defineKitTexts({
  en: { empty: 'No events yet' },
  it: { empty: 'Nessun evento' },
});

export type EventTimelineTone = 'neutral' | 'success' | 'danger' | 'warning' | 'info';

export type EventTimelineTimestamp = Date | number | string;

export interface EventTimelineItem {
  readonly id: string;
  readonly title: ReactNode;
  /** Extra detail shown after the timestamp on the second line. */
  readonly meta?: ReactNode;
  /**
   * A `Date` or epoch milliseconds is formatted in the kit locale; a string is
   * shown exactly as given (use it when the app already formatted the moment).
   */
  readonly timestamp?: EventTimelineTimestamp;
  readonly tone?: EventTimelineTone;
  /** Replaces the square marker; it is tinted with the tone colour. */
  readonly icon?: ReactNode;
}

export interface EventTimelineClassNames {
  readonly root?: string;
  readonly item?: string;
  readonly marker?: string;
  readonly content?: string;
  readonly title?: string;
  readonly details?: string;
  readonly timestamp?: string;
  readonly meta?: string;
  readonly empty?: string;
}

export interface EventTimelineProps<TItem extends EventTimelineItem = EventTimelineItem> {
  /** Events in the order they were appended (oldest first). */
  readonly items: readonly TItem[];
  /** `asc` shows the items as given, `desc` shows the newest first. */
  readonly order?: 'asc' | 'desc';
  /** Shown instead of the list when there are no items. */
  readonly emptyState?: ReactNode;
  /** Replaces the default rendering of `item.meta`. */
  readonly renderMeta?: (item: TItem) => ReactNode;
  /** Replaces the default formatting of `Date` and number timestamps. */
  readonly formatTimestamp?: (timestamp: Date, item: TItem) => ReactNode;
  readonly 'aria-label'?: string;
  readonly className?: string;
  readonly classes?: EventTimelineClassNames;
}

const markerToneClasses: Record<EventTimelineTone, string> = {
  neutral: 'bg-muted-foreground/50',
  success: 'bg-emerald-500',
  danger: 'bg-destructive',
  warning: 'bg-amber-500',
  info: 'bg-blue-500',
};

const iconToneClasses: Record<EventTimelineTone, string> = {
  neutral: 'text-muted-foreground',
  success: 'text-emerald-600 dark:text-emerald-400',
  danger: 'text-destructive',
  warning: 'text-amber-600 dark:text-amber-400',
  info: 'text-blue-600 dark:text-blue-400',
};

const timestampLocales = { en: 'en-GB', it: 'it-IT' } as const;

/** The moment as a `Date`, or null for strings (shown as given) and invalid dates. */
function toDate(timestamp: EventTimelineTimestamp | undefined): Date | null {
  if (timestamp === undefined || typeof timestamp === 'string') return null;
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * A read-only log of what happened, one row per event. It is append-only by
 * design: there is no edit or delete affordance, so it can show audit trails
 * and consent histories without suggesting they can be changed.
 */
export function EventTimeline<TItem extends EventTimelineItem = EventTimelineItem>({
  items,
  order = 'asc',
  emptyState,
  renderMeta,
  formatTimestamp,
  'aria-label': ariaLabel,
  className,
  classes,
}: EventTimelineProps<TItem>): React.ReactElement {
  const texts = useKitTexts(eventTimelineTexts);
  const locale = useKitLocale();

  if (items.length === 0) {
    return (
      <div
        data-slot="event-timeline-empty"
        className={cn('text-muted-foreground py-6 text-center text-sm', className, classes?.empty)}
      >
        {emptyState ?? texts.empty}
      </div>
    );
  }

  const ordered = order === 'desc' ? [...items].reverse() : items;
  // Spelled out rather than `dateStyle: 'short'`, which drops the century in Italian.
  const formatter = new Intl.DateTimeFormat(timestampLocales[locale], {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return (
    <ol
      data-slot="event-timeline"
      aria-label={ariaLabel}
      reversed={order === 'desc'}
      className={cn('flex list-none flex-col', className, classes?.root)}
    >
      {ordered.map((item) => {
        const tone = item.tone ?? 'neutral';
        const meta = renderMeta ? renderMeta(item) : item.meta;
        const date = toDate(item.timestamp);
        const hasTimestamp = typeof item.timestamp === 'string' || date !== null;
        const hasMeta = meta !== undefined && meta !== null && meta !== false;

        return (
          <li
            key={item.id}
            data-tone={tone}
            className={cn(
              'border-border flex items-start gap-3 border-b py-2.5 last:border-b-0',
              classes?.item,
            )}
          >
            {item.icon ? (
              <span
                aria-hidden="true"
                className={cn(
                  'mt-0.5 flex size-4 shrink-0 items-center justify-center [&_svg]:size-4',
                  iconToneClasses[tone],
                  classes?.marker,
                )}
              >
                {item.icon}
              </span>
            ) : (
              <span
                aria-hidden="true"
                className={cn(
                  'mt-1.5 size-2 shrink-0 rounded-[2px]',
                  markerToneClasses[tone],
                  classes?.marker,
                )}
              />
            )}

            <div className={cn('min-w-0 flex-1', classes?.content)}>
              <div className={cn('text-foreground text-sm leading-5', classes?.title)}>{item.title}</div>

              {hasTimestamp || hasMeta ? (
                <div
                  className={cn(
                    'text-muted-foreground mt-0.5 flex flex-wrap items-center gap-x-1.5 font-mono text-xs leading-4',
                    classes?.details,
                  )}
                >
                  {typeof item.timestamp === 'string' ? (
                    <span className={classes?.timestamp}>{item.timestamp}</span>
                  ) : date ? (
                    <time
                      dateTime={date.toISOString()}
                      // The server and the device may be in different time zones.
                      suppressHydrationWarning
                      className={classes?.timestamp}
                    >
                      {formatTimestamp ? formatTimestamp(date, item) : formatter.format(date)}
                    </time>
                  ) : null}
                  {hasTimestamp && hasMeta ? <span aria-hidden="true">·</span> : null}
                  {hasMeta ? <span className={cn('min-w-0', classes?.meta)}>{meta}</span> : null}
                </div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
