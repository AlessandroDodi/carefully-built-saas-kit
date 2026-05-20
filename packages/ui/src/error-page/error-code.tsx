import { cn } from "../utils/cn";

export interface ErrorCodeProps {
  readonly code: string;
  readonly reference?: string | null;
  readonly className?: string;
}

export function ErrorCode({ code, reference, className }: ErrorCodeProps): React.ReactElement {
  return (
    <p className={cn("text-xs text-muted-foreground/55", className)}>
      Codice {code}
      {reference ? <span className="ml-2">Rif. {reference}</span> : null}
    </p>
  );
}
