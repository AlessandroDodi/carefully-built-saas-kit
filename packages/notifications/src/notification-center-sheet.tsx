"use client";

import { Bell, CheckCheck } from "lucide-react";
import { useMemo, useState } from "react";

import {
  Button,
  ResponsiveSheet,
  Tabs,
  TabsContent,
  TabsList,
  TabsScrollArea,
  TabsTrigger,
} from "@carefully-built/ui";

import { NotificationList } from "./notification-list";
import type {
  NotificationLocaleConfig,
  NotificationRecord,
  NotificationSourceMeta,
  NotificationTabConfig,
  NotificationVisualMeta,
} from "./types";

const defaultLocaleConfig: Required<Omit<NotificationLocaleConfig, "locale">> = {
  allTabValue: "all",
  allTabLabel: "All",
  title: "Notifications",
  description: "Recent updates from your workspace.",
  emptyAllLabel: "No notifications",
  emptyFilteredLabel: "No notifications in this category",
  markAllSeenLabel: "Mark all read",
  openNotificationsLabel: "Open notifications",
  tooltipLabel: "Notifications",
};

export interface NotificationCenterSheetProps<TNotification extends NotificationRecord> {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly notifications: readonly TNotification[] | undefined;
  readonly unreadCount?: number;
  readonly tabs: readonly NotificationTabConfig[];
  readonly typeMeta?: Record<string, NotificationVisualMeta>;
  readonly sourceMeta?: Record<string, NotificationSourceMeta>;
  readonly localeConfig?: NotificationLocaleConfig;
  readonly onOpenNotification?: (notification: TNotification) => void;
  readonly onMarkSeen?: (notification: TNotification) => void;
  readonly onMarkAllSeen?: () => void;
  readonly width?: number;
}

export function NotificationCenterSheet<TNotification extends NotificationRecord>({
  open,
  onOpenChange,
  notifications,
  unreadCount = 0,
  tabs,
  typeMeta,
  sourceMeta,
  localeConfig,
  onOpenNotification,
  onMarkSeen,
  onMarkAllSeen,
  width = 620,
}: NotificationCenterSheetProps<TNotification>): React.ReactElement {
  const labels = { ...defaultLocaleConfig, ...localeConfig };
  const [selectedTab, setSelectedTab] = useState(labels.allTabValue);
  const resolvedTabs = useMemo(
    () => [{ value: labels.allTabValue, label: labels.allTabLabel, icon: Bell }, ...tabs],
    [labels.allTabLabel, labels.allTabValue, tabs],
  );
  const visibleNotifications =
    selectedTab === labels.allTabValue
      ? notifications
      : notifications?.filter((notification) => notification.type === selectedTab);

  return (
    <ResponsiveSheet
      open={open}
      onOpenChange={onOpenChange}
      title={labels.title}
      description={labels.description}
      width={width}
      enableDesktopConfirmShortcut={false}
      mobileDrawerContentClassName="data-[vaul-drawer-direction=bottom]:border-t-0 [&>div:first-child]:hidden"
    >
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <TabsScrollArea className="pb-1">
            <TabsList className="min-w-max">
              {resolvedTabs.map((tab) => {
                const Icon = tab.icon;

                return (
                  <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5">
                    <Icon className="size-3.5" />
                    {tab.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </TabsScrollArea>
          {unreadCount > 0 && onMarkAllSeen ? (
            <Button type="button" variant="outline" size="sm" onClick={onMarkAllSeen}>
              <CheckCheck className="size-3.5" />
              {labels.markAllSeenLabel}
            </Button>
          ) : null}
        </div>

        <TabsContent value={selectedTab} className="mt-2">
          <NotificationList
            notifications={visibleNotifications}
            emptyLabel={selectedTab === labels.allTabValue ? labels.emptyAllLabel : labels.emptyFilteredLabel}
            typeMeta={typeMeta}
            sourceMeta={sourceMeta}
            locale={localeConfig?.locale}
            onOpen={(notification) => {
              onOpenChange(false);
              onOpenNotification?.(notification);
            }}
            onMarkSeen={onMarkSeen}
          />
        </TabsContent>
      </Tabs>
    </ResponsiveSheet>
  );
}
