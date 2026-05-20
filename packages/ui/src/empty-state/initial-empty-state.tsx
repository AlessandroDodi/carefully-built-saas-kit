import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

import { EmptyStateCard } from "./empty-state-card";

export interface InitialEmptyStateProps {
  readonly icon?: ReactNode;
  readonly title: string;
  readonly subtitle: string;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
  readonly actionIcon?: ReactNode;
  readonly className?: string;
}

export function InitialEmptyState({
  icon = <Inbox className="size-7" />,
  title,
  subtitle,
  actionLabel,
  onAction,
  actionIcon,
  className,
}: InitialEmptyStateProps): React.ReactElement {
  return (
    <EmptyStateCard
      icon={icon}
      title={title}
      subtitle={subtitle}
      actionLabel={actionLabel}
      onAction={onAction}
      actionIcon={actionIcon}
      className={className}
    />
  );
}
