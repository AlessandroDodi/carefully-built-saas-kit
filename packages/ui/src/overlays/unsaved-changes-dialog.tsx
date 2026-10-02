'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../primitives/dialog';
import { Button } from '../primitives/button';
import { resolveUnsavedChangesDialogCopy } from './unsaved-changes';

import type { UnsavedChangesDialogCopy } from './unsaved-changes';

export interface UnsavedChangesDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onDiscard: () => void;
  readonly copy?: Partial<UnsavedChangesDialogCopy>;
}

export function UnsavedChangesDialog({
  open,
  onOpenChange,
  onDiscard,
  copy,
}: UnsavedChangesDialogProps): React.ReactElement {
  const resolvedCopy = resolveUnsavedChangesDialogCopy(copy);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]" closeLabel={resolvedCopy.closeLabel}>
        <DialogHeader>
          <DialogTitle>{resolvedCopy.title}</DialogTitle>
          <DialogDescription>{resolvedCopy.description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" type="button" onClick={onDiscard}>
            {resolvedCopy.discardLabel}
          </Button>
          <Button
            type="button"
            onClick={() => {
              onOpenChange(false);
            }}
          >
            {resolvedCopy.stayLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
