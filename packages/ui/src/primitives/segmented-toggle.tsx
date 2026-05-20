'use client';

import type { ReactNode } from 'react';

import { Tabs, TabsList, TabsScrollArea, TabsTrigger } from './tabs';
import { cn } from '../utils/cn';

export interface SegmentedToggleOption<TValue extends string> {
  readonly value: TValue;
  readonly label: string;
  readonly icon?: ReactNode;
}

export interface SegmentedToggleProps<TValue extends string> {
  readonly value: TValue;
  readonly onChange: (value: TValue) => void;
  readonly options: readonly SegmentedToggleOption<TValue>[];
  readonly disabled?: boolean;
  readonly className?: string;
  readonly variant?: 'default' | 'primary';
  readonly scrollable?: boolean;
}

export function SegmentedToggle<TValue extends string>({
  value,
  onChange,
  options,
  disabled = false,
  className,
  variant = 'default',
  scrollable = false,
}: SegmentedToggleProps<TValue>): React.ReactElement {
  const isPrimaryVariant = variant === 'primary';

  return (
    <Tabs
      value={value}
      onValueChange={(nextValue) => {
        if (nextValue) {
          onChange(nextValue as TValue);
        }
      }}
      className={cn('w-full', disabled && 'opacity-50', className)}
    >
      {scrollable ? (
        <TabsScrollArea>
          <TabsList
            className={cn(
              'w-full min-w-max',
              isPrimaryVariant &&
                'border-border bg-background h-8 gap-0.5 rounded-lg border p-0.5 shadow-none',
            )}
          >
            {options.map((option) => (
              <TabsTrigger
                key={option.value}
                value={option.value}
                disabled={disabled}
                className={cn(
                  'shrink-0',
                  isPrimaryVariant && [
                    'text-foreground h-full gap-1.5 rounded-md px-2 py-0 text-[13px] leading-5 font-medium tracking-[-0.28px] shadow-none',
                    'hover:text-foreground',
                    'data-active:border-border data-active:bg-accent data-active:text-accent-foreground data-active:shadow-none',
                    '[&_svg:not([class*=size-])]:size-4',
                  ],
                )}
              >
                {option.icon}
                {option.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </TabsScrollArea>
      ) : (
        <TabsList
          className={cn(
            'w-full',
            isPrimaryVariant &&
              'border-border bg-background h-8 gap-0.5 rounded-lg border p-0.5 shadow-none',
          )}
        >
          {options.map((option) => (
            <TabsTrigger
              key={option.value}
              value={option.value}
              disabled={disabled}
              className={cn(
                'flex-1',
                isPrimaryVariant && [
                  'text-foreground h-full gap-1.5 rounded-md px-2 py-0 text-[13px] leading-5 font-medium tracking-[-0.28px] shadow-none',
                  'hover:text-foreground',
                  'data-active:border-border data-active:bg-accent data-active:text-accent-foreground data-active:shadow-none',
                  '[&_svg:not([class*=size-])]:size-4',
                ],
              )}
            >
              {option.icon}
              {option.label}
            </TabsTrigger>
          ))}
        </TabsList>
      )}
    </Tabs>
  );
}
