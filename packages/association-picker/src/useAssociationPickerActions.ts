import { useCallback } from 'react';
import { flushSync } from 'react-dom';

import type { AssociationEntityType } from './associationTypeMeta';
import type { AssociationPickerOption } from './types';

interface UseAssociationPickerActionsArgs {
  readonly filteredOptions: readonly AssociationPickerOption[];
  readonly highlightedOptionIndex: number;
  readonly maxSelections?: number;
  readonly onChange: (value: string[]) => void;
  readonly setCreatedOptions: (
    value: (current: AssociationPickerOption[]) => AssociationPickerOption[],
  ) => void;
  readonly setCreatingType: (value: AssociationEntityType | null) => void;
  readonly setHighlightedOptionIndex: (value: number | ((current: number) => number)) => void;
  readonly setIsCreateMenuOpen: (open: boolean) => void;
  readonly setIsOpen: (open: boolean) => void;
  readonly value: readonly string[];
}

export function useAssociationPickerActions(args: UseAssociationPickerActionsArgs): {
  readonly handleCreated: ({ option }: { option: AssociationPickerOption }) => void;
  readonly moveHighlightedOption: (direction: 'up' | 'down') => void;
  readonly openCreateFlow: (entityType: AssociationEntityType) => void;
  readonly selectHighlightedOption: () => void;
  readonly toggleValue: (value: string) => void;
} {
  const {
    filteredOptions,
    highlightedOptionIndex,
    maxSelections,
    onChange,
    setCreatedOptions,
    setCreatingType,
    setHighlightedOptionIndex,
    setIsCreateMenuOpen,
    setIsOpen,
    value,
  } = args;

  const toggleValue = useCallback(
    (nextValue: string): void => {
      if (value.includes(nextValue)) {
        onChange(value.filter((currentValue) => currentValue !== nextValue));
        return;
      }

      if (maxSelections === 1) {
        onChange([nextValue]);
        return;
      }

      onChange([...value, nextValue]);
    },
    [maxSelections, onChange, value],
  );

  const moveHighlightedOption = useCallback(
    (direction: 'up' | 'down'): void => {
      if (filteredOptions.length === 0) return;
      setHighlightedOptionIndex((current) =>
        direction === 'down'
          ? (current + 1) % filteredOptions.length
          : (current - 1 + filteredOptions.length) % filteredOptions.length,
      );
    },
    [filteredOptions.length, setHighlightedOptionIndex],
  );

  const selectHighlightedOption = useCallback((): void => {
    const highlighted = filteredOptions[highlightedOptionIndex];
    if (highlighted) toggleValue(highlighted.value);
  }, [filteredOptions, highlightedOptionIndex, toggleValue]);

  const openCreateFlow = useCallback(
    (entityType: AssociationEntityType): void => {
      setIsOpen(false);
      setCreatingType(entityType);
      setIsCreateMenuOpen(false);
    },
    [setCreatingType, setIsCreateMenuOpen, setIsOpen],
  );

  const handleCreated = useCallback(
    ({ option }: { option: AssociationPickerOption }): void => {
      // Commit the synthetic option before updating the external field value,
      // otherwise form-controlled rerenders can briefly see the new value without
      // a matching option and clean it up immediately.
      flushSync(() => {
        setCreatedOptions((current) => [
          ...current.filter((item) => item.value !== option.value),
          option,
        ]);
      });

      if (maxSelections === 1) {
        onChange([option.value]);
        return;
      }

      if (!value.includes(option.value)) {
        onChange([...value, option.value]);
      }
    },
    [maxSelections, onChange, setCreatedOptions, value],
  );

  return {
    handleCreated,
    moveHighlightedOption,
    openCreateFlow,
    selectHighlightedOption,
    toggleValue,
  };
}
