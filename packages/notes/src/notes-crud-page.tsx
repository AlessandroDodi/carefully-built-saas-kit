'use client';

import { Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import {
  Button,
  Input,
  Label,
  ResponsiveSheet,
  SearchInput,
  Textarea,
  resolveCollectionEmptyState,
} from '@carefully-built/ui';

import { NotesGrid } from './notes-grid';
import { filterNotes, type NoteListItem } from './note-helpers';

export interface NoteCrudValues {
  readonly title: string;
  readonly body: string;
  readonly associations: readonly string[];
}

interface NotesCrudPageProps<TNote extends NoteListItem> {
  readonly isLoading?: boolean;
  readonly notes: readonly TNote[];
  readonly associationField?: (args: {
    readonly value: readonly string[];
    readonly onChange: (value: readonly string[]) => void;
  }) => React.ReactNode;
  readonly onCreate: (values: NoteCrudValues) => Promise<void> | void;
  readonly onDelete: (note: TNote) => Promise<void> | void;
  readonly onUpdate: (note: TNote, values: NoteCrudValues) => Promise<void> | void;
  readonly title?: string;
}

const emptyDraft: NoteCrudValues = {
  associations: [],
  body: '',
  title: '',
};

export function NotesCrudPage<TNote extends NoteListItem>({
  isLoading = false,
  notes,
  associationField,
  onCreate,
  onDelete,
  onUpdate,
  title = 'Notes',
}: NotesCrudPageProps<TNote>): React.ReactElement {
  const [draft, setDraft] = useState<NoteCrudValues>(emptyDraft);
  const [editingNote, setEditingNote] = useState<TNote | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const filteredNotes = useMemo(
    () => filterNotes([...notes], { association: 'all', search, tag: 'all' }),
    [notes, search],
  );
  const emptyState = resolveCollectionEmptyState({
    filteredCount: filteredNotes.length,
    hasSearch: search.trim().length > 0,
    totalCount: notes.length,
  });

  function openCreateSheet(): void {
    setDraft(emptyDraft);
    setEditingNote(null);
    setIsSheetOpen(true);
  }

  function openEditSheet(note: TNote): void {
    setDraft({
      associations: note.associations.map((association) => association.value),
      body: note.body,
      title: note.title,
    });
    setEditingNote(note);
    setIsSheetOpen(true);
  }

  async function submitNote(): Promise<void> {
    if (!draft.title.trim() || !draft.body.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingNote) {
        await onUpdate(editingNote, draft);
      } else {
        await onCreate(draft);
      }
      setIsSheetOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deleteNote(): Promise<void> {
    if (!editingNote) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onDelete(editingNote);
      setIsSheetOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h1 className="truncate text-xl font-semibold tracking-tight">{title}</h1>
        <Button size="sm" onClick={openCreateSheet}>
          <Plus className="size-4" />
          Add note
        </Button>
      </div>

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search notes..."
        className="max-w-sm"
      />

      <NotesGrid
        emptyState={emptyState}
        isLoading={isLoading}
        notes={filteredNotes}
        onCreate={openCreateSheet}
        onEdit={openEditSheet}
      />

      <ResponsiveSheet
        confirmDisabled={!draft.title.trim() || !draft.body.trim() || isSubmitting}
        confirmLabel={editingNote ? 'Save changes' : 'Add note'}
        confirmLoading={isSubmitting}
        footer={
          editingNote ? (
            <div className="flex w-full items-center justify-between gap-3">
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  void deleteNote();
                }}
              >
                <Trash2 className="size-4" />
                Delete
              </Button>
              <Button
                type="button"
                disabled={!draft.title.trim() || !draft.body.trim() || isSubmitting}
                onClick={() => {
                  void submitNote();
                }}
              >
                Save changes
              </Button>
            </div>
          ) : undefined
        }
        onCancel={() => setIsSheetOpen(false)}
        onConfirm={() => {
          void submitNote();
        }}
        onOpenChange={setIsSheetOpen}
        open={isSheetOpen}
        title={editingNote ? 'Edit note' : 'Add note'}
      >
        <div className="space-y-5 pb-4">
          <div className="space-y-2">
            <Label htmlFor="note-title">Title</Label>
            <Input
              id="note-title"
              value={draft.title}
              onChange={(event) => {
                setDraft((current) => ({ ...current, title: event.target.value }));
              }}
              placeholder="Note title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="note-body">Body</Label>
            <Textarea
              id="note-body"
              value={draft.body}
              onChange={(event) => {
                setDraft((current) => ({ ...current, body: event.target.value }));
              }}
              placeholder="Write the note..."
              className="min-h-40"
            />
          </div>
          {associationField?.({
            value: draft.associations,
            onChange: (associations) => {
              setDraft((current) => ({ ...current, associations }));
            },
          })}
        </div>
      </ResponsiveSheet>
    </div>
  );
}
