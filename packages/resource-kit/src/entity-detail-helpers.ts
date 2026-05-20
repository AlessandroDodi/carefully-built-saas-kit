import type {
  AssociationEntityType,
  AssociationPickerOption,
} from '@carefully-built/association-picker';

export type EntityDetailTab =
  | 'info'
  | 'properties'
  | 'requests'
  | 'notes'
  | 'documents'
  | 'opportunities'
  | 'agenda';
export type SupportedAssociationEntityType = 'contact' | 'property' | 'request';

export const ENTITY_DETAIL_TABS: readonly EntityDetailTab[] = [
  'info',
  'properties',
  'requests',
  'notes',
  'documents',
  'opportunities',
  'agenda',
];

export interface EntityAssociationRecord {
  readonly value: string;
  readonly entityId: string;
  readonly entityType: AssociationEntityType;
  readonly label: string;
  readonly typeLabel: string;
}

export interface EntityAssociationPayload {
  readonly entityId: string;
  readonly entityType: AssociationEntityType;
}

export interface EntityOpportunityListItem {
  readonly _id: string;
  readonly title: string;
  readonly pipelineKey?: string;
  readonly stageKey?: string;
  readonly value?: number;
  readonly notes?: string;
  readonly tagIds?: string[];
  readonly metadata?: Record<string, unknown>;
  readonly primaryAssociationLabel?: string;
  readonly associations: readonly EntityAssociationRecord[];
  readonly primaryPropertyId?: string;
}

export function resolveEntityDetailTab(value?: string | null): EntityDetailTab {
  if (value && ENTITY_DETAIL_TABS.includes(value as EntityDetailTab)) {
    return value as EntityDetailTab;
  }

  return 'info';
}

export function buildEntityAssociationValue(
  entityType: SupportedAssociationEntityType,
  entityId: string,
): string {
  return `${entityType}:${entityId}`;
}

export function createCurrentEntityAssociationRecord({
  entityType,
  entityId,
  label,
}: {
  readonly entityType: SupportedAssociationEntityType;
  readonly entityId: string;
  readonly label: string;
}): EntityAssociationRecord {
  return {
    value: buildEntityAssociationValue(entityType, entityId),
    entityId,
    entityType,
    label,
    typeLabel:
      entityType === 'contact'
        ? 'Contatto'
        : entityType === 'property'
          ? 'Proprietà'
          : 'Richiesta',
  };
}

export function normalizeAssociatedNotes<T extends {
  readonly _id: unknown;
  readonly title?: string | null;
  readonly body: string;
  readonly updatedAt: number;
  readonly visibility: string;
  readonly associations: readonly EntityAssociationRecord[];
}>(notes: readonly T[]): {
  readonly _id: string;
  readonly title: string;
  readonly body: string;
  readonly updatedAt: number;
  readonly visibility: T['visibility'];
  readonly associations: T['associations'];
}[] {
  return notes.map((note) => ({
    _id: String(note._id),
    title: note.title ?? '',
    body: note.body,
    updatedAt: note.updatedAt,
    visibility: note.visibility,
    associations: note.associations,
  }));
}

export function filterAssociatedCollection<
  T extends {
    readonly associations: readonly {
      readonly value: string;
    }[];
  },
>(items: readonly T[], entityType: SupportedAssociationEntityType, entityId: string): T[] {
  const entityAssociation = buildEntityAssociationValue(entityType, entityId);

  return items.filter((item) =>
    item.associations.some((association) => association.value === entityAssociation),
  );
}

export function filterAssociatedDocuments<T extends {
  readonly associations: readonly { readonly value: string }[];
}>(
  documents: readonly T[],
  entityType: SupportedAssociationEntityType,
  entityId: string,
): T[] {
  return filterAssociatedCollection(documents, entityType, entityId);
}

