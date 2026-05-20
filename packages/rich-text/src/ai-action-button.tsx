'use client';

import { Sparkles } from 'lucide-react';
import * as React from 'react';

import { cn } from '@carefully-built/ui';

export interface AIActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  readonly compact?: boolean;
  readonly icon?: React.ReactNode;
}

export function AIActionButton({
  className,
  compact = false,
  type = 'button',
  children = 'AI',
  icon,
  ...props
}: AIActionButtonProps): React.ReactElement {
  return (
    <button
      type={type}
      className={cn(
        'group inline-flex items-center rounded-full bg-[linear-gradient(120deg,#14b8a6_0%,#8b5cf6_48%,#ec4899_74%,#facc15_100%)] p-[1.5px] shadow-[0_4px_16px_rgba(236,72,153,0.18)] transition-transform hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/70 focus-visible:ring-offset-2',
        className
      )}
      {...props}
    >
      <span
        className={cn(
          'inline-flex items-center justify-center rounded-full bg-white font-medium text-slate-900 transition-colors group-hover:bg-white dark:bg-zinc-950 dark:text-white',
          compact ? 'h-5 gap-1.5 px-2.5 text-[10px] tracking-[-0.02em]' : 'h-9 gap-2 px-3.5 text-sm'
        )}
      >
        {icon ?? <Sparkles className={cn('shrink-0 text-slate-900 dark:text-white', compact ? 'size-2.5' : 'size-3.5')} />}
        <span>{children}</span>
      </span>
    </button>
  );
}
