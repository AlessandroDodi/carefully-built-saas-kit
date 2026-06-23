const DATE_INPUT_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

function padDatePart(value: number): string {
  return String(value).padStart(2, '0');
}

export function parseDatePickerValue(value: string | undefined): Date | undefined {
  if (!value) {
    return undefined;
  }

  const match = DATE_INPUT_PATTERN.exec(value);
  if (!match) {
    return undefined;
  }

  const [, yearValue, monthValue, dayValue] = match;
  const year = Number(yearValue);
  const month = Number(monthValue);
  const day = Number(dayValue);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return undefined;
  }

  return date;
}

export function formatDatePickerValue(date: Date): string {
  return [
    String(date.getFullYear()),
    padDatePart(date.getMonth() + 1),
    padDatePart(date.getDate()),
  ].join('-');
}

export function formatDatePickerDisplayValue(
  value: string | undefined,
  placeholder: string,
  locale = 'en-US',
): string {
  const date = parseDatePickerValue(value);

  if (!date) {
    return placeholder;
  }

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}
