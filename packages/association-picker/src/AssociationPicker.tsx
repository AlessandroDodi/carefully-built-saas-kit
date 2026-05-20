'use client';

import { AssociationPickerView } from './AssociationPickerView';
import { useAssociationPickerActions } from './useAssociationPickerActions';
import { useAssociationPickerEffects } from './useAssociationPickerEffects';
import { useAssociationPickerModel } from './useAssociationPickerModel';
import { useAssociationPickerOutsideClose } from './useAssociationPickerOutsideClose';
import { useAssociationPickerState } from './useAssociationPickerState';
import { useAssociationPickerValueCleanup } from './useAssociationPickerValueCleanup';

import type { AssociationPickerProps } from './types';

export function AssociationPicker({
  options,
  value,
  onChange,
  maxSelections,
  allowedEntityTypes,
  excludedEntityTypes = [],
  placeholder = 'Seleziona associazioni',
  searchPlaceholder = 'Cerca associazioni...',
  emptyMessage = 'Nessuna associazione trovata',
  disabled = false,
  className,
  createConfig,
}: AssociationPickerProps): React.ReactElement {
  const state = useAssociationPickerState({
    allowedEntityTypes,
    excludedEntityTypes,
  });
  const model = useAssociationPickerModel({
    activeType: state.activeType,
    allowedEntityTypeSet: state.allowedEntityTypeSet,
    createConfig,
    createdOptions: state.createdOptions,
    excludedEntityTypeSet: state.excludedEntityTypeSet,
    options,
    search: state.search,
    value,
  });

  useAssociationPickerOutsideClose(state.containerRef, state.isOpen, state.setIsOpen);
  useAssociationPickerEffects({
    activeType: state.activeType,
    availableTypeOptions: model.availableTypeOptions,
    filteredOptionsLength: model.filteredOptions.length,
    highlightedOptionIndex: state.highlightedOptionIndex,
    isOpen: state.isOpen,
    optionRefs: state.optionRefs,
    searchInputRef: state.searchInputRef,
    setActiveType: state.setActiveType,
    setHighlightedOptionIndex: state.setHighlightedOptionIndex,
    setIsCreateMenuOpen: state.setIsCreateMenuOpen,
    setIsOpen: state.setIsOpen,
    setSearch: state.setSearch,
  });
  useAssociationPickerValueCleanup(model.visibleOptions, value, onChange);

  const actions = useAssociationPickerActions({
    filteredOptions: model.filteredOptions,
    highlightedOptionIndex: state.highlightedOptionIndex,
    maxSelections,
    onChange,
    setCreatedOptions: state.setCreatedOptions,
    setCreatingType: state.setCreatingType,
    setHighlightedOptionIndex: state.setHighlightedOptionIndex,
    setIsCreateMenuOpen: state.setIsCreateMenuOpen,
    setIsOpen: state.setIsOpen,
    value,
  });
  return (
    <AssociationPickerView
      activeType={state.activeType}
      availableTypeOptions={model.availableTypeOptions}
      className={className}
      containerRef={state.containerRef}
      createConfig={createConfig}
      createableTypes={model.createableTypes}
      creatingType={state.creatingType}
      disabled={disabled}
      emptyMessage={emptyMessage}
      filteredOptions={model.filteredOptions}
      handleCreated={actions.handleCreated}
      highlightedOptionIndex={state.highlightedOptionIndex}
      isCreateMenuOpen={state.isCreateMenuOpen}
      isOpen={state.isOpen}
      moveHighlightedOption={actions.moveHighlightedOption}
      onToggleOpen={() => {
        state.setIsOpen(!state.isOpen);
      }}
      openCreateFlow={actions.openCreateFlow}
      optionRefs={state.optionRefs}
      placeholder={placeholder}
      search={state.search}
      searchInputRef={state.searchInputRef}
      searchPlaceholder={searchPlaceholder}
      selectedOptions={model.selectedOptions}
      selectHighlightedOption={actions.selectHighlightedOption}
      setActiveType={state.setActiveType}
      setCreatingType={state.setCreatingType}
      setHighlightedOptionIndex={state.setHighlightedOptionIndex}
      setIsCreateMenuOpen={state.setIsCreateMenuOpen}
      setIsOpen={state.setIsOpen}
      setSearch={state.setSearch}
      singleCreateType={model.singleCreateType}
      toggleValue={actions.toggleValue}
      value={value}
    />
  );
}
