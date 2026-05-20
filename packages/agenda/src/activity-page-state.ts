'use client';

import { useUrlStringFilters } from '@carefully-built/crud';
import { useResourceSheetState } from '@carefully-built/resource-kit';
import { parseAsString, useQueryState } from 'nuqs';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import type { LucideIcon } from 'lucide-react';

import {
  ALL_DAY_ACTIVITY_END_TIME,
  ALL_DAY_ACTIVITY_START_TIME,
  buildDefaultTimedRange,
  formatDateInputValue,
  formatTimeInputValue,
  toLocalTimestamp,
} from './activity-form-time';
import {
  filterActivities,
  formatActivityTypeOptionValue,
  type ActivityCalendarScope,
  type ActivityCalendarSourceFilter,
  type ActivityListItem,
} from './activity-helpers';
import { buildAvailableActivityTypes, type AvailableActivityType } from './activity-types';

export interface AgendaUserLike {
  readonly _id: string;
  readonly name?: string | null;
  readonly email?: string | null;
  readonly imageUrl?: string | null;
  readonly archivedAt?: number | null;
}

export interface AgendaAssociationOption {
  readonly value: string;
  readonly entityId: string;
  readonly entityType:
    | 'contact'
    | 'property'
    | 'request'
    | 'opportunity'
    | 'activity'
    | 'note'
    | 'document';
  readonly label: string;
  readonly typeLabel: string;
}

export interface AgendaIntegrationPreferences {
  readonly showExistingEvents: boolean;
  readonly syncDashboardEvents: boolean;
}

export interface AgendaFilterConfig {
  readonly key: string;
  readonly label: string;
  readonly icon?: LucideIcon;
  readonly options: readonly { readonly value: string; readonly label: string }[];
}

export interface AgendaActivityFormValues {
  readonly title: string;
  readonly activityTypeId: string;
  readonly participantUserIds: readonly string[];
  readonly visibility: 'public' | 'private';
  readonly associations: readonly string[];
  readonly tagIds: readonly string[];
  readonly date: string;
  readonly allDay: boolean;
  readonly startTime?: string;
  readonly endTime?: string;
  readonly description?: string;
  readonly status: 'todo' | 'scheduled' | 'done' | 'cancelled';
}

export interface AgendaActivityMutationPayload {
  readonly title: string;
  readonly activityTypeId: string;
  readonly assignedUserId: string;
  readonly participantUserIds: readonly string[];
  readonly visibility: 'public' | 'private';
  readonly associations: readonly {
    readonly entityId: string;
    readonly entityType: AgendaAssociationOption['entityType'];
  }[];
  readonly tagIds: readonly string[];
  readonly dueAt?: number;
  readonly startAt?: number;
  readonly endAt?: number;
  readonly description?: string;
  readonly status: 'todo' | 'scheduled' | 'done' | 'cancelled';
}

export interface ActivityFilters {
  readonly activityType: string;
  readonly operator: string;
  readonly association: string;
  readonly tag: string;
  readonly status: string;
  readonly calendarSource: ActivityCalendarSourceFilter;
  readonly dateFrom: string;
  readonly dateTo: string;
}

export interface ActivityDraftPreset {
  readonly date: string;
  readonly allDay: boolean;
  readonly startTime: string;
  readonly endTime: string;
}

export interface EditableActivity extends ActivityListItem {
  readonly _id: string;
  readonly activityTypeId: string;
  readonly assignedUserId?: string;
  readonly participantUserIds: string[];
  readonly dueAt?: number;
  readonly updatedAt?: number;
}

