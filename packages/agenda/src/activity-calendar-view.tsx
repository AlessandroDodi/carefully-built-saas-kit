'use client';

import dayGridPlugin from '@fullcalendar/daygrid';
import type {
  DateSelectArg,
  DatesSetArg,
  EventClickArg,
  EventContentArg,
  EventDropArg,
} from '@fullcalendar/core';
import itLocale from '@fullcalendar/core/locales/it';
import interactionPlugin from '@fullcalendar/interaction';
import type { DateClickArg } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import FullCalendar from '@fullcalendar/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

import type {
  ActivityCalendarScope,
  ActivityCalendarSourceFilter,
  ActivityListItem,
} from './activity-helpers';
import { buildActivityDisplayModel, toAlphaColor } from './activity-helpers';
import { getActivityCalendarScopeForViewport } from './activity-calendar-scope';
import { isAllDayActivityRange } from './activity-form-time';

import { Button } from '@carefully-built/ui';
import { Calendar } from '@carefully-built/ui';
import { Popover, PopoverContent, PopoverTrigger } from '@carefully-built/ui';
import { Tooltip, TooltipContent, TooltipTrigger } from '@carefully-built/ui';
import { SearchableSelect } from '@carefully-built/ui';

function cn(...classes: readonly (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

function getReadableTextColor(backgroundColor: string): string {
  const normalized = backgroundColor.replace('#', '');
  if (normalized.length !== 6) {
    return '#ffffff';
  }

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

  return luminance > 0.62 ? '#111827' : '#ffffff';
}

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const update = (): void => {
      setIsMobile(media.matches);
    };

    update();
    media.addEventListener('change', update);

    return () => {
      media.removeEventListener('change', update);
    };
  }, []);

  return isMobile;
}

interface ActivityCalendarViewProps {
  readonly activities: ActivityListItem[];
  readonly showGoogleCalendarEvents: boolean;
  readonly calendarSourceFilter: ActivityCalendarSourceFilter;
  readonly scope: ActivityCalendarScope;
  readonly anchorDate: Date;
  readonly currentUserId: string;
  readonly onAnchorDateChange: (nextDate: Date) => void;
  readonly onScopeChange: (nextScope: ActivityCalendarScope) => void;
  readonly onDateClick: (start: Date, end?: Date | null, allDay?: boolean) => void;
  readonly onMoveActivity: (
    activity: ActivityListItem,
    start: Date,
    end?: Date | null,
  ) => Promise<void>;
  readonly onEdit: (activity: ActivityListItem) => void;
}

function getScheduledDate(activity: ActivityListItem): Date | null {
  const timestamp = activity.startAt ?? activity.dueAt ?? activity.endAt;
  return timestamp ? new Date(timestamp) : null;
}

function formatCalendarTitle(scope: ActivityCalendarScope): string {
  if (scope === 'day') {
    return 'timeGridDay';
  }

  if (scope === 'week') {
    return 'timeGridWeek';
  }

  return 'dayGridMonth';
}

function getScopeFromViewType(viewType: string): ActivityCalendarScope {
  if (viewType === 'timeGridDay') {
    return 'day';
  }

  if (viewType === 'timeGridWeek') {
    return 'week';
  }

  return 'month';
}

function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function startOfWeek(date: Date): Date {
  const nextDate = new Date(date);
  const day = nextDate.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  nextDate.setDate(nextDate.getDate() + diff);
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
}

interface PickerOption {
  value: string;
  label: string;
  date: Date;
  searchText?: string;
}

interface GoogleCalendarEventListItem {
  id: string;
  title: string;
  description?: string;
  startAt: number;
  endAt?: number;
  allDay: boolean;
}

interface CalendarEventBadges {
  hasApp: boolean;
  hasGoogleCalendar: boolean;
}

interface CalendarTooltipSource {
  activity?: ActivityListItem;
  googleCalendarEvent?: GoogleCalendarEventListItem;
  badges: CalendarEventBadges;
  currentUserId?: string;
}

