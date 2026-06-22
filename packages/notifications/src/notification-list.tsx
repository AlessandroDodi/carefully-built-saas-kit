"use client";

import { Bell } from "lucide-react";

import { EmptyStateCard, Skeleton } from "@carefully-built/ui";

import { NotificationListItem } from "./notification-list-item";
import type {
  NotificationRecord,
  NotificationSourceMeta,
  NotificationVisualMeta,
} from "./types";

export interface NotificationListProps<TNotification extends NotificationRecord> {
  readonly notifications: readonly TNotification[] | undefined;
  readonly emptyLabel: string;
  readonly typeMeta?: Record<string, NotificationVisualMeta>;
  readonly sourceMeta?: Record<string, NotificationSourceMeta>;
  readonly locale?: React.ComponentProps<typeof NotificationListItem<TNotification>>["locale"];
  readonly onOpen?: (notification: TNotification) => void;
  readonly onMarkSeen?: (notification: TNotification) => void;
}

export function NotificationList<TNotification extends NotificationRecord>({
  notifications,
  emptyLabel,
  typeMeta,
  sourceMeta,
  locale,
  onOpen,
  onMarkSeen,
}: NotificationListProps<TNotification>): React.ReactElement {
  if (notifications === undefined) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-20 w-full rounded-lg" />
        <Skeleton className="h-20 w-full rounded-lg" />
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <EmptyStateCard
        icon={<Bell className="size-7" />}
        title={emptyLabel}
        subtitle="You're all caught up."
      />
    );
  }

  return (
    <div className="space-y-2">
      {notifications.map((notification) => (
        <NotificationListItem
          key={notification.id}
          notification={notification}
          typeMeta={typeMeta}
          sourceMeta={sourceMeta}
          locale={locale}
          onOpen={onOpen}
          onMarkSeen={onMarkSeen}
        />
      ))}
    </div>
  );
}
