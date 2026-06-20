"use client";

import { Button } from "@carefully-built/ui";

interface NotesSheetFooterProps {
  readonly onArchive: () => void;
  readonly onCancel: () => void;
  readonly onConfirm: () => void;
}

export function NotesSheetFooter({
  onArchive,
  onCancel,
  onConfirm,
}: NotesSheetFooterProps): React.ReactElement {
  return (
    <div className="flex w-full items-center justify-between gap-3">
      <button
        type="button"
        onClick={onArchive}
        className="text-sm text-destructive hover:underline"
      >
        Archive note
      </button>
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={onConfirm}>
          Save changes
        </Button>
      </div>
    </div>
  );
}
