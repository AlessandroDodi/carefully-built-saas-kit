import { cn } from '@carefully-built/ui';

import type { ReactNode } from 'react';

export interface SettingsTextProps {
  readonly children: ReactNode;
  /** Shown, muted, when `children` is empty. */
  readonly emptyLabel?: ReactNode;
  readonly className?: string;
}

/** A read-only block of text that keeps the author's line breaks. */
export function SettingsText({ children, emptyLabel, className }: SettingsTextProps): React.ReactElement {
  const isEmpty = children === null || children === undefined || children === '' || children === false;
  return (
    <p className={cn('text-sm whitespace-pre-wrap', isEmpty ? 'text-muted-foreground italic' : 'text-foreground', className)}>
      {isEmpty ? emptyLabel : children}
    </p>
  );
}
