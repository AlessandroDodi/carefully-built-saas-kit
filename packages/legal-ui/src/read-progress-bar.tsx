'use client';

import type { ReactNode } from 'react';

import { cn, useKitTexts } from '@carefully-built/ui';

import { readerTexts } from './reader-texts';

export interface ReadProgressBarClassNames {
  readonly root?: string;
  readonly header?: string;
  readonly label?: string;
  readonly percentage?: string;
  readonly track?: string;
  readonly bar?: string;
}

export interface ReadProgressBarProps {
  /** 0 to 1, e.g. `progress` from `useReadProgress`. */
  readonly value: number;
  readonly label?: ReactNode;
  /** Accessible name when `label` is not plain text. */
  readonly 'aria-label'?: string;
  readonly showPercentage?: boolean;
  /** Show the finished state. Defaults to `value >= 1`. */
  readonly complete?: boolean;
  readonly className?: string;
  readonly classes?: ReadProgressBarClassNames;
}

/** A label, a percentage and a thin bar that turns to the success colour when complete. */
export function ReadProgressBar({
  value,
  label,
  'aria-label': ariaLabel,
  showPercentage = true,
  complete,
  className,
  classes,
}: ReadProgressBarProps): React.ReactElement {
  const texts = useKitTexts(readerTexts);
  const ratio = Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
  const isComplete = complete ?? ratio >= 1;
  // Never show 100% before the end is actually reached.
  const percentage = isComplete ? 100 : Math.min(99, Math.round(ratio * 100));
  const shownLabel = label ?? texts.progressLabel;

  return (
    <div
      data-slot="read-progress-bar"
      data-complete={isComplete ? '' : undefined}
      className={cn('flex w-full flex-col gap-1.5', className, classes?.root)}
    >
      <div className={cn('flex items-baseline justify-between gap-3 text-xs', classes?.header)}>
        <span className={cn('text-muted-foreground', classes?.label)}>{shownLabel}</span>
        {showPercentage ? (
          <span
            className={cn(
              'font-mono tabular-nums',
              isComplete ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground',
              classes?.percentage,
            )}
          >
            {percentage}%
          </span>
        ) : null}
      </div>
      <div
        role="progressbar"
        aria-label={ariaLabel ?? (typeof shownLabel === 'string' ? shownLabel : texts.progressLabel)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
        className={cn('bg-muted h-1 w-full overflow-hidden rounded-[2px]', classes?.track)}
      >
        <div
          className={cn(
            'h-full rounded-[2px] transition-[width] duration-150 ease-out',
            isComplete ? 'bg-emerald-500' : 'bg-primary',
            classes?.bar,
          )}
          style={{ width: `${String(percentage)}%` }}
        />
      </div>
    </div>
  );
}