export interface UseAgendaPageStateOptions {
  readonly activities: readonly ActivityListItem[] | undefined;
  readonly activityTypes: readonly { readonly _id: string; readonly label: string; readonly color: string }[] | undefined;
  readonly organizationUsers: readonly AgendaUserLike[] | undefined;
  readonly currentUser: AgendaUserLike | null | undefined;
  readonly organizationId: string | null | undefined;
  readonly associationOptions: readonly AgendaAssociationOption[] | undefined;
  readonly integrationPreferences: AgendaIntegrationPreferences;
  readonly icons: {
    readonly activityType: LucideIcon;
    readonly operator: LucideIcon;
  };
  readonly createActivity: (payload: AgendaActivityMutationPayload) => Promise<string>;
  readonly updateActivity: (id: string, payload: Partial<AgendaActivityMutationPayload>) => Promise<void>;
  readonly archiveActivity: (id: string) => Promise<void>;
  readonly createActivityType: (data: { label: string; color: string }) => Promise<string>;
  readonly updateActivityType: (id: string, data: { label: string; color: string }) => Promise<void>;
  readonly archiveActivityType: (id: string) => Promise<void>;
  readonly syncCreatedActivity?: (args: {
    readonly title: string;
    readonly description?: string;
    readonly startAt?: number;
    readonly endAt?: number;
    readonly allDay: boolean;
    readonly createdId: string;
  }) => Promise<string | null | undefined>;
  readonly attachCalendarEvent?: (activityId: string, eventId: string) => Promise<void>;
  readonly deleteCalendarEvent?: (eventId: string) => Promise<boolean>;
}

const ACTIVITY_URL_FILTERS = [
  { key: 'search', param: 'q', defaultValue: '', clearValue: '' },
  { key: 'activityType' },
  { key: 'operator' },
  { key: 'association' },
  { key: 'tag' },
  { key: 'status' },
  { key: 'calendarSource' },
  { key: 'dateFrom', defaultValue: '', clearValue: '' },
  { key: 'dateTo', defaultValue: '', clearValue: '' },
] as const;

function buildActivityTypeFilterConfig(
  activityTypes: readonly AvailableActivityType[],
  icon: LucideIcon,
): AgendaFilterConfig {
  return {
    key: 'activityType',
    label: 'Tipo attività',
    icon,
    options: activityTypes.map((activityType) => ({
      value: formatActivityTypeOptionValue(activityType._id),
      label: activityType.label,
    })),
  };
}

function buildOperatorFilterConfig(
  users: readonly AgendaUserLike[],
  icon: LucideIcon,
): AgendaFilterConfig {
  return {
    key: 'operator',
    label: 'Operatore',
    icon,
    options: users.map((user) => ({
      value: String(user._id),
      label: user.name ?? 'Utente',
    })),
  };
}

function mapAssociationValuesToPayload(
  selectedValues: readonly string[],
  options: readonly AgendaAssociationOption[],
): AgendaActivityMutationPayload['associations'] {
  const optionMap = new Map(options.map((option) => [option.value, option]));

  return selectedValues.flatMap((value) => {
    const option = optionMap.get(value);
    return option ? [{ entityId: option.entityId, entityType: option.entityType }] : [];
  });
}

function buildCreatePreset(start: Date, end?: Date | null, allDay = false): ActivityDraftPreset {
  if (allDay) {
    return {
      date: formatDateInputValue(start.getTime()),
      allDay: true,
      startTime: ALL_DAY_ACTIVITY_START_TIME,
      endTime: ALL_DAY_ACTIVITY_END_TIME,
    };
  }

  const startsAtMidnight = start.getHours() === 0 && start.getMinutes() === 0;
  const endsAtMidnight = !end || (end.getHours() === 0 && end.getMinutes() === 0);
  const isDateOnlySelection = startsAtMidnight && endsAtMidnight;

  if (isDateOnlySelection) {
    const defaultRange = buildDefaultTimedRange();
    return {
      date: formatDateInputValue(start.getTime()),
      allDay: false,
      startTime: defaultRange.startTime,
      endTime: defaultRange.endTime,
    };
  }

  const resolvedEnd =
    end && end.getTime() > start.getTime() ? end : new Date(start.getTime() + 60 * 60 * 1000);

  return {
    date: formatDateInputValue(start.getTime()),
    allDay: false,
    startTime: formatTimeInputValue(start.getTime()),
    endTime: formatTimeInputValue(resolvedEnd.getTime()),
  };
}

