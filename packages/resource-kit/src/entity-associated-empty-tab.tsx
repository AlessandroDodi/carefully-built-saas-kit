'use client';

import { EmptyStateCard } from '@carefully-built/ui';

import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export interface EntityAssociatedEmptyTabProps {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly subtitle: string;
  readonly actionLabel?: string;
  readonly actionIcon?: ReactNode;
  readonly onAction?: () => void;
}

export function EntityAssociatedEmptyTab({
  icon: Icon,
  title,
  subtitle,
  actionLabel,
  actionIcon,
  onAction,
}: EntityAssociatedEmptyTabProps): React.ReactElement {
  return (
    <EmptyStateCard
      icon={<Icon className="size-7" />}
      title={title}
      subtitle={subtitle}
      actionLabel={actionLabel}
      actionIcon={actionIcon}
      onAction={onAction}
      className="min-h-[260px]"
    />
  );
}
