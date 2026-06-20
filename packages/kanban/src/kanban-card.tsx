"use client";

import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

import { AssociationDisplayList } from "@carefully-built/notes";
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@carefully-built/ui";
import { getPlainTextFromRichText } from "@carefully-built/rich-text";

import {
  formatKanbanCurrencyDisplay,
  formatKanbanStatusLabel,
  getKanbanItemNotes,
  getKanbanStatusColor,
} from "./kanban-helpers";
import type { KanbanItem, KanbanStage } from "./types";

interface KanbanCardProps<TItem extends KanbanItem = KanbanItem> {
  readonly item: TItem;
  readonly onEdit?: (id: TItem["_id"]) => void;
  readonly onDelete?: (id: TItem["_id"]) => void;
  readonly onDragStart?: (item: TItem) => void;
  readonly onDragEnd?: () => void;
  readonly onMoveToStage?: (itemId: TItem["_id"], stageKey: string) => void | Promise<void>;
  readonly isDragging?: boolean;
  readonly mobileMoveStages?: readonly KanbanStage[];
  readonly showDragHandle?: boolean;
  readonly dragDataType?: string;
  readonly itemLabel?: string;
}

function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

function KanbanTooltipDetail({
  label,
  value,
}: {
  readonly label: string;
  readonly value: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="space-y-0.5">
      <p className="text-[10px] font-medium tracking-[0.08em] uppercase opacity-65">{label}</p>
      <div className="text-[11px] leading-relaxed opacity-90">{value}</div>
    </div>
  );
}

function KanbanDetailsTooltip({
  item,
  stage,
  formattedValue,
}: {
  readonly item: KanbanItem;
  readonly stage: KanbanStage | null;
  readonly formattedValue: string | null;
}): React.ReactElement {
  const notes = getPlainTextFromRichText(getKanbanItemNotes(item));
  const statusLabel = formatKanbanStatusLabel(item.status);
  const statusColor = getKanbanStatusColor(item.status);

  return (
    <div className="space-y-2 rounded-[12px] px-1 py-0.5">
      <div className="space-y-1">
        <p className="text-[12px] leading-tight font-semibold">{item.title}</p>
        {stage ? (
          <div className="flex items-center gap-1.5 text-[10px] opacity-90">
            <span className="size-2 rounded-full" style={{ backgroundColor: stage.color }} />
            <span>{stage.name}</span>
          </div>
        ) : null}
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <KanbanTooltipDetail
          label="Status"
          value={
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full" style={{ backgroundColor: statusColor }} />
              {statusLabel}
            </span>
          }
        />
        <KanbanTooltipDetail label="Value" value={formattedValue ?? "Not set"} />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <KanbanTooltipDetail
          label="Owner"
          value={item.assignedUserName ?? "Unassigned"}
        />
      </div>

      {item.associations.length > 0 ? (
        <KanbanTooltipDetail
          label="Associations"
          value={
            <AssociationDisplayList
              associations={item.associations}
              className="max-w-80 flex-nowrap overflow-hidden"
            />
          }
        />
      ) : (
        <KanbanTooltipDetail label="Associations" value="No association" />
      )}

      {notes ? <KanbanTooltipDetail label="Note" value={notes} /> : null}
    </div>
  );
}

function getStageCardStyle(stage: KanbanStage | null): React.CSSProperties | undefined {
  if (!stage) {
    return undefined;
  }

  return {
    background: `linear-gradient(135deg, ${stage.color}12 0%, ${stage.color}08 46%, var(--card) 100%)`,
    borderColor: `${stage.color}3D`,
  };
}

