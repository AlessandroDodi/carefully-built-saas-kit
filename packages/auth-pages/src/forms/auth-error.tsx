import { cn } from "@carefully-built/ui";

interface AuthErrorProps {
  readonly error?: string;
  readonly className?: string;
}

export function AuthError({
  error,
  className,
}: AuthErrorProps): React.ReactElement | null {
  if (!error) {
    return null;
  }

  return (
    <div className={cn("bg-destructive/15 text-destructive rounded-md p-3 text-sm", className)}>
      {error}
    </div>
  );
}
