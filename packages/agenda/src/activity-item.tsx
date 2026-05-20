'use client';

import { Clock3, Lock, UserRound } from 'lucide-react';

import type { ReactNode } from 'react';
import type { ActivityDensity } from './activity-helpers';

function cn(...classes: readonly (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

interface ActivityItemProps {
  readonly density: ActivityDensity;
  readonly icon?: ReactNode;
  readonly name: string;
  readonly content?: ReactNode;
  readonly time?: ReactNode;
  readonly type?: ReactNode;
  readonly assignee?: ReactNode;
  readonly description?: ReactNode;
  readonly isPrivatePlaceholder?: boolean;
  readonly className?: string;
  readonly onClick?: () => void;
}

const densityClasses: Record<ActivityDensity, string> = {
  large: 'gap-3 rounded-xl p-4',
  compact: 'gap-2 rounded-lg p-3',
  micro: 'gap-1.5 rounded-md p-2',
};

export function ActivityItem({
  density,
  icon,
  name,
  content,
  time,
  type,
  assignee,
  description,
  isPrivatePlaceholder = false,
  className,
  onClick,
}: ActivityItemProps): React.ReactElement {
  const isMicro = density === 'micro';

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full flex-col border border-border bg-background text-left shadow-sm transition hover:border-primary/30 hover:shadow-md',
        densityClasses[density],
        onClick ? 'cursor-pointer' : 'cursor-default',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2">
            {icon ? <span className="shrink-0">{icon}</span> : null}
            <p
              className={cn(
                'truncate font-medium text-foreground',
                isMicro ? 'text-xs' : 'text-sm'
              )}
            >
              {name}
            </p>
            {isPrivatePlaceholder ? (
              <Lock className="size-3 shrink-0 text-muted-foreground" />
            ) : null}
          </div>
          {content ? <div className="min-w-0">{content}</div> : null}
        </div>
      </div>

      {time || type || assignee ? (
        <div className={cn('flex flex-wrap items-center gap-x-3 gap-y-1', isMicro && 'gap-x-2')}>
          {time ? (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Clock3 className="size-3" />
              {time}
            </span>
          ) : null}
          {type ? <span className="text-xs">{type}</span> : null}
          {assignee ? (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <UserRound className="size-3" />
              {assignee}
            </span>
          ) : null}
        </div>
      ) : null}

      {description ? (
        <p
          className={cn(
            'line-clamp-2 text-muted-foreground',
            isMicro ? 'text-[11px]' : 'text-xs'
          )}
        >
          {description}
        </p>
      ) : null}
    </button>
  );
}
