import type { ReactNode } from "react";

import { Skeleton, cn } from "@carefully-built/ui";

export interface SettingsDetailItem {
  readonly label: ReactNode;
  readonly value: ReactNode;
  readonly loading?: boolean;
}

export function SettingsDetailGrid({
  items,
  className,
}: {
  readonly items: readonly SettingsDetailItem[];
  readonly className?: string;
}): React.ReactElement {
  return (
    <div className={cn("grid gap-6 md:grid-cols-2 md:gap-8", className)}>
      {items.map((item, index) => (
        <div key={index} className="space-y-2">
          <p className="text-sm font-medium text-foreground">{item.label}</p>
          {item.loading ? (
            <Skeleton className="h-[22px] w-16 rounded-[7px]" />
          ) : (
            <div className="text-sm text-muted-foreground">{item.value}</div>
          )}
        </div>
      ))}
    </div>
  );
}

export function SettingsStatusPill({
  children,
  tone = "neutral",
}: {
  readonly children: ReactNode;
  readonly tone?: "success" | "neutral";
}): React.ReactElement {
  return (
    <span
      className={cn(
        "inline-flex h-[22px] items-center rounded-[7px] px-2 text-sm font-medium",
        tone === "success"
          ? "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
          : "bg-muted text-muted-foreground",
      )}
    >
      {children}
    </span>
  );
}

export function SettingsEmptyState({
  icon,
  children,
  variant = "subtle",
}: {
  readonly icon?: ReactNode;
  readonly children: ReactNode;
  readonly variant?: "plain" | "subtle";
}): React.ReactElement {
  return (
    <div
      className={cn(
        "text-muted-foreground flex flex-col items-center gap-2 px-4 py-8 text-center text-sm",
        variant === "subtle" && "rounded-lg border border-border/70",
      )}
    >
      {icon}
      <p>{children}</p>
    </div>
  );
}

export function SettingsIntegrationRow({
  icon,
  label,
  status,
  statusTone = "neutral",
  actions,
}: {
  readonly icon?: ReactNode;
  readonly label: ReactNode;
  readonly status: ReactNode;
  readonly statusTone?: "success" | "neutral";
  readonly actions?: ReactNode;
}): React.ReactElement {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        {icon}
        <span className="text-sm font-bold">{label}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-2 text-sm">
          <span
            className={cn(
              "size-2 rounded-full",
              statusTone === "success"
                ? "bg-emerald-500"
                : "bg-muted-foreground/40",
            )}
            aria-hidden="true"
          />
          <span
            className={
              statusTone === "success"
                ? "text-emerald-600"
                : "text-muted-foreground"
            }
          >
            {status}
          </span>
        </span>
        {actions}
      </div>
    </div>
  );
}

export function SettingsPanel({
  children,
  className,
}: {
  readonly children: ReactNode;
  readonly className?: string;
}): React.ReactElement {
  return (
    <div className={cn("rounded-xl border border-border p-4", className)}>
      {children}
    </div>
  );
}