function normalizeActivities(activities: readonly ActivityListItem[] | undefined): EditableActivity[] {
  return (activities ?? []).map((activity) => ({
    ...activity,
    assignedUserName: activity.assignedUserName ?? undefined,
    activityTypeId: activity.activityTypeId,
    assignedUserId: activity.assignedUserId ?? undefined,
    participantUserIds: activity.participantUserIds.map(String),
    dueAt: activity.dueAt,
    updatedAt: 'updatedAt' in activity && typeof activity.updatedAt === 'number' ? activity.updatedAt : undefined,
  }));
}

function normalizeCalendarSourceFilter(value: string): ActivityCalendarSourceFilter {
  return ['dashboard', 'dashboard-only', 'google-linked', 'google-only'].includes(value)
    ? (value as ActivityCalendarSourceFilter)
    : 'all';
}

function normalizeColor(color: string): string {
  const value = color.trim();
  return value.length > 0 ? value : '#713DFF';
}

function sortActivitiesByDate<T extends { startAt?: number; dueAt?: number; updatedAt?: number }>(
  activities: readonly T[],
): T[] {
  return [...activities].sort((left, right) => {
    const leftDate = left.startAt ?? left.dueAt ?? left.updatedAt ?? 0;
    const rightDate = right.startAt ?? right.dueAt ?? right.updatedAt ?? 0;
    return leftDate - rightDate;
  });
}

function requireOrganizationId(organizationId: string | null | undefined): string {
  if (!organizationId) {
    throw new Error('No organization selected.');
  }
  return organizationId;
}

function buildActivityPayload(args: {
  readonly values: AgendaActivityFormValues;
  readonly currentUserId: string;
  readonly associationOptions: readonly AgendaAssociationOption[];
  readonly activityTypeId: string;
}): AgendaActivityMutationPayload {
  const values = args.values;

  return {
    title: values.title,
    activityTypeId: args.activityTypeId,
    assignedUserId: args.currentUserId,
    participantUserIds: values.participantUserIds,
    visibility: values.visibility,
    associations: mapAssociationValuesToPayload(values.associations, args.associationOptions),
    tagIds: values.tagIds,
    dueAt: toLocalTimestamp(
      values.date,
      values.allDay ? ALL_DAY_ACTIVITY_END_TIME : (values.endTime ?? values.startTime ?? ''),
    ),
    startAt: toLocalTimestamp(
      values.date,
      values.allDay ? ALL_DAY_ACTIVITY_START_TIME : (values.startTime ?? ''),
    ),
    endAt: toLocalTimestamp(
      values.date,
      values.allDay ? ALL_DAY_ACTIVITY_END_TIME : (values.endTime ?? ''),
    ),
    description: values.description?.trim() ? values.description.trim() : undefined,
    status: values.status,
  };
}

function buildOptimisticActivity(args: {
  readonly id: string;
  readonly base?: EditableActivity;
  readonly values: AgendaActivityFormValues;
  readonly payload: AgendaActivityMutationPayload;
  readonly activityType: AvailableActivityType;
  readonly currentUser: AgendaUserLike;
  readonly associationOptions: readonly AgendaAssociationOption[];
  readonly participantLabelMap: ReadonlyMap<string, string>;
  readonly googleCalendarEventId?: string | null;
}): EditableActivity {
  const associationOptionMap = new Map(args.associationOptions.map((option) => [option.value, option]));

  return {
    ...args.base,
    _id: args.id,
    title: args.values.title,
    activityTypeId: args.payload.activityTypeId,
    activityTypeLabel: args.activityType.label,
    activityTypeColor: args.activityType.color,
    assignedUserId: String(args.currentUser._id),
    assignedUserName: args.currentUser.name ?? args.currentUser.email ?? 'Utente',
    participantUserIds: [...args.values.participantUserIds],
    participantUserNames: args.values.participantUserIds.map(
      (participantId) => args.participantLabelMap.get(participantId) ?? 'Utente',
    ),
    visibility: args.values.visibility,
    associations: args.values.associations.flatMap((value) => {
      const associationOption = associationOptionMap.get(value);
      return associationOption
        ? [
            {
              value: associationOption.value,
              entityId: associationOption.entityId,
              entityType: associationOption.entityType,
              label: associationOption.label,
              typeLabel: associationOption.typeLabel,
            },
          ]
        : [];
    }),
    googleCalendarEventId: args.googleCalendarEventId ?? args.base?.googleCalendarEventId,
    dueAt: args.payload.dueAt,
    startAt: args.payload.startAt,
    endAt: args.payload.endAt,
    description: args.payload.description,
    status: args.payload.status,
    tagIds: [...args.values.tagIds],
    updatedAt: Date.now(),
  };
}

