import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface EmptyStateCardProps {
  readonly icon: ReactNode;
  readonly title: string;
  readonly subtitle: string;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
  readonly actionHref?: string;
  readonly actionTarget?: "_blank" | "_self" | "_parent" | "_top";
  readonly actionRel?: string;
  readonly actionDisabled?: boolean;
  readonly actionIcon?: ReactNode;
  readonly className?: string;
}

export function EmptyStateCard({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
  actionHref,
  actionTarget = "_self",
  actionRel,
  actionDisabled = false,
  actionIcon,
  className,
}: EmptyStateCardProps): React.ReactElement {
  const hasLinkAction = actionLabel !== undefined && actionHref !== undefined;
  const hasButtonAction = actionLabel !== undefined && onAction !== undefined;
  const hasDisabledAction = actionLabel !== undefined && actionDisabled;
  const hasAction = hasLinkAction || hasButtonAction || hasDisabledAction;

  return (
    <Card className={cn("w-full border border-dashed border-border shadow-none ring-0", className)}>
      <CardContent className="flex flex-col items-center justify-start px-6 py-10 text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
          {icon}
        </div>
        <div className="space-y-1.5">
          <h3 className="text-lg font-medium tracking-tight">{title}</h3>
          <p className="max-w-2xl text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {hasAction ? (
          hasLinkAction ? (
            <Button asChild className="mt-5" disabled={actionDisabled}>
              <a href={actionHref} target={actionTarget} rel={actionRel}>
                {actionIcon ? <span className="mr-2 inline-flex items-center">{actionIcon}</span> : null}
                {actionLabel}
              </a>
            </Button>
          ) : hasDisabledAction ? (
            <Button className="mt-5" disabled>
              {actionIcon ? <span className="mr-2 inline-flex items-center">{actionIcon}</span> : null}
              {actionLabel}
            </Button>
          ) : (
            <Button className="mt-5" onClick={onAction} disabled={actionDisabled}>
              {actionIcon ? <span className="mr-2 inline-flex items-center">{actionIcon}</span> : null}
              {actionLabel}
            </Button>
          )
        ) : null}
      </CardContent>
    </Card>
  );
}
