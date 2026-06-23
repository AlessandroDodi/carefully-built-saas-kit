"use client";

import { FileText, Plus } from "lucide-react";

import { EmptyStateCard, NoResultsState, type CollectionEmptyState } from "@carefully-built/ui";

import { NoteCard } from "./note-card";
import type { NoteAssociation, NoteListItem } from "./note-helpers";

interface NotesGridProps<TNote extends NoteListItem> {
  readonly emptyState: CollectionEmptyState;
  readonly isLoading: boolean;
  readonly notes: readonly TNote[];
  readonly onCreate: () => void;
  readonly onEdit: (note: TNote) => void;
  readonly getAssociationHref?: (association: NoteAssociation) => string | null;
  readonly labels?: NotesGridLabelsInput;
}

export interface NotesGridLabels {
  readonly noResultsTitle: string;
  readonly noResultsSubtitle: string;
  readonly emptyTitle: string;
  readonly emptySubtitle: string;
  readonly addNoteLabel: string;
}

export type NotesGridLabelsInput = Partial<NotesGridLabels>;

function resolveNotesGridLabels(labels: NotesGridLabelsInput = {}): NotesGridLabels {
  return {
    noResultsTitle: labels.noResultsTitle ?? "No notes found",
    noResultsSubtitle: labels.noResultsSubtitle ?? "Try changing your search or filters.",
    emptyTitle: labels.emptyTitle ?? "No notes yet",
    emptySubtitle: labels.emptySubtitle ?? "Add a note to start collecting useful context.",
    addNoteLabel: labels.addNoteLabel ?? "Add note",
  };
}

export function NotesGrid<TNote extends NoteListItem>({
  emptyState,
  isLoading,
  notes,
  onCreate,
  onEdit,
  getAssociationHref,
  labels,
}: NotesGridProps<TNote>): React.ReactElement {
  const resolvedLabels = resolveNotesGridLabels(labels);

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto px-px pb-1">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <NoteCard key={index} loading />
          ))}
        </div>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="w-full">
        {emptyState === "no-results" ? (
          <NoResultsState
            title={resolvedLabels.noResultsTitle}
            subtitle={resolvedLabels.noResultsSubtitle}
          />
        ) : (
          <EmptyStateCard
            icon={<FileText className="size-7" />}
            title={resolvedLabels.emptyTitle}
            subtitle={resolvedLabels.emptySubtitle}
            actionLabel={resolvedLabels.addNoteLabel}
            actionIcon={<Plus className="size-4" />}
            onAction={onCreate}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-px pb-1">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {notes.map((note) => (
          <NoteCard
            key={note._id}
            title={note.title}
            body={note.body}
            associations={note.associations}
            updatedAt={note.updatedAt}
            getAssociationHref={getAssociationHref}
            onClick={() => {
              onEdit(note);
            }}
          />
        ))}
      </div>
    </div>
  );
}
