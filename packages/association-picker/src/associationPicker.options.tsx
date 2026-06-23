import { buildSearchText, rankBySearch } from '@carefully-built/search';

import { ORDERED_ASSOCIATION_ENTITY_TYPES } from './constants';
import {
  getAssociationTypeChipMeta,
  normalizeAssociationEntityType,
  type AssociationEntityType,
} from './associationTypeMeta';
import type {
  AssociationFilterType,
  AssociationPickerLabels,
  AssociationPickerLabelsInput,
  AssociationPickerOption,
} from './types';

export function getResolvedAssociationPickerLabels(
  labels: AssociationPickerLabelsInput = {},
): AssociationPickerLabels {
  return {
    allTypesLabel: labels.allTypesLabel ?? 'All',
    createLabel: labels.createLabel ?? 'Create',
    createEntityLabel:
      labels.createEntityLabel ?? ((entityTypeLabel: string) => `Create ${entityTypeLabel}`),
    entityTypeLabels: labels.entityTypeLabels ?? {},
  };
}

export function getAssociationEntityTypeLabel(
  entityType: AssociationEntityType,
  labels: AssociationPickerLabels,
): string {
  return labels.entityTypeLabels[entityType] ?? getAssociationTypeChipMeta(entityType).label;
}

export function mergeAssociationOptions(
  options: readonly AssociationPickerOption[],
  createdOptions: readonly AssociationPickerOption[],
): AssociationPickerOption[] {
  const optionsMap = new Map<string, AssociationPickerOption>();

  for (const option of options) optionsMap.set(option.value, option);
  for (const option of createdOptions) optionsMap.set(option.value, option);

  return [...optionsMap.values()];
}

export function getVisibleAssociationOptions(
  options: readonly AssociationPickerOption[],
  excludedEntityTypes: ReadonlySet<string>,
  allowedEntityTypes: ReadonlySet<string> | null,
): AssociationPickerOption[] {
  return options.filter(
    (option) => {
      const normalizedEntityType = normalizeAssociationEntityType(option.entityType);

      if (allowedEntityTypes && !allowedEntityTypes.has(normalizedEntityType)) {
        return false;
      }

      return !excludedEntityTypes.has(normalizedEntityType);
    },
  );
}

export function getAvailableTypeOptions(
  options: readonly AssociationPickerOption[],
  labels = getResolvedAssociationPickerLabels(),
) {
  const matchedTypes = ORDERED_ASSOCIATION_ENTITY_TYPES.filter((entityType) =>
    options.some(
      (option) => normalizeAssociationEntityType(option.entityType) === entityType,
    ),
  );

  if (matchedTypes.length <= 1) {
    return matchedTypes.map((entityType) => {
      const Icon = getAssociationTypeChipMeta(entityType).icon;
      return {
        value: entityType,
        label: getAssociationEntityTypeLabel(entityType, labels),
        icon: <Icon className="size-4" />,
      };
    });
  }

  return [
    { value: 'all' as const, label: labels.allTypesLabel },
    ...matchedTypes.map((entityType) => {
      const Icon = getAssociationTypeChipMeta(entityType).icon;
      return {
        value: entityType,
        label: getAssociationEntityTypeLabel(entityType, labels),
        icon: <Icon className="size-4" />,
      };
    }),
  ];
}

export function getFilteredAssociationOptions(
  options: readonly AssociationPickerOption[],
  activeType: AssociationFilterType,
  search: string,
): AssociationPickerOption[] {
  const typeScopedOptions = options.filter((option) => {
    const normalizedEntityType = normalizeAssociationEntityType(option.entityType);
    return activeType === 'all' || normalizedEntityType === activeType;
  });

  return rankBySearch(
    typeScopedOptions,
    search,
    (option) => buildSearchText(option.label, option.typeLabel),
  );
}
