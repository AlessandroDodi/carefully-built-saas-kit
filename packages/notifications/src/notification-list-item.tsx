"use client";

import { formatDistanceToNow } from "date-fns";
import type { Locale } from "date-fns";
import { ArrowRight, Bell } from "lucide-react";

import { Chip } from "@carefully-built/ui";

import type {
  NotificationRecord,
  NotificationSourceMeta,
  NotificationVisualMeta,
} from "./types";

const fallbackTypeClassName = "bg-[#f4f0ff] text-[#6d28d9]";
const fallbackSourceClassName = "border border-[#e5e7eb] bg-[#f4f5f6] text-[#5f6368]";

export interface NotificationListItemProps<TNotification extends NotificationRecord> {
  readonly notification: TNotification;
  readonly typeMeta?: Record<string, NotificationVisualMeta>;
  readonly sourceMeta?: Record<string, NotificationSourceMeta>;
  readonly locale?: Locale;
  readonly onOpen?: (notification: TNotification) => void;
  readonly onMarkSeen?: (notification: TNotification) => void;
  readonly className?: string;
}

function getNotificationActionLabel(notification: NotificationRecord, isSeen: boolean): string {
  if (notification.href) {
    return `Open ${notification.title}`;
  }

  return isSeen ? notification.title : `Segna come vista: ${notification.title}`;
}

export function NotificationListItem<TNotification extends NotificationRecord>({
  notification,
  typeMeta,
  sourceMeta,
  locale,
  onOpen,
  onMarkSeen,
  className,
}: NotificationListItemProps<TNotification>): React.ReactElement {
  const resolvedTypeMeta = typeMeta?.[notification.type] ?? {
    icon: Bell,
    className: fallbackTypeClassName,
  };
  const resolvedSourceMeta = notification.source ? sourceMeta?.[notification.source] : null;
  const Icon = resolvedTypeMeta.icon;
  const isSeen = Boolean(notification.seenAt);

  const handleOpen = (): void => {
    if (!isSeen) {
      onMarkSeen?.(notification);
    }

    onOpen?.(notification);
  };

  return (
    <button
      type="button"
      aria-label={getNotificationActionLabel(notification, isSeen)}
      onClick={handleOpen}
      className={[
        "group focus-visible:ring-ring grid w-full grid-cols-[40px_minmax(0,1fr)] gap-x-2.5 rounded-lg border p-2.5 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none",
        isSeen ? "bg-background hover:bg-muted/30" : "border-primary/20 bg-primary/5 hover:bg-primary/8",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={["flex size-10 items-center justify-center rounded-md", resolvedTypeMeta.className].join(" ")}>
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          <p className="text-foreground min-w-0 truncate text-sm font-medium">{notification.title}</p>
          {!isSeen ? <span className="bg-primary size-1.5 shrink-0 rounded-full" /> : null}
        </div>
        {notification.message ? (
          <p className="text-muted-foreground mt-0.5 line-clamp-1 text-xs">{notification.message}</p>
        ) : null}
      </div>
      <div className="col-span-2 mt-[6px] flex items-end justify-between gap-2">
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          <Chip className={resolvedTypeMeta.className}>{notification.typeLabel}</Chip>
          {resolvedSourceMeta ? (
            <Chip className={resolvedSourceMeta.className || fallbackSourceClassName}>
              {resolvedSourceMeta.label}
            </Chip>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="text-muted-foreground text-xs leading-5 whitespace-nowrap">
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
              locale,
            })}
          </span>
          {notification.href ? (
            <span className="text-muted-foreground group-hover:text-primary inline-flex size-7 items-center justify-center rounded-md transition-colors">
              <ArrowRight className="size-3.5" />
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
}
