import type { Locale } from "date-fns";
import type { LucideIcon } from "lucide-react";

export interface NotificationRecord {
  readonly id: string;
  readonly type: string;
  readonly typeLabel: string;
  readonly title: string;
  readonly message?: string;
  readonly source?: string;
  readonly href?: string;
  readonly seenAt?: number;
  readonly createdAt: number;
}

export interface NotificationVisualMeta {
  readonly icon: LucideIcon;
  readonly className: string;
}

export interface NotificationSourceMeta {
  readonly label: string;
  readonly className: string;
}

export interface NotificationTabConfig {
  readonly value: string;
  readonly label: string;
  readonly icon: LucideIcon;
}

export interface NotificationLocaleConfig {
  readonly locale?: Locale;
  readonly allTabValue?: string;
  readonly allTabLabel?: string;
  readonly title?: string;
  readonly description?: string;
  readonly emptyAllLabel?: string;
  readonly emptyFilteredLabel?: string;
  readonly markAllSeenLabel?: string;
  readonly openNotificationsLabel?: string;
  readonly tooltipLabel?: string;
}
