export type DateDisplayValue = Date | number | string;

export interface DateDisplayLabels {
  readonly today: string;
  readonly yesterday: string;
  readonly daysAgo: (dayCount: number) => string;
}

export interface DateDisplayFormatOptions {
  readonly locale?: string;
  readonly labels?: Partial<DateDisplayLabels>;
}

const DEFAULT_DATE_DISPLAY_LABELS: DateDisplayLabels = {
  today: 'Today',
  yesterday: 'Yesterday',
  daysAgo: (dayCount) => `${String(dayCount)} days ago`,
};

function getDate(value: DateDisplayValue): Date {
  return value instanceof Date ? value : new Date(value);
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getDayDifference(from: Date, to: Date): number {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / millisecondsPerDay);
}

function capitalizeMonthLabel(value: string): string {
  return value
    .split(' ')
    .map((part, index) => {
      if (index !== 1 || part.length === 0) {
        return part;
      }

      const [firstCharacter = '', ...restCharacters] = part;
      return `${firstCharacter.toUpperCase()}${restCharacters.join('')}`;
    })
    .join(' ');
}

export function formatAbsoluteDate(
  value: DateDisplayValue,
  options: DateDisplayFormatOptions = {},
): string {
  const date = getDate(value);
  const currentYear = new Date().getFullYear();
  const includesYear = date.getFullYear() !== currentYear;
  const locale = options.locale ?? 'en-US';

  return capitalizeMonthLabel(
    new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
      ...(includesYear ? { year: 'numeric' } : {}),
    }).format(date)
  );
}

export function formatDisplayDate(
  value: DateDisplayValue,
  options: DateDisplayFormatOptions = {},
): string {
  const date = getDate(value);
  const dayDifference = getDayDifference(date, new Date());
  const labels = {
    ...DEFAULT_DATE_DISPLAY_LABELS,
    ...options.labels,
  };

  if (dayDifference === 0) {
    return labels.today;
  }

  if (dayDifference === 1) {
    return labels.yesterday;
  }

  if (dayDifference >= 2 && dayDifference <= 10) {
    return labels.daysAgo(dayDifference);
  }

  return formatAbsoluteDate(date, options);
}
