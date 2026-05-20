'use client';

import { useUrlStringFilters } from '@carefully-built/crud';
import { useResourceSheetState } from '@carefully-built/resource-kit';
import { parseAsString, useQueryState } from 'nuqs';
import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';

import {
  filterNotes,
  normalizeAssociationEntityType,
  type NoteAssociation,
  type NoteListItem,
} from './note-helpers';

export interface NoteAssociationOption extends NoteAssociation {}

export interface NoteFormValuesLike {
  readonly title: string;
  readonly body: string;
  readonly associations: readonly string[];
  readonly tagIds: readonly string[];
  readonly visibility: 'public' | 'private';
}

export interface EditableNote extends NoteListItem {
  readonly _id: string;
}

interface NoteRelationLike {
  readonly fromEntityType: string;
  readonly toEntityType: string;
  readonly toEntityId: string;
  readonly relationshipType: string;
  readonly archivedAt?: number;
}

interface UseNotesPageStateOptions {
  readonly notes: readonly NoteListItem[] | undefined;
  readonly associationOptions: readonly NoteAssociationOption[] | undefined;
  readonly editingNoteRelations: readonly NoteRelationLike[] | undefined;
  readonly organizationId: string | null | undefined;
  readonly currentUserId: string | null | undefined;
  readonly createNote: (data: NoteMutationData) => Promise<void>;
  readonly updateNote: (id: string, data: NoteMutationData) => Promise<void>;
  readonly archiveNote: (id: string) => Promise<void>;
}

interface NoteMutationData {
  readonly title: string;
  readonly body: string;
  readonly associations: readonly {
    readonly entityId: string;
    readonly entityType: NoteAssociationOption['entityType'];
  }[];
  readonly tagIds: readonly string[];
  readonly visibility: 'public' | 'private';
}

const NOTE_URL_FILTERS = [
  { key: 'search', param: 'q', defaultValue: '', clearValue: '' },
  { key: 'association' },
  { key: 'tag' },
] as const;

function mapAssociationValuesToPayload(
  selectedValues: readonly string[],
  options: readonly NoteAssociationOption[],
): NoteMutationData['associations'] {
  const optionMap = new Map(options.map((option) => [option.value, option]));

  return selectedValues.flatMap((value) => {
    const option = optionMap.get(value);
    return option ? [{ entityId: option.entityId, entityType: option.entityType }] : [];
  });
}

function normalizeEditableNotes(notes: readonly NoteListItem[] | undefined): EditableNote[] {
  return (notes ?? []).map((note) => ({
    ...note,
    _id: String(note._id),
    title: note.title ?? '',
    body: note.body ?? '',
  }));
}

function mapEntityRelationsToAssociations(
  relations: readonly NoteRelationLike[] | undefined,
  options: readonly NoteAssociationOption[],
): NoteAssociation[] {
  if (!relations) {
    return [];
  }

  const optionMap = new Map(options.map((option) => [option.value, option]));

  return relations.flatMap((relation) => {
    if (
      relation.fromEntityType !== 'note' ||
      relation.relationshipType !== 'attached_to' ||
      relation.archivedAt
    ) {
      return [];
    }

    const entityType = normalizeAssociationEntityType(relation.toEntityType);
    if (!entityType) {
      return [];
    }

    const value = `${entityType}:${relation.toEntityId}`;
    const option = optionMap.get(value);

    return option
      ? [{
          value,
          entityId: option.entityId,
          entityType: option.entityType,
          label: option.label,
          typeLabel: option.typeLabel,
        }]
      : [];
  });
}

