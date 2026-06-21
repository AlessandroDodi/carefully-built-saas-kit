'use client';

import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

import { getChipClassName, type ChipSize } from '@/components/ui/chip-utils';
import { cn } from '@/lib/utils';

interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  readonly children: ReactNode;
  readonly leading?: ReactNode;
  readonly trailing?: ReactNode;
  readonly size?: ChipSize;
}

export function Chip({
  children,
  className,
  leading,
  size = 'default',
  trailing,
  ...props
}: ChipProps): React.ReactElement {
  return (
    <span
      {...props}
      className={cn(
        getChipClassName(size),
        className
      )}
    >
      {leading ? <span className="shrink-0">{leading}</span> : null}
      <span className="truncate">{children}</span>
      {trailing ? <span className="shrink-0">{trailing}</span> : null}
    </span>
  );
}

interface ChipButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly children: ReactNode;
  readonly leading?: ReactNode;
  readonly trailing?: ReactNode;
  readonly selected?: boolean;
  readonly size?: ChipSize;
}

export function ChipButton({
  children,
  className,
  leading,
  selected = false,
  size = 'default',
  trailing,
  ...props
}: ChipButtonProps): React.ReactElement {
  return (
    <button
      type="button"
      aria-pressed={selected}
      {...props}
      className={cn(
        getChipClassName(size),
        'border text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        selected
          ? 'border-[#713dff] bg-[#f6f1ff] text-[#1f1f23] shadow-[0_0_0_1px_rgba(113,61,255,0.08)] hover:bg-[#f6f1ff]'
          : 'border-[#e7e8eb] bg-white text-[#5f6368] hover:bg-[#f7f7f9]',
        className
      )}
    >
      {leading ? <span className="shrink-0">{leading}</span> : null}
      <span className="truncate">{children}</span>
      {trailing ? <span className="shrink-0">{trailing}</span> : null}
    </button>
  );
}