function normalizeEventTitle(value: string | undefined): string {
  return (value ?? '').trim().toLocaleLowerCase('it-IT');
}

function areTimestampsClose(left?: number, right?: number, toleranceMs = 60_000): boolean {
  if (typeof left !== 'number' || typeof right !== 'number') {
    return false;
  }

  return Math.abs(left - right) <= toleranceMs;
}

function findMatchingGoogleCalendarEvent(args: {
  activity: ActivityListItem;
  googleEventsById: ReadonlyMap<string, GoogleCalendarEventListItem>;
  consumedGoogleEventIds: ReadonlySet<string>;
}): GoogleCalendarEventListItem | undefined {
  if (args.activity.googleCalendarEventId) {
    return args.googleEventsById.get(args.activity.googleCalendarEventId);
  }

  const activityTitle = normalizeEventTitle(args.activity.title);
  const activityStartAt = args.activity.startAt ?? args.activity.dueAt;
  const activityEndAt = args.activity.endAt ?? args.activity.dueAt;
  const activityIsAllDay = isAllDayActivityRange(args.activity.startAt, args.activity.endAt);

  for (const event of args.googleEventsById.values()) {
    if (args.consumedGoogleEventIds.has(event.id)) {
      continue;
    }

    if (normalizeEventTitle(event.title) !== activityTitle) {
      continue;
    }

    if (event.allDay !== activityIsAllDay) {
      continue;
    }

    if (!areTimestampsClose(activityStartAt, event.startAt)) {
      continue;
    }

    const comparableActivityEndAt = activityEndAt ?? activityStartAt;
    const comparableGoogleEndAt = event.endAt ?? event.startAt;

    if (!areTimestampsClose(comparableActivityEndAt, comparableGoogleEndAt)) {
      continue;
    }

    return event;
  }

  return undefined;
}

