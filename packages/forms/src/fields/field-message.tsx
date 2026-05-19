interface FieldMessageProps {
  readonly message?: string;
}

export function FieldMessage({ message }: FieldMessageProps): React.ReactElement | null {
  return message ? <p className="text-sm text-destructive">{message}</p> : null;
}
