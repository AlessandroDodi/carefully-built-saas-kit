# @carefully-built/agenda

Reusable agenda helpers, activity lists, time utilities, and activity type primitives for SaaS apps.

## Install

```bash
bun add @carefully-built/agenda
```

For local development in an app inside the same parent workspace, use the packed tarball or workspace link already used by the consuming app.

## Import Paths

- `@carefully-built/agenda`

## Component Usage

```tsx
import { ActivityCalendarView } from '@carefully-built/agenda';

// Check the API catalog below for the component source and prop types.
// Most components are controlled shells: pass app data, handlers, and slot content from the consuming app.
```

Components in this package:

- `ActivityCalendarView`: import from `@carefully-built/agenda`.
- `ActivityListView`: import from `@carefully-built/agenda`.
- `SharedActivityCalendarDayPicker`: import from `@carefully-built/agenda`.
- `SharedActivityCalendarEvents`: import from `@carefully-built/agenda`.
- `SharedActivityCalendarHeader`: import from `@carefully-built/agenda`.
- `SharedActivityCalendarWidget`: import from `@carefully-built/agenda`.

## Hook Usage

```tsx
import { useAgendaPageState } from '@carefully-built/agenda';

export function Example() {
  const state = useAgendaPageState({} as never);
  return null;
}
```

Hooks in this package:

- `useAgendaPageState`: keep app-specific data fetching and mutations in the consuming app.

## Helper Usage

```ts
import { addLocalDays } from '@carefully-built/agenda';
```

Helpers in this package:

- `addLocalDays`
- `addOneHourToTime`
- `ALL_DAY_ACTIVITY_END_TIME`
- `ALL_DAY_ACTIVITY_START_TIME`
- `buildActivityDisplayModel`
- `buildAvailableActivityTypes`
- `buildDefaultTimedRange`
- `DEFAULT_ACTIVITY_END_TIME`
- `DEFAULT_ACTIVITY_START_TIME`
- `DEFAULT_ACTIVITY_TYPES`
- `filterActivities`
- `formatCalendarWidgetTime`
- `getActivitiesForDay`
- `getActivityCalendarScopeForViewport`
- `getScheduledTimestamp`
- `getVisibleWeekDays`
- `isActivityPast`
- `isAllDayActivityRange`
- `isSameLocalDay`
- `shouldShowActivityCalendarScopeControls`
- `startOfLocalDay`
- `toAlphaColor`
- `toLocalTimestamp`

## Types And Schemas

- `ActivityAssociation`
- `ActivityCalendarScope`
- `ActivityCalendarSourceFilter`
- `ActivityDensity`
- `ActivityDisplayModel`
- `ActivityDraftPreset`
- `ActivityFilters`
- `ActivityItem`
- `ActivityListItem`
- `ActivityStatus`
- `ActivityVisibility`
- `AgendaActivityFormValues`
- `AgendaActivityMutationPayload`
- `AgendaAssociationOption`
- `AgendaFilterConfig`
- `AgendaIntegrationPreferences`
- `AgendaUserLike`
- `AssociationEntityType`
- `AvailableActivityType`
- `EditableActivity`
- `formatActivityTypeOptionValue`
- `formatDateInputValue`
- `formatTimeInputValue`
- `parseActivityTypeOptionValue`
- `UseAgendaPageStateOptions`


## API Catalog

