'use client';

import { Check } from 'lucide-react';
import { Checkbox as CheckboxPrimitive } from 'radix-ui';
import { useState } from 'react';

import type { ReactNode } from 'react';

import { getCheckboxBoxClassName, getCheckboxDataState } from './checkbox.utils';
import { cn } from '../utils/cn';

import type { CheckboxSize } from './checkbox.utils';

export interface CheckboxCardClassNames {
  readonly root?: string;
  /** The square on the left. It carries `data-state` and `data-disabled`. */
  readonly checkbox?: string;
  /** The column to the right of the square. */
  readonly content?: string;
  /** The line that holds the title and the badge. */
  readonly header?: string;
  readonly title?: string;
  readonly badge?: string;
  readonly description?: string;
}

export interface CheckboxCardProps {
  readonly title: ReactNode;
  readonly description?: ReactNode;
  /** Shown next to the title, e.g. a `Chip` or a short text. */
  readonly badge?: ReactNode;
  /** Controlled state. Omit it to let the card keep its own state. */
  readonly checked?: boolean;
  /** Initial state when uncontrolled. Defaults to unchecked. */
  readonly defaultChecked?: boolean;
  readonly onCheckedChange?: (checked: boolean) => void;
  readonly disabled?: boolean;
  readonly required?: boolean;
  /** Size of the square. See `Checkbox`. */
  readonly size?: CheckboxSize;
  readonly id?: string;
  /** Inside a form the card submits like a native checkbox. */
  readonly name?: string;
  readonly value?: string;
  /** Replaces the accessible name, which is otherwise the title, badge and description. */
  readonly 'aria-label'?: string;
  readonly 'aria-describedby'?: string;
  readonly className?: string;
  readonly classes?: CheckboxCardClassNames;
}

/**
 * A whole card that is one checkbox: the square on the left, a title, an
 * optional badge and description. The card itself has `role="checkbox"`, so it
 * is a single tab stop and Space toggles it; the square inside is decorative.
 */
export function CheckboxCard({
  title,
  description,
  badge,
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  required,
  size = 'default',
  id,
  name,
  value,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  className,
  classes,
}: CheckboxCardProps): React.ReactElement {
  const [ownChecked, setOwnChecked] = useState(defaultChecked);
  const isChecked = checked ?? ownChecked;
  const hasBadge = badge !== undefined && badge !== null && badge !== false;
  const hasDescription = description !== undefined && description !== null && description !== false;

  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox-card"
      data-checked={isChecked ? '' : undefined}
      id={id}
      name={name}
      value={value}
      required={required}
      disabled={disabled}
      checked={isChecked}
      onCheckedChange={(next) => {
        const nextChecked = next === true;
        setOwnChecked(nextChecked);
        onCheckedChange?.(nextChecked);
      }}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      className={cn(
        'border-border bg-card text-card-foreground flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-colors outline-none',
        'focus-visible:ring-ring/50 focus-visible:ring-3',
        'data-checked:border-primary data-checked:bg-primary/5',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
        classes?.root,
      )}
    >
      <span
        aria-hidden="true"
        data-slot="checkbox-card-indicator"
        data-state={getCheckboxDataState(isChecked)}
        data-disabled={disabled ? '' : undefined}
        className={cn(getCheckboxBoxClassName(size), size === 'default' && 'mt-0.5', classes?.checkbox)}
      >
        {isChecked ? <Check strokeWidth={3} /> : null}
      </span>

      <span data-slot="checkbox-card-content" className={cn('min-w-0 flex-1', classes?.content)}>
        <span className={cn('flex flex-wrap items-center gap-x-2 gap-y-1', classes?.header)}>
          <span data-slot="checkbox-card-title" className={cn('text-sm leading-5 font-medium', classes?.title)}>
            {title}
          </span>
          {hasBadge ? (
            <span data-slot="checkbox-card-badge" className={classes?.badge}>
              {badge}
            </span>
          ) : null}
        </span>

        {hasDescription ? (
          <span
            data-slot="checkbox-card-description"
            className={cn('text-muted-foreground mt-0.5 block text-sm leading-5', classes?.description)}
          >
            {description}
          </span>
        ) : null}
      </span>
    </CheckboxPrimitive.Root>
  );
}
