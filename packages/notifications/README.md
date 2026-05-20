# @carefully-built/notifications

Reusable notification center UI for SaaS dashboards.

## Components

- `NotificationCenterButton`: bell icon button with unread badge and sheet wiring.
- `NotificationCenterSheet`: responsive sheet with tabs and mark-all-seen action.
- `NotificationList`: loading, empty, and list states.
- `NotificationListItem`: compact notification row with type/source chips and optional navigation.

The app keeps data fetching, mutation calls, routing, and product copy. The package owns the boring UI: tabs, badge, sheet layout, skeletons, unread state, and relative date display.

## Example

```tsx
<NotificationCenterButton
  notifications={notifications}
  unreadCount={unreadCount}
  tabs={tabs}
  onMarkSeen={(notification) => markSeen(notification.id)}
  onMarkAllSeen={() => markAllSeen()}
  onNavigate={(notification) => router.push(notification.href)}
/>
```
