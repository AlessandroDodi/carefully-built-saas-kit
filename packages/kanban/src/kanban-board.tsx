"use client";

import { Plus } from "lucide-react";

import { Button } from "@carefully-built/ui";

import { formatKanbanCurrencyDisplay } from "./kanban-helpers";
import { KanbanCard } from "./kanban-card";
import { KanbanStageBadge } from "./kanban-stage-badge";
import type { KanbanColumn, KanbanItem } from "./types";

interface KanbanBoardProps<TItem extends KanbanItem = KanbanItem> {
  readonly columns: readonly KanbanColumn<TItem>[];
  readonly className?: string;
  readonly draggedItemId?: TItem["_id"] | null;
  readonly dragSourceStageKey?: string | null;
  readonly dropStageKey?: string | null;
  readonly onMoveItem?: (itemId: TItem["_id"], stageKey: string) => void | Promise<void>;
  readonly onDragStart?: (item: TItem) => void;
  readonly onDragEnd?: () => void;
  readonly onStageDragOver?: (stageKey: string) => void;
  readonly onStageDragLeave?: (stageKey: string) => void;
  readonly onStageDrop?: (stageKey: string) => void;
  readonly onEdit?: (id: TItem["_id"]) => void;
  readonly onDelete?: (id: TItem["_id"]) => void;
  readonly onCreateInStage?: (stageKey: string) => void;
  readonly showDragHandle?: boolean;
  readonly emptyColumnMessage?: string;
  readonly emptyColumnActionLabel?: string;
  readonly dropMessage?: string;
  readonly totalLabel?: string;
  readonly itemLabel?: string;
}

function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

function getItemValueTotal(items: readonly KanbanItem[]): number {
  return items.reduce((total, item) => {
    return typeof item.value === "number" && Number.isFinite(item.value)
      ? total + item.value
      : total;
  }, 0);
}

function formatStageTotal(items: readonly KanbanItem[]): string {
  return formatKanbanCurrencyDisplay(getItemValueTotal(items)) ?? "€ 0";
}

function getPipelineValueTotal(columns: readonly KanbanColumn[]): number {
  return columns.reduce((total, column) => total + getItemValueTotal(column.items), 0);
}

export function KanbanBoard<TItem extends KanbanItem = KanbanItem>({
  columns,
  className,
  draggedItemId = null,
  dragSourceStageKey = null,
  dropStageKey = null,
  onMoveItem,
  onDragStart,
  onDragEnd,
  onStageDragOver,
  onStageDragLeave,
  onStageDrop,
  onEdit,
  onDelete,
  onCreateInStage,
  showDragHandle = true,
  emptyColumnMessage = "Nessun elemento in questo step.",
  emptyColumnActionLabel = "Aggiungi",
  dropMessage = "Rilascia qui per spostare",
  totalLabel = "Totale pipeline",
  itemLabel = "elemento",
}: KanbanBoardProps<TItem>): React.ReactElement {
  const stages = columns.map((column) => column.stage);
  const pipelineTotal = getPipelineValueTotal(columns);

  return (
    <>
      <div className={cx("min-h-0 overflow-x-auto pb-2", className)}>
        <div className="flex min-h-full min-w-full gap-4">
          {columns.map((column) => (
            <section
              key={column.stage.key}
              className="flex min-h-0 w-[272px] min-w-[272px] flex-col gap-3"
            >
              <div className="flex items-center gap-2">
                <span
                  className="size-3 shrink-0 rounded-full"
                  style={{ backgroundColor: column.stage.color }}
                />
                <span className="text-foreground min-w-0 truncate text-sm font-semibold">
                  {column.stage.name}
                </span>
                <KanbanStageBadge
                  label={String(column.items.length)}
                  color={column.stage.color}
                  className="shrink-0 px-1.5 py-0 text-[11px]"
                />
                <span className="text-muted-foreground ml-auto shrink-0 text-[11px] font-medium">
                  {formatStageTotal(column.items)}
                </span>
              </div>

              <div
                className="min-h-0 flex-1 space-y-3 overflow-y-auto rounded-xl pr-1 transition-colors"
                onDragOver={(event) => {
                  if (!onStageDragOver || !draggedItemId) {
                    return;
                  }

                  event.preventDefault();
                  onStageDragOver(column.stage.key);
                }}
                onDragLeave={() => {
                  onStageDragLeave?.(column.stage.key);
                }}
                onDrop={(event) => {
                  if (!onStageDrop) {
                    return;
                  }

                  event.preventDefault();
                  onStageDrop(column.stage.key);
                }}
              >
                {column.items.map((item) => (
                  <KanbanCard
                    key={item._id}
                    item={item}
                    isDragging={draggedItemId === item._id}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    mobileMoveStages={stages}
                    onMoveToStage={onMoveItem}
                    showDragHandle={showDragHandle}
                    itemLabel={itemLabel}
                  />
                ))}
                {column.items.length === 0 ? (
                  <div
                    className={cx(
                      "text-muted-foreground flex h-20 flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-3 text-center text-xs leading-5 transition-colors",
                      dropStageKey === column.stage.key && dragSourceStageKey !== column.stage.key
                        ? "border-primary bg-primary/5"
                        : "border-border",
                    )}
                  >
                    <span>{emptyColumnMessage}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-6"
                      onClick={() => onCreateInStage?.(column.stage.key)}
                    >
                      <Plus className="size-3.5" />
                      {emptyColumnActionLabel}
                    </Button>
                  </div>
                ) : dropStageKey === column.stage.key && dragSourceStageKey !== column.stage.key ? (
                  <div className="border-primary bg-primary/5 text-primary flex h-20 items-center justify-center rounded-xl border border-dashed px-3 text-center text-xs leading-5">
                    {dropMessage}
                  </div>
                ) : null}
              </div>
            </section>
          ))}
        </div>
      </div>

      <div className="border-primary bg-primary text-primary-foreground fixed inset-x-4 bottom-[calc(env(safe-area-inset-bottom)+5.5rem+4px)] z-[45] rounded-md border px-3 py-1.5 shadow-lg md:right-6 md:bottom-6 md:left-auto md:w-auto md:rounded-lg md:py-2">
        <div className="flex items-center justify-between gap-3 md:justify-start">
          <span className="text-[11px] font-medium tracking-wide uppercase opacity-80">
            {totalLabel}
          </span>
          <span className="text-sm font-semibold">
            {formatKanbanCurrencyDisplay(pipelineTotal)}
          </span>
        </div>
      </div>
    </>
  );
}
