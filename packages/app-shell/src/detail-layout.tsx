import { cn } from '@carefully-built/ui';

import type { ReactNode } from 'react';

export interface DetailLayoutProps {
  /** The main column: tabs, tables, charts. */
  readonly children: ReactNode;
  /** The side column: the record's data with its edit button, status, dates. */
  readonly aside: ReactNode;
  readonly asideWidth?: number;
  readonly className?: string;
}

/**
 * A record page: content on the left, the record's own data in a narrower
 * column on the right, stacked on small screens with the data first.
 */
export function DetailLayout({ children, aside, asideWidth = 360, className }: DetailLayoutProps): React.ReactElement {
  return (
    <div
      data-slot="detail-layout"
      className={cn('grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_var(--detail-aside)]', className)}
      style={{ '--detail-aside': `${String(asideWidth)}px` } as React.CSSProperties}
    >
      <div data-slot="detail-aside" className="order-first min-w-0 space-y-4 xl:order-last">
        {aside}
      </div>
      <div data-slot="detail-main" className="min-w-0 space-y-4">
        {children}
      </div>
    </div>
  );
}