export function useAgendaPageState(options: UseAgendaPageStateOptions) {
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false);
  const [createDraftPreset, setCreateDraftPreset] = useState<ActivityDraftPreset>(() => ({
    date: formatDateInputValue(new Date().getTime()),
    allDay: false,
    ...buildDefaultTimedRange(),
  }));
  const [anchorDate, setAnchorDate] = useState(new Date());
  const [localActivities, setLocalActivities] = useState<EditableActivity[]>([]);
  const [archivedActivityIds, setArchivedActivityIds] = useState<string[]>([]);
  const [localActivityTypes, setLocalActivityTypes] = useState<AvailableActivityType[]>([]);
  const [archivedActivityTypeIds, setArchivedActivityTypeIds] = useState<string[]>([]);
  const urlFilters = useUrlStringFilters(ACTIVITY_URL_FILTERS);
  const {
    search,
    activityType: selectedActivityType,
    operator: selectedOperator,
    association: selectedAssociation,
    tag: selectedTag,
    status: selectedStatus,
    calendarSource: selectedCalendarSource,
    dateFrom: selectedDateFrom,
    dateTo: selectedDateTo,
  } = urlFilters.values;
  const [calendarScope, setCalendarScopeQuery] = useQueryState(
    'scope',
    parseAsString.withDefault('week'),
  );
  const [highlightedActivityId, setHighlightedActivityIdQuery] = useQueryState(
    'activityId',
    parseAsString.withDefault(''),
  );

  const currentUser = options.currentUser;
  const normalizedSelectedActivityType =
    selectedActivityType && selectedActivityType !== 'all' ? selectedActivityType : 'all';
  const normalizedSelectedOperator =
    selectedOperator && selectedOperator !== 'all' ? selectedOperator : 'all';
  const normalizedSelectedCalendarSource = normalizeCalendarSourceFilter(selectedCalendarSource);
  const isCalendarLoading =
    options.activities === undefined || currentUser === undefined || options.organizationId === null;

  const normalizedActivities = useMemo(() => normalizeActivities(options.activities), [options.activities]);
  const mergedActivities = useMemo(
    () =>
      sortActivitiesByDate(
        [
          ...normalizedActivities,
          ...localActivities.filter(
            (localActivity) =>
              !normalizedActivities.some((activity) => activity._id === localActivity._id),
          ),
        ].filter((activity) => !archivedActivityIds.includes(activity._id)),
      ),
    [archivedActivityIds, localActivities, normalizedActivities],
  );
  const activitySheet = useResourceSheetState({
    items: mergedActivities,
    getItemId: (activity) => activity._id,
  });
  const editingActivity = activitySheet.editingItem;
  const serverActivityTypes = useMemo(
    () =>
      (options.activityTypes ?? []).map((activityType) => ({
        _id: String(activityType._id),
        label: activityType.label,
        color: activityType.color,
      })),
    [options.activityTypes],
  );
  const activityTypes = useMemo(() => {
    return buildAvailableActivityTypes({
      serverTypes: serverActivityTypes,
      localTypes: localActivityTypes,
      activities: mergedActivities,
      archivedIds: archivedActivityTypeIds,
    });
  }, [archivedActivityTypeIds, localActivityTypes, mergedActivities, serverActivityTypes]);
  const orgUsers = useMemo(() => {
    const activeUsers = (options.organizationUsers ?? []).filter((orgUser) => !orgUser.archivedAt);

    if (!currentUser) {
      return activeUsers;
    }

    const hasCurrentUser = activeUsers.some((orgUser) => orgUser._id === currentUser._id);
    return hasCurrentUser ? activeUsers : [currentUser, ...activeUsers];
  }, [currentUser, options.organizationUsers]);

  const filteredActivities = useMemo(() => {
    return filterActivities(mergedActivities, {
      search,
      activityType: normalizedSelectedActivityType,
      operator: normalizedSelectedOperator,
      association: selectedAssociation,
      tag: selectedTag,
      status: selectedStatus,
      calendarSource: normalizedSelectedCalendarSource,
      dateFrom: selectedDateFrom,
      dateTo: selectedDateTo,
    });
  }, [
    mergedActivities,
    normalizedSelectedActivityType,
    normalizedSelectedCalendarSource,
    normalizedSelectedOperator,
    search,
    selectedAssociation,
    selectedDateFrom,
    selectedDateTo,
    selectedStatus,
    selectedTag,
  ]);
  const selectedFilters: ActivityFilters = useMemo(
    () => ({
      activityType: normalizedSelectedActivityType,
      operator: normalizedSelectedOperator,
      association: selectedAssociation,
      tag: selectedTag,
      status: selectedStatus,
      calendarSource: normalizedSelectedCalendarSource,
      dateFrom: selectedDateFrom,
      dateTo: selectedDateTo,
    }),
    [
      normalizedSelectedActivityType,
      normalizedSelectedCalendarSource,
      normalizedSelectedOperator,
      selectedAssociation,
      selectedDateFrom,
      selectedDateTo,
      selectedStatus,
      selectedTag,
    ],
  );
  const associationFilterOptions = useMemo(
    () =>
      [
        ...new Map(
          mergedActivities.flatMap((activity) =>
            activity.associations.map((association) => [association.value, association]),
          ),
        ).values(),
      ].sort((left, right) => left.label.localeCompare(right.label, 'it')),
    [mergedActivities],
  );
  const activityTypeFilterConfig = useMemo(
    () => buildActivityTypeFilterConfig(activityTypes, options.icons.activityType),
    [activityTypes, options.icons.activityType],
  );
  const operatorFilterConfig = useMemo(
    () => buildOperatorFilterConfig(orgUsers, options.icons.operator),
    [options.icons.operator, orgUsers],
  );
  const participantOptions = useMemo(
    () =>
      orgUsers.map((orgUser) => ({
        value: String(orgUser._id),
        label: orgUser.name ?? orgUser.email ?? 'Utente',
        email: orgUser.email,
        imageUrl: orgUser.imageUrl,
        archived: Boolean(orgUser.archivedAt),
      })),
    [orgUsers],
  );

  useEffect(() => {
    if (
      normalizedSelectedOperator !== 'all' &&
      !orgUsers.some((orgUser) => String(orgUser._id) === normalizedSelectedOperator)
    ) {
      urlFilters.setValue('operator', 'all');
    }
  }, [normalizedSelectedOperator, orgUsers, urlFilters]);

  useEffect(() => {
    if (
      normalizedSelectedActivityType !== 'all' &&
      !activityTypes.some(
        (activityType) =>
          activityType._id === normalizedSelectedActivityType ||
          formatActivityTypeOptionValue(activityType._id) === normalizedSelectedActivityType,
      )
    ) {
      urlFilters.setValue('activityType', 'all');
    }
  }, [activityTypes, normalizedSelectedActivityType, urlFilters]);

  useEffect(() => {
    if (!highlightedActivityId || editingActivity?._id === highlightedActivityId) {
      return;
    }

    const highlightedActivity = mergedActivities.find(
      (activity) => activity._id === highlightedActivityId,
    );

    if (!highlightedActivity) {
      return;
    }

    const scheduledAt = highlightedActivity.startAt ?? highlightedActivity.dueAt;
    if (scheduledAt) {
      setAnchorDate(new Date(scheduledAt));
    }

    activitySheet.openEdit(highlightedActivity._id);
  }, [activitySheet.openEdit, editingActivity?._id, highlightedActivityId, mergedActivities]);

  function getDraftFilterResultCount(draftValues: Record<string, string>): number | undefined {
    const draftFilters = urlFilters.getDraftValues({
      ...draftValues,
      dateFrom: draftValues.dateMin ?? draftValues.dateFrom ?? selectedFilters.dateFrom,
      dateTo: draftValues.dateMax ?? draftValues.dateTo ?? selectedFilters.dateTo,
    });
    const draftCalendarSource = normalizeCalendarSourceFilter(draftFilters.calendarSource);

    if (draftCalendarSource === 'google-only') {
      return undefined;
    }

    return filterActivities(mergedActivities, {
      search,
      activityType: draftFilters.activityType,
      operator: draftFilters.operator,
      association: draftFilters.association,
      tag: draftFilters.tag,
      status: draftFilters.status,
      calendarSource: draftCalendarSource,
      dateFrom: draftFilters.dateFrom,
      dateTo: draftFilters.dateTo,
    }).length;
  }

  function closeSheet(): void {
    activitySheet.close();
    void setHighlightedActivityIdQuery(null);
  }

  function syncSheetOpen(open: boolean): void {
    activitySheet.syncOpen(open);
    if (!open) {
      void setHighlightedActivityIdQuery(null);
    }
  }

  async function submitActivity(values: AgendaActivityFormValues): Promise<void> {
    if (!currentUser?._id) {
      throw new Error('Current user not found.');
    }

    requireOrganizationId(options.organizationId);

    let resolvedActivityTypeId = values.activityTypeId;
    let resolvedActivityType = activityTypes.find(
      (activityType) => activityType._id === values.activityTypeId,
    );
    if (resolvedActivityTypeId.startsWith('default:')) {
      const fallbackType = resolvedActivityType;
      if (!fallbackType) {
        toast.error('Tipologia attività non trovata.');
        return;
      }

      try {
        const createdTypeId = await options.createActivityType({
          label: fallbackType.label,
          color: fallbackType.color,
        });
        resolvedActivityTypeId = String(createdTypeId);
        resolvedActivityType = {
          _id: String(createdTypeId),
          label: fallbackType.label,
          color: fallbackType.color,
        };
        setLocalActivityTypes((currentTypes) => [
          ...currentTypes.filter((activityType) => activityType._id !== String(createdTypeId)),
          resolvedActivityType!,
        ]);
      } catch (error) {
        console.error(error);
        toast.error('Impossibile creare la tipologia selezionata.');
        return;
      }
    }

    if (!resolvedActivityType) {
      toast.error('Tipologia attività non trovata.');
      return;
    }

    const payload = buildActivityPayload({
      values,
      currentUserId: currentUser._id,
      associationOptions: options.associationOptions ?? [],
      activityTypeId: resolvedActivityTypeId,
    });
    const participantLabelMap = new Map(
      orgUsers.map((orgUser) => [String(orgUser._id), orgUser.name ?? orgUser.email ?? 'Utente']),
    );

    try {
      if (editingActivity) {
        await options.updateActivity(editingActivity._id, payload);
        setLocalActivities((currentActivities) =>
          sortActivitiesByDate([
            ...currentActivities.filter((activity) => activity._id !== editingActivity._id),
            buildOptimisticActivity({
              id: editingActivity._id,
              base: editingActivity,
              values,
              payload,
              activityType: resolvedActivityType,
              currentUser,
              associationOptions: options.associationOptions ?? [],
              participantLabelMap,
            }),
          ]),
        );
        setArchivedActivityIds((currentIds) =>
          currentIds.filter((id) => id !== editingActivity._id),
        );
        toast.success('attività aggiornata');
      } else {
        const createdId = await options.createActivity(payload);
        const optimisticActivity = buildOptimisticActivity({
          id: createdId,
          values,
          payload,
          activityType: resolvedActivityType,
          currentUser,
          associationOptions: options.associationOptions ?? [],
          participantLabelMap,
        });
        setLocalActivities((currentActivities) =>
          sortActivitiesByDate([
            ...currentActivities.filter((activity) => activity._id !== String(createdId)),
            optimisticActivity,
          ]),
        );
        setArchivedActivityIds((currentIds) => currentIds.filter((id) => id !== String(createdId)));
        toast.success('attività aggiunta');
        closeSheet();

        if (options.integrationPreferences.syncDashboardEvents && payload.startAt && options.syncCreatedActivity) {
          void options.syncCreatedActivity({
            title: values.title,
            description: payload.description,
            startAt: payload.startAt,
            endAt: payload.endAt,
            allDay: values.allDay,
            createdId,
          }).then(async (eventId) => {
            if (!eventId) {
              return;
            }

            await options.attachCalendarEvent?.(createdId, eventId);
            setLocalActivities((currentActivities) =>
              sortActivitiesByDate(
                currentActivities.map((activity) =>
                  activity._id === String(createdId)
                    ? { ...activity, googleCalendarEventId: eventId, updatedAt: Date.now() }
                    : activity,
                ),
              ),
            );
          }).catch((error: unknown) => {
            console.error(error);
            toast.warning(
              'Attività salvata, ma non è stato possibile sincronizzarla con Google Calendar.',
            );
          });
        }

        return;
      }

      closeSheet();
    } catch (error) {
      console.error(error);
      toast.error('Si e verificato un errore durante il salvataggio dell attività.');
    }
  }

  async function moveActivity(
    activity: ActivityListItem,
    start: Date,
    end?: Date | null,
  ): Promise<void> {
    if (!currentUser?._id) {
      toast.error('Utente corrente non trovato.');
      return;
    }

    try {
      requireOrganizationId(options.organizationId);
      const nextStartAt = start.getTime();
      const nextEndAt = end && end.getTime() > nextStartAt ? end.getTime() : undefined;
      const nextDueAt = nextEndAt ?? nextStartAt;

      await options.updateActivity(activity._id, {
        startAt: nextStartAt,
        endAt: nextEndAt,
        dueAt: nextDueAt,
      });

      setLocalActivities((currentActivities) =>
        sortActivitiesByDate([
          ...currentActivities.filter((currentActivity) => currentActivity._id !== activity._id),
          {
            ...activity,
            startAt: nextStartAt,
            endAt: nextEndAt,
            dueAt: nextDueAt,
            updatedAt: Date.now(),
          },
        ]),
      );
      setArchivedActivityIds((currentIds) => currentIds.filter((id) => id !== activity._id));
      toast.success('attività spostata');
    } catch (error) {
      console.error(error);
      toast.error('Impossibile spostare l’attività.');
    }
  }

  async function archiveEditingActivity(): Promise<void> {
    if (!editingActivity || !currentUser?._id || !options.organizationId) {
      return;
    }

    try {
      const googleCalendarEventId = editingActivity.googleCalendarEventId;

      await options.archiveActivity(editingActivity._id);

      let googleCalendarDeleteFailed = false;

      if (googleCalendarEventId && options.deleteCalendarEvent) {
        googleCalendarDeleteFailed = !(await options.deleteCalendarEvent(googleCalendarEventId));
      }

      setLocalActivities((currentActivities) =>
        currentActivities.filter((activity) => activity._id !== editingActivity._id),
      );
      setArchivedActivityIds((currentIds) => [
        ...currentIds.filter((id) => id !== editingActivity._id),
        editingActivity._id,
      ]);
      toast.success('attività archiviata');
      if (googleCalendarDeleteFailed) {
        toast.error(
          'Attività archiviata nell’app, ma non è stato possibile eliminarla da Google Calendar.',
        );
      }
      closeSheet();
    } catch (error) {
      console.error(error);
      toast.error('Impossibile archiviare l attività.');
    }
  }

  async function createActivityType(data: { label: string; color: string }): Promise<void> {
    if (!currentUser?._id || !options.organizationId) {
      return;
    }

    const normalizedData = { ...data, color: normalizeColor(data.color) };

    try {
      const createdId = await options.createActivityType(normalizedData);
      setLocalActivityTypes((currentTypes) => [
        ...currentTypes.filter((activityType) => activityType._id !== String(createdId)),
        { _id: String(createdId), label: normalizedData.label, color: normalizedData.color },
      ]);
      setArchivedActivityTypeIds((currentIds) =>
        currentIds.filter((id) => id !== String(createdId)),
      );
      toast.success('Tipologia aggiunta');
    } catch (error) {
      console.error(error);
      toast.error('Impossibile creare la tipologia.');
    }
  }

  async function updateActivityType(id: string, data: { label: string; color: string }): Promise<void> {
    if (!currentUser?._id || !options.organizationId) {
      return;
    }

    const normalizedData = { ...data, color: normalizeColor(data.color) };

    try {
      if (id.startsWith('default:')) {
        const createdId = await options.createActivityType(normalizedData);
        setLocalActivityTypes((currentTypes) => [
          ...currentTypes.filter((activityType) => activityType._id !== String(createdId)),
          { _id: String(createdId), label: normalizedData.label, color: normalizedData.color },
        ]);
        setArchivedActivityTypeIds((currentIds) =>
          currentIds.filter((currentId) => currentId !== String(createdId)),
        );
        toast.success('Tipologia aggiunta');
        return;
      }

      await options.updateActivityType(id, normalizedData);
      setLocalActivityTypes((currentTypes) => {
        const nextTypes = currentTypes.filter((activityType) => activityType._id !== id);
        return [...nextTypes, { _id: id, label: normalizedData.label, color: normalizedData.color }];
      });
      toast.success('Tipologia aggiornata');
    } catch (error) {
      console.error(error);
      toast.error('Impossibile aggiornare la tipologia.');
    }
  }

  async function archiveActivityType(id: string): Promise<void> {
    if (!currentUser?._id || !options.organizationId || id.startsWith('default:')) {
      return;
    }

    try {
      await options.archiveActivityType(id);
      setLocalActivityTypes((currentTypes) =>
        currentTypes.filter((activityType) => activityType._id !== id),
      );
      setArchivedActivityTypeIds((currentIds) => [
        ...currentIds.filter((currentId) => currentId !== id),
        id,
      ]);
      toast.success('Tipologia archiviata');
    } catch (error) {
      console.error(error);
      toast.error('Impossibile archiviare la tipologia.');
    }
  }

  return {
    activities: mergedActivities,
    filteredActivities,
    associationOptions: options.associationOptions,
    activityTypes,
    activityTypeFilterConfig,
    operatorFilterConfig,
    currentUserId: currentUser?._id ?? null,
    participantOptions,
    googleCalendarPreferences: options.integrationPreferences,
    isCalendarLoading,
    isSheetOpen: activitySheet.isOpen,
    isTypeDialogOpen,
    editingActivity,
    search,
    selectedActivityType: normalizedSelectedActivityType,
    selectedOperator: normalizedSelectedOperator,
    filters: selectedFilters,
    associationFilterOptions,
    calendarScope: calendarScope as ActivityCalendarScope,
    anchorDate,
    createDraftPreset,
    highlightedActivityId,
    openCreateSheet: () => {
      setCreateDraftPreset({
        date: formatDateInputValue(new Date().getTime()),
        allDay: false,
        ...buildDefaultTimedRange(),
      });
      activitySheet.openCreate();
    },
    openCreateSheetForDate: (start: Date, end?: Date | null, allDay = false) => {
      setCreateDraftPreset(buildCreatePreset(start, end, allDay));
      activitySheet.openCreate();
    },
    openEditSheet: (activity: EditableActivity) => {
      activitySheet.openEdit(activity._id);
    },
    closeSheet,
    syncSheetOpen,
    setSearch: (value: string) => {
      urlFilters.setValue('search', value);
    },
    setSelectedActivityType: (value: string) => {
      urlFilters.setValue('activityType', value);
    },
    setSelectedOperator: (value: string) => {
      urlFilters.setValue('operator', value);
    },
    setFilter: (key: keyof ActivityFilters, value: string) => {
      urlFilters.setValue(key, value);
    },
    getDraftFilterResultCount,
    clearFilters: urlFilters.clear,
    setCalendarScope: (value: ActivityCalendarScope) => {
      setAnchorDate(new Date());
      void setCalendarScopeQuery(value);
    },
    setAnchorDate,
    setIsTypeDialogOpen,
    submitActivity,
    archiveEditingActivity,
    createActivityType,
    updateActivityType,
    archiveActivityType,
    moveActivity,
  };
}
