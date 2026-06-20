"use client";

import { Bell } from "lucide-react";
import { useState } from "react";

import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@carefully-built/ui";

import { NotificationCenterSheet } from "./notification-center-sheet";
import type { NotificationCenterSheetProps } from "./notification-center-sheet";
import type { NotificationRecord } from "./types";

export interface NotificationCenterButtonProps<TNotification extends NotificationRecord>
  extends Omit<NotificationCenterSheetProps<TNotification>, "open" | "onOpenChange"> {
  readonly buttonClassName?: string;
}

export function NotificationCenterButton<TNotification extends NotificationRecord>({
  buttonClassName,
  localeConfig,
  unreadCount = 0,
  ...sheetProps
}: NotificationCenterButtonProps<TNotification>): React.ReactElement {
  const [open, setOpen] = useState(false);
  const openLabel = localeConfig?.openNotificationsLabel ?? "Open notifications";
  const tooltipLabel = localeConfig?.tooltipLabel ?? "Notifications";

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className={["relative", buttonClassName].filter(Boolean).join(" ")}
              aria-label={openLabel}
              onClick={() => setOpen(true)}
            >
              <Bell className="size-4" />
              {unreadCount > 0 ? (
                <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-4">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              ) : null}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{tooltipLabel}</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <NotificationCenterSheet
        {...sheetProps}
        localeConfig={localeConfig}
        unreadCount={unreadCount}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
