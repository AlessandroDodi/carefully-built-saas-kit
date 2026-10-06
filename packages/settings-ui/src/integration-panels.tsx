"use client";

import { Mail, RefreshCw } from "lucide-react";
import type { ReactNode } from "react";

import { Button, Label, cn } from "@carefully-built/ui";

import { SettingsPanel } from "./settings-details";

export interface SettingsPipesWidgetPanelProps {
  readonly authToken?: string;
  readonly hasError?: boolean;
  readonly errorText: string;
  readonly loadingText: string;
  readonly className?: string;
  readonly onClickCapture?: React.MouseEventHandler<HTMLDivElement>;
  readonly renderWidget: (authToken: string) => ReactNode;
}

export function SettingsPipesWidgetPanel({
  authToken,
  hasError = false,
  errorText,
  loadingText,
  className,
  onClickCapture,
  renderWidget,
}: SettingsPipesWidgetPanelProps): React.ReactElement {
  return (
    <div className={className} onClickCapture={onClickCapture}>
      {authToken ? (
        renderWidget(authToken)
      ) : (
        <p className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
          {hasError ? errorText : loadingText}
        </p>
      )}
    </div>
  );
}

export interface SettingsEmailPreviewItem {
  readonly id: string;
  readonly from: string;
  readonly subject: string;
  readonly snippet?: string;
  readonly receivedAt?: number;
}

export interface SettingsEmailPreviewPanelCopy {
  readonly title: string;
  readonly refreshLabel: string;
  readonly reconnectMessage: string;
  readonly emptyMessage: string;
}

export interface SettingsEmailPreviewPanelProps<TMessage extends SettingsEmailPreviewItem> {
  readonly messages: readonly TMessage[];
  readonly connectionError?: unknown;
  readonly isLoading?: boolean;
  readonly copy: SettingsEmailPreviewPanelCopy;
  readonly onRefresh: () => void;
  readonly formatDate: (timestamp: number | undefined, message: TMessage) => string;
}

export function SettingsEmailPreviewPanel<TMessage extends SettingsEmailPreviewItem>({
  messages,
  connectionError,
  isLoading = false,
  copy,
  onRefresh,
  formatDate,
}: SettingsEmailPreviewPanelProps<TMessage>): React.ReactElement {
  return (
    <SettingsPanel>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <Mail className="size-4 text-muted-foreground" aria-hidden="true" />
          <Label>{copy.title}</Label>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isLoading}
          onClick={onRefresh}
        >
          <RefreshCw className={cn(isLoading && "animate-spin")} aria-hidden="true" />
          {copy.refreshLabel}
        </Button>
      </div>

      <div className="mt-4 space-y-2">
        {connectionError ? (
          <p className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
            {copy.reconnectMessage}
          </p>
        ) : null}

        {!connectionError && messages.length === 0 ? (
          <p className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
            {copy.emptyMessage}
          </p>
        ) : null}

        {messages.map((message) => (
          <div key={message.id} className="grid gap-1 rounded-lg border border-border px-3 py-2">
            <div className="flex min-w-0 items-center justify-between gap-3">
              <p className="truncate text-sm font-medium">{message.subject}</p>
              <span className="shrink-0 text-xs text-muted-foreground">
                {formatDate(message.receivedAt, message)}
              </span>
            </div>
            <p className="truncate text-xs text-muted-foreground">{message.from}</p>
            {message.snippet ? (
              <p className="line-clamp-2 text-sm text-muted-foreground">{message.snippet}</p>
            ) : null}
          </div>
        ))}
      </div>
    </SettingsPanel>
  );
}
