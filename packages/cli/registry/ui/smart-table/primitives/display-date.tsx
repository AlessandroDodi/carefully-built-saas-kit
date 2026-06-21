import {
  formatAbsoluteDate,
  formatDisplayDate,
  type DateDisplayValue,
} from "@/components/ui/date-display";

export interface DisplayDateProps {
  readonly value: DateDisplayValue;
  readonly className?: string;
}

export function DisplayDate({ value, className }: DisplayDateProps): React.ReactElement {
  const date = value instanceof Date ? value : new Date(value);

  return (
    <time dateTime={date.toISOString()} title={formatAbsoluteDate(date)} className={className}>
      {formatDisplayDate(date)}
    </time>
  );
}
