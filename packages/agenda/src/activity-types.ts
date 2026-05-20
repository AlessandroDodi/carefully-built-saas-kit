interface ActivityTypeSource {
  readonly _id: string;
  readonly label: string;
  readonly color: string;
}

interface ActivityLike {
  readonly activityTypeId: string;
  readonly activityTypeLabel: string;
  readonly activityTypeColor: string;
}

export interface AvailableActivityType {
  readonly _id: string;
  readonly label: string;
  readonly color: string;
  readonly isFallback?: boolean;
  readonly isUsed?: boolean;
  readonly canDelete?: boolean;
}

export const DEFAULT_ACTIVITY_TYPES = [
  { label: 'Appuntamento', color: '#0EA5E9' },
  { label: 'Telefonata', color: '#06B6D4' },
  { label: 'Sopralluogo', color: '#EA580C' },
  { label: 'Riunione', color: '#713DFF' },
] as const;

const MISSING_ACTIVITY_TYPE_LABEL = 'Tipologia non disponibile';

function normalizeNamedColor(color: string | undefined): string {
  const value = color?.trim();
  return value && value.length > 0 ? value : '#713DFF';
}

function normalizeSource(source: ActivityTypeSource): AvailableActivityType {
  return {
    _id: source._id,
    label: source.label,
    color: normalizeNamedColor(source.color),
  };
}

function shouldSynthesizeActivityType(activity: ActivityLike): boolean {
  const activityTypeLabel = activity.activityTypeLabel.trim();

  return Boolean(
    activity.activityTypeId
    && activity.activityTypeId !== 'private'
    && activityTypeLabel
    && activityTypeLabel !== MISSING_ACTIVITY_TYPE_LABEL
  );
}

function collectUsedActivityTypeIds(activities: readonly ActivityLike[]): Set<string> {
  return new Set(
    activities
      .map((activity) => activity.activityTypeId)
      .filter((activityTypeId) => activityTypeId && activityTypeId !== 'private')
  );
}

function addSourceActivityTypes(
  target: Map<string, AvailableActivityType>,
  activityTypes: readonly ActivityTypeSource[],
  archivedIds: ReadonlySet<string>
): void {
  for (const activityType of activityTypes) {
    const normalizedType = normalizeSource(activityType);
    if (!archivedIds.has(normalizedType._id) && !target.has(normalizedType._id)) {
      target.set(normalizedType._id, normalizedType);
    }
  }
}

function addActivityDerivedTypes(
  target: Map<string, AvailableActivityType>,
  activities: readonly ActivityLike[],
  archivedIds: ReadonlySet<string>
): void {
  for (const activity of activities) {
    if (
      shouldSynthesizeActivityType(activity)
      && !target.has(activity.activityTypeId)
      && !archivedIds.has(activity.activityTypeId)
    ) {
      target.set(activity.activityTypeId, {
        _id: activity.activityTypeId,
        label: activity.activityTypeLabel.trim(),
        color: normalizeNamedColor(activity.activityTypeColor),
      });
    }
  }
}

function buildFallbackTypes(activityTypes: readonly AvailableActivityType[]): AvailableActivityType[] {
  const labels = new Set(
    activityTypes.map((activityType) => activityType.label.trim().toLocaleLowerCase())
  );

  return DEFAULT_ACTIVITY_TYPES
    .filter((activityType) => !labels.has(activityType.label.trim().toLocaleLowerCase()))
    .map((activityType) => ({
      _id: `default:${activityType.label.trim().toLocaleLowerCase()}`,
      label: activityType.label,
      color: normalizeNamedColor(activityType.color),
      isFallback: true,
    }));
}

export function buildAvailableActivityTypes(options: {
  readonly serverTypes?: readonly ActivityTypeSource[] | null;
  readonly localTypes?: readonly ActivityTypeSource[];
  readonly activities?: readonly ActivityLike[];
  readonly archivedIds?: readonly string[];
}): readonly AvailableActivityType[] {
  const activities = options.activities ?? [];
  const usedActivityTypeIds = collectUsedActivityTypeIds(activities);
  const mergedRealTypesMap = new Map<string, AvailableActivityType>();
  const archivedIds = new Set(options.archivedIds ?? []);

  addSourceActivityTypes(mergedRealTypesMap, options.serverTypes ?? [], archivedIds);
  addSourceActivityTypes(mergedRealTypesMap, options.localTypes ?? [], archivedIds);
  addActivityDerivedTypes(mergedRealTypesMap, activities, archivedIds);

  const mergedRealTypes = [...mergedRealTypesMap.values()];
  const fallbackTypes = buildFallbackTypes(mergedRealTypes);

  return [...mergedRealTypes, ...fallbackTypes].map((activityType) => ({
    ...activityType,
    isUsed: usedActivityTypeIds.has(activityType._id),
    canDelete: !activityType.isFallback && !usedActivityTypeIds.has(activityType._id),
  }));
}
