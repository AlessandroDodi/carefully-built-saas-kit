'use client';

import Link from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, Link2, List, ListOrdered, Table2, Trash2, Unlink } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import type { LucideIcon } from 'lucide-react';

import { FormFieldLabel } from '@carefully-built/forms';
import { Button, cn } from '@carefully-built/ui';
import { AIActionButton } from './ai-action-button';
import {
  getPlainTextFromRichText,
  isRichTextDocument,
  parseRichTextContent,
  parseSerializedRichTextDocument,
  stringifyRichTextContent,
} from './rich-text-utils';

export interface RichTextEditorProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly label?: string;
  readonly labelIcon?: LucideIcon;
  readonly placeholder?: string;
  readonly disabled?: boolean;
  readonly error?: string;
  readonly className?: string;
  readonly improveText?: (serializedDocument: string) => Promise<string>;
  readonly onImproveError?: (error: unknown) => void;
  readonly improveLabel?: string;
  readonly improvingLabel?: string;
}

interface ToolbarButtonProps {
  readonly label: string;
  readonly active?: boolean;
  readonly disabled?: boolean;
  readonly onClick: () => void;
  readonly icon: React.ComponentType<{ className?: string }>;
}

function ToolbarButton({
  label,
  active = false,
  disabled = false,
  onClick,
  icon: Icon,
}: ToolbarButtonProps): React.ReactElement {
  return (
    <Button
      type="button"
      size="icon-sm"
      variant={active ? 'secondary' : 'outline'}
      disabled={disabled}
      onClick={onClick}
      title={label}
      aria-label={label}
    >
      <Icon />
    </Button>
  );
}

function promptForLink(currentUrl: string): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.prompt('Enter a link', currentUrl) ?? null;
}

