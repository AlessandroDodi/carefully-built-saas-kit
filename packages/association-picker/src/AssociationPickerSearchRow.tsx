import { Search } from 'lucide-react';
import type { KeyboardEvent, MutableRefObject } from 'react';

import { Input } from '@carefully-built/ui';
import type { AssociationEntityType } from './associationTypeMeta';
import { AssociationPickerCreateAction } from './AssociationPickerCreateAction';

interface AssociationPickerSearchRowProps {
  readonly canCreate: boolean;
  readonly createButtonLabel: string;
  readonly createableTypes: readonly AssociationEntityType[];
  readonly isCreateMenuOpen: boolean;
  readonly search: string;
  readonly searchPlaceholder: string;
  readonly searchInputRef: MutableRefObject<HTMLInputElement | null>;
  readonly selectHighlightedOption: () => void;
  readonly moveHighlightedOption: (direction: 'up' | 'down') => void;
  readonly setHighlightedOptionIndex: (value: number) => void;
  readonly setIsCreateMenuOpen: (open: boolean) => void;
  readonly setIsOpen: (open: boolean) => void;
  readonly setSearch: (value: string) => void;
  readonly singleCreateType: AssociationEntityType | null;
  readonly openCreateFlow: (entityType: AssociationEntityType) => void;
}

export function AssociationPickerSearchRow(props: AssociationPickerSearchRowProps): React.ReactElement {
  const {
    canCreate, createButtonLabel, createableTypes, isCreateMenuOpen, search, searchPlaceholder,
    searchInputRef, selectHighlightedOption, moveHighlightedOption, setHighlightedOptionIndex,
    setIsCreateMenuOpen, setIsOpen, setSearch, singleCreateType, openCreateFlow,
  } = props;

  return (
    <div className="mb-2 flex items-center gap-2">
      <div className="relative min-w-0 flex-1">
        <Search className="text-muted-foreground absolute left-2.5 top-1/2 size-4 -translate-y-1/2" />
        <Input
          ref={searchInputRef}
          value={search}
          onChange={(event) => { setSearch(event.target.value); setHighlightedOptionIndex(0); }}
          onKeyDown={(event) => handleSearchKeyDown(event, moveHighlightedOption, selectHighlightedOption, setIsOpen)}
          placeholder={searchPlaceholder}
          className="pl-9"
        />
      </div>
      {!canCreate ? null : (
        <AssociationPickerCreateAction
          createableTypes={createableTypes}
          isMenuOpen={isCreateMenuOpen}
          label={createButtonLabel}
          openCreateFlow={openCreateFlow}
          setIsMenuOpen={setIsCreateMenuOpen}
          singleCreateType={singleCreateType}
        />
      )}
    </div>
  );
}

function handleSearchKeyDown(
  event: KeyboardEvent<HTMLInputElement>,
  moveHighlightedOption: (direction: 'up' | 'down') => void,
  selectHighlightedOption: () => void,
  setIsOpen: (open: boolean) => void,
): void {
  if (event.key === 'Escape') return void (event.preventDefault(), event.stopPropagation(), setIsOpen(false));
  if (event.key === 'ArrowDown') return void (event.preventDefault(), moveHighlightedOption('down'));
  if (event.key === 'ArrowUp') return void (event.preventDefault(), moveHighlightedOption('up'));
  if (event.key === 'Enter') return void (event.preventDefault(), selectHighlightedOption());
}
