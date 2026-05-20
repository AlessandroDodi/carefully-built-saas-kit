import type { NoteAssociation } from "@carefully-built/notes";

export interface KanbanStage {
  readonly key: string;
  readonly name: string;
  readonly color: string;
}

export interface KanbanPipelineConfig {
  readonly key: string;
  readonly name: string;
  readonly color: string;
  readonly isDefault?: boolean;
  readonly stages: readonly KanbanStage[];
}

export type KanbanStatus = "open" | "won" | "lost" | "archived";

export interface KanbanItem<TId extends string = string> {
  readonly _id: TId;
  readonly title: string;
  readonly pipelineKey?: string;
  readonly stageKey?: string;
  readonly status?: KanbanStatus;
  readonly value?: number;
  readonly associations: readonly NoteAssociation[];
  readonly assignedUserName?: string;
  readonly notes?: string | null;
  readonly metadata?: Record<string, unknown> | null;
}

export interface KanbanColumn<TItem extends KanbanItem = KanbanItem> {
  readonly stage: KanbanStage;
  readonly items: readonly TItem[];
}