export function RichTextEditor({
  value,
  onChange,
  label,
  labelIcon,
  placeholder = 'Write here...',
  disabled = false,
  error,
  className,
  improveText,
  onImproveError,
  improveLabel = 'Migliora',
  improvingLabel = 'Miglioro...',
}: RichTextEditorProps): React.ReactElement {
  const improveFlashTimeoutRef = useRef<number | null>(null);
  const [isImproving, setIsImproving] = useState(false);
  const [isImproveFlashActive, setIsImproveFlashActive] = useState(false);
  const plainTextValue = useMemo(() => getPlainTextFromRichText(value), [value]);
  const canImprove = Boolean(improveText) && plainTextValue.length > 0;
  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Table.configure({
        resizable: false,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: parseRichTextContent(value),
    editorProps: {
      attributes: {
        class: cn(
          'min-h-40 rounded-b-lg border border-t-0 border-input bg-background px-3 py-2 text-sm outline-none',
          'prose prose-sm max-w-none [&_.selectedCell]:bg-muted [&_a]:text-primary [&_a]:underline',
          '[&_p.is-editor-empty:first-child::before]:pointer-events-none [&_p.is-editor-empty:first-child::before]:float-left [&_p.is-editor-empty:first-child::before]:h-0 [&_p.is-editor-empty:first-child::before]:text-muted-foreground [&_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]',
          '[&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-border [&_td]:p-2 [&_th]:border [&_th]:border-border [&_th]:bg-muted [&_th]:p-2'
        ),
        'data-placeholder': placeholder,
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(stringifyRichTextContent(currentEditor.getJSON()));
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    editor.setEditable(!disabled);
  }, [disabled, editor]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const nextContent = parseRichTextContent(value);
    const currentContent = editor.getJSON();

    if (JSON.stringify(currentContent) !== JSON.stringify(nextContent)) {
      editor.commands.setContent(nextContent, { emitUpdate: false });
    }
  }, [editor, value]);

  useEffect(() => {
    return () => {
      if (improveFlashTimeoutRef.current !== null) {
        window.clearTimeout(improveFlashTimeoutRef.current);
      }
    };
  }, []);

  function setLink(): void {
    if (!editor) {
      return;
    }

    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const nextUrl = promptForLink(previousUrl ?? '');

    if (nextUrl === null) {
      return;
    }

    if (!nextUrl.trim()) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: nextUrl }).run();
  }

  async function handleImproveText(): Promise<void> {
    if (disabled || isImproving || !improveText || !canImprove || !editor) {
      return;
    }

    setIsImproving(true);

    try {
      const currentDocument = editor.getJSON();

      if (!isRichTextDocument(currentDocument)) {
        throw new Error('Invalid rich text document.');
      }

      const improvedDocumentJson = await improveText(stringifyRichTextContent(currentDocument));

      const improvedDocument = parseSerializedRichTextDocument(improvedDocumentJson);

      if (!improvedDocument) {
        throw new Error('OpenAI non ha restituito un documento rich text valido.');
      }

      editor.commands.setContent(improvedDocument);

      if (improveFlashTimeoutRef.current !== null) {
        window.clearTimeout(improveFlashTimeoutRef.current);
      }

      setIsImproveFlashActive(true);
      improveFlashTimeoutRef.current = window.setTimeout(() => {
        setIsImproveFlashActive(false);
        improveFlashTimeoutRef.current = null;
      }, 1000);
    } catch (error) {
      console.error('Failed to improve text:', error);
      onImproveError?.(error);
    } finally {
      setIsImproving(false);
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      {label ? (
        <FormFieldLabel label={label} icon={labelIcon} hasError={Boolean(error)} />
      ) : null}
      <div
        className={cn(
          'overflow-hidden rounded-lg border border-transparent',
          isImproveFlashActive
            ? 'opportunity-value-prefill-animated rounded-lg bg-[linear-gradient(rgb(255,255,255),rgb(255,255,255))_padding-box,conic-gradient(from_var(--opportunity-border-angle),rgb(100_116_139_/_0.18)_52%,#14b8a6_62%,#8b5cf6_74%,#ec4899_86%,#facc15_96%,rgb(100_116_139_/_0.22))_border-box] shadow-[0_0_0_3px_rgba(168,85,247,0.14)] dark:bg-[linear-gradient(rgb(24,24,27),rgb(24,24,27))_padding-box,conic-gradient(from_var(--opportunity-border-angle),rgb(148_163_184_/_0.16)_52%,#14b8a6_62%,#8b5cf6_74%,#ec4899_86%,#facc15_96%,rgb(148_163_184_/_0.2))_border-box]'
            : undefined
        )}
      >
        <div className={cn('overflow-hidden rounded-lg bg-background')}>
        <div
          className={cn(
            'flex flex-wrap items-center gap-2 rounded-t-lg border border-input bg-muted/40 px-2 py-2',
            error ? 'border-destructive' : '',
            isImproveFlashActive ? 'border-transparent' : ''
          )}
        >
          <ToolbarButton
            label="Grassetto"
            icon={Bold}
            active={editor?.isActive('bold')}
            disabled={disabled || !editor?.can().chain().focus().toggleBold().run()}
            onClick={() => {
              editor?.chain().focus().toggleBold().run();
            }}
          />
          <ToolbarButton
            label="Corsivo"
            icon={Italic}
            active={editor?.isActive('italic')}
            disabled={disabled || !editor?.can().chain().focus().toggleItalic().run()}
            onClick={() => {
              editor?.chain().focus().toggleItalic().run();
            }}
          />
          <ToolbarButton
            label="Link"
            icon={Link2}
            active={editor?.isActive('link')}
            disabled={disabled || !editor}
            onClick={setLink}
          />
          <ToolbarButton
            label="Rimuovi link"
            icon={Unlink}
            disabled={disabled || !editor?.isActive('link')}
            onClick={() => {
              editor?.chain().focus().unsetLink().run();
            }}
          />
          <ToolbarButton
            label="Elenco puntato"
            icon={List}
            active={editor?.isActive('bulletList')}
            disabled={disabled || !editor?.can().chain().focus().toggleBulletList().run()}
            onClick={() => {
              editor?.chain().focus().toggleBulletList().run();
            }}
          />
          <ToolbarButton
            label="Elenco numerato"
            icon={ListOrdered}
            active={editor?.isActive('orderedList')}
            disabled={disabled || !editor?.can().chain().focus().toggleOrderedList().run()}
            onClick={() => {
              editor?.chain().focus().toggleOrderedList().run();
            }}
          />
          <ToolbarButton
            label="Tabella"
            icon={Table2}
            active={editor?.isActive('table')}
            disabled={disabled || !editor}
            onClick={() => {
              if (editor?.isActive('table')) {
                editor.chain().focus().addColumnAfter().run();
                return;
              }

              editor
                ?.chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run();
            }}
          />
          {editor?.isActive('table') ? (
            <>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={disabled}
                onClick={() => {
                  editor.chain().focus().addRowAfter().run();
                }}
              >
                Riga
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={disabled}
                onClick={() => {
                  editor.chain().focus().addColumnAfter().run();
                }}
              >
                Colonna
              </Button>
              <Button
                type="button"
                size="icon-sm"
                variant="outline"
                disabled={disabled}
                onClick={() => {
                  editor.chain().focus().deleteTable().run();
                }}
                title="Delete table"
                aria-label="Delete table"
              >
                <Trash2 />
              </Button>
            </>
          ) : null}
          {improveText ? (
            <AIActionButton
              compact
              className="ml-auto"
              aria-label={improveLabel}
              disabled={disabled || isImproving || !canImprove}
              onClick={() => {
                void handleImproveText();
              }}
            >
              {isImproving ? improvingLabel : improveLabel}
            </AIActionButton>
          ) : null}
        </div>
        <EditorContent
          editor={editor}
          className={cn(
            '[&_.ProseMirror]:rounded-b-lg',
            error ? '[&_.ProseMirror]:border-destructive' : '',
            isImproveFlashActive
              ? '[&_.ProseMirror]:!border-transparent [&_.ProseMirror]:text-violet-700 [&_.ProseMirror]:[text-shadow:0_0_10px_rgba(139,92,246,0.18)] dark:[&_.ProseMirror]:text-violet-200 dark:[&_.ProseMirror]:[text-shadow:0_0_12px_rgba(168,85,247,0.28)]'
              : undefined
          )}
        />
        </div>
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