export function filterAssociatedProperties<T extends {
  readonly associations?: readonly { readonly value: string }[];
}>(
  properties: readonly T[],
  entityType: SupportedAssociationEntityType,
  entityId: string,
): (T & { readonly associations: readonly { readonly value: string }[] })[] {
  return filterAssociatedCollection(
    properties.filter(
      (
        property,
      ): property is T & {
        readonly associations: readonly { readonly value: string }[];
      } => Array.isArray(property.associations),
    ),
    entityType,
    entityId,
  );
}

export function filterAssociatedRequests<
  T extends {
    readonly formValues: {
      readonly primaryContactId?: string;
      readonly primaryPropertyId?: string;
    };
  },
>(requests: readonly T[], entityType: SupportedAssociationEntityType, entityId: string): T[] {
  const entityAssociation = buildEntityAssociationValue(entityType, entityId);

  return requests.filter((request) => {
    const matchesPrimaryEntity =
      (entityType === 'contact' && request.formValues.primaryContactId === entityId) ||
      (entityType === 'property' && request.formValues.primaryPropertyId === entityId);
    const matchesAssociation =
      request.formValues.primaryContactId === entityAssociation ||
      request.formValues.primaryPropertyId === entityAssociation;

    return matchesPrimaryEntity || matchesAssociation;
  });
}

export function filterAssociatedActivities<T extends {
  readonly associations: readonly { readonly value: string }[];
}>(
  activities: readonly T[],
  entityType: SupportedAssociationEntityType,
  entityId: string,
): T[] {
  return filterAssociatedCollection(activities, entityType, entityId);
}

export function filterAssociatedNotes<T extends {
  readonly associations: readonly { readonly value: string }[];
}>(notes: readonly T[], entityType: SupportedAssociationEntityType, entityId: string): T[] {
  return filterAssociatedCollection(notes, entityType, entityId);
}

export function filterAssociatedOpportunities<T extends EntityOpportunityListItem>(
  opportunities: readonly T[],
  entityType: SupportedAssociationEntityType,
  entityId: string,
  pipelineKey?: string | null,
): T[] {
  const entityAssociation = buildEntityAssociationValue(entityType, entityId);

  return opportunities.filter((opportunity) => {
    const matchesEntity =
      (entityType === 'property' && opportunity.primaryPropertyId === entityId) ||
      opportunity.associations.some((association) => association.value === entityAssociation);
    const matchesPipeline = pipelineKey ? opportunity.pipelineKey === pipelineKey : true;

    return matchesEntity && matchesPipeline;
  });
}

export function createEntityAssociationOption({
  entityType,
  entityId,
  label,
}: {
  readonly entityType: SupportedAssociationEntityType;
  readonly entityId: string;
  readonly label: string;
}): AssociationPickerOption {
  return createCurrentEntityAssociationRecord({ entityType, entityId, label });
}

export function buildEntityAssociationOptions(
  options: readonly AssociationPickerOption[] | undefined,
  currentEntity: {
    readonly entityType: SupportedAssociationEntityType;
    readonly entityId: string;
    readonly label: string;
  },
): AssociationPickerOption[] {
  return withCurrentEntityAssociationOption(
    options ?? [],
    createEntityAssociationOption(currentEntity),
  );
}

export function mapAssociationValuesToPayload(
  selectedValues: readonly string[],
  options: readonly AssociationPickerOption[],
): EntityAssociationPayload[] {
  const optionMap = new Map(options.map((option) => [option.value, option]));

  return selectedValues.flatMap((value) => {
    const option = optionMap.get(value);

    return option
      ? [
          {
            entityId: option.entityId,
            entityType: option.entityType,
          },
        ]
      : [];
  });
}

export function withCurrentEntityAssociationOption(
  options: readonly AssociationPickerOption[],
  currentOption: AssociationPickerOption,
): AssociationPickerOption[] {
  return options.some((option) => option.value === currentOption.value)
    ? [...options]
    : [currentOption, ...options];
}
