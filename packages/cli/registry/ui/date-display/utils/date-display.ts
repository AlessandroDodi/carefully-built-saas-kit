export type DateDisplayValue = Date | number | string;

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

export function formatAbsoluteDate(value: DateDisplayValue): string {
  const date = getDate(value);
  const currentYear = new Date().getFullYear();
  const includesYear = date.getFullYear() !== currentYear;

  return capitalizeMonthLabel(
    new Intl.DateTimeFormat('it-IT', {
      day: 'numeric',
      month: 'short',
      ...(includesYear ? { year: 'numeric' } : {}),
    }).format(date)
  );
}

export function formatDisplayDate(value: DateDisplayValue): string {
  const date = getDate(value);
  const dayDifference = getDayDifference(date, new Date());

  if (dayDifference === 0) {
    return 'Oggi';
  }

  if (dayDifference === 1) {
    return 'Ieri';
  }

  if (dayDifference >= 2 && dayDifference <= 10) {
    return `${String(dayDifference)} giorni fa`;
  }

  return formatAbsoluteDate(date);
}
