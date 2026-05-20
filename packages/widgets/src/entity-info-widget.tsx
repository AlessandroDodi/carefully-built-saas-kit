"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@carefully-built/ui";

import { WidgetEmptyState } from "./widget-empty-state";
import type { WidgetEmptyStateConfig } from "./widget-empty-state";

export interface EntityInfoWidgetProps {
  readonly icon: LucideIcon;
  readonly name: string;
  readonly children: ReactNode;
  readonly className?: string;
  readonly contentClassName?: string;
  readonly nameActions?: ReactNode;
  readonly headerActions?: ReactNode;
  readonly isEmpty?: boolean;
  readonly emptyState?: WidgetEmptyStateConfig;
}

export function EntityInfoWidget({
  icon: Icon,
  name,
  children,
  className,
  contentClassName,
  nameActions,
  headerActions,
  isEmpty = false,
  emptyState,
}: EntityInfoWidgetProps): React.ReactElement {
  return (
    <section
      className={cn(
        "border-border flex min-w-0 flex-col gap-3 rounded-[12px] border bg-background p-1.5",
        className,
      )}
    >
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 px-0.5 sm:flex-nowrap">
        <div className="text-muted-foreground flex min-w-0 items-center gap-[3px] text-[13px]">
          <Icon className="size-3.5 shrink-0" strokeWidth={1.75} />
          <span className="truncate">{name}</span>
          {nameActions ? <span className="ml-1 shrink-0">{nameActions}</span> : null}
        </div>
        {headerActions ? (
          <div className="flex min-w-0 max-w-full items-center gap-2 sm:shrink-0">
            {headerActions}
          </div>
        ) : null}
      </div>
      <div className={cn("min-w-0", contentClassName)}>
        {isEmpty && emptyState ? (
          <WidgetEmptyState
            icon={emptyState.icon ?? Icon}
            title={emptyState.title}
            description={emptyState.description}
            minHeightClassName={emptyState.minHeightClassName}
            className={emptyState.className}
            action={emptyState.action}
          />
        ) : (
          children
        )}
      </div>
    </section>
  );
}
