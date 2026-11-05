import { defineKitTexts } from "@carefully-built/ui";

import type { NotificationLocaleConfig } from "./types";

/** Default copy of the notification center, one entry per kit locale. */
export const notificationTexts = defineKitTexts<Required<Omit<NotificationLocaleConfig, "locale">>>({
  en: {
    allTabValue: "all",
    allTabLabel: "All",
    title: "Notifications",
    description: "Recent updates from your workspace.",
    emptyAllLabel: "No notifications",
    emptyFilteredLabel: "No notifications in this category",
    emptySubtitle: "You're all caught up.",
    openNotificationItemLabel: "Open {title}",
    markSeenItemLabel: "Mark as read: {title}",
    closeLabel: "Close",
    markAllSeenLabel: "Mark all read",
    openNotificationsLabel: "Open notifications",
    tooltipLabel: "Notifications",
  },
  it: {
    allTabValue: "all",
    allTabLabel: "Tutte",
    title: "Notifiche",
    description: "Gli ultimi aggiornamenti dell’organizzazione.",
    emptyAllLabel: "Nessuna notifica",
    emptyFilteredLabel: "Nessuna notifica in questa categoria",
    emptySubtitle: "Non c’è nulla da leggere.",
    openNotificationItemLabel: "Apri {title}",
    markSeenItemLabel: "Segna come letta: {title}",
    closeLabel: "Chiudi",
    markAllSeenLabel: "Segna tutte come lette",
    openNotificationsLabel: "Apri le notifiche",
    tooltipLabel: "Notifiche",
  },
});