export function useNotesPageState(options: UseNotesPageStateOptions) {
  const urlFilters = useUrlStringFilters(NOTE_URL_FILTERS);
  const { search, association: selectedAssociation, tag: selectedTag } = urlFilters.values;
  const [highlightedNoteId, setHighlightedNoteIdQuery] = useQueryState(
    'noteId',
    parseAsString.withDefault(''),
  );
  const normalizedNotes = useMemo(() => normalizeEditableNotes(options.notes), [options.notes]);
  const noteSheet = useResourceSheetState({
    items: normalizedNotes,
    getItemId: (note) => note._id,
  });
  const editingNote = noteSheet.editingItem;
  const isLoading =
    options.notes === undefined ||
    options.associationOptions === undefined ||
    options.currentUserId === undefined ||
    options.organizationId === null;
  const filteredNotes = useMemo(
    () =>
      filterNotes(normalizedNotes, {
        search,
        association: selectedAssociation,
        tag: selectedTag,
      }),
    [normalizedNotes, search, selectedAssociation, selectedTag],
  );
  const associationFilterOptions = useMemo(
    () => [...(options.associationOptions ?? [])],
    [options.associationOptions],
  );
  const resolvedEditingNote = useMemo(() => {
    if (!editingNote) {
      return null;
    }

    const fallbackAssociations = mapEntityRelationsToAssociations(
      options.editingNoteRelations,
      options.associationOptions ?? [],
    );

    return {
      ...editingNote,
      associations:
        editingNote.associations.length > 0 ? editingNote.associations : fallbackAssociations,
    };
  }, [editingNote, options.associationOptions, options.editingNoteRelations]);

  useEffect(() => {
    if (!highlightedNoteId || editingNote?._id === highlightedNoteId) {
      return;
    }

    const highlightedNote = normalizedNotes.find((note) => note._id === highlightedNoteId);
    if (highlightedNote) {
      noteSheet.openEdit(highlightedNote._id);
    }
  }, [editingNote?._id, highlightedNoteId, normalizedNotes, noteSheet.openEdit]);

  function closeSheet(): void {
    noteSheet.close();
    void setHighlightedNoteIdQuery(null);
  }

  function syncSheetOpen(open: boolean): void {
    noteSheet.syncOpen(open);
    if (!open) {
      void setHighlightedNoteIdQuery(null);
    }
  }

  function requireNoteContext(): void {
    if (!options.currentUserId) {
      throw new Error('Current user not found.');
    }
    if (!options.organizationId) {
      throw new Error('No organization selected.');
    }
  }

  async function submitNote(values: NoteFormValuesLike): Promise<void> {
    const associations = mapAssociationValuesToPayload(
      values.associations,
      options.associationOptions ?? [],
    );

    try {
      requireNoteContext();

      if (editingNote) {
        await options.updateNote(editingNote._id, {
          title: values.title,
          body: values.body,
          associations,
          tagIds: values.tagIds,
          visibility: values.visibility,
        });
        toast.success('Nota aggiornata');
      } else {
        await options.createNote({
          title: values.title,
          body: values.body,
          associations,
          tagIds: values.tagIds,
          visibility: values.visibility,
        });
        toast.success('Nota aggiunta');
      }

      noteSheet.close();
    } catch (error) {
      console.error(error);
      toast.error('Si e verificato un errore durante il salvataggio.');
    }
  }

  function archiveEditingNote(): void {
    if (!editingNote) {
      return;
    }

    const noteToArchive = editingNote;
    noteSheet.close();
    window.setTimeout(() => {
      toast.error(`Vuoi archiviare "${noteToArchive.title}"?`, {
        action: {
          label: 'Conferma',
          onClick: () => {
            void (async () => {
              try {
                requireNoteContext();
                await options.archiveNote(noteToArchive._id);
                toast.success('Nota archiviata');
              } catch (error) {
                console.error(error);
                toast.error('Impossibile archiviare la nota.');
              }
            })();
          },
        },
      });
    }, 150);
  }

  function getDraftFilterResultCount(draftValues: Record<string, string>): number | undefined {
    if (isLoading) {
      return undefined;
    }

    return filterNotes(normalizedNotes, {
      search,
      association: urlFilters.getDraftValues(draftValues).association,
      tag: urlFilters.getDraftValues(draftValues).tag,
    }).length;
  }

  return {
    associationOptions: options.associationOptions,
    associationFilterOptions,
    editingNote: resolvedEditingNote,
    filteredNotes,
    totalNotesCount: normalizedNotes.length,
    isLoading,
    isSheetOpen: noteSheet.isOpen,
    organizationId: options.organizationId ?? null,
    search,
    selectedAssociation,
    selectedTag,
    highlightedNoteId,
    clearFilters: urlFilters.clear,
    openCreateSheet: noteSheet.openCreate,
    openEditSheet: (note: EditableNote) => {
      noteSheet.openEdit(note._id);
    },
    closeSheet,
    setSearch: (value: string) => {
      urlFilters.setValue('search', value);
    },
    setSelectedAssociation: (value: string) => {
      urlFilters.setValue('association', value);
    },
    setSelectedTag: (value: string) => {
      urlFilters.setValue('tag', value);
    },
    getDraftFilterResultCount,
    submitNote,
    archiveEditingNote,
    syncSheetOpen,
  };
}
