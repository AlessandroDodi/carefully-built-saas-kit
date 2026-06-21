'use client';

import { Command } from 'lucide-react';

import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export function KeyboardKeycap({
  children,
  className,
}: {
  readonly children: ReactNode;
  readonly className?: string;
}): React.ReactElement {
  return (
    <span
      className={cn(
        'inline-flex h-4 min-w-4 items-center justify-center rounded-[4px] border px-1 text-[9px] font-semibold leading-none',
        className,
      )}
    >
      {children}
    </span>
  );
}

export function ShortcutModifierKeycap({
  modifierLabel,
  className,
}: {
  readonly modifierLabel: string;
  readonly className?: string;
}): React.ReactElement {
  return (
    <KeyboardKeycap className={className}>
      {modifierLabel === 'Cmd' ? <Command className="size-[10px]" /> : 'Ctrl'}
    </KeyboardKeycap>
  );
}
