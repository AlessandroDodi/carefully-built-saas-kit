# @carefully-built/agenda

Reusable agenda primitives for SaaS apps.

## Includes

- `ActivityListView` and `ActivityItem` for reusable list-style agenda surfaces.
- Activity filtering/search helpers.
- Activity display model helpers for private placeholders, compact density, and time labels.
- Date/time helpers for activity forms.
- Activity type defaults and merge helpers.

## Example

```tsx
import { ActivityListView, filterActivities } from '@carefully-built/agenda';

const visibleActivities = filterActivities(activities, {
  search,
  activityType: 'all',
  operator: 'all',
});

<ActivityListView
  activities={visibleActivities}
  currentUserId={currentUserId}
  onEdit={setEditingActivity}
  onCreate={openCreateSheet}
/>;
```
