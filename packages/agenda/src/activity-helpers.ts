import { buildSearchText, rankBySearch } from '@carefully-built/search';

export type AssociationEntityType =
  | 'contact'
  | 'property'
  | 'request'
  | 'opportunity'
  | 'activity'
  | 'note'
  | 'document';
export type ActivityCalendarScope = 'day' | 'week' | 'month';
export type ActivityDensity = 'large' | 'compact' | 'micro';
export type ActivityVisibility = 'private' | 'internal' | 'team' | 'public';
export type ActivityStatus = 'todo' | 'scheduled' | 'done' | 'cancelled';
export type ActivityCalendarSourceFilter =
  | 'all'
  | 'dashboard'
  | 'dashboard-only'
  | 'google-linked'
  | 'google-only';

export interface ActivityAssociation {
  value: string;
  entityId: string;
  entityType: AssociationEntityType;
  label: string;
  typeLabel: string;
}

export interface ActivityListItem {
  _id: string;
  title: string;
  description?: string;
  googleCalendarEventId?: string;
  visibility: ActivityVisibility;
  status: ActivityStatus;
  activityTypeId: string;
  activityTypeLabel: string;
  activityTypeColor: string;
  assignedUserId?: string;
  assignedUserName?: string | null;
  participantUserIds: string[];
  participantUserNames: string[];
  tagIds?: string[];
  startAt?: number;
  dueAt?: number;
  endAt?: number;
  associations: ActivityAssociation[];
}

interface BuildActivityDisplayModelOptions {
  density: ActivityDensity;
  scope: ActivityCalendarScope;
  viewerUserId: string;
}

export interface ActivityDisplayModel {
  title: string;
  timeLabel: string | null;
  typeLabel: string | null;
  assigneeLabel: string | null;
  description: string | null;
  isPrivatePlaceholder: boolean;
  activityTypeColor: string;
}

interface FilterActivitiesOptions {
  search: string;
  activityType: string;
  operator: string;
  association?: string;
  tag?: string;
  status?: string;
  calendarSource?: ActivityCalendarSourceFilter;
  dateFrom?: string;
  dateTo?: string;
}

