"use client";

import { GripVertical, Plus, Trash2 } from "lucide-react";
import type { ReactNode } from "react";

import { Button, cn } from "@carefully-built/ui";

export interface SettingsReorderableListProps<T> {
  readonly items: readonly T[];
  readonly addLabel?: string;
  readonly draggedIndex: number | null;
  readonly getKey: (item: T, index: number) => string;
  readonly canRemove?: (item: T, index: number) => boolean;
  readonly onAdd: () => void;
  readonly onDragStart: (index: number) => void;
  readonly onDragEnd: () => void;
  readonly onDrop: (index: number) => void;
  readonly onRemove: (index: number) => void;
  readonly renderItem: (item: T, index: number) => ReactNode;
  readonly renderPreview?: (item: T, index: number) => ReactNode;
}

export function SettingsReorderableList<T>({
  items,
  addLabel,
  draggedIndex,
  getKey,
  canRemove = () => true,
  onAdd,
  onDragStart,
  onDragEnd,
  onDrop,
  onRemove,
  renderItem,
  renderPreview,
}: SettingsReorderableListProps<T>): React.ReactElement {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end">
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <Plus className="size-4" />
          {addLabel ?? "Aggiungi"}
        </Button>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={getKey(item, index)}
            draggable
            onDragStart={() => onDragStart(index)}
            onDragEnd={onDragEnd}
            onDragOver={(event) => {
              event.preventDefault();
            }}
            onDrop={() => onDrop(index)}
            className={cn(
              "rounded-xl border border-border bg-background px-3 py-3 transition-colors",
              draggedIndex === index && "opacity-60",
              draggedIndex !== null &&
                draggedIndex !== index &&
                "hover:border-primary/40",
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className="mt-1 flex shrink-0 cursor-grab items-center justify-center rounded-md border border-border bg-muted/40 p-1.5 text-muted-foreground active:cursor-grabbing"
                aria-hidden="true"
              >
                <GripVertical className="size-4" />
              </div>
              <div className="min-w-0 flex-1">{renderItem(item, index)}</div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => onRemove(index)}
                disabled={!canRemove(item, index)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
            {renderPreview ? (
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                {renderPreview(item, index)}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
