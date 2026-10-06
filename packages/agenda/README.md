# @carefully-built/agenda

Reusable agenda primitives for SaaS apps.

## Includes

- `ActivityListView` and `ActivityItem` for reusable list-style agenda surfaces.
- `ActivityCalendarView` FullCalendar wrapper, with optional `readOnly`, `locale`,
  and `slotDuration` props for display-only / localized / fine-grained schedules.
- `ShiftTimeline`: a lightweight, div-based single-day hour-axis timeline (NOT
  FullCalendar) with shift/assignment blocks positioned by start/end, lane layout
  for overlaps, and a mobile stacked-list fallback.
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

### ShiftTimeline

```tsx
import { ShiftTimeline } from '@carefully-built/agenda';

<ShiftTimeline
  dayStart="09:00"
  dayEnd="21:00"
  slotMinutes={30}
  assignments={[
    { id: 'a1', employeeName: 'Anna', employeeColor: '#6D41FF', start: '09:00', end: '13:00', skillLabel: 'Barista' },
    { id: 'a2', employeeName: 'Marco', employeeColor: '#27A8E8', start: '12:00', end: '18:00' },
  ]}
  onAssignmentClick={(id) => openAssignment(id)}
/>;
```
