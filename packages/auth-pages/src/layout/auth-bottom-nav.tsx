import { cn } from "@carefully-built/ui";

interface AuthBottomNavProps {
  readonly text: string;
  readonly linkText: string;
  readonly linkPath: string;
  readonly className?: string;
  readonly linkClassName?: string;
}

export function AuthBottomNav({
  text,
  linkText,
  linkPath,
  className,
  linkClassName,
}: AuthBottomNavProps): React.ReactElement {
  return (
    <p className={cn("text-muted-foreground text-center text-sm", className)}>
      {text}{" "}
      <a
        className={cn("text-foreground underline-offset-4 hover:underline", linkClassName)}
        href={linkPath}
      >
        {linkText}
      </a>
    </p>
  );
}
