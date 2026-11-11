"use client";

import { Lock } from "lucide-react";
import type { ReactNode } from "react";

import { Button, cn } from "@carefully-built/ui";

import type { WidgetEmptyStateAction } from "./widget-empty-state";

export interface LockedContentProps {
  /** What the feature would show: rendered blurred and inert underneath. */
  readonly children: ReactNode;
  readonly title: string;
  readonly description?: string;
  /** Small label above the title, e.g. "Pro" or "Fase 2". */
  readonly badge?: string;
  readonly action?: WidgetEmptyStateAction;
  readonly className?: string;
}

/**
 * A feature the plan does not include yet: its content stays visible but
 * blurred and faded behind a lock, with a call to unlock it. The content is
 * hidden from assistive tech and cannot be focused or clicked.
 */
export function LockedContent({
  children,
  title,
  description,
  badge,
  action,
  className,
}: LockedContentProps): React.ReactElement {
  return (
    <div data-locked="" className={cn("relative isolate w-full overflow-hidden rounded-[16px]", className)}>
      <div aria-hidden inert className="pointer-events-none select-none blur-[5px] saturate-50">
        {children}
      </div>
      <div className="from-card/30 via-card/75 to-card absolute inset-0 bg-gradient-to-b" />
      <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
        <div className="max-w-[280px] space-y-2">
          <div className="bg-background/80 text-foreground mx-auto flex size-9 items-center justify-center rounded-full border shadow-sm backdrop-blur">
            <Lock className="size-4" strokeWidth={1.75} />
          </div>
          {badge ? (
            <p className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">{badge}</p>
          ) : null}
          <p className="text-foreground text-sm font-medium">{title}</p>
          {description ? <p className="text-muted-foreground text-xs leading-5">{description}</p> : null}
          {action ? (
            action.href ? (
              <Button asChild size="sm" className="mt-3">
                <a href={action.href} target={action.target ?? "_self"} rel={action.rel}>
                  {action.icon ? <span className="inline-flex items-center">{action.icon}</span> : null}
                  {action.label}
                </a>
              </Button>
            ) : (
              <Button type="button" size="sm" className="mt-3" onClick={action.onClick} disabled={action.disabled}>
                {action.icon ? <span className="inline-flex items-center">{action.icon}</span> : null}
                {action.label}
              </Button>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}