| Export | Kind | Source |
|---|---|---|
| `ActivityCalendarView` | Component | `packages/agenda/src/activity-calendar-view.tsx` |
| `ActivityListView` | Component | `packages/agenda/src/activity-list-view.tsx` |
| `SharedActivityCalendarDayPicker` | Component | `packages/agenda/src/shared-activity-calendar-day-picker.tsx` |
| `SharedActivityCalendarEvents` | Component | `packages/agenda/src/shared-activity-calendar-events.tsx` |
| `SharedActivityCalendarHeader` | Component | `packages/agenda/src/shared-activity-calendar-header.tsx` |
| `SharedActivityCalendarWidget` | Component | `packages/agenda/src/shared-activity-calendar-widget.tsx` |
| `addLocalDays` | Helper | `packages/agenda/src/activity-calendar-widget.ts` |
| `addOneHourToTime` | Helper | `packages/agenda/src/activity-form-time.ts` |
| `ALL_DAY_ACTIVITY_END_TIME` | Helper | `packages/agenda/src/activity-form-time.ts` |
| `ALL_DAY_ACTIVITY_START_TIME` | Helper | `packages/agenda/src/activity-form-time.ts` |
| `buildActivityDisplayModel` | Helper | `packages/agenda/src/activity-helpers.ts` |
| `buildAvailableActivityTypes` | Helper | `packages/agenda/src/activity-types.ts` |
| `buildDefaultTimedRange` | Helper | `packages/agenda/src/activity-form-time.ts` |
| `DEFAULT_ACTIVITY_END_TIME` | Helper | `packages/agenda/src/activity-form-time.ts` |
| `DEFAULT_ACTIVITY_START_TIME` | Helper | `packages/agenda/src/activity-form-time.ts` |
| `DEFAULT_ACTIVITY_TYPES` | Helper | `packages/agenda/src/activity-types.ts` |
| `filterActivities` | Helper | `packages/agenda/src/activity-helpers.ts` |
| `formatCalendarWidgetTime` | Helper | `packages/agenda/src/activity-calendar-widget.ts` |
| `getActivitiesForDay` | Helper | `packages/agenda/src/activity-calendar-widget.ts` |
| `getActivityCalendarScopeForViewport` | Helper | `packages/agenda/src/activity-calendar-scope.ts` |
| `getScheduledTimestamp` | Helper | `packages/agenda/src/activity-calendar-widget.ts` |
| `getVisibleWeekDays` | Helper | `packages/agenda/src/activity-calendar-widget.ts` |
| `isActivityPast` | Helper | `packages/agenda/src/activity-calendar-widget.ts` |
| `isAllDayActivityRange` | Helper | `packages/agenda/src/activity-form-time.ts` |
| `isSameLocalDay` | Helper | `packages/agenda/src/activity-calendar-widget.ts` |
| `shouldShowActivityCalendarScopeControls` | Helper | `packages/agenda/src/activity-calendar-scope.ts` |
| `startOfLocalDay` | Helper | `packages/agenda/src/activity-calendar-widget.ts` |
| `toAlphaColor` | Helper | `packages/agenda/src/activity-helpers.ts` |
| `toLocalTimestamp` | Helper | `packages/agenda/src/activity-form-time.ts` |
| `useAgendaPageState` | Hook | `packages/agenda/src/activity-page-state.ts` |
| `ActivityAssociation` | Type | `packages/agenda/src/activity-helpers.ts` |
| `ActivityCalendarScope` | Type | `packages/agenda/src/activity-helpers.ts` |
| `ActivityCalendarSourceFilter` | Type | `packages/agenda/src/activity-helpers.ts` |
| `ActivityDensity` | Type | `packages/agenda/src/activity-helpers.ts` |
| `ActivityDisplayModel` | Type | `packages/agenda/src/activity-helpers.ts` |
| `ActivityDraftPreset` | Type | `packages/agenda/src/activity-page-state.ts` |
| `ActivityFilters` | Type | `packages/agenda/src/activity-page-state.ts` |
| `ActivityItem` | Type | `packages/agenda/src/activity-item.tsx` |
| `ActivityListItem` | Type | `packages/agenda/src/activity-helpers.ts` |
| `ActivityStatus` | Type | `packages/agenda/src/activity-helpers.ts` |
| `ActivityVisibility` | Type | `packages/agenda/src/activity-helpers.ts` |
| `AgendaActivityFormValues` | Type | `packages/agenda/src/activity-page-state.ts` |
| `AgendaActivityMutationPayload` | Type | `packages/agenda/src/activity-page-state.ts` |
| `AgendaAssociationOption` | Type | `packages/agenda/src/activity-page-state.ts` |
| `AgendaFilterConfig` | Type | `packages/agenda/src/activity-page-state.ts` |
| `AgendaIntegrationPreferences` | Type | `packages/agenda/src/activity-page-state.ts` |
| `AgendaUserLike` | Type | `packages/agenda/src/activity-page-state.ts` |
| `AssociationEntityType` | Type | `packages/agenda/src/activity-helpers.ts` |
| `AvailableActivityType` | Type | `packages/agenda/src/activity-types.ts` |
| `EditableActivity` | Type | `packages/agenda/src/activity-page-state.ts` |
| `formatActivityTypeOptionValue` | Type | `packages/agenda/src/activity-helpers.ts` |
| `formatDateInputValue` | Type | `packages/agenda/src/activity-form-time.ts` |
| `formatTimeInputValue` | Type | `packages/agenda/src/activity-form-time.ts` |
| `parseActivityTypeOptionValue` | Type | `packages/agenda/src/activity-helpers.ts` |
| `UseAgendaPageStateOptions` | Type | `packages/agenda/src/activity-page-state.ts` |


## Consumer Responsibilities

- Provide the app-specific data, copy, routing, and mutation/query adapters.
- Keep domain-specific business rules in the consuming app.
- Pass design-system compatible classes/components where a package exposes slots.

## Package Responsibilities

- Own reusable SaaS behavior and presentation.
- Stay free of Immobiliare-specific domain concepts.
- Keep exported APIs documented here when they change.
