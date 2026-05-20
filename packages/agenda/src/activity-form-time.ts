export const DEFAULT_ACTIVITY_START_TIME = '09:00';
export const DEFAULT_ACTIVITY_END_TIME = '10:00';
export const ALL_DAY_ACTIVITY_START_TIME = '00:00';
export const ALL_DAY_ACTIVITY_END_TIME = '23:59';

function parseDateParts(value: string): {
  year: number;
  month: number;
  day: number;
} | null {
  const [rawYear = '', rawMonth = '', rawDay = ''] = value.split('-');
  const year = Number(rawYear);
  const month = Number(rawMonth);
  const day = Number(rawDay);

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return null;
  }

  return { year, month, day };
}

function parseTimeToMinutes(value: string): number {
  const [rawHours = '0', rawMinutes = '0'] = value.split(':');
  const hours = Number(rawHours);
  const minutes = Number(rawMinutes);
  return (hours * 60) + minutes;
}

function formatMinutesToTime(value: number): string {
  const normalizedMinutes = ((value % (24 * 60)) + (24 * 60)) % (24 * 60);
  const hours = String(Math.floor(normalizedMinutes / 60)).padStart(2, '0');
  const minutes = String(normalizedMinutes % 60).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function addOneHourToTime(value: string): string {
  return formatMinutesToTime(parseTimeToMinutes(value) + 60);
}

export function buildDefaultTimedRange(): {
  startTime: string;
  endTime: string;
} {
  return {
    startTime: DEFAULT_ACTIVITY_START_TIME,
    endTime: DEFAULT_ACTIVITY_END_TIME,
  };
}

export function toLocalTimestamp(date: string, time: string): number | undefined {
  const parsedDate = parseDateParts(date);

  if (!parsedDate) {
    return undefined;
  }

  const normalizedTime = time || '00:00';
  const [rawHours = '0', rawMinutes = '0'] = normalizedTime.split(':');
  const hours = Number(rawHours);
  const minutes = Number(rawMinutes);

  return new Date(parsedDate.year, parsedDate.month - 1, parsedDate.day, hours, minutes, 0, 0).getTime();
}

export function formatDateInputValue(timestamp: number | undefined): string {
  if (typeof timestamp !== 'number') {
    return '';
  }

  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${String(year)}-${month}-${day}`;
}

export function formatTimeInputValue(timestamp: number | undefined): string {
  if (typeof timestamp !== 'number') {
    return '';
  }

  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function isAllDayActivityRange(startAt?: number, endAt?: number): boolean {
  if (!startAt || !endAt) {
    return false;
  }

  const startTime = formatTimeInputValue(startAt);
  const endTime = formatTimeInputValue(endAt);

  return startTime === ALL_DAY_ACTIVITY_START_TIME && endTime === ALL_DAY_ACTIVITY_END_TIME;
}
