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

export interface FallbackActivityType {
  readonly label: string;
  readonly color: string;
}

/**
 * Starter types offered to an organization that has none of its own. They are
 * matched against the real types **by label**, so a host whose data is in
 * another language must pass its own through `fallbackTypes` — otherwise none
 * match and every default shows up as an extra, undeletable row next to the
 * real ones.
 */
export const DEFAULT_ACTIVITY_TYPES = [
  { label: 'Meeting', color: '#0EA5E9' },
  { label: 'Call', color: '#06B6D4' },
  { label: 'Visit', color: '#EA580C' },
  { label: 'Review', color: '#713DFF' },
] as const;

/**
 * Etichetta che l'host usa per un'attivita' il cui tipo non esiste piu'. Serve a
 * NON sintetizzare una tipologia da quel segnaposto: se non combacia con quella
 * che l'host manda davvero, compare come una riga in piu' nell'elenco dei tipi.
 */
export const MISSING_ACTIVITY_TYPE_LABEL = 'Activity type unavailable';

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

function shouldSynthesizeActivityType(
  activity: ActivityLike,
  missingTypeLabel: string
): boolean {
  const activityTypeLabel = activity.activityTypeLabel.trim();

  return Boolean(
    activity.activityTypeId
    && activity.activityTypeId !== 'private'
    && activityTypeLabel
    && activityTypeLabel !== MISSING_ACTIVITY_TYPE_LABEL
    && activityTypeLabel !== missingTypeLabel.trim()
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
  archivedIds: ReadonlySet<string>,
  missingTypeLabel: string
): void {
  for (const activity of activities) {
    if (
      shouldSynthesizeActivityType(activity, missingTypeLabel)
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

function buildFallbackTypes(
  activityTypes: readonly AvailableActivityType[],
  fallbackTypes: readonly FallbackActivityType[]
): AvailableActivityType[] {
  const labels = new Set(
    activityTypes.map((activityType) => activityType.label.trim().toLocaleLowerCase('en-US'))
  );

  return fallbackTypes
    .filter((activityType) => !labels.has(activityType.label.trim().toLocaleLowerCase('en-US')))
    .map((activityType) => ({
      _id: `default:${activityType.label.trim().toLocaleLowerCase('en-US')}`,
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
  /** Starter types for an organization with none. Defaults to the English set. */
  readonly fallbackTypes?: readonly FallbackActivityType[];
  /** Segnaposto che l'host usa per un tipo sparito. Default: quello inglese. */
  readonly missingTypeLabel?: string;
}): readonly AvailableActivityType[] {
  const activities = options.activities ?? [];
  const usedActivityTypeIds = collectUsedActivityTypeIds(activities);
  const mergedRealTypesMap = new Map<string, AvailableActivityType>();
  const archivedIds = new Set(options.archivedIds ?? []);

  addSourceActivityTypes(mergedRealTypesMap, options.serverTypes ?? [], archivedIds);
  addSourceActivityTypes(mergedRealTypesMap, options.localTypes ?? [], archivedIds);
  addActivityDerivedTypes(
    mergedRealTypesMap,
    activities,
    archivedIds,
    options.missingTypeLabel ?? MISSING_ACTIVITY_TYPE_LABEL
  );

  const mergedRealTypes = [...mergedRealTypesMap.values()];
  const fallbackTypes = buildFallbackTypes(
    mergedRealTypes,
    options.fallbackTypes ?? DEFAULT_ACTIVITY_TYPES
  );

  return [...mergedRealTypes, ...fallbackTypes].map((activityType) => ({
    ...activityType,
    isUsed: usedActivityTypeIds.has(activityType._id),
    canDelete: !activityType.isFallback && !usedActivityTypeIds.has(activityType._id),
  }));
}
