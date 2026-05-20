'use client';

import { useEffect, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { FormFieldLabel } from './form-field-label';

import type { LucideIcon } from 'lucide-react';
import type { FieldValues, Path } from 'react-hook-form';

import { Input } from '@carefully-built/ui';
import {
  formatCompactCurrencyValue,
  getCompactCurrencySuggestion,
  parseCompactCurrencyInput,
} from './compact-currency';
import { cn } from '@carefully-built/ui';

interface CustomCompactCurrencyFieldProps<TValues extends FieldValues> {
  readonly name: Path<TValues>;
  readonly label?: string;
  readonly labelIcon?: LucideIcon;
  readonly placeholder?: string;
  readonly disabled?: boolean;
  readonly autoFocus?: boolean;
  readonly className?: string;
}

export function CustomCompactCurrencyField<TValues extends FieldValues>({
  name,
  label,
  labelIcon,
  placeholder,
  disabled = false,
  autoFocus = false,
  className,
}: CustomCompactCurrencyFieldProps<TValues>): React.ReactElement {
  const { control } = useFormContext<TValues>();
  const { field, fieldState: { error } } = useController({
    name,
    control,
  });
  const [inputValue, setInputValue] = useState<string>(
    typeof field.value === 'number' ? formatCompactCurrencyValue(field.value) : ''
  );
  const [isFocused, setIsFocused] = useState(false);
  const suggestion = getCompactCurrencySuggestion(inputValue);

  function applySuggestion(): void {
    if (!suggestion) {
      return;
    }

    field.onChange(suggestion.value);
    setInputValue(suggestion.label);
    setIsFocused(false);
  }

  useEffect(() => {
    if (isFocused) {
      return;
    }

    setInputValue(
      typeof field.value === 'number' ? formatCompactCurrencyValue(field.value) : ''
    );
  }, [field.value, isFocused]);

  return (
    <div className={cn('space-y-2', className)}>
      {label ? (
        <FormFieldLabel
          htmlFor={name}
          label={label}
          icon={labelIcon}
          hasError={Boolean(error)}
        />
      ) : null}
      <div className="relative">
        <Input
          id={name}
          name={field.name}
          ref={field.ref}
          value={inputValue}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          inputMode="decimal"
          className={error ? 'border-destructive' : ''}
          onChange={(event) => {
            const nextValue = event.target.value;
            const parsedValue = parseCompactCurrencyInput(nextValue);

            setInputValue(nextValue);
            field.onChange(
              nextValue.trim().length === 0 ? undefined : (parsedValue ?? nextValue)
            );
          }}
          onFocus={() => {
            setIsFocused(true);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && suggestion) {
              event.preventDefault();
              applySuggestion();
            }
          }}
          onBlur={() => {
            const parsedValue = parseCompactCurrencyInput(inputValue);

            setIsFocused(false);
            field.onBlur();

            if (inputValue.trim().length === 0) {
              field.onChange(undefined);
              setInputValue('');
              return;
            }

            if (parsedValue !== undefined) {
              field.onChange(parsedValue);
              setInputValue(formatCompactCurrencyValue(parsedValue));
            }
          }}
        />
        {isFocused && suggestion ? (
          <div className="bg-popover text-popover-foreground absolute left-0 right-0 top-[calc(100%+8px)] z-20 rounded-xl border p-1 shadow-lg">
            <button
              type="button"
              className="hover:bg-accent hover:text-accent-foreground flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm transition-colors"
              onMouseDown={(event) => {
                event.preventDefault();
              }}
              onClick={applySuggestion}
            >
              <span>{suggestion.label}</span>
              <span className="text-muted-foreground text-xs">Applica</span>
            </button>
          </div>
        ) : null}
      </div>
      {error?.message ? <p className="text-sm text-destructive">{error.message}</p> : null}
    </div>
  );
}
