import { getPlainTextFromRichText } from "@carefully-built/rich-text";
import { buildSearchText, rankBySearch } from "@carefully-built/search";

export type SupportedNoteAssociationEntityType =
  | "contact"
  | "property"
  | "request"
  | "opportunity"
  | "activity"
  | "note"
  | "document"
  | "file";

export interface NoteAssociation {
  readonly value: string;
  readonly entityId: string;
  readonly entityType: SupportedNoteAssociationEntityType;
  readonly label: string;
  readonly typeLabel: string;
  readonly imageUrl?: string;
}

export interface NoteListItem {
  readonly _id: string;
  readonly title: string;
  readonly body: string;
  readonly updatedAt: number;
  readonly visibility: "private" | "internal" | "team" | "public";
  readonly tagIds?: string[];
  readonly associations: NoteAssociation[];
}

export interface FilterNotesOptions {
  readonly search: string;
  readonly association: string;
  readonly tag: string;
}

export function normalizeAssociationEntityType(
  entityType: string,
): SupportedNoteAssociationEntityType | null {
  if (entityType === "file") {
    return "document";
  }

  if (
    entityType === "contact" ||
    entityType === "property" ||
    entityType === "request" ||
    entityType === "opportunity" ||
    entityType === "activity" ||
    entityType === "note" ||
    entityType === "document"
  ) {
    return entityType;
  }

  return null;
}

export function getNotePreview(body: string): string {
  return getPlainTextFromRichText(body);
}

export function filterNotes<TNote extends NoteListItem>(
  notes: TNote[],
  options: FilterNotesOptions,
): TNote[] {
  const scopedNotes = notes.filter((note) => {
    const matchesAssociation =
      options.association === "all" ||
      note.associations.some((association) => association.value === options.association);
    const matchesTag = options.tag === "all" || (note.tagIds ?? []).includes(options.tag);

    return matchesAssociation && matchesTag;
  });

  return rankBySearch(scopedNotes, options.search, (note) =>
    buildSearchText(
      note.title,
      getNotePreview(note.body),
      note.associations.map((association) => association.label),
    ),
  );
}