export function KanbanCard<TItem extends KanbanItem = KanbanItem>({
  item,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
  onMoveToStage,
  isDragging = false,
  mobileMoveStages = [],
  showDragHandle = true,
  dragDataType = "text/kanban-item-id",
  itemLabel = "elemento",
}: KanbanCardProps<TItem>): React.ReactElement {
  const [isMoveDrawerOpen, setIsMoveDrawerOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const mobileDragStartRef = useRef<{ x: number; y: number } | null>(null);
  const formattedValue = formatKanbanCurrencyDisplay(item.value);
  const hasAssociation = item.associations.length > 0;
  const canMoveOnMobile = mobileMoveStages.length > 0 && typeof onMoveToStage === "function";
  const currentStage = mobileMoveStages.find((stage) => stage.key === item.stageKey) ?? null;
  const stageCardStyle = getStageCardStyle(currentStage);

  function openMoveDrawer(): void {
    setIsMoveDrawerOpen(true);
  }

  function resetMobileDrag(): void {
    mobileDragStartRef.current = null;
  }

  function handleMobilePointerDown(event: React.PointerEvent<HTMLButtonElement>): void {
    if (event.pointerType === "mouse") {
      return;
    }

    mobileDragStartRef.current = { x: event.clientX, y: event.clientY };
  }

  function handleMobilePointerMove(event: React.PointerEvent<HTMLButtonElement>): void {
    const mobileDragStart = mobileDragStartRef.current;

    if (!mobileDragStart || event.pointerType === "mouse" || isMoveDrawerOpen) {
      return;
    }

    const distance = Math.hypot(event.clientX - mobileDragStart.x, event.clientY - mobileDragStart.y);

    if (distance < 10) {
      return;
    }

    openMoveDrawer();
    resetMobileDrag();
  }

  function handleDesktopDragStart(event: React.DragEvent<HTMLDivElement>): void {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData(dragDataType, String(item._id));

    if (cardRef.current) {
      const cardRect = cardRef.current.getBoundingClientRect();
      const dragImageX = event.clientX - cardRect.left;
      const dragImageY = event.clientY - cardRect.top;

      event.dataTransfer.setDragImage(cardRef.current, dragImageX, dragImageY);
    }

    onDragStart?.(item);
  }

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            ref={cardRef}
            className={cx(
              "bg-card text-card-foreground relative overflow-hidden rounded-xl border border-border shadow-sm transition-[opacity,box-shadow,border-color,background-color] hover:border-primary/30 hover:shadow-md",
              isDragging && "opacity-60",
            )}
            style={stageCardStyle}
          >
            {currentStage ? (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-1"
                style={{ backgroundColor: currentStage.color }}
              />
            ) : null}
            <div className="flex items-center justify-between gap-2 px-3 py-2.5">
              <div className="flex min-w-0 items-center gap-2">
                {showDragHandle ? (
                  <>
                    <div
                      draggable
                      onDragStart={handleDesktopDragStart}
                      onDragEnd={() => {
                        onDragEnd?.();
                      }}
                      className="hidden shrink-0 cursor-grab items-center justify-center self-center rounded-md border border-border bg-muted/40 p-1 text-muted-foreground active:cursor-grabbing sm:flex"
                      aria-label={`Sposta ${itemLabel}`}
                      title={`Sposta ${itemLabel}`}
                    >
                      <GripVertical className="size-3" />
                    </div>

                    {canMoveOnMobile ? (
                      <button
                        type="button"
                        className="flex shrink-0 items-center justify-center self-center rounded-md border border-border bg-muted/40 p-1 text-muted-foreground sm:hidden"
                        aria-label={`Sposta ${itemLabel}`}
                        title={`Sposta ${itemLabel}`}
                        onClick={openMoveDrawer}
                        onPointerDown={handleMobilePointerDown}
                        onPointerMove={handleMobilePointerMove}
                        onPointerUp={resetMobileDrag}
                        onPointerCancel={resetMobileDrag}
                      >
                        <GripVertical className="size-3" />
                      </button>
                    ) : null}
                  </>
                ) : null}
                <button
                  type="button"
                  onClick={() => onEdit?.(item._id)}
                  className="decoration-border truncate text-left text-sm font-medium text-foreground underline underline-offset-2"
                >
                  {item.title}
                </button>
              </div>

              {onEdit || onDelete ? (
                <div className="flex items-center gap-1">
                  {onEdit ? (
                    <Button type="button" variant="ghost" size="icon-xs" onClick={() => onEdit(item._id)}>
                      <Pencil className="size-3.5" />
                    </Button>
                  ) : null}
                  {onDelete ? (
                    <Button type="button" variant="ghost" size="icon-xs" onClick={() => onDelete(item._id)}>
                      <Trash2 className="size-3.5" />
                    </Button>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="flex items-center justify-between gap-3 px-2.5 pb-3">
              <div className="flex min-w-0 items-center gap-2 rounded-md px-1.5 py-0.5">
                {hasAssociation ? (
                  <AssociationDisplayList
                    associations={item.associations}
                    className="flex-nowrap overflow-hidden"
                  />
                ) : (
                  <span className="truncate text-[11px] text-muted-foreground">
                    No association
                  </span>
                )}
              </div>

              {formattedValue ? (
                <span className="text-foreground/80 shrink-0 text-[11px] font-medium">
                  {formattedValue}
                </span>
              ) : null}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          sideOffset={10}
          className="w-max max-w-[min(28rem,calc(100vw-1.5rem))] rounded-[12px] px-3 py-2 text-left"
        >
          <KanbanDetailsTooltip
            item={item}
            stage={currentStage}
            formattedValue={formattedValue}
          />
        </TooltipContent>
      </Tooltip>

      {canMoveOnMobile ? (
        <Drawer open={isMoveDrawerOpen} onOpenChange={setIsMoveDrawerOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Move to</DrawerTitle>
              <DrawerDescription>Select the new stage for this item.</DrawerDescription>
            </DrawerHeader>

            <div className="space-y-2 px-4 pb-4">
              {mobileMoveStages.map((stage) => {
                const isCurrentStage = item.stageKey === stage.key;

                return (
                  <Button
                    key={stage.key}
                    type="button"
                    variant={isCurrentStage ? "secondary" : "outline"}
                    className="w-full justify-between"
                    disabled={isCurrentStage}
                    onClick={() => {
                      void onMoveToStage?.(item._id, stage.key);
                      setIsMoveDrawerOpen(false);
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <span className="size-2 rounded-full" style={{ backgroundColor: stage.color }} />
                      {stage.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {isCurrentStage ? "Attuale" : "Sposta"}
                    </span>
                  </Button>
                );
              })}
            </div>
          </DrawerContent>
        </Drawer>
      ) : null}
    </>
  );
}
