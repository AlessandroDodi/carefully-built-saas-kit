export interface CompactCurrencySuggestion {
  readonly value: number;
  readonly label: string;
}

function trimTrailingZero(value: string): string {
  return value.endsWith('.0') ? value.slice(0, -2) : value;
}

function normalizeCompactNumberPart(value: string): string {
  const trimmedValue = value.trim();
  const lastDotIndex = trimmedValue.lastIndexOf('.');
  const lastCommaIndex = trimmedValue.lastIndexOf(',');
  const decimalSeparatorIndex = Math.max(lastDotIndex, lastCommaIndex);

  if (decimalSeparatorIndex < 0) {
    return trimmedValue.replace(/[.,]/g, '');
  }

  const integerPart = trimmedValue.slice(0, decimalSeparatorIndex).replace(/[.,]/g, '');
  const decimalPart = trimmedValue.slice(decimalSeparatorIndex + 1).replace(/[.,]/g, '');

  return `${integerPart}.${decimalPart}`;
}

function normalizeFullNumberPart(value: string): string {
  const trimmedValue = value.trim();

  if (/^\d{1,3}([.,]\d{3})+$/.test(trimmedValue)) {
    return trimmedValue.replace(/[.,]/g, '');
  }

  const lastDotIndex = trimmedValue.lastIndexOf('.');
  const lastCommaIndex = trimmedValue.lastIndexOf(',');
  const decimalSeparatorIndex = Math.max(lastDotIndex, lastCommaIndex);

  if (decimalSeparatorIndex < 0) {
    return trimmedValue;
  }

  const decimalSeparator = trimmedValue[decimalSeparatorIndex] ?? '.';
  const integerPart = trimmedValue.slice(0, decimalSeparatorIndex).replace(/[.,]/g, '');
  const decimalPart = trimmedValue.slice(decimalSeparatorIndex + 1).replace(/[.,]/g, '');

  if (decimalPart.length === 0) {
    return integerPart;
  }

  if (decimalPart.length === 3 && decimalSeparator !== '') {
    return `${integerPart}${decimalPart}`;
  }

  return `${integerPart}.${decimalPart}`;
}

export function parseCompactCurrencyInput(value: string): number | undefined {
  const normalizedValue = value.trim().replace(/\s+/g, '').replace(/€/g, '');

  if (normalizedValue.length === 0) {
    return undefined;
  }

  const compactMatch = /^([0-9][0-9.,]*)([KMB])$/i.exec(normalizedValue);

  if (compactMatch) {
    const numberPart = normalizeCompactNumberPart(compactMatch[1] ?? '');
    const parsedNumber = Number(numberPart);

    if (!Number.isFinite(parsedNumber)) {
      return undefined;
    }

    const suffix = (compactMatch[2] ?? '').toUpperCase();
    const multiplier =
      suffix === 'M' ? 1_000_000 : suffix === 'B' ? 1_000_000_000 : 1_000;

    return Math.round(parsedNumber * multiplier);
  }

  if (!/^[0-9][0-9.,]*$/.test(normalizedValue)) {
    return undefined;
  }

  const parsedNumber = Number(normalizeFullNumberPart(normalizedValue));
  return Number.isFinite(parsedNumber) ? parsedNumber : undefined;
}

export function formatCompactCurrencyValue(value: number | undefined): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return '';
  }

  if (Math.abs(value) >= 1_000_000) {
    return `${trimTrailingZero((value / 1_000_000).toFixed(1))}M`;
  }

  if (Math.abs(value) >= 1_000) {
    return `${trimTrailingZero((value / 1_000).toFixed(1))}K`;
  }

  return trimTrailingZero(value.toFixed(0));
}

export function formatCompactCurrencyDisplay(value: number | undefined): string | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return null;
  }

  return `€ ${formatCompactCurrencyValue(value).toLowerCase()}`;
}

export function getCompactCurrencySuggestion(value: string): CompactCurrencySuggestion | null {
  const trimmedValue = value.trim();

  if (
    trimmedValue.length === 0 ||
    /[KMB]/i.test(trimmedValue) ||
    /^\d{1,3}([.,]\d{3})+$/.test(trimmedValue) ||
    !/^\d+([.,]\d+)?$/.test(trimmedValue)
  ) {
    return null;
  }

  const parsedNumber = Number(trimmedValue.replace(',', '.'));

  if (!Number.isFinite(parsedNumber) || parsedNumber <= 0 || parsedNumber >= 10_000) {
    return null;
  }

  const suggestedValue = Math.round(parsedNumber * 1_000);
  return {
    value: suggestedValue,
    label: formatCompactCurrencyValue(suggestedValue),
  };
}
