import type { KanbanColumn, KanbanItem, KanbanPipelineConfig, KanbanStatus } from "./types";

export const KANBAN_STATUS_OPTIONS = [
  { value: "open", label: "Aperto", color: "#2563EB" },
  { value: "won", label: "Vinto", color: "#16A34A" },
  { value: "lost", label: "Perso", color: "#DC2626" },
] as const;

function trimTrailingZero(value: string): string {
  return value.endsWith(".0") ? value.slice(0, -2) : value;
}

export function formatKanbanCurrencyDisplay(value: number | undefined): string | null {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  if (Math.abs(value) >= 1_000_000) {
    return `€ ${trimTrailingZero((value / 1_000_000).toFixed(1)).toLowerCase()}m`;
  }

  if (Math.abs(value) >= 1_000) {
    return `€ ${trimTrailingZero((value / 1_000).toFixed(1)).toLowerCase()}k`;
  }

  return `€ ${trimTrailingZero(value.toFixed(0)).toLowerCase()}`;
}

export function formatKanbanStatusLabel(status: KanbanStatus | undefined): string {
  return KANBAN_STATUS_OPTIONS.find((option) => option.value === status)?.label ?? "Aperto";
}

export function getKanbanStatusColor(status: KanbanStatus | undefined): string {
  return KANBAN_STATUS_OPTIONS.find((option) => option.value === status)?.color ?? "#2563EB";
}

export function getKanbanItemNotes(item: {
  readonly notes?: string | null;
  readonly metadata?: Record<string, unknown> | null;
}): string {
  if (typeof item.notes === "string" && item.notes.length > 0) {
    return item.notes;
  }

  const legacyNotes = item.metadata?.legacyRichTextNotes;
  return typeof legacyNotes === "string" ? legacyNotes : "";
}

export function resolveKanbanSelection<TPipeline extends KanbanPipelineConfig>({
  pipelines,
  selectedPipelineKey,
}: {
  readonly pipelines: readonly TPipeline[];
  readonly selectedPipelineKey?: string | null;
}): {
  readonly selectedPipelineKey: string | null;
  readonly selectedPipeline: TPipeline | null;
} {
  if (pipelines.length === 0) {
    return {
      selectedPipelineKey: null,
      selectedPipeline: null,
    };
  }

  const selectedPipeline =
    pipelines.find((pipeline) => pipeline.key === selectedPipelineKey) ??
    pipelines.find((pipeline) => pipeline.isDefault) ??
    pipelines[0];

  return {
    selectedPipelineKey: selectedPipeline?.key ?? null,
    selectedPipeline: selectedPipeline ?? null,
  };
}

export function buildKanbanColumns<TItem extends KanbanItem>({
  items,
  pipeline,
}: {
  readonly items: readonly TItem[];
  readonly pipeline: KanbanPipelineConfig;
}): KanbanColumn<TItem>[] {
  return pipeline.stages.map((stage) => ({
    stage,
    items: items.filter((item) => item.pipelineKey === pipeline.key && item.stageKey === stage.key),
  }));
}
