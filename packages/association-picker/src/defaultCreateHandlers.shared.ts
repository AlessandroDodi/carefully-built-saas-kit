import { getAssociationTypeChipMeta, type AssociationEntityType } from './associationTypeMeta';
import type { AssociationPickerOption } from './types';

export function buildAssociationCreateOption(
  entityType: AssociationEntityType,
  entityId: string,
  label: string,
): AssociationPickerOption {
  return {
    value: `${entityType}:${entityId}`,
    entityId,
    entityType,
    label,
    typeLabel: getAssociationTypeChipMeta(entityType).label,
  };
}
