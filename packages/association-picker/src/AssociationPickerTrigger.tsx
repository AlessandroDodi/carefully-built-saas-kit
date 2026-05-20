import { ChevronDown, X } from 'lucide-react';

import { Chip } from '@carefully-built/ui';
import { cn } from '@carefully-built/ui';

import { getAssociationTypeChipMeta } from './associationTypeMeta';
import type { AssociationPickerOption } from './types';

interface AssociationPickerTriggerProps {
  readonly disabled: boolean;
  readonly isOpen: boolean;
  readonly placeholder: string;
  readonly selectedOptions: readonly AssociationPickerOption[];
  readonly toggleValue: (value: string) => void;
  readonly onToggleOpen: () => void;
}

export function AssociationPickerTrigger({
  disabled,
  isOpen,
  placeholder,
  selectedOptions,
  toggleValue,
  onToggleOpen,
}: AssociationPickerTriggerProps): React.ReactElement {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onToggleOpen}
      className={cn(
        'border-input dark:bg-input/30 bg-transparent flex min-h-8 w-full items-center gap-2 rounded-lg border px-2.5 py-1 text-left text-sm transition-colors',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3 outline-none',
        'disabled:bg-input/50 dark:disabled:bg-input/80',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      <div className="min-w-0 flex-1">
        {selectedOptions.length === 0 ? <span className="text-muted-foreground">{placeholder}</span> : (
          <div className="flex flex-wrap gap-1.5">
            {selectedOptions.map((option) => (
              <Chip
                key={option.value}
                className="bg-muted text-foreground max-w-full"
                trailing={<AssociationPickerRemove value={option.value} toggleValue={toggleValue} />}
              >
                <span className="truncate">{option.label}</span>
                <span className="text-muted-foreground shrink-0">· {getAssociationTypeChipMeta(option.entityType).label}</span>
              </Chip>
            ))}
          </div>
        )}
      </div>
      <ChevronDown className={cn('text-muted-foreground size-4 shrink-0 transition-transform', isOpen && 'rotate-180')} />
    </button>
  );
}

function AssociationPickerRemove({
  value,
  toggleValue,
}: {
  readonly value: string;
  readonly toggleValue: (value: string) => void;
}): React.ReactElement {
  return (
    <span
      role="button"
      tabIndex={0}
      onClick={(event) => {
        event.stopPropagation();
        toggleValue(value);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          event.stopPropagation();
          toggleValue(value);
        }
      }}
      className="text-muted-foreground hover:text-foreground"
    >
      <X className="size-3" />
    </span>
  );
}
