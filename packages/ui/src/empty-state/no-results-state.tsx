import { SearchX } from "lucide-react";
import type { ReactNode } from "react";

import { defineKitTexts, useKitTexts } from "../locale/kit-texts";
import { EmptyStateCard } from "./empty-state-card";

const noResultsTexts = defineKitTexts({
  en: { title: "No results", subtitle: "Try changing your search or filters." },
  it: { title: "Nessun risultato", subtitle: "Prova a cambiare la ricerca o i filtri." },
});

export interface NoResultsStateProps {
  readonly icon?: ReactNode;
  readonly title?: string;
  readonly subtitle?: string;
  readonly className?: string;
}

export function NoResultsState({
  icon = <SearchX className="size-7" />,
  title,
  subtitle,
  className,
}: NoResultsStateProps): React.ReactElement {
  const texts = useKitTexts(noResultsTexts, { title, subtitle });

  return (
    <EmptyStateCard icon={icon} title={texts.title} subtitle={texts.subtitle} className={className} />
  );
}
