"use client";

import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

import { Button, cn } from "@carefully-built/ui";

export interface DashboardPageHeaderProps {
  readonly title: ReactNode;
  readonly actions?: ReactNode;
  readonly backHref?: string;
  readonly onBack?: () => void;
}

export interface DashboardPageLayoutProps {
  readonly children: ReactNode;
  readonly title?: ReactNode;
  readonly actions?: ReactNode;
  readonly header?: ReactNode;
  readonly backHref?: string;
  readonly onBack?: () => void;
  readonly fillViewport?: boolean;
  readonly className?: string;
}

export function DashboardPageHeader({
  title,
  actions,
  backHref,
  onBack,
}: DashboardPageHeaderProps): React.ReactElement {
  const backButton = backHref ? (
    <Button variant="ghost" size="icon-sm" asChild>
      <a href={backHref} aria-label="Back">
        <ArrowLeft className="size-4" />
      </a>
    </Button>
  ) : onBack ? (
    <Button variant="ghost" size="icon-sm" aria-label="Back" onClick={onBack}>
      <ArrowLeft className="size-4" />
    </Button>
  ) : null;

  return (
    <div className="flex shrink-0 items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-2">
        {backButton}
        <h1 className="truncate text-xl font-semibold tracking-tight">{title}</h1>
      </div>
      {actions ? <div className="flex min-w-0 items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function DashboardPageLayout({
  children,
  title,
  actions,
  header,
  backHref,
  onBack,
  fillViewport = true,
  className,
}: DashboardPageLayoutProps): React.ReactElement {
  const defaultHeader = title ? (
    <DashboardPageHeader title={title} actions={actions} backHref={backHref} onBack={onBack} />
  ) : null;
  const resolvedHeader = header ?? defaultHeader;

  return (
    <div
      className={cn(
        fillViewport
          ? "flex h-[calc(100vh-theme(spacing.16)-theme(spacing.8))] flex-col gap-3 overflow-hidden md:h-[calc(100vh-theme(spacing.12))]"
          : "space-y-3",
        className,
      )}
    >
      {resolvedHeader}
      {children}
    </div>
  );
}
