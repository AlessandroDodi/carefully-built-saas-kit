export type DeviceCodeCharset = 'alphanumeric' | 'numeric';

export interface DeviceCodeFormat {
  /** Number of characters of a complete code. */
  readonly length: number;
  readonly charset?: DeviceCodeCharset;
  /** Alphanumeric codes are upper-cased unless this is false. */
  readonly uppercase?: boolean;
}

export interface DeviceCodeSelection {
  readonly start: number;
  readonly end: number;
}

const disallowedCharacters: Record<DeviceCodeCharset, RegExp> = {
  alphanumeric: /[^A-Za-z0-9]/g,
  numeric: /[^0-9]/g,
};

/**
 * Keeps only the characters a code can contain, dropping separators, spaces
 * and anything else a paste or an on-screen keyboard may add. Does not cut the
 * result to a length.
 */
export function filterDeviceCodeCharacters(
  raw: string,
  charset: DeviceCodeCharset = 'alphanumeric',
  uppercase = true,
): string {
  const filtered = raw.replace(disallowedCharacters[charset], '');
  return uppercase ? filtered.toUpperCase() : filtered;
}

/** The code as it is stored and reported: allowed characters only, at most `length` of them. */
export function normalizeDeviceCode(raw: string, format: DeviceCodeFormat): string {
  return filterDeviceCodeCharacters(raw, format.charset, format.uppercase).slice(
    0,
    Math.max(0, format.length),
  );
}

/**
 * Sizes of the visual groups. `groups` wins when it is valid (positive whole
 * numbers), so `[3, 3]` renders `XXX-XXX`; otherwise there is one group of
 * `length` cells.
 */
export function resolveDeviceCodeGroups(length = 6, groups?: readonly number[]): number[] {
  const valid =
    groups !== undefined &&
    groups.length > 0 &&
    groups.every((size) => Number.isInteger(size) && size > 0);
  if (valid) return [...groups];

  return [Math.max(1, Math.floor(length))];
}

/** Cuts a normalized code into its groups; groups not reached yet are empty strings. */
export function splitDeviceCode(value: string, groups: readonly number[]): string[] {
  const parts: string[] = [];
  let offset = 0;
  for (const size of groups) {
    parts.push(value.slice(offset, offset + size));
    offset += size;
  }
  return parts;
}

/** `ABC123` with groups `[3, 3]` becomes `ABC-123`. Incomplete codes keep no trailing separator. */
export function formatDeviceCode(
  value: string,
  groups: readonly number[],
  separator = '-',
): string {
  return splitDeviceCode(value, groups)
    .filter((part) => part.length > 0)
    .join(separator);
}

/**
 * Result of pasting `pasted` over `selection`. A paste that holds a whole code
 * replaces everything, wherever the caret is; a shorter one is inserted at the
 * selection. `caret` is where typing continues.
 */
export function pasteDeviceCode(
  current: string,
  pasted: string,
  selection: DeviceCodeSelection,
  format: DeviceCodeFormat,
): { value: string; caret: number } {
  const inserted = filterDeviceCodeCharacters(pasted, format.charset, format.uppercase);
  if (inserted.length === 0) {
    return { value: current, caret: Math.min(selection.start, current.length) };
  }

  if (inserted.length >= format.length) {
    const value = inserted.slice(0, format.length);
    return { value, caret: value.length };
  }

  const start = Math.max(0, Math.min(selection.start, current.length));
  const end = Math.max(start, Math.min(selection.end, current.length));
  const value = `${current.slice(0, start)}${inserted}${current.slice(end)}`.slice(0, format.length);
  return { value, caret: Math.min(start + inserted.length, value.length) };
}

/** Keyboard the browser should open: digits only for numeric codes. */
export function getDeviceCodeInputMode(charset: DeviceCodeCharset = 'alphanumeric'): 'numeric' | 'text' {
  return charset === 'numeric' ? 'numeric' : 'text';
}
