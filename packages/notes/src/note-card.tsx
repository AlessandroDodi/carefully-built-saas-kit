"use client";

import { Card, CardContent, CardFooter, CardTitle, DisplayDate, Skeleton } from "@carefully-built/ui";

import { AssociationDisplayList } from "./association-display-list";
import { getNotePreview, type NoteAssociation } from "./note-helpers";

interface NoteCardProps {
  readonly title?: string;
  readonly body?: string;
  readonly associations?: readonly NoteAssociation[];
  readonly updatedAt?: number;
  readonly onClick?: () => void;
  readonly className?: string;
  readonly loading?: boolean;
  readonly getAssociationHref?: (association: NoteAssociation) => string | null;
}

function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

export function NoteCard({
  title,
  body,
  associations,
  updatedAt,
  onClick,
  className,
  loading = false,
  getAssociationHref,
}: NoteCardProps): React.ReactElement {
  const preview = body ? getNotePreview(body) : "";

  return (
    <Card
      size="sm"
      className={cx(
        "border border-border/80 shadow-none ring-0 transition-colors",
        onClick && !loading ? "cursor-pointer hover:bg-muted/40" : "",
        className,
      )}
      onClick={loading ? undefined : onClick}
    >
      <CardContent className="space-y-2 px-3">
        {loading ? (
          <>
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </>
        ) : (
          <>
            <CardTitle className="truncate text-sm font-medium">{title}</CardTitle>
            <p className="text-muted-foreground line-clamp-2 min-h-10 text-sm">{preview}</p>
          </>
        )}
      </CardContent>
      <CardFooter className="bg-transparent px-3 py-2">
        {loading ? (
          <div className="flex w-full items-center justify-between gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-14" />
          </div>
        ) : (
          <div className="flex w-full items-center justify-between gap-3 text-xs">
            <AssociationDisplayList
              associations={associations ?? []}
              emptyValue="Nessuna associazione"
              className="flex-1 flex-nowrap overflow-hidden"
              getAssociationHref={getAssociationHref}
            />
            {updatedAt ? (
              <DisplayDate value={updatedAt} className="text-muted-foreground shrink-0" />
            ) : null}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
