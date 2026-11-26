'use client';

import { RefreshCw, Upload, WifiOff } from 'lucide-react';

import type { ReactNode } from 'react';

import { cn, useKitTexts } from '@carefully-built/ui';

import { syncStatusTexts } from './sync-texts';

import type { SyncStatus } from '../sync-status';

export interface SyncStatusBadgeClassNames {
  readonly root?: string;
  /** The small square shown when online. */
  readonly marker?: string;
  readonly icon?: string;
  readonly label?: string;
}

export interface SyncStatusBadgeLabels {
  readonly online?: string;
  readonly offline?: string;
  /** Used for `pending` when there is no count to show. */
  readonly pending?: string;
  readonly syncing?: string;
  /** `{count}` is replaced with the number, e.g. `{count} to send`. */
  readonly pendingCount?: string;
}

export interface SyncStatusBadgeProps {
  readonly status: SyncStatus;
  /** Items not delivered yet. Shown when greater than zero and the status is not `online`. */
  readonly pendingCount?: number;
  /** Extra text at the end, e.g. a device name. */
  readonly detail?: ReactNode;
  /** Replaces the icon of the offline, pending and syncing states. */
  readonly icon?: ReactNode;
  readonly labels?: SyncStatusBadgeLabels;
  readonly className?: string;
  readonly classes?: SyncStatusBadgeClassNames;
}

/**
 * Connection and sync state in one line. Online is quiet: a green square and
 * plain text. Offline and pending are an amber pill, syncing a blue one.
 */
export function SyncStatusBadge({
  status,
  pendingCount,
  detail,
  icon,
  labels,
  className,
  classes,
}: SyncStatusBadgeProps): React.ReactElement {
  const texts = useKitTexts(syncStatusTexts, labels);
  const hasCount = pendingCount !== undefined && pendingCount > 0;
  const countLabel = hasCount ? texts.pendingCount.replaceAll('{count}', String(pendingCount)) : null;
  const hasDetail = detail !== undefined && detail !== null && detail !== false && detail !== '';

  const parts: ReactNode[] =
    status === 'online'
      ? [texts.online]
      : status === 'pending'
        ? [countLabel ?? texts.pending]
        : [status === 'offline' ? texts.offline : texts.syncing, ...(countLabel ? [countLabel] : [])];
  if (hasDetail) parts.push(detail);

  const label = (
    <span className={cn('min-w-0 truncate', classes?.label)}>
      {parts.map((part, index) => (
        <span key={index}>
          {index > 0 ? <span aria-hidden="true"> · </span> : null}
          {part}
        </span>
      ))}
    </span>
  );

  if (status === 'online') {
    return (
      <span
        role="status"
        data-slot="sync-status-badge"
        data-status={status}
        className={cn(
          'text-foreground inline-flex max-w-full items-center gap-2 text-xs',
          className,
          classes?.root,
        )}
      >
        <span
          aria-hidden="true"
          className={cn('size-2 shrink-0 rounded-[2px] bg-emerald-500', classes?.marker)}
        />
        {label}
      </span>
    );
  }

  const iconClassName = cn('size-3.5 shrink-0', classes?.icon);
  return (
    <span
      role="status"
      data-slot="sync-status-badge"
      data-status={status}
      className={cn(
        'inline-flex max-w-full items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium',
        status === 'syncing'
          ? 'border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300'
          : 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300',
        className,
        classes?.root,
      )}
    >
      {icon !== undefined ? (
        <span aria-hidden="true" className={cn('flex shrink-0 [&_svg]:size-3.5', classes?.icon)}>
          {icon}
        </span>
      ) : status === 'offline' ? (
        <WifiOff aria-hidden="true" className={iconClassName} />
      ) : status === 'syncing' ? (
        <RefreshCw aria-hidden="true" className={cn(iconClassName, 'animate-spin')} />
      ) : (
        <Upload aria-hidden="true" className={iconClassName} />
      )}
      {label}
    </span>
  );
}
