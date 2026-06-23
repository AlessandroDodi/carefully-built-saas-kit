import { AssociationPickerCreateAction } from './AssociationPickerCreateAction';
import { getAssociationEntityTypeLabel } from './associationPicker.options';
import { getAssociationTypeChipMeta, type AssociationEntityType } from './associationTypeMeta';

import type { AssociationPickerOption } from './types';
import type { AssociationPickerLabels } from './types';
import type { RefObject } from 'react';

import { Chip } from '@carefully-built/ui';
import { Button } from '@carefully-built/ui';
import { cn } from '@carefully-built/ui';

interface AssociationPickerOptionsListProps {
  readonly emptyMessage: string;
  readonly filteredOptions: readonly AssociationPickerOption[];
  readonly highlightedOptionIndex: number;
  readonly isCreateMenuOpen: boolean;
  readonly labels: AssociationPickerLabels;
  readonly optionRefs: RefObject<(HTMLButtonElement | null)[]>;
  readonly createableTypes: readonly AssociationEntityType[];
  readonly singleCreateType: AssociationEntityType | null;
  readonly value: readonly string[];
  readonly setIsCreateMenuOpen: (open: boolean) => void;
  readonly setHighlightedOptionIndex: (value: number) => void;
  readonly openCreateFlow: (entityType: AssociationEntityType) => void;
  readonly toggleValue: (value: string) => void;
}

export function AssociationPickerOptionsList(props: AssociationPickerOptionsListProps): React.ReactElement {
  const {
    createableTypes, emptyMessage, filteredOptions, highlightedOptionIndex, isCreateMenuOpen, optionRefs,
    labels, singleCreateType, value, setHighlightedOptionIndex, setIsCreateMenuOpen, openCreateFlow, toggleValue,
  } = props;

  if (filteredOptions.length === 0) {
    return (
      <div className="px-2 py-4">
        <p className="text-muted-foreground text-sm">{emptyMessage}</p>
        {createableTypes.length === 0 ? null : (
          <AssociationPickerCreateAction
            className="mt-2"
            createableTypes={createableTypes}
            isMenuOpen={isCreateMenuOpen}
            label={singleCreateType ? labels.createEntityLabel(getAssociationEntityTypeLabel(singleCreateType, labels).toLowerCase()) : labels.createLabel}
            labels={labels}
            openCreateFlow={openCreateFlow}
            setIsMenuOpen={setIsCreateMenuOpen}
            singleCreateType={singleCreateType}
          />
        )}
      </div>
    );
  }

  return (
    <>
      {filteredOptions.map((option, index) => (
        <AssociationPickerOptionRow
          key={option.value}
          index={index}
          isHighlighted={highlightedOptionIndex === index}
          isSelected={value.includes(option.value)}
          option={option}
          optionRefs={optionRefs}
          setHighlightedOptionIndex={setHighlightedOptionIndex}
          toggleValue={toggleValue}
        />
      ))}
    </>
  );
}

function AssociationPickerOptionRow({
  index, isHighlighted, isSelected, option, optionRefs, setHighlightedOptionIndex, toggleValue,
}: {
  readonly index: number;
  readonly isHighlighted: boolean;
  readonly isSelected: boolean;
  readonly option: AssociationPickerOption;
  readonly optionRefs: RefObject<(HTMLButtonElement | null)[]>;
  readonly setHighlightedOptionIndex: (value: number) => void;
  readonly toggleValue: (value: string) => void;
}): React.ReactElement {
  const chipMeta = getAssociationTypeChipMeta(option.entityType);
  const ChipIcon = chipMeta.icon;

  return (
    <Button
      ref={(node) => {
        optionRefs.current[index] = node;
      }}
      type="button"
      variant="ghost"
      className={cn('h-auto w-full justify-start rounded-md px-2 py-1.5', (isSelected || isHighlighted) && 'bg-muted/60')}
      onMouseEnter={() => {
        setHighlightedOptionIndex(index);
      }}
      onClick={() => {
        toggleValue(option.value);
      }}
    >
      <div className="min-w-0 flex-1 overflow-hidden pr-2 text-left">
        <p title={option.label} className="text-foreground block w-full truncate text-left text-[13px] font-medium leading-[1.2]">
          {option.label}
        </p>
      </div>
      <Chip size="compact" className={chipMeta.className} leading={<ChipIcon className="size-2.5" />}>
        {option.typeLabel}
      </Chip>
    </Button>
  );
}
