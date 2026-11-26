import { cn } from '../utils/cn';

export type CheckboxSize = 'default' | 'lg';

/** `indeterminate` is the dash of a parent whose children are only partly selected. */
export type CheckboxCheckedState = boolean | 'indeterminate';

export type CheckboxDataState = 'checked' | 'unchecked' | 'indeterminate';

/** The value of the `data-state` attribute a box carries, the one its styles are written against. */
export function getCheckboxDataState(checked: CheckboxCheckedState | undefined): CheckboxDataState {
  if (checked === 'indeterminate') return 'indeterminate';
  return checked === true ? 'checked' : 'unchecked';
}

const checkboxBoxSizeClasses: Record<CheckboxSize, string> = {
  default: 'size-4 rounded-[4px] [&_svg]:size-3',
  lg: 'size-6 rounded-md [&_svg]:size-4',
};

/**
 * The classes of the square itself, shared by `Checkbox` and by the square
 * drawn inside a `CheckboxCard`. They read `data-state`, so the same string
 * styles a real checkbox and a decorative one.
 */
export function getCheckboxBoxClassName(size: CheckboxSize = 'default'): string {
  return cn(
    'border-input bg-background text-primary-foreground flex shrink-0 items-center justify-center border shadow-xs transition-colors',
    'data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
    checkboxBoxSizeClasses[size],
  );
}
