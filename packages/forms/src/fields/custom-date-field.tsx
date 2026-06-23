'use client';

import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';

import {
  formatDatePickerDisplayValue,
  formatDatePickerValue,
  parseDatePickerValue,
} from './date-picker-value';

import { Button } from '@carefully-built/ui';
import { Calendar } from '@carefully-built/ui';
import { Popover, PopoverContent, PopoverTrigger } from '@carefully-built/ui';
import { cn } from '@carefully-built/ui';

interface CustomDateFieldProps {
  readonly id?: string; readonly value: string | undefined; readonly onChange: (value: string | undefined) => void;
  readonly placeholder?: string; readonly hasError?: boolean; readonly disabled?: boolean;
  readonly locale?: React.ComponentProps<typeof Calendar>['locale'];
  readonly displayLocale?: string;
  readonly clearLabel?: string;
}

interface CustomDateFieldTriggerProps extends React.ComponentProps<typeof Button> {
  readonly displayValue: string; readonly isEmpty: boolean; readonly hasError: boolean;
}

interface CustomDateFieldCalendarProps {
  readonly selectedDate: Date | undefined; readonly onSelectDate: (date: Date) => void; readonly onClear: () => void;
  readonly locale?: React.ComponentProps<typeof Calendar>['locale'];
  readonly clearLabel: string;
}

function CustomDateFieldTrigger({
  displayValue,
  isEmpty,
  hasError,
  className,
  ...triggerProps
}: CustomDateFieldTriggerProps): React.ReactElement {
  return (
    <Button
      type="button"
      variant="outline"
      aria-invalid={hasError}
      data-empty={isEmpty}
      className={cn(
        'h-8 w-full justify-between rounded-lg px-2.5 text-left font-normal',
        'aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20',
        'data-[empty=true]:text-muted-foreground',
        className
      )}
      {...triggerProps}
    >
      <span className="truncate">{displayValue}</span>
      <CalendarIcon className="size-4" />
    </Button>
  );
}

function CustomDateFieldCalendar({
  selectedDate,
  onSelectDate,
  onClear,
  locale,
  clearLabel,
}: CustomDateFieldCalendarProps): React.ReactElement {
  return (
    <PopoverContent align="start" className="w-auto p-0">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(nextDate) => {
          if (nextDate) {
            onSelectDate(nextDate);
          }
        }}
        locale={locale}
        className="rounded-lg border-0"
      />
      {selectedDate ? (
        <div className="border-t p-2">
          <Button type="button" variant="ghost" size="sm" className="w-full" onClick={onClear}>
            {clearLabel}
          </Button>
        </div>
      ) : null}
    </PopoverContent>
  );
}

export function CustomDateField({
  id,
  value,
  onChange,
  placeholder = 'Select date',
  locale,
  displayLocale = 'en-US',
  clearLabel = 'Clear',
  hasError = false,
  disabled = false,
}: CustomDateFieldProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const selectedDate = parseDatePickerValue(value);
  const displayValue = formatDatePickerDisplayValue(value, placeholder, displayLocale);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <CustomDateFieldTrigger
          id={id}
          displayValue={displayValue}
          isEmpty={!selectedDate}
          hasError={hasError}
          disabled={disabled}
        />
      </PopoverTrigger>
      <CustomDateFieldCalendar
        selectedDate={selectedDate}
        onSelectDate={(nextDate) => {
          onChange(formatDatePickerValue(nextDate));
          setOpen(false);
        }}
        onClear={() => {
          onChange(undefined);
          setOpen(false);
        }}
        locale={locale}
        clearLabel={clearLabel}
      />
    </Popover>
  );
}
