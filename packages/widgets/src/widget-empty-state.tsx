"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Button, cn } from "@carefully-built/ui";

export interface WidgetEmptyStateAction {
  readonly label: string;
  readonly href?: string;
  readonly onClick?: () => void;
  readonly target?: "_blank" | "_self" | "_parent" | "_top";
  readonly rel?: string;
  readonly icon?: ReactNode;
  readonly disabled?: boolean;
}

export interface WidgetEmptyStateConfig {
  readonly title: string;
  readonly description: string;
  readonly icon?: LucideIcon;
  readonly minHeightClassName?: string;
  readonly className?: string;
  readonly action?: WidgetEmptyStateAction;
}

export interface WidgetEmptyStateProps extends WidgetEmptyStateConfig {
  readonly icon: LucideIcon;
}

export function WidgetEmptyState({
  icon: Icon,
  title,
  description,
  minHeightClassName,
  className,
  action,
}: WidgetEmptyStateProps): React.ReactElement {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center rounded-[16px] border border-dashed border-border/70 px-4 py-8 text-center",
        minHeightClassName ?? "min-h-[248px]",
        className,
      )}
    >
      <div className="max-w-[280px] space-y-2">
        <div className="text-muted-foreground flex justify-center">
          <Icon className="size-5" strokeWidth={1.75} />
        </div>
        <p className="text-foreground text-sm font-medium">{title}</p>
        <p className="text-muted-foreground text-xs leading-5">{description}</p>
        {action ? (
          action.href ? (
            <Button asChild variant="outline" size="sm" className="mt-4">
              <a href={action.href} target={action.target ?? "_self"} rel={action.rel}>
                {action.icon ? <span className="inline-flex items-center">{action.icon}</span> : null}
                {action.label}
              </a>
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={action.onClick}
              disabled={action.disabled}
            >
              {action.icon ? <span className="inline-flex items-center">{action.icon}</span> : null}
              {action.label}
            </Button>
          )
        ) : null}
      </div>
    </div>
  );
}
