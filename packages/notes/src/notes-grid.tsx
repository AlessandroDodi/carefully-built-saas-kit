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
}

export function NotesGrid<TNote extends NoteListItem>({
  emptyState,
  isLoading,
  notes,
  onCreate,
  onEdit,
  getAssociationHref,
}: NotesGridProps<TNote>): React.ReactElement {
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
            title="Nessuna nota trovata"
            subtitle="La ricerca non ha portato risultati."
          />
        ) : (
          <EmptyStateCard
            icon={<FileText className="size-7" />}
            title="Nessuna nota trovata"
            subtitle="Aggiungi una nota per iniziare a raccogliere informazioni utili."
            actionLabel="Aggiungi nota"
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