function getWeekOptions(anchorDate: Date): PickerOption[] {
  const startYear = anchorDate.getFullYear() - 2;
  const endYear = anchorDate.getFullYear() + 2;
  const formatter = new Intl.DateTimeFormat('it-IT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const firstWeek = startOfWeek(new Date(startYear, 0, 4));
  const lastWeekBoundary = startOfWeek(new Date(endYear, 11, 31));

  const options: PickerOption[] = [];

  for (let cursor = new Date(firstWeek); cursor <= lastWeekBoundary; cursor = addDays(cursor, 7)) {
    const weekStart = new Date(cursor);
    const weekEnd = addDays(weekStart, 6);

    options.push({
      value: `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, '0')}-${String(weekStart.getDate()).padStart(2, '0')}`,
      label: `${formatter.format(weekStart)} - ${formatter.format(weekEnd)}`,
      date: weekStart,
      searchText: `${weekStart.toLocaleDateString('it-IT')} ${weekEnd.toLocaleDateString('it-IT')}`,
    });
  }

  return options;
}

function getMonthOptions(anchorDate: Date): PickerOption[] {
  const startYear = anchorDate.getFullYear() - 2;
  const endYear = anchorDate.getFullYear() + 2;
  const formatter = new Intl.DateTimeFormat('it-IT', {
    month: 'long',
    year: 'numeric',
  });

  const options: PickerOption[] = [];

  for (let year = startYear; year <= endYear; year += 1) {
    for (let monthIndex = 0; monthIndex < 12; monthIndex += 1) {
      const monthStart = new Date(year, monthIndex, 1);
      options.push({
        value: `${year}-${String(monthIndex + 1).padStart(2, '0')}`,
        label: formatter.format(monthStart),
        date: monthStart,
        searchText: formatter.format(monthStart),
      });
    }
  }

  return options;
}

function formatTitleLabel(scope: ActivityCalendarScope, anchorDate: Date): string {
  if (scope === 'month') {
    return new Intl.DateTimeFormat('it-IT', {
      month: 'long',
      year: 'numeric',
    }).format(anchorDate);
  }

  if (scope === 'day') {
    return new Intl.DateTimeFormat('it-IT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(anchorDate);
  }

  const rangeEnd = addDays(anchorDate, 6);
  const formatter = new Intl.DateTimeFormat('it-IT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return `${formatter.format(anchorDate)} - ${formatter.format(rangeEnd)}`;
}

function areSameAnchor(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function isPastActivity(activity: ActivityListItem): boolean {
  const referenceTimestamp = activity.endAt ?? activity.startAt ?? activity.dueAt;
  return typeof referenceTimestamp === 'number' ? referenceTimestamp < Date.now() : false;
}

function formatTooltipDateRange(startAt?: number, endAt?: number, allDay = false): string | null {
  if (!startAt) {
    return null;
  }

  if (allDay) {
    const formatter = new Intl.DateTimeFormat('it-IT', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    if (!endAt || endAt <= startAt) {
      return formatter.format(new Date(startAt));
    }

    const inclusiveEndAt = endAt - 1;
    return `${formatter.format(new Date(startAt))} - ${formatter.format(new Date(inclusiveEndAt))}`;
  }

  const dateFormatter = new Intl.DateTimeFormat('it-IT', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const timeFormatter = new Intl.DateTimeFormat('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const startDate = new Date(startAt);
  const startDateLabel = dateFormatter.format(startDate);
  const startTimeLabel = timeFormatter.format(startDate);

  if (!endAt) {
    return `${startDateLabel}, ${startTimeLabel}`;
  }

  const endDate = new Date(endAt);
  const endDateLabel = dateFormatter.format(endDate);
  const endTimeLabel = timeFormatter.format(endDate);

  if (startDateLabel === endDateLabel) {
    return `${startDateLabel}, ${startTimeLabel} - ${endTimeLabel}`;
  }

  return `${startDateLabel}, ${startTimeLabel} - ${endDateLabel}, ${endTimeLabel}`;
}

function CalendarEventSourceIcons({
  badges,
}: {
  readonly badges: CalendarEventBadges | undefined;
}): React.ReactNode {
  if (!badges?.hasApp && !badges?.hasGoogleCalendar) {
    return null;
  }

  return (
    <div className="agenda-calendar-event__meta">
      {badges?.hasApp ? (
        <img
          src="/logos/square_logo.png"
          alt="Evento dell'app"
          className="agenda-calendar-event__icon"
        />
      ) : null}
      {badges?.hasGoogleCalendar ? (
        <img
          src="/logos/google-calendar-2020.svg"
          alt="Evento Google Calendar"
          className="agenda-calendar-event__icon"
        />
      ) : null}
    </div>
  );
}

function CalendarEventConnections({
  badges,
}: {
  readonly badges: CalendarEventBadges;
}): React.ReactNode {
  if (!badges.hasApp && !badges.hasGoogleCalendar) {
    return null;
  }

  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-medium tracking-[0.08em] uppercase opacity-65">Collegato su</p>
      <div className="space-y-1">
        {badges.hasApp ? (
          <div className="flex items-center gap-1.5 text-[11px] opacity-90">
            <img src="/logos/square_logo.png" alt="" className="size-3.5 shrink-0" />
            <span>Immobiliare in Cloud</span>
          </div>
        ) : null}
        {badges.hasGoogleCalendar ? (
          <div className="flex items-center gap-1.5 text-[11px] opacity-90">
            <img src="/logos/google-calendar-2020.svg" alt="" className="size-3.5 shrink-0" />
            <span>Google Calendar</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function CalendarEventTooltip({
  activity,
  googleCalendarEvent,
  badges,
  currentUserId,
}: CalendarTooltipSource): React.ReactNode {
  const activityDisplay =
    activity && currentUserId
      ? buildActivityDisplayModel(activity, {
          density: 'large',
          scope: 'week',
          viewerUserId: currentUserId,
        })
      : null;
  const title = activityDisplay?.title ?? googleCalendarEvent?.title ?? 'Evento';
  const timeLabel = activity
    ? formatTooltipDateRange(
        activity.startAt ?? activity.dueAt,
        activity.endAt,
        isAllDayActivityRange(activity.startAt, activity.endAt),
      )
    : formatTooltipDateRange(
        googleCalendarEvent?.startAt,
        googleCalendarEvent?.endAt,
        googleCalendarEvent?.allDay ?? false,
      );
  const description = activityDisplay?.description ?? googleCalendarEvent?.description ?? null;
  const participants = activity?.participantUserNames.filter(Boolean) ?? [];
  const associations = activity?.associations ?? [];

  return (
    <div className="space-y-2 rounded-[12px] px-1 py-0.5">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[12px] leading-tight font-semibold">{title}</p>
          {timeLabel ? (
            <p className="text-[10px] whitespace-nowrap opacity-90">{timeLabel}</p>
          ) : null}
        </div>
      </div>
      {activityDisplay?.typeLabel ? (
        <p className="text-[11px] opacity-90">Tipo: {activityDisplay.typeLabel}</p>
      ) : null}
      {activityDisplay?.assigneeLabel ? (
        <p className="text-[11px] opacity-90">Assegnato a: {activityDisplay.assigneeLabel}</p>
      ) : null}
      {participants.length > 0 ? (
        <p className="text-[11px] opacity-90">Partecipanti: {participants.join(', ')}</p>
      ) : null}
      {associations.length > 0 ? (
        <p className="text-[11px] opacity-90">
          Collegamenti: {associations.map((association) => association.label).join(', ')}
        </p>
      ) : null}
      {description ? <p className="text-[11px] leading-relaxed opacity-90">{description}</p> : null}
      <div className="pt-1">
        <CalendarEventConnections badges={badges} />
      </div>
    </div>
  );
}

function renderEventContent(arg: EventContentArg): React.ReactNode {
  const activity = arg.event.extendedProps.activity as ActivityListItem | undefined;
  const googleCalendarEvent = arg.event.extendedProps.googleCalendarEvent as
    | GoogleCalendarEventListItem
    | undefined;
  const badges = arg.event.extendedProps.badges as CalendarEventBadges | undefined;
  const currentUserId = arg.event.extendedProps.currentUserId as string | undefined;
  const timeText = arg.timeText?.trim();

  if (googleCalendarEvent) {
    const effectiveBadges = badges ?? { hasApp: false, hasGoogleCalendar: true };
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="agenda-calendar-event__content cursor-pointer"
            style={{ color: '#1f2937' }}
          >
            <div className="agenda-calendar-event__text">
              {timeText ? <div className="agenda-calendar-event__time">{timeText}</div> : null}
              <CalendarEventSourceIcons badges={effectiveBadges} />
              <div className="agenda-calendar-event__title">{googleCalendarEvent.title}</div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          sideOffset={10}
          className="w-max max-w-[min(28rem,calc(100vw-1.5rem))] rounded-[12px] px-3 py-2 text-left"
        >
          <CalendarEventTooltip
            activity={activity}
            googleCalendarEvent={googleCalendarEvent}
            badges={effectiveBadges}
            currentUserId={currentUserId}
          />
        </TooltipContent>
      </Tooltip>
    );
  }

  if (!activity) {
    return <div className="agenda-calendar-event__title">{arg.event.title}</div>;
  }

  const isPast = isPastActivity(activity);
  const eventTextColor = getReadableTextColor(activity.activityTypeColor);
  const showAccent = arg.view.type === 'dayGridMonth';
  const effectiveBadges = badges ?? { hasApp: true, hasGoogleCalendar: false };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            'agenda-calendar-event__content cursor-pointer',
            isPast && 'agenda-calendar-event__content--past',
          )}
          style={{ color: isPast ? undefined : eventTextColor }}
        >
          {showAccent ? (
            <span
              className="agenda-calendar-event__accent"
              style={{ backgroundColor: activity.activityTypeColor }}
            />
          ) : null}
          <div className="agenda-calendar-event__text">
            {timeText ? <div className="agenda-calendar-event__time">{timeText}</div> : null}
            <CalendarEventSourceIcons badges={effectiveBadges} />
            <div className="agenda-calendar-event__title">{activity.title}</div>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        sideOffset={10}
        className="w-max max-w-[min(28rem,calc(100vw-1.5rem))] rounded-[12px] px-3 py-2 text-left"
      >
        <CalendarEventTooltip
          activity={activity}
          googleCalendarEvent={googleCalendarEvent}
          badges={effectiveBadges}
          currentUserId={currentUserId}
        />
      </TooltipContent>
    </Tooltip>
  );
}

export function ActivityCalendarView({
  activities,
  showGoogleCalendarEvents,
  calendarSourceFilter,
  scope,
  anchorDate,
  currentUserId,
  onAnchorDateChange,
  onScopeChange,
  onDateClick,
  onMoveActivity,
  onEdit,
}: ActivityCalendarViewProps): React.ReactElement {
  const calendarRef = useRef<FullCalendar | null>(null);
  const anchorDateRef = useRef(anchorDate);
  const scopeRef = useRef(scope);
  const isMobile = useIsMobile();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [visibleRange, setVisibleRange] = useState<{ start: string; end: string } | null>(null);
  const [googleCalendarEvents, setGoogleCalendarEvents] = useState<GoogleCalendarEventListItem[]>(
    [],
  );
  const effectiveScope = getActivityCalendarScopeForViewport(scope, isMobile);

  const events = useMemo(() => {
    const googleEventsById = new Map(
      googleCalendarEvents.map((event) => [event.id, event] as const),
    );
    const consumedGoogleEventIds = new Set<string>();

    const activityEvents = activities.flatMap((activity) => {
      const scheduledDate = getScheduledDate(activity);

      if (!scheduledDate) {
        return [];
      }

      const isAllDay = isAllDayActivityRange(activity.startAt, activity.endAt);
      const linkedGoogleEvent = findMatchingGoogleCalendarEvent({
        activity,
        googleEventsById,
        consumedGoogleEventIds,
      });

      if (linkedGoogleEvent) {
        consumedGoogleEventIds.add(linkedGoogleEvent.id);
      }

      return [
        {
          id: activity._id,
          title: activity.title,
          start: activity.startAt ?? activity.dueAt ?? activity.endAt ?? undefined,
          end: isAllDay ? undefined : (activity.endAt ?? undefined),
          allDay: isAllDay,
          backgroundColor: isPastActivity(activity)
            ? toAlphaColor(activity.activityTypeColor, 0.72)
            : activity.activityTypeColor,
          borderColor: isPastActivity(activity)
            ? toAlphaColor(activity.activityTypeColor, 0.82)
            : activity.activityTypeColor,
          classNames: [
            'agenda-calendar-event',
            isPastActivity(activity) ? 'agenda-calendar-event--past' : '',
          ].filter(Boolean),
          extendedProps: {
            activity,
            currentUserId,
            googleCalendarEvent: linkedGoogleEvent,
            badges: {
              hasApp: true,
              hasGoogleCalendar: Boolean(activity.googleCalendarEventId || linkedGoogleEvent),
            } satisfies CalendarEventBadges,
          },
        },
      ];
    });

    const shouldShowStandaloneGoogleEvents =
      calendarSourceFilter === 'all' || calendarSourceFilter === 'google-only';
    const standaloneGoogleEvents = shouldShowStandaloneGoogleEvents
      ? googleCalendarEvents
          .filter((event) => !consumedGoogleEventIds.has(event.id))
          .map((event) => ({
            id: `google-calendar:${event.id}`,
            title: event.title,
            start: event.startAt,
            end: event.allDay ? undefined : (event.endAt ?? undefined),
            allDay: event.allDay,
            editable: false,
            backgroundColor: '#E8F0FE',
            borderColor: '#A8C7FA',
            textColor: '#1f2937',
            classNames: ['agenda-calendar-event', 'agenda-calendar-event--google'],
            extendedProps: {
              googleCalendarEvent: event,
              badges: {
                hasApp: false,
                hasGoogleCalendar: true,
              } satisfies CalendarEventBadges,
            },
          }))
      : [];

    return [...activityEvents, ...standaloneGoogleEvents];
  }, [activities, calendarSourceFilter, currentUserId, googleCalendarEvents]);

  const titleLabel = useMemo(
    () => formatTitleLabel(effectiveScope, anchorDate),
    [anchorDate, effectiveScope],
  );
  const weekOptions = useMemo(() => getWeekOptions(anchorDate), [anchorDate]);
  const monthOptions = useMemo(() => getMonthOptions(anchorDate), [anchorDate]);
  const selectedWeekValue = useMemo(() => {
    const weekStart = startOfWeek(anchorDate);
    return `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, '0')}-${String(weekStart.getDate()).padStart(2, '0')}`;
  }, [anchorDate]);
  const selectedMonthValue = useMemo(() => {
    return `${anchorDate.getFullYear()}-${String(anchorDate.getMonth() + 1).padStart(2, '0')}`;
  }, [anchorDate]);

  useEffect(() => {
    anchorDateRef.current = anchorDate;
    scopeRef.current = effectiveScope;
  }, [anchorDate, effectiveScope]);

  useEffect(() => {
    const shouldLoadGoogleCalendarEvents =
      showGoogleCalendarEvents || calendarSourceFilter === 'google-only';

    if (!shouldLoadGoogleCalendarEvents || !visibleRange) {
      setGoogleCalendarEvents([]);
      return;
    }

    let cancelled = false;
    const range = visibleRange;

    async function loadGoogleCalendarEvents(): Promise<void> {
      try {
        const searchParams = new URLSearchParams({
          start: range.start,
          end: range.end,
        });
        const response = await fetch(
          `/api/integrations/google-calendar/events?${searchParams.toString()}`,
          {
            cache: 'no-store',
          },
        );

        if (!response.ok) {
          throw new Error('Failed to fetch Google Calendar events');
        }

        const data = (await response.json()) as {
          events?: GoogleCalendarEventListItem[];
        };

        if (!cancelled) {
          setGoogleCalendarEvents(data.events ?? []);
        }
      } catch (error) {
        console.error('Failed to load Google Calendar events:', error);
        if (!cancelled) {
          setGoogleCalendarEvents([]);
        }
      }
    }

    void loadGoogleCalendarEvents();

    return () => {
      cancelled = true;
    };
  }, [calendarSourceFilter, showGoogleCalendarEvents, visibleRange]);

  useEffect(() => {
    const api = calendarRef.current?.getApi();

    if (!api) {
      return;
    }

    const targetView = formatCalendarTitle(effectiveScope);
    if (api.view.type !== targetView) {
      api.changeView(targetView, anchorDate);
      return;
    }

    api.gotoDate(anchorDate);
  }, [anchorDate, effectiveScope]);

  function handleDatesSet(arg: DatesSetArg): void {
    const nextScope = getScopeFromViewType(arg.view.type);
    const nextAnchor = arg.view.currentStart;
    setVisibleRange({
      start: arg.start.toISOString(),
      end: arg.end.toISOString(),
    });

    queueMicrotask(() => {
      if (nextScope !== scopeRef.current) {
        onScopeChange(nextScope);
      }

      if (!areSameAnchor(anchorDateRef.current, nextAnchor)) {
        onAnchorDateChange(nextAnchor);
      }
    });
  }

  function handleEventClick(arg: EventClickArg): void {
    const activity = arg.event.extendedProps.activity as ActivityListItem | undefined;
    if (activity) {
      onEdit(activity);
    }
  }

  function handleDateClick(arg: DateClickArg): void {
    onDateClick(arg.date, null, arg.allDay && arg.view.type !== 'dayGridMonth');
  }

  function handleDateSelect(arg: DateSelectArg): void {
    onDateClick(arg.start, arg.end, arg.allDay && arg.view.type !== 'dayGridMonth');
    arg.view.calendar.unselect();
  }

  async function handleEventDrop(arg: EventDropArg): Promise<void> {
    const activity = arg.event.extendedProps.activity as ActivityListItem | undefined;

    if (!activity || !arg.event.start) {
      arg.revert();
      return;
    }

    try {
      await onMoveActivity(activity, arg.event.start, arg.event.end);
    } catch (error) {
      console.error(error);
      arg.revert();
    }
  }

  function handlePickerSelect(date: Date | undefined): void {
    if (!date) {
      return;
    }

    onAnchorDateChange(date);
    setIsPickerOpen(false);
  }

  function handleWeekChange(value: string): void {
    const selectedOption = weekOptions.find((option) => option.value === value);
    if (selectedOption) {
      onAnchorDateChange(selectedOption.date);
    }
  }

  function handleMonthChange(value: string): void {
    const selectedOption = monthOptions.find((option) => option.value === value);
    if (selectedOption) {
      onAnchorDateChange(selectedOption.date);
    }
  }

  function handleNavigate(direction: 'prev' | 'next'): void {
    const api = calendarRef.current?.getApi();
    if (!api) {
      return;
    }

    if (direction === 'prev') {
      api.prev();
      return;
    }

    api.next();
  }

  return (
    <div className="agenda-calendar-shell border-border bg-background rounded-2xl border p-3 md:p-4">
      <div className="flex items-center justify-between gap-3 pb-4">
        {effectiveScope === 'day' ? (
          <Popover open={isPickerOpen} onOpenChange={setIsPickerOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="agenda-calendar-title-trigger h-auto px-2 py-1 text-left"
              >
                <span>{titleLabel}</span>
                <ChevronDown className="text-muted-foreground size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <Calendar
                mode="single"
                selected={anchorDate}
                onSelect={handlePickerSelect}
                locale={itLocale}
                weekStartsOn={1}
              />
            </PopoverContent>
          </Popover>
        ) : null}
        {effectiveScope === 'week' ? (
          <SearchableSelect
            value={selectedWeekValue}
            onValueChange={handleWeekChange}
            options={weekOptions}
            ariaLabel="Seleziona settimana"
            placeholder="Seleziona settimana"
            searchPlaceholder="Cerca settimana..."
            className="max-w-full min-w-[20rem]"
            triggerClassName="agenda-calendar-searchable-trigger"
            contentClassName="w-[24rem]"
            renderValue={(option) => option.label}
            renderOption={(option) => option.label}
          />
        ) : null}
        {effectiveScope === 'month' ? (
          <SearchableSelect
            value={selectedMonthValue}
            onValueChange={handleMonthChange}
            options={monthOptions}
            ariaLabel="Seleziona mese"
            placeholder="Seleziona mese"
            searchPlaceholder="Cerca mese..."
            className="max-w-full min-w-[16rem]"
            triggerClassName="agenda-calendar-searchable-trigger"
            contentClassName="w-[20rem]"
            renderValue={(option) => option.label}
            renderOption={(option) => option.label}
          />
        ) : null}

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => {
              handleNavigate('prev');
            }}
            aria-label="Periodo precedente"
          >
            <ChevronLeft />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => {
              handleNavigate('next');
            }}
            aria-label="Periodo successivo"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        locale={itLocale}
        initialView={formatCalendarTitle(effectiveScope)}
        initialDate={anchorDate}
        headerToolbar={false}
        buttonText={{
          timeGridDay: 'giorno',
          timeGridWeek: 'settimana',
          dayGridMonth: 'mese',
          today: 'oggi',
        }}
        firstDay={1}
        allDaySlot
        nowIndicator
        height="auto"
        expandRows
        dayMaxEvents
        slotEventOverlap={false}
        selectable
        selectMirror
        editable
        slotMinTime="06:00:00"
        slotMaxTime="22:00:00"
        events={events}
        datesSet={handleDatesSet}
        dateClick={handleDateClick}
        select={handleDateSelect}
        eventClick={handleEventClick}
        eventDrop={(arg) => {
          void handleEventDrop(arg);
        }}
        eventContent={renderEventContent}
      />
    </div>
  );
}
