'use client';

import { Clock3, Copy, Download, FileText, Link2, MoreVertical, Pencil, Trash2 } from 'lucide-react';

import { buildDocumentAssociationSummary } from './document-helpers';
import { formatFileSize, isPreviewable } from './file-utils';

import { Button } from '@carefully-built/ui';
import { Card, CardContent, CardFooter, CardTitle } from '@carefully-built/ui';
import { Chip } from '@carefully-built/ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@carefully-built/ui';

export interface DocumentCardAssociationItem {
  readonly icon?: React.ReactNode;
  readonly label: string;
  readonly value: string;
}

export interface DocumentCardItem<TId = string> {
  readonly _id: TId;
  readonly associationId?: string | null;
  readonly associationLabel?: string | null;
  readonly associationType?: string | null;
  readonly associations?: readonly DocumentCardAssociationItem[];
  readonly cardId?: string;
  readonly collectionFileCount?: number;
  readonly description?: string;
  readonly externalUrl?: string | null;
  readonly fileCount: number;
  readonly fileMimeType?: string | null;
  readonly fileName?: string | null;
  readonly fileSize?: number | null;
  readonly isPending?: boolean;
  readonly previewUrl?: string | null;
  readonly publicUploadUrl?: string | null;
  readonly sourceType: 'external_link' | string;
  readonly tagIds?: readonly unknown[];
  readonly title: string;
  readonly updatedAt?: number;
}

interface DocumentCardProps<TId = string, TDocument extends DocumentCardItem<TId> = DocumentCardItem<TId>> {
  readonly document: TDocument;
  readonly onDelete: (id: TId) => void;
  readonly onCopyLink: (url: string) => void;
  readonly onEdit: (document: TDocument) => void;
}

function DocumentPreview({
  document,
}: {
  readonly document: DocumentCardItem<unknown>;
}): React.ReactElement {
  if (document.sourceType === 'external_link' && document.fileCount === 0) {
    return (
      <div className="bg-muted flex size-full flex-col items-center justify-center gap-2 text-center">
        <Clock3 className="text-primary size-7" />
        <div className="space-y-1 px-6">
          <p className="text-sm font-medium">In attesa di caricamento</p>
          <p className="text-muted-foreground text-xs">
            Il documento apparira qui quando qualcuno usera il link pubblico.
          </p>
        </div>
      </div>
    );
  }

  if (
    document.previewUrl &&
    document.fileMimeType &&
    isPreviewable(document.fileMimeType) &&
    document.fileMimeType.startsWith('image/')
  ) {
    return (
      <img src={document.previewUrl} alt={document.title} className="size-full object-cover" />
    );
  }

  if (document.previewUrl && document.fileMimeType === 'application/pdf') {
    return (
      <iframe
        src={`${document.previewUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
        title={document.title}
        className="pointer-events-none size-full overflow-hidden"
      />
    );
  }

  return (
    <div className="flex size-full items-center justify-center">
      <FileText className="text-muted-foreground size-10" />
    </div>
  );
}

function formatDocumentDate(value: number | undefined): string {
  if (typeof value !== 'number') {
    return '';
  }

  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
}

function AssociationInlineList({
  associations,
}: {
  readonly associations: readonly DocumentCardAssociationItem[];
}): React.ReactElement {
  return (
    <div className="flex flex-1 flex-nowrap gap-1 overflow-hidden">
      {associations.slice(0, 2).map((association) => (
        <Chip key={association.value} className="bg-muted text-muted-foreground">
          {association.label}
        </Chip>
      ))}
      {associations.length > 2 ? (
        <Chip className="bg-muted text-muted-foreground">+{associations.length - 2}</Chip>
      ) : null}
    </div>
  );
}

export function DocumentCard<TId = string, TDocument extends DocumentCardItem<TId> = DocumentCardItem<TId>>({
  document,
  onDelete,
  onCopyLink,
  onEdit,
}: DocumentCardProps<TId, TDocument>): React.ReactElement {
  const associationSummary = buildDocumentAssociationSummary(document);
  const associations = document.associations ?? [];
  const collectionFileCount = document.collectionFileCount ?? document.fileCount;
  const showStackedPreview =
    document.sourceType === 'external_link' && collectionFileCount > 1;
  const publicUploadUrl =
    document.publicUploadUrl ??
    (document.sourceType === 'external_link' ? document.externalUrl : null);

  return (
    <Card
      size="sm"
      className="border-border/80 gap-0 cursor-pointer border py-0 shadow-none ring-0 transition-colors hover:bg-muted/30 data-[size=sm]:py-0"
      role="button"
      tabIndex={0}
      onClick={() => {
        onEdit(document);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onEdit(document);
        }
      }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {showStackedPreview ? (
          <>
            <div className="border-border/60 bg-background/80 absolute inset-4 translate-x-2 translate-y-2 rounded-md border" />
            <div className="border-border/70 bg-background/90 absolute inset-3 translate-x-1 translate-y-1 rounded-md border" />
          </>
        ) : null}
        <div
          className={
            showStackedPreview
              ? 'border-border/80 absolute inset-2 overflow-hidden rounded-md border bg-muted'
              : 'relative size-full overflow-hidden bg-muted'
          }
        >
          <DocumentPreview document={document} />
        </div>
      </div>

      <CardContent className="space-y-2 px-3 pt-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate text-sm font-medium" title={document.title}>
              {document.title}
            </CardTitle>
            <div className="flex min-w-0 items-center gap-2">
              <p className="text-muted-foreground min-w-0 truncate text-xs">
                {document.isPending
                  ? 'Link pubblico attivo'
                  : document.sourceType === 'external_link'
                    ? `${document.fileCount} ${document.fileCount === 1 ? 'file caricato' : 'file caricati'}`
                    : document.fileSize
                      ? formatFileSize(document.fileSize)
                      : 'Documento'}
              </p>
              {document.sourceType === 'external_link' ? (
                <Chip
                  size="compact"
                  className="border-border/70 bg-muted/60 text-muted-foreground border"
                  leading={<Link2 className="size-3" />}
                >
                  Link
                </Chip>
              ) : null}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={(event) => {
                  event.stopPropagation();
                }}
              >
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(document)}>
                <Pencil className="mr-2 size-4" />
                Modifica
              </DropdownMenuItem>
              {publicUploadUrl ? (
                <DropdownMenuItem onClick={() => onCopyLink(publicUploadUrl)}>
                  <Copy className="mr-2 size-4" />
                  Copia link
                </DropdownMenuItem>
              ) : null}
              {document.previewUrl ? (
                <DropdownMenuItem asChild>
                  <a
                    href={document.previewUrl}
                    download={document.fileName ?? document.title}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="mr-2 size-4" />
                    Scarica file
                  </a>
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(document._id)}
              >
                <Trash2 className="mr-2 size-4" />
                Elimina
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>

      <CardFooter className="bg-transparent px-3 py-2">
        <div className="flex w-full items-center justify-between gap-3 text-xs">
          {associations.length > 0 ? (
            <AssociationInlineList associations={associations} />
          ) : (
            <span className="text-muted-foreground truncate">{associationSummary}</span>
          )}
          <span className="text-muted-foreground shrink-0">{formatDocumentDate(document.updatedAt)}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
