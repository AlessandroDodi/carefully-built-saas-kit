'use client';

import { useLayoutEffect, useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import type { LucideIcon } from 'lucide-react';
import type { FieldValues, Path } from 'react-hook-form';

import { Textarea, cn } from '@carefully-built/ui';

import { FieldMessage } from './field-message';
import { FormFieldLabel } from './form-field-label';

interface CustomTextareaFieldProps<TValues extends FieldValues> {
  readonly name: Path<TValues>;
  readonly label?: string;
  readonly labelIcon?: LucideIcon;
  readonly placeholder?: string;
  readonly disabled?: boolean;
  readonly autoFocus?: boolean;
  readonly rows?: number;
  /**
   * Grow with the text instead of scrolling inside a small box (default). A
   * scroll inside a scrolling sheet is unusable on a phone. Capped at 60% of
   * the screen height, past which the field scrolls.
   */
  readonly autoResize?: boolean;
  readonly className?: string;
}

function useAutoResize(value: unknown, enabled: boolean): React.RefObject<HTMLTextAreaElement | null> {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!enabled || !element) return;
    element.style.height = 'auto';
    const border = element.offsetHeight - element.clientHeight;
    element.style.height = `${String(element.scrollHeight + border)}px`;
  }, [value, enabled]);

  return ref;
}

export function CustomTextareaField<TValues extends FieldValues>({
  name,
  label,
  labelIcon,
  placeholder,
  disabled = false,
  autoFocus = false,
  rows = 4,
  autoResize = true,
  className,
}: CustomTextareaFieldProps<TValues>): React.ReactElement {
  const { control, watch } = useFormContext<TValues>();
  const ref = useAutoResize(watch(name), autoResize);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className={cn('space-y-2', className)}>
          {label ? (
            <FormFieldLabel htmlFor={name} label={label} icon={labelIcon} hasError={Boolean(error)} />
          ) : null}
          <Textarea
            {...field}
            ref={(element) => {
              field.ref(element);
              ref.current = element;
            }}
            id={name}
            placeholder={placeholder}
            disabled={disabled}
            autoFocus={autoFocus}
            rows={rows}
            className={cn(autoResize && 'max-h-[60vh] resize-none', error && 'border-destructive')}
            value={field.value ?? ''}
          />
          <FieldMessage message={error?.message} />
        </div>
      )}
    />
  );
}
