import type { MutableRefObject, ReactNode } from 'react';

import { SegmentedToggle } from '@carefully-built/ui';

import { AssociationPickerOptionsList } from './AssociationPickerOptionsList';
import { AssociationPickerSearchRow } from './AssociationPickerSearchRow';
import type { AssociationEntityType } from './associationTypeMeta';
import type { AssociationFilterType, AssociationPickerLabels, AssociationPickerOption } from './types';

interface AssociationPickerPopoverProps {
  readonly activeType: AssociationFilterType;
  readonly availableTypeOptions: readonly { value: AssociationFilterType; label: string; icon?: ReactNode }[];
  readonly canCreate: boolean;
  readonly createButtonLabel: string;
  readonly createableTypes: readonly AssociationEntityType[];
  readonly emptyMessage: string;
  readonly filteredOptions: readonly AssociationPickerOption[];
  readonly highlightedOptionIndex: number;
  readonly isCreateMenuOpen: boolean;
  readonly labels: AssociationPickerLabels;
  readonly optionRefs: MutableRefObject<(HTMLButtonElement | null)[]>;
  readonly search: string;
  readonly searchInputRef: MutableRefObject<HTMLInputElement | null>;
  readonly searchPlaceholder: string;
  readonly singleCreateType: AssociationEntityType | null;
  readonly value: readonly string[];
  readonly moveHighlightedOption: (direction: 'up' | 'down') => void;
  readonly openCreateFlow: (entityType: AssociationEntityType) => void;
  readonly selectHighlightedOption: () => void;
  readonly setActiveType: (value: AssociationFilterType) => void;
  readonly setHighlightedOptionIndex: (value: number) => void;
  readonly setIsCreateMenuOpen: (open: boolean) => void;
  readonly setIsOpen: (open: boolean) => void;
  readonly setSearch: (value: string) => void;
  readonly toggleValue: (value: string) => void;
}

export function AssociationPickerPopover(props: AssociationPickerPopoverProps): React.ReactElement {
  const { activeType, availableTypeOptions, canCreate, createButtonLabel, createableTypes, emptyMessage, filteredOptions, highlightedOptionIndex, isCreateMenuOpen, labels, optionRefs, search, searchInputRef, searchPlaceholder, singleCreateType, value, moveHighlightedOption, openCreateFlow, selectHighlightedOption, setActiveType, setHighlightedOptionIndex, setIsCreateMenuOpen, setIsOpen, setSearch, toggleValue } = props;

  return (
    <div className="bg-popover text-popover-foreground absolute left-0 right-0 top-[calc(100%+8px)] z-20 rounded-xl border p-2 shadow-lg">
      <AssociationPickerSearchRow
        canCreate={canCreate}
        createButtonLabel={createButtonLabel}
        createableTypes={createableTypes}
        isCreateMenuOpen={isCreateMenuOpen}
        labels={labels}
        search={search}
        searchPlaceholder={searchPlaceholder}
        searchInputRef={searchInputRef}
        selectHighlightedOption={selectHighlightedOption}
        moveHighlightedOption={moveHighlightedOption}
        setHighlightedOptionIndex={setHighlightedOptionIndex}
        setIsCreateMenuOpen={setIsCreateMenuOpen}
        setIsOpen={setIsOpen}
        setSearch={setSearch}
        singleCreateType={singleCreateType}
        openCreateFlow={openCreateFlow}
      />
      {availableTypeOptions.length <= 1 ? null : <SegmentedToggle value={activeType} onChange={(nextValue) => { setActiveType(nextValue); setHighlightedOptionIndex(0); }} options={availableTypeOptions} className="mb-2" scrollable />}
      <div className="max-h-64 space-y-1 overflow-y-auto">
        <AssociationPickerOptionsList
          createableTypes={createableTypes}
          emptyMessage={emptyMessage}
          filteredOptions={filteredOptions}
          highlightedOptionIndex={highlightedOptionIndex}
          isCreateMenuOpen={isCreateMenuOpen}
          labels={labels}
          optionRefs={optionRefs}
          singleCreateType={singleCreateType}
          value={value}
          setIsCreateMenuOpen={setIsCreateMenuOpen}
          setHighlightedOptionIndex={setHighlightedOptionIndex}
          openCreateFlow={openCreateFlow}
          toggleValue={toggleValue}
        />
      </div>
    </div>
  );
}
