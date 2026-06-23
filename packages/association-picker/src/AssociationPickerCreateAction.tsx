import { Plus } from 'lucide-react';

import { Button } from '@carefully-built/ui';
import { cn } from '@carefully-built/ui';

import { getAssociationTypeChipMeta, type AssociationEntityType } from './associationTypeMeta';
import { getAssociationEntityTypeLabel } from './associationPicker.options';
import type { AssociationPickerLabels } from './types';

interface AssociationPickerCreateActionProps {
  readonly className?: string;
  readonly createableTypes: readonly AssociationEntityType[];
  readonly isMenuOpen: boolean;
  readonly label: string;
  readonly labels: AssociationPickerLabels;
  readonly singleCreateType: AssociationEntityType | null;
  readonly setIsMenuOpen: (open: boolean) => void;
  readonly openCreateFlow: (entityType: AssociationEntityType) => void;
}

export function AssociationPickerCreateAction({
  className,
  createableTypes,
  isMenuOpen,
  label,
  labels,
  singleCreateType,
  setIsMenuOpen,
  openCreateFlow,
}: AssociationPickerCreateActionProps): React.ReactElement {
  if (singleCreateType) {
    return <AssociationCreateButton className={className} label={label} onClick={() => openCreateFlow(singleCreateType)} />;
  }

  return (
    <div className={cn('relative shrink-0', className)}>
      <AssociationCreateButton label={label} onClick={() => setIsMenuOpen(!isMenuOpen)} />
      {!isMenuOpen ? null : (
        <div className="bg-popover absolute right-0 top-[calc(100%+6px)] z-30 min-w-44 rounded-lg border p-1 shadow-lg">
          {createableTypes.map((entityType) => (
            <button
              key={entityType}
              type="button"
              className="hover:bg-accent hover:text-accent-foreground flex w-full items-center rounded-md px-2 py-1.5 text-left text-sm"
              onClick={() => openCreateFlow(entityType)}
            >
              {getAssociationEntityTypeLabel(entityType, labels)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function AssociationCreateButton({
  className,
  label,
  onClick,
}: {
  readonly className?: string;
  readonly label: string;
  readonly onClick: () => void;
}): React.ReactElement {
  return <Button type="button" variant="outline" size="sm" className={cn('shrink-0', className)} onClick={onClick}><Plus className="size-4" />{label}</Button>;
}
