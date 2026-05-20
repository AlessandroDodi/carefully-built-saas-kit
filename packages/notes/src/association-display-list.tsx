"use client";

import {
  CalendarDays,
  FileBadge2,
  FileText,
  House,
  MessageSquare,
  Target,
  UserRound,
} from "lucide-react";

import type { NoteAssociation, SupportedNoteAssociationEntityType } from "./note-helpers";

interface AssociationDisplayListProps {
  readonly associations: readonly NoteAssociation[];
  readonly emptyValue?: string;
  readonly className?: string;
  readonly getAssociationHref?: (association: NoteAssociation) => string | null;
}

const associationMeta: Record<
  SupportedNoteAssociationEntityType,
  { readonly className: string; readonly icon: React.ComponentType<{ className?: string }> }
> = {
  activity: { className: "bg-sky-100 text-sky-700", icon: CalendarDays },
  contact: { className: "bg-emerald-100 text-emerald-700", icon: UserRound },
  document: { className: "bg-amber-100 text-amber-700", icon: FileBadge2 },
  file: { className: "bg-amber-100 text-amber-700", icon: FileBadge2 },
  note: { className: "bg-violet-100 text-violet-700", icon: FileText },
  opportunity: { className: "bg-rose-100 text-rose-700", icon: Target },
  property: { className: "bg-indigo-100 text-indigo-700", icon: House },
  request: { className: "bg-teal-100 text-teal-700", icon: MessageSquare },
};

function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

function getDefaultAssociationHref(association: NoteAssociation): string | null {
  const entityId = encodeURIComponent(association.entityId);
  const entityType = association.entityType === "file" ? "document" : association.entityType;
  const hrefs: Partial<Record<SupportedNoteAssociationEntityType, string>> = {
    activity: `/dashboard/activities?activityId=${entityId}`,
    contact: `/dashboard/contacts/${entityId}`,
    document: `/dashboard/documents?documentId=${entityId}`,
    note: `/dashboard/notes?noteId=${entityId}`,
    opportunity: `/dashboard/opportunities?q=${encodeURIComponent(association.label)}`,
    property: `/dashboard/properties/${entityId}`,
    request: `/dashboard/requests/${entityId}`,
  };

  return hrefs[entityType] ?? null;
}

function AssociationMedia({
  association,
}: {
  readonly association: NoteAssociation;
}): React.ReactElement {
  const meta = associationMeta[association.entityType];
  const Icon = meta.icon;

  if (association.imageUrl) {
    return (
      <span
        className="size-3 shrink-0 rounded-full border border-border/60 bg-muted bg-cover bg-center"
        style={{ backgroundImage: `url("${association.imageUrl}")` }}
      />
    );
  }

  return (
    <span className={cx("flex size-3 shrink-0 items-center justify-center rounded-[3px]", meta.className)}>
      <Icon className="size-2" />
    </span>
  );
}

function AssociationChip({
  association,
  getAssociationHref,
}: {
  readonly association: NoteAssociation;
  readonly getAssociationHref?: (association: NoteAssociation) => string | null;
}): React.ReactElement {
  const href = getAssociationHref?.(association) ?? getDefaultAssociationHref(association);
  const content = (
    <>
      <AssociationMedia association={association} />
      <span className="min-w-0 truncate underline-offset-2 group-hover:underline">
        {association.label}
      </span>
    </>
  );
  const className =
    "group inline-flex h-5 max-w-full items-center gap-1 rounded-md border border-border bg-background px-1.5 text-xs font-medium leading-4 text-foreground transition-colors hover:border-primary/40 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  if (!href) {
    return (
      <span className={className} title={association.label}>
        {content}
      </span>
    );
  }

  return (
    <a
      href={href}
      className={className}
      title={association.label}
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      {content}
    </a>
  );
}

export function AssociationDisplayList({
  associations,
  emptyValue = "-",
  className,
  getAssociationHref,
}: AssociationDisplayListProps): React.ReactElement {
  if (associations.length === 0) {
    return <span className="text-muted-foreground">{emptyValue}</span>;
  }

  return (
    <div className={cx("flex min-w-0 flex-wrap gap-1", className)}>
      {associations.map((association) => (
        <AssociationChip
          key={association.value}
          association={association}
          getAssociationHref={getAssociationHref}
        />
      ))}
    </div>
  );
}
