interface AuthBottomNavProps {
  readonly text: string;
  readonly linkText: string;
  readonly linkPath: string;
}

export function AuthBottomNav({
  text,
  linkText,
  linkPath,
}: AuthBottomNavProps): React.ReactElement {
  return (
    <p className="text-muted-foreground text-center text-sm">
      {text}{" "}
      <a
        className="text-foreground underline-offset-4 hover:underline"
        href={linkPath}
      >
        {linkText}
      </a>
    </p>
  );
}
