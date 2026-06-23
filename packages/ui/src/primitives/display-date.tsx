import {
  formatAbsoluteDate,
  formatDisplayDate,
  type DateDisplayValue,
  type DateDisplayFormatOptions,
} from "../utils/date-display";

export interface DisplayDateProps {
  readonly value: DateDisplayValue;
  readonly formatOptions?: DateDisplayFormatOptions;
  readonly className?: string;
}

export function DisplayDate({ value, formatOptions, className }: DisplayDateProps): React.ReactElement {
  const date = value instanceof Date ? value : new Date(value);

  return (
    <time dateTime={date.toISOString()} title={formatAbsoluteDate(date, formatOptions)} className={className}>
      {formatDisplayDate(date, formatOptions)}
    </time>
  );
}
