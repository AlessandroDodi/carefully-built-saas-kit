import { useMemo, useRef, useState } from 'react';

import {
  normalizeAssociationEntityType,
  type AssociationEntityType,
} from './associationTypeMeta';
import type {
  AssociationFilterType,
  AssociationPickerOption,
} from './types';

export function useAssociationPickerState({
  allowedEntityTypes,
  excludedEntityTypes,
}: {
  readonly allowedEntityTypes?: readonly AssociationEntityType[];
  readonly excludedEntityTypes: readonly AssociationEntityType[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [creatingType, setCreatingType] = useState<AssociationEntityType | null>(null);
  const [createdOptions, setCreatedOptions] = useState<AssociationPickerOption[]>([]);
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState<AssociationFilterType>('all');
  const [highlightedOptionIndex, setHighlightedOptionIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const allowedEntityTypeSet = useMemo(
    () =>
      allowedEntityTypes && allowedEntityTypes.length > 0
        ? new Set(allowedEntityTypes.map((entityType) => normalizeAssociationEntityType(entityType)))
        : null,
    [allowedEntityTypes],
  );
  const excludedEntityTypeSet = useMemo(
    () => new Set(excludedEntityTypes.map((entityType) => normalizeAssociationEntityType(entityType))),
    [excludedEntityTypes],
  );

  return {
    activeType,
    allowedEntityTypeSet,
    containerRef,
    createdOptions,
    creatingType,
    excludedEntityTypeSet,
    highlightedOptionIndex,
    isCreateMenuOpen,
    isOpen,
    optionRefs,
    search,
    searchInputRef,
    setActiveType,
    setCreatedOptions,
    setCreatingType,
    setHighlightedOptionIndex,
    setIsCreateMenuOpen,
    setIsOpen,
    setSearch,
  };
}
