import { SearchX } from "lucide-react";
import type { ReactNode } from "react";

import { EmptyStateCard } from "./empty-state-card";

export interface NoResultsStateProps {
  readonly icon?: ReactNode;
  readonly title?: string;
  readonly subtitle?: string;
  readonly className?: string;
}

export function NoResultsState({
  icon = <SearchX className="size-7" />,
  title = "Nessun risultato",
  subtitle = "La ricerca non ha portato risultati.",
  className,
}: NoResultsStateProps): React.ReactElement {
  return <EmptyStateCard icon={icon} title={title} subtitle={subtitle} className={className} />;
}
