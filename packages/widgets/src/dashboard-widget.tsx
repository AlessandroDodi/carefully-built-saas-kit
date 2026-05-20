"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Skeleton, cn } from "@carefully-built/ui";

import { EntityInfoWidget } from "./entity-info-widget";
import type { WidgetEmptyStateConfig } from "./widget-empty-state";

export interface DashboardWidgetProps {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly value?: ReactNode;
  readonly actions?: ReactNode;
  readonly children?: ReactNode;
  readonly className?: string;
  readonly contentClassName?: string;
  readonly isLoading?: boolean;
  readonly loadingFallback?: ReactNode;
  readonly isEmpty?: boolean;
  readonly emptyState?: WidgetEmptyStateConfig;
}

export function DashboardWidget({
  icon,
  title,
  value,
  actions,
  children,
  className,
  contentClassName,
  isLoading = false,
  loadingFallback,
  isEmpty = false,
  emptyState,
}: DashboardWidgetProps): React.ReactElement {
  const shouldRenderEmptyState = !isLoading && value === undefined && isEmpty;
  let defaultContentClassName = "pt-1";

  if (value !== undefined) {
    defaultContentClassName = "px-0.5 pt-2 pb-0.5";
  } else if (shouldRenderEmptyState) {
    defaultContentClassName = "flex min-h-0 flex-1 pt-1";
  }

  return (
    <EntityInfoWidget
      icon={icon}
      name={title}
      className={cn("h-full min-w-0 gap-0", className)}
      contentClassName={cn(defaultContentClassName, contentClassName)}
      headerActions={actions}
      isEmpty={shouldRenderEmptyState}
      emptyState={value === undefined ? emptyState : undefined}
    >
      {value !== undefined ? (
        <div
          className="text-foreground text-[24px] leading-none font-medium tracking-[-0.02em]"
          aria-busy={isLoading || undefined}
        >
          {isLoading ? <Skeleton className="h-7 w-16" /> : value}
        </div>
      ) : isLoading ? (
        (loadingFallback ?? <Skeleton className="h-[264px] w-full rounded-[10px]" />)
      ) : (
        children
      )}
    </EntityInfoWidget>
  );
}
