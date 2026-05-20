import { useMemo } from 'react';

import { getCreateableAssociationTypes } from './associationPicker.create';
import {
  getAvailableTypeOptions,
  getFilteredAssociationOptions,
  getVisibleAssociationOptions,
  mergeAssociationOptions,
} from './associationPicker.options';
import type { AssociationEntityType } from './associationTypeMeta';
import type { AssociationPickerCreateConfig, AssociationPickerOption } from './types';

interface UseAssociationPickerModelArgs {
  readonly activeType: 'all' | AssociationEntityType;
  readonly allowedEntityTypeSet: ReadonlySet<string> | null;
  readonly createConfig?: AssociationPickerCreateConfig;
  readonly createdOptions: readonly AssociationPickerOption[];
  readonly excludedEntityTypeSet: ReadonlySet<string>;
  readonly options: readonly AssociationPickerOption[];
  readonly search: string;
  readonly value: readonly string[];
}

export function useAssociationPickerModel(args: UseAssociationPickerModelArgs) {
  const {
    activeType,
    allowedEntityTypeSet,
    createConfig,
    createdOptions,
    excludedEntityTypeSet,
    options,
    search,
    value,
  } = args;

  return useMemo(() => {
    const mergedOptions = mergeAssociationOptions(options, createdOptions);
    const visibleOptions = getVisibleAssociationOptions(
      mergedOptions,
      excludedEntityTypeSet,
      allowedEntityTypeSet,
    );
    const availableTypeOptions = getAvailableTypeOptions(visibleOptions);
    const filteredOptions = getFilteredAssociationOptions(visibleOptions, activeType, search);
    const createableTypes = getCreateableAssociationTypes(
      createConfig,
      excludedEntityTypeSet,
      allowedEntityTypeSet,
      activeType,
    );

    return {
      availableTypeOptions,
      createableTypes,
      filteredOptions,
      selectedOptions: visibleOptions.filter((option) => value.includes(option.value)),
      singleCreateType: createableTypes.length === 1 ? createableTypes[0] ?? null : null,
      visibleOptions,
    };
  }, [
    activeType,
    allowedEntityTypeSet,
    createConfig,
    createdOptions,
    excludedEntityTypeSet,
    options,
    search,
    value,
  ]);
}
