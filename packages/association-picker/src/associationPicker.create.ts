import { ORDERED_ASSOCIATION_ENTITY_TYPES } from './constants';
import {
  getAssociationTypeChipMeta,
  type AssociationEntityType,
} from './associationTypeMeta';
import type {
  AssociationFilterType,
  AssociationPickerCreateConfig,
} from './types';

export function getCreateableAssociationTypes(
  createConfig: AssociationPickerCreateConfig | undefined,
  excludedEntityTypes: ReadonlySet<string>,
  allowedEntityTypes: ReadonlySet<string> | null,
  activeType: AssociationFilterType,
): AssociationEntityType[] {
  if (!createConfig) {
    return [];
  }

  return ORDERED_ASSOCIATION_ENTITY_TYPES.filter((entityType) => {
    if (!createConfig.handlers[entityType]) return false;
    if (allowedEntityTypes && !allowedEntityTypes.has(entityType)) return false;
    if (excludedEntityTypes.has(entityType)) return false;
    if (createConfig.currentEntityType === entityType) return false;
    if (activeType !== 'all' && activeType !== entityType) return false;
    return true;
  });
}

export function getCreateButtonLabel(entityType: AssociationEntityType | null): string {
  if (!entityType) {
    return 'Create';
  }

  return `Create ${getAssociationTypeChipMeta(entityType).label.toLowerCase()}`;
}