function formatTimeRange(startAt?: number, endAt?: number): string | null {
  if (!startAt) {
    return null;
  }

  const dateFormatter = new Intl.DateTimeFormat('it-IT', {
    day: 'numeric',
    month: 'short',
  });
  const timeFormatter = new Intl.DateTimeFormat('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const startDate = new Date(startAt);
  const startDateLabel = dateFormatter.format(startDate);
  const startTimeLabel = timeFormatter.format(startDate);

  if (!endAt) {
    return `${startDateLabel}, ${startTimeLabel}`;
  }

  const endDate = new Date(endAt);
  const endDateLabel = dateFormatter.format(endDate);
  const endTimeLabel = timeFormatter.format(endDate);

  if (startDateLabel === endDateLabel) {
    return `${startDateLabel}, ${startTimeLabel} - ${endTimeLabel}`;
  }

  return `${startDateLabel}, ${startTimeLabel} - ${endDateLabel}, ${endTimeLabel}`;
}

function isPrivateForViewer(activity: ActivityListItem, viewerUserId: string): boolean {
  if (activity.visibility !== 'private') {
    return false;
  }

  return activity.assignedUserId !== viewerUserId;
}

export function buildActivityDisplayModel(
  activity: ActivityListItem,
  options: BuildActivityDisplayModelOptions,
): ActivityDisplayModel {
  const masked = isPrivateForViewer(activity, options.viewerUserId);
  const baseModel: ActivityDisplayModel = {
    title: masked ? 'Occupato' : activity.title,
    timeLabel: formatTimeRange(activity.startAt, activity.endAt),
    typeLabel: masked ? null : activity.activityTypeLabel,
    assigneeLabel: masked ? null : (activity.assignedUserName ?? null),
    description: masked ? null : (activity.description ?? null),
    isPrivatePlaceholder: masked,
    activityTypeColor: activity.activityTypeColor,
  };

  if (options.density === 'micro') {
    return {
      ...baseModel,
      typeLabel: null,
      assigneeLabel: null,
      description: null,
    };
  }

  if (options.density === 'compact') {
    return {
      ...baseModel,
      description: null,
    };
  }

  return baseModel;
}

export function formatActivityTypeOptionValue(activityTypeId: string): string {
  return `activity-type:${activityTypeId}`;
}

export function parseActivityTypeOptionValue(value: string): string | null {
  const prefix = 'activity-type:';
  if (!value || value === 'all') {
    return null;
  }

  return value.startsWith(prefix) ? value.slice(prefix.length) : value;
}

export function toAlphaColor(hexColor: string, alpha: number): string {
  const normalizedHex = hexColor.replace('#', '');
  if (normalizedHex.length !== 6) {
    return hexColor;
  }

  const red = Number.parseInt(normalizedHex.slice(0, 2), 16);
  const green = Number.parseInt(normalizedHex.slice(2, 4), 16);
  const blue = Number.parseInt(normalizedHex.slice(4, 6), 16);

  return `rgba(${String(red)}, ${String(green)}, ${String(blue)}, ${String(alpha)})`;
}

export function filterActivities<T extends ActivityListItem>(
  activities: T[],
  options: FilterActivitiesOptions,
): T[] {
  const selectedActivityTypeId = parseActivityTypeOptionValue(options.activityType);

  const scopedActivities = activities.filter((activity) => {
    const matchesActivityType =
      selectedActivityTypeId === null || activity.activityTypeId === selectedActivityTypeId;
    const matchesOperator =
      !options.operator ||
      options.operator === 'all' ||
      (activity.assignedUserId ?? '') === options.operator;
    const matchesAssociation =
      !options.association ||
      options.association === 'all' ||
      activity.associations.some((association) => association.value === options.association);
    const matchesTag =
      !options.tag || options.tag === 'all' || (activity.tagIds ?? []).includes(options.tag);
    const matchesStatus =
      !options.status || options.status === 'all' || activity.status === options.status;
    const matchesCalendarSource = matchesActivityCalendarSource(
      activity,
      options.calendarSource ?? 'all',
    );
    const matchesDate = matchesActivityDateRange(
      activity,
      options.dateFrom ?? '',
      options.dateTo ?? '',
    );

    return (
      matchesActivityType &&
      matchesOperator &&
      matchesAssociation &&
      matchesTag &&
      matchesStatus &&
      matchesCalendarSource &&
      matchesDate
    );
  });

  return rankBySearch(scopedActivities, options.search, (activity) =>
    buildSearchText(
      activity.title,
      activity.description,
      activity.activityTypeLabel,
      activity.assignedUserName,
      activity.participantUserNames,
      activity.associations.map((association) => association.label),
    ),
  );
}

function matchesActivityCalendarSource(
  activity: ActivityListItem,
  calendarSource: ActivityCalendarSourceFilter,
): boolean {
  if (calendarSource === 'all' || calendarSource === 'dashboard') {
    return true;
  }

  const hasGoogleCalendarEvent = Boolean(activity.googleCalendarEventId);

  if (calendarSource === 'dashboard-only') {
    return !hasGoogleCalendarEvent;
  }

  if (calendarSource === 'google-linked') {
    return hasGoogleCalendarEvent;
  }

  return false;
}

function matchesActivityDateRange(
  activity: ActivityListItem,
  dateFrom: string,
  dateTo: string,
): boolean {
  if (!dateFrom && !dateTo) {
    return true;
  }

  const timestamp = activity.startAt ?? activity.dueAt ?? activity.endAt;
  if (typeof timestamp !== 'number') {
    return false;
  }

  const activityDate = new Date(timestamp);
  const fromDate = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
  const toDate = dateTo ? new Date(`${dateTo}T23:59:59.999`) : null;

  return (!fromDate || activityDate >= fromDate) && (!toDate || activityDate <= toDate);
}
