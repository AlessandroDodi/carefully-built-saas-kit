'use client';

import { cn } from '@carefully-built/ui';

import type { ActivityCalendarScope } from './activity-helpers';

export type ActivityViewMode = ActivityCalendarScope | 'list';

export interface ActivityViewModeToggleOption {
  readonly value: ActivityViewMode;
  readonly label: string;
}

export interface ActivityViewModeToggleProps {
  readonly value: ActivityViewMode;
  readonly onChange: (value: ActivityViewMode) => void;
  readonly options?: readonly ActivityViewModeToggleOption[];
  readonly className?: string;
  readonly disabled?: boolean;
  readonly scrollable?: boolean;
}

export const defaultActivityViewModeOptions: readonly ActivityViewModeToggleOption[] = [
  { value: 'list', label: 'List' },
  { value: 'month', label: 'Month' },
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
] as const;

export function ActivityViewModeToggle({
  value,
  onChange,
  options = defaultActivityViewModeOptions,
  className = 'w-full sm:w-auto sm:min-w-[280px]',
  disabled = false,
  scrollable = false,
}: ActivityViewModeToggleProps): React.ReactElement {
  return (
    <div
      role="group"
      className={cn(
        'border-border bg-background flex h-8 gap-0.5 rounded-lg border p-0.5 shadow-none',
        scrollable ? 'min-w-max overflow-x-auto' : 'w-full',
        disabled && 'opacity-50',
        className,
      )}
    >
      {options.map((option) => {
        const isSelected = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isSelected}
            disabled={disabled}
            className={cn(
              'text-foreground h-full flex-1 shrink-0 rounded-md px-2 py-0 text-[13px] leading-5 font-medium shadow-none transition-colors',
              'hover:text-foreground focus-visible:ring-ring/50 focus-visible:outline-ring focus-visible:ring-[3px] focus-visible:outline-1',
              isSelected && 'border-border bg-accent text-accent-foreground',
              disabled && 'pointer-events-none',
            )}
            onClick={() => {
              onChange(option.value);
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
