'use client';

import { cn } from '@carefully-built/ui';

import type { ReactNode } from 'react';

export const DOCUMENT_CARD_GRID_CLASS =
  'grid grid-cols-[repeat(auto-fill,minmax(min(100%,17.5rem),1fr))] gap-4';

interface DocumentCardGridProps {
  readonly children: ReactNode;
  readonly className?: string;
}

export function DocumentCardGrid({
  children,
  className,
}: DocumentCardGridProps): React.ReactElement {
  return <div className={cn(DOCUMENT_CARD_GRID_CLASS, className)}>{children}</div>;
}
