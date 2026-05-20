import { useEffect, type RefObject } from 'react';

import type { AssociationFilterType } from './types';

interface UseAssociationPickerEffectsArgs {
  readonly activeType: AssociationFilterType;
  readonly availableTypeOptions: readonly { value: AssociationFilterType }[];
  readonly filteredOptionsLength: number;
  readonly highlightedOptionIndex: number;
  readonly isOpen: boolean;
  readonly optionRefs: RefObject<(HTMLButtonElement | null)[]>;
  readonly searchInputRef: RefObject<HTMLInputElement | null>;
  readonly setActiveType: (value: AssociationFilterType) => void;
  readonly setHighlightedOptionIndex: (value: number | ((current: number) => number)) => void;
  readonly setIsCreateMenuOpen: (open: boolean) => void;
  readonly setIsOpen: (open: boolean) => void;
  readonly setSearch: (value: string) => void;
}

export function useAssociationPickerEffects({
  activeType,
  availableTypeOptions,
  filteredOptionsLength,
  highlightedOptionIndex,
  isOpen,
  optionRefs,
  searchInputRef,
  setActiveType,
  setHighlightedOptionIndex,
  setIsCreateMenuOpen,
  setIsOpen,
  setSearch,
}: UseAssociationPickerEffectsArgs): void {
  useEffect(() => {
    const handleCloseAll = (): void => {
      setIsOpen(false);
    };
    window.addEventListener('association-picker:close-all', handleCloseAll);
    return () => {
      window.removeEventListener('association-picker:close-all', handleCloseAll);
    };
  }, [setIsOpen]);

  useEffect(() => {
    if (!isOpen) {
      setSearch('');
      setActiveType('all');
      setHighlightedOptionIndex(0);
      setIsCreateMenuOpen(false);
      return;
    }

    requestAnimationFrame(() => searchInputRef.current?.focus());
  }, [
    isOpen,
    searchInputRef,
    setActiveType,
    setHighlightedOptionIndex,
    setIsCreateMenuOpen,
    setSearch,
  ]);

  useEffect(() => {
    if (availableTypeOptions.length === 1 && activeType !== availableTypeOptions[0]?.value) {
      setActiveType(availableTypeOptions[0]?.value ?? 'all');
      return;
    }

    if (
      availableTypeOptions.length > 1 &&
      activeType !== 'all' &&
      !availableTypeOptions.some((option) => option.value === activeType)
    ) {
      setActiveType('all');
    }
  }, [activeType, availableTypeOptions, setActiveType]);

  useEffect(() => {
    optionRefs.current = optionRefs.current.slice(0, filteredOptionsLength);
    if (filteredOptionsLength === 0) {
      setHighlightedOptionIndex(0);
      return;
    }
    setHighlightedOptionIndex((current) => Math.min(current, filteredOptionsLength - 1));
  }, [filteredOptionsLength, optionRefs, setHighlightedOptionIndex]);

  useEffect(() => {
    if (!isOpen) return;
    optionRefs.current[highlightedOptionIndex]?.scrollIntoView({ block: 'nearest' });
  }, [highlightedOptionIndex, isOpen, optionRefs]);
}
