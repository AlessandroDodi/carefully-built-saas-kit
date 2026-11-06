'use client';

import { cn } from '@carefully-built/ui';

import type { CSSProperties, ReactNode } from 'react';

export interface RevealProps {
  readonly children: ReactNode;
  /** Position in the sequence: each step waits `step` ms more than the previous. */
  readonly index?: number;
  readonly step?: number;
  /** Extra delay in ms before the sequence, e.g. for a block below another sequence. */
  readonly offset?: number;
  readonly duration?: number;
  readonly className?: string;
  readonly style?: CSSProperties;
  readonly as?: 'div' | 'li' | 'section' | 'span';
  /** Lets the wrapper take a themed slot (e.g. `widget`) instead of `reveal`. */
  readonly 'data-slot'?: string;
}

/**
 * Fades and lifts its content into place on mount, staggered by `index`, so a
 * page of widgets appears one after the other instead of all at once.
 */
export function Reveal({
  children,
  index = 0,
  step = 80,
  offset = 0,
  duration = 700,
  className,
  style,
  as: Tag = 'div',
  'data-slot': slot = 'reveal',
}: RevealProps): React.ReactElement {
  return (
    <Tag
      data-slot={slot}
      className={cn('animate-in fade-in-0 slide-in-from-bottom-3 fill-mode-both ease-out', className)}
      style={{ animationDuration: `${String(duration)}ms`, animationDelay: `${String(offset + index * step)}ms`, ...style }}
    >
      {children}
    </Tag>
  );
}

export interface GrowBarProps {
  /** 0–100. */
  readonly percent: number;
  readonly color?: string;
  readonly delay?: number;
  readonly className?: string;
  readonly trackClassName?: string;
}

/** A progress bar that grows from the left on mount. */
export function GrowBar({ percent, color, delay = 0, className, trackClassName }: GrowBarProps): React.ReactElement {
  return (
    <div className={cn('bg-muted h-2 w-full overflow-hidden rounded-full', trackClassName)}>
      <div
        data-slot="grow-bar"
        className={cn('bg-primary h-full origin-left rounded-full', className)}
        style={{
          width: `${String(Math.max(0, Math.min(100, percent)))}%`,
          backgroundColor: color,
          animation: `kit-grow-x 900ms cubic-bezier(0.2, 0.8, 0.2, 1) ${String(delay)}ms both`,
        }}
      />
    </div>
  );
}
