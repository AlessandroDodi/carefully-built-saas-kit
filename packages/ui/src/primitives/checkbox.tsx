'use client';

import { Check, Minus } from 'lucide-react';
import { Checkbox as CheckboxPrimitive } from 'radix-ui';

import type { ComponentProps } from 'react';

import { getCheckboxBoxClassName } from './checkbox.utils';
import { cn } from '../utils/cn';

import type { CheckboxSize } from './checkbox.utils';

export interface CheckboxProps
  extends Omit<ComponentProps<typeof CheckboxPrimitive.Root>, 'asChild' | 'children'> {
  /** `lg` is a 24px square with a 44px hit area, for touch screens. Defaults to a 16px square. */
  readonly size?: CheckboxSize;
}

/**
 * An accessible checkbox: a button with `role="checkbox"` that Space toggles.
 * It has no label of its own: pair it with a `Label` (`htmlFor` its `id`) or
 * give it an `aria-label`. Inside a form it submits like a native checkbox
 * (`name`, `value`, `required`).
 */
export function Checkbox({ size = 'default', className, ...props }: CheckboxProps): React.ReactElement {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      data-size={size}
      className={cn(
        getCheckboxBoxClassName(size),
        'peer relative outline-none',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:ring-3',
        'disabled:cursor-not-allowed disabled:opacity-50',
        // The square stays small; the area that takes the finger does not.
        size === 'lg' && 'after:absolute after:-inset-2.5',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="group/checkbox-indicator flex items-center justify-center"
      >
        <Check
          aria-hidden="true"
          strokeWidth={3}
          className="group-data-[state=indeterminate]/checkbox-indicator:hidden"
        />
        <Minus
          aria-hidden="true"
          strokeWidth={3}
          className="hidden group-data-[state=indeterminate]/checkbox-indicator:block"
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
