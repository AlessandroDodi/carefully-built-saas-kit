import { cn } from '@carefully-built/ui';

import { AssociationPickerCreateSheet } from './AssociationPickerCreateSheet';
import { AssociationPickerPopover } from './AssociationPickerPopover';
import { AssociationPickerTrigger } from './AssociationPickerTrigger';
import { getCreateButtonLabel } from './associationPicker.create';
import type { AssociationEntityType } from './associationTypeMeta';
import type {
  AssociationFilterType,
  AssociationPickerCreateConfig,
  AssociationPickerLabels,
  AssociationPickerOption,
} from './types';

interface AssociationPickerViewProps {
  readonly activeType: AssociationFilterType;
  readonly availableTypeOptions: readonly { value: AssociationFilterType; label: string; icon?: React.ReactNode }[];
  readonly className?: string;
  readonly containerRef: React.MutableRefObject<HTMLDivElement | null>;
  readonly createConfig?: AssociationPickerCreateConfig;
  readonly createableTypes: readonly AssociationEntityType[];
  readonly creatingType: AssociationEntityType | null;
  readonly disabled: boolean;
  readonly emptyMessage: string;
  readonly filteredOptions: readonly AssociationPickerOption[];
  readonly handleCreated: ({ option }: { option: AssociationPickerOption }) => void;
  readonly highlightedOptionIndex: number;
  readonly isCreateMenuOpen: boolean;
  readonly isOpen: boolean;
  readonly labels: AssociationPickerLabels;
  readonly moveHighlightedOption: (direction: 'up' | 'down') => void;
  readonly onToggleOpen: () => void;
  readonly openCreateFlow: (entityType: AssociationEntityType) => void;
  readonly optionRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  readonly placeholder: string;
  readonly search: string;
  readonly searchInputRef: React.MutableRefObject<HTMLInputElement | null>;
  readonly searchPlaceholder: string;
  readonly selectedOptions: readonly AssociationPickerOption[];
  readonly selectHighlightedOption: () => void;
  readonly setActiveType: (value: AssociationFilterType) => void;
  readonly setCreatingType: (value: AssociationEntityType | null) => void;
  readonly setHighlightedOptionIndex: (value: number) => void;
  readonly setIsCreateMenuOpen: (open: boolean) => void;
  readonly setIsOpen: (open: boolean) => void;
  readonly setSearch: (value: string) => void;
  readonly singleCreateType: AssociationEntityType | null;
  readonly toggleValue: (value: string) => void;
  readonly value: readonly string[];
}

export function AssociationPickerView(props: AssociationPickerViewProps): React.ReactElement {
  const { activeType, availableTypeOptions, className, containerRef, createConfig, createableTypes, creatingType, disabled, emptyMessage, filteredOptions, handleCreated, highlightedOptionIndex, isCreateMenuOpen, isOpen, labels, moveHighlightedOption, onToggleOpen, openCreateFlow, optionRefs, placeholder, search, searchInputRef, searchPlaceholder, selectedOptions, selectHighlightedOption, setActiveType, setCreatingType, setHighlightedOptionIndex, setIsCreateMenuOpen, setIsOpen, setSearch, singleCreateType, toggleValue, value } = props;

  return (
    <div ref={containerRef} data-association-picker="true" data-association-picker-open={isOpen ? 'true' : 'false'} className={cn('relative', className)}>
      <AssociationPickerTrigger disabled={disabled} isOpen={isOpen} placeholder={placeholder} selectedOptions={selectedOptions} toggleValue={toggleValue} onToggleOpen={onToggleOpen} />
      {!isOpen ? null : <AssociationPickerPopover activeType={activeType} availableTypeOptions={availableTypeOptions} canCreate={createableTypes.length > 0} createButtonLabel={getCreateButtonLabel(singleCreateType, labels)} createableTypes={createableTypes} emptyMessage={emptyMessage} filteredOptions={filteredOptions} highlightedOptionIndex={highlightedOptionIndex} isCreateMenuOpen={isCreateMenuOpen} labels={labels} optionRefs={optionRefs} search={search} searchInputRef={searchInputRef} searchPlaceholder={searchPlaceholder} singleCreateType={singleCreateType} value={value} moveHighlightedOption={moveHighlightedOption} openCreateFlow={openCreateFlow} selectHighlightedOption={selectHighlightedOption} setActiveType={setActiveType} setHighlightedOptionIndex={setHighlightedOptionIndex} setIsCreateMenuOpen={setIsCreateMenuOpen} setIsOpen={setIsOpen} setSearch={setSearch} toggleValue={toggleValue} />}
      <AssociationPickerCreateSheet createConfig={createConfig} creatingType={creatingType} handleCreated={handleCreated} setCreatingType={setCreatingType} />
    </div>
  );
}
