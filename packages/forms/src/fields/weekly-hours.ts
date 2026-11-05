import { z } from 'zod';

/** ISO weekday: 1 = Monday … 7 = Sunday. */
export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const WEEKDAYS: readonly Weekday[] = [1, 2, 3, 4, 5, 6, 7];

/** One time range on one weekday, times as `HH:mm`. */
export interface WeeklyHoursRange {
  readonly weekday: Weekday;
  readonly start: string;
  readonly end: string;
}

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Zod schema for a weekly hours value; `end` must follow `start`. */
export const weeklyHoursSchema = z.array(
  z
    .object({
      weekday: z.union([
        z.literal(1),
        z.literal(2),
        z.literal(3),
        z.literal(4),
        z.literal(5),
        z.literal(6),
        z.literal(7),
      ]),
      start: z.string().regex(TIME_PATTERN),
      end: z.string().regex(TIME_PATTERN),
    })
    .refine((range) => range.start < range.end, { path: ['end'] }),
);

/** Office hours, Monday to Friday: a sensible starting point for a new record. */
export function defaultWeeklyHours(start = '09:00', end = '18:00'): WeeklyHoursRange[] {
  return [1, 2, 3, 4, 5].map((weekday) => ({ weekday: weekday as Weekday, start, end }));
}

export function rangesForDay(value: readonly WeeklyHoursRange[], weekday: Weekday): WeeklyHoursRange[] {
  return value.filter((range) => range.weekday === weekday);
}

/** Turning a day on adds a default range; turning it off removes all its ranges. */
export function toggleDay(
  value: readonly WeeklyHoursRange[],
  weekday: Weekday,
  template: Pick<WeeklyHoursRange, 'start' | 'end'>,
): WeeklyHoursRange[] {
  const others = value.filter((range) => range.weekday !== weekday);
  const isOn = others.length !== value.length;
  return isOn ? others : sortRanges([...value, { weekday, ...template }]);
}

export function addRange(value: readonly WeeklyHoursRange[], weekday: Weekday): WeeklyHoursRange[] {
  const last = rangesForDay(value, weekday).at(-1);
  const start = last ? last.end : '09:00';
  return sortRanges([...value, { weekday, start, end: start < '18:00' ? '18:00' : '23:59' }]);
}

export function updateRange(
  value: readonly WeeklyHoursRange[],
  target: WeeklyHoursRange,
  patch: Partial<Pick<WeeklyHoursRange, 'start' | 'end'>>,
): WeeklyHoursRange[] {
  return value.map((range) => (range === target ? { ...range, ...patch } : range));
}

export function removeRange(
  value: readonly WeeklyHoursRange[],
  target: WeeklyHoursRange,
): WeeklyHoursRange[] {
  return value.filter((range) => range !== target);
}

function sortRanges(value: readonly WeeklyHoursRange[]): WeeklyHoursRange[] {
  return [...value].sort((a, b) => a.weekday - b.weekday || a.start.localeCompare(b.start));
}
