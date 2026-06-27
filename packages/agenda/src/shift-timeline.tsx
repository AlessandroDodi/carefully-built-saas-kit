'use client';

import { Clock3 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

function cn(...classes: readonly (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
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

/** A single shift/assignment block placed on the {@link ShiftTimeline} hour axis. */
export interface ShiftTimelineAssignment {
  /** Stable identifier, used as the React key and passed to `onAssignmentClick`. */
  readonly id: string;
  /** Display name of the person (or resource) covering the shift. */
  readonly employeeName: string;
  /** Hex/CSS color used for the block accent. Falls back to the theme primary when omitted. */
  readonly employeeColor?: string;
  /** Start time in 24h `HH:MM` format (e.g. `"09:00"`). */
  readonly start: string;
  /** End time in 24h `HH:MM` format (e.g. `"13:30"`). Must be after `start`. */
  readonly end: string;
  /** Optional secondary label (role, skill, station, …). */
  readonly skillLabel?: string;
}

export interface ShiftTimelineProps {
  /** Assignment blocks to position on the axis. */
  readonly assignments: readonly ShiftTimelineAssignment[];
  /** First hour shown on the axis, `HH:MM` (default `"09:00"`). */
  readonly dayStart?: string;
  /** Last hour shown on the axis, `HH:MM` (default `"21:00"`). */
  readonly dayEnd?: string;
  /** Minutes per grid slot / tick label (default `30`). */
  readonly slotMinutes?: number;
  /** Pixel extent of one slot along the axis (default `56`). */
  readonly slotHeight?: number;
  /** Axis orientation (default `"vertical"`). */
  readonly orientation?: 'vertical' | 'horizontal';
  /** Locale used to format tick labels (default `"en-US"`). */
  readonly locale?: string;
  /** Invoked with the assignment id when a block is clicked. Makes blocks focusable buttons. */
  readonly onAssignmentClick?: (id: string) => void;
  /** Custom renderer for a block's inner content. Receives the assignment. */
  readonly renderCard?: (assignment: ShiftTimelineAssignment) => ReactNode;
  /** Message shown when there are no assignments (default `"No shifts scheduled"`). */
  readonly emptyLabel?: string;
  readonly className?: string;
}

interface PositionedAssignment {
  readonly assignment: ShiftTimelineAssignment;
  /** Start offset along the axis, 0–1 of the visible range. */
  readonly offset: number;
  /** Size along the axis, 0–1 of the visible range. */
  readonly size: number;
  /** Lane index for overlapping blocks. */
  readonly lane: number;
  /** Number of lanes in this block's overlap cluster. */
  readonly laneCount: number;
}

function parseTimeToMinutes(value: string): number {
  const [hoursPart, minutesPart] = value.split(':');
  const hours = Number.parseInt(hoursPart ?? '', 10);
  const minutes = Number.parseInt(minutesPart ?? '0', 10);

  if (Number.isNaN(hours)) {
    return 0;
  }

  return hours * 60 + (Number.isNaN(minutes) ? 0 : minutes);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function formatTickLabel(minutes: number, locale: string): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const formatter = new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return formatter.format(new Date(2000, 0, 1, hours, mins));
}

function formatRange(assignment: ShiftTimelineAssignment): string {
  return `${assignment.start} – ${assignment.end}`;
}

/**
 * Greedy interval layout: assigns each assignment a lane within its cluster of
 * mutually-overlapping blocks, returning the lane count per cluster so callers
 * can size the cross-axis (side-by-side overlapping shifts).
 */
function layoutAssignments(
  assignments: readonly ShiftTimelineAssignment[],
  rangeStart: number,
  rangeEnd: number,
): readonly PositionedAssignment[] {
  const total = Math.max(rangeEnd - rangeStart, 1);

  const normalized = assignments
    .map((assignment) => {
      const startMinutes = clamp(parseTimeToMinutes(assignment.start), rangeStart, rangeEnd);
      const endMinutes = clamp(parseTimeToMinutes(assignment.end), rangeStart, rangeEnd);
      return {
        assignment,
        startMinutes,
        endMinutes: Math.max(endMinutes, startMinutes),
      };
    })
    .sort((left, right) =>
      left.startMinutes === right.startMinutes
        ? left.endMinutes - right.endMinutes
        : left.startMinutes - right.startMinutes,
    );

  const positioned: PositionedAssignment[] = [];
  let clusterStartIndex = 0;
  let clusterMaxEnd = -1;
  let laneEnds: number[] = [];

  function flushCluster(endIndex: number): void {
    const laneCount = Math.max(laneEnds.length, 1);
    for (let index = clusterStartIndex; index < endIndex; index += 1) {
      const entry = positioned[index];
      if (entry) {
        positioned[index] = { ...entry, laneCount };
      }
    }
  }

  normalized.forEach((entry) => {
    const startsNewCluster = entry.startMinutes >= clusterMaxEnd;

    if (startsNewCluster && positioned.length > clusterStartIndex) {
      flushCluster(positioned.length);
      clusterStartIndex = positioned.length;
      laneEnds = [];
      clusterMaxEnd = -1;
    }

    let lane = laneEnds.findIndex((laneEnd) => laneEnd <= entry.startMinutes);
    if (lane === -1) {
      lane = laneEnds.length;
    }
    laneEnds[lane] = entry.endMinutes;
    clusterMaxEnd = Math.max(clusterMaxEnd, entry.endMinutes);

    positioned.push({
      assignment: entry.assignment,
      offset: (entry.startMinutes - rangeStart) / total,
      size: (entry.endMinutes - entry.startMinutes) / total,
      lane,
      laneCount: 1,
    });
  });

  flushCluster(positioned.length);

  return positioned;
}

function AssignmentCardContent({
  assignment,
  renderCard,
}: {
  readonly assignment: ShiftTimelineAssignment;
  readonly renderCard?: (assignment: ShiftTimelineAssignment) => ReactNode;
}): React.ReactElement {
  if (renderCard) {
    return <>{renderCard(assignment)}</>;
  }

  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className="truncate text-xs font-medium text-foreground">{assignment.employeeName}</span>
      <span className="truncate text-[11px] text-muted-foreground">{formatRange(assignment)}</span>
      {assignment.skillLabel ? (
        <span className="truncate text-[11px] text-muted-foreground/80">{assignment.skillLabel}</span>
      ) : null}
    </div>
  );
}

/**
 * `ShiftTimeline` renders a lightweight, div-based hour axis with shift/assignment
 * blocks positioned proportionally to their start/end. It is intentionally NOT a
 * FullCalendar wrapper — it is a single-day planner timeline for assignment surfaces.
 *
 * Overlapping blocks are laid out side-by-side in lanes. Below the `md` breakpoint
 * the axis collapses to a chronological stacked list for readability on phones.
 */
export function ShiftTimeline({
  assignments,
  dayStart = '09:00',
  dayEnd = '21:00',
  slotMinutes = 30,
  slotHeight = 56,
  orientation = 'vertical',
  locale = 'en-US',
  onAssignmentClick,
  renderCard,
  emptyLabel = 'No shifts scheduled',
  className,
}: ShiftTimelineProps): React.ReactElement {
  const isMobile = useIsMobile();

  const rangeStart = parseTimeToMinutes(dayStart);
  const rangeEnd = Math.max(parseTimeToMinutes(dayEnd), rangeStart + slotMinutes);
  const safeSlot = Math.max(slotMinutes, 1);

  const ticks = useMemo(() => {
    const values: number[] = [];
    for (let minutes = rangeStart; minutes <= rangeEnd; minutes += safeSlot) {
      values.push(minutes);
    }
    return values;
  }, [rangeStart, rangeEnd, safeSlot]);

  const positioned = useMemo(
    () => layoutAssignments(assignments, rangeStart, rangeEnd),
    [assignments, rangeStart, rangeEnd],
  );

  const slotCount = Math.max((rangeEnd - rangeStart) / safeSlot, 1);
  const axisExtent = slotCount * slotHeight;

  if (assignments.length === 0) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-lg border border-dashed border-border bg-background p-6 text-sm text-muted-foreground',
          className,
        )}
      >
        <Clock3 className="mr-2 size-4" />
        {emptyLabel}
      </div>
    );
  }

  // Mobile: collapse the axis into a chronological stacked list.
  if (isMobile) {
    return (
      <ul className={cn('flex flex-col gap-2', className)}>
        {positioned.map(({ assignment }) => {
          const color = assignment.employeeColor;
          const interactive = Boolean(onAssignmentClick);
          return (
            <li key={assignment.id}>
              <button
                type="button"
                disabled={!interactive}
                onClick={interactive ? () => onAssignmentClick?.(assignment.id) : undefined}
                className={cn(
                  'flex min-h-[44px] w-full items-stretch gap-2 rounded-lg border border-border bg-background p-2 text-left shadow-sm transition',
                  interactive ? 'cursor-pointer hover:border-primary/30 hover:shadow-md' : 'cursor-default',
                )}
              >
                <span
                  aria-hidden
                  className="w-1 shrink-0 rounded-full bg-primary"
                  style={color ? { backgroundColor: color } : undefined}
                />
                <AssignmentCardContent assignment={assignment} renderCard={renderCard} />
              </button>
            </li>
          );
        })}
      </ul>
    );
  }

  const isVertical = orientation === 'vertical';

  return (
    <div
      className={cn('rounded-lg border border-border bg-background p-3 md:p-4', className)}
      role="list"
      aria-label="Shift timeline"
    >
      <div
        className={cn('relative', isVertical ? 'flex' : 'flex flex-col')}
        style={isVertical ? { height: axisExtent } : { width: '100%' }}
      >
        {/* Axis tick labels */}
        <div
          className={cn(
            'relative shrink-0 text-[11px] text-muted-foreground',
            isVertical ? 'w-12' : 'h-5 w-full',
          )}
          style={isVertical ? { height: axisExtent } : undefined}
          aria-hidden
        >
          {ticks.map((minutes) => {
            const fraction = (minutes - rangeStart) / Math.max(rangeEnd - rangeStart, 1);
            return (
              <span
                key={minutes}
                className={cn(
                  'absolute whitespace-nowrap tabular-nums',
                  isVertical ? '-translate-y-1/2 pr-2 text-right' : '-translate-x-1/2',
                )}
                style={
                  isVertical
                    ? { top: `${fraction * 100}%`, right: 0 }
                    : { left: `${fraction * 100}%` }
                }
              >
                {formatTickLabel(minutes, locale)}
              </span>
            );
          })}
        </div>

        {/* Track with gridlines + positioned blocks */}
        <div
          className={cn(
            'relative flex-1 rounded-md border border-border/60 bg-muted/20',
            isVertical ? 'ml-1' : 'mt-1',
          )}
          style={isVertical ? { height: axisExtent } : { height: slotHeight * 2 }}
        >
          {ticks.map((minutes) => {
            const fraction = (minutes - rangeStart) / Math.max(rangeEnd - rangeStart, 1);
            return (
              <span
                key={minutes}
                aria-hidden
                className={cn('absolute bg-border/50', isVertical ? 'left-0 h-px w-full' : 'top-0 h-full w-px')}
                style={isVertical ? { top: `${fraction * 100}%` } : { left: `${fraction * 100}%` }}
              />
            );
          })}

          {positioned.map(({ assignment, offset, size, lane, laneCount }) => {
            const color = assignment.employeeColor;
            const interactive = Boolean(onAssignmentClick);
            const lanePercent = (lane / laneCount) * 100;
            const laneSizePercent = (1 / laneCount) * 100;

            const positionStyle: React.CSSProperties = isVertical
              ? {
                  top: `${offset * 100}%`,
                  height: `${Math.max(size * 100, 0)}%`,
                  left: `${lanePercent}%`,
                  width: `calc(${laneSizePercent}% - 4px)`,
                }
              : {
                  left: `${offset * 100}%`,
                  width: `${Math.max(size * 100, 0)}%`,
                  top: `${lanePercent}%`,
                  height: `calc(${laneSizePercent}% - 4px)`,
                };

            return (
              <button
                key={assignment.id}
                type="button"
                role="listitem"
                disabled={!interactive}
                onClick={interactive ? () => onAssignmentClick?.(assignment.id) : undefined}
                title={`${assignment.employeeName} · ${formatRange(assignment)}`}
                className={cn(
                  'absolute overflow-hidden rounded-md border border-border bg-card p-1.5 text-left shadow-sm transition',
                  interactive ? 'cursor-pointer hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1' : 'cursor-default',
                )}
                style={{
                  ...positionStyle,
                  borderLeftWidth: 3,
                  borderLeftColor: color ?? 'var(--primary)',
                }}
              >
                <AssignmentCardContent assignment={assignment} renderCard={renderCard} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
