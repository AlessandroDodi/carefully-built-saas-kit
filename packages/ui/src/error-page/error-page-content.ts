export type ErrorPageKind = "error" | "not-found";

export interface ErrorPageContent {
  readonly code: string;
  readonly title: string;
  readonly description: string;
  readonly shouldCapture: boolean;
}

export interface ResolveErrorPageContentOptions {
  readonly fallbackCode?: string;
  readonly fallbackTitle?: string;
  readonly fallbackDescription?: string;
}

const NOT_FOUND_STATUS = 404;

function getErrorText(error: unknown): string {
  if (error instanceof Error) {
    const digest = "digest" in error ? String(error.digest) : "";
    return `${error.message} ${digest}`;
  }

  if (typeof error === "object" && error !== null) {
    const record = error as { readonly message?: unknown; readonly digest?: unknown };
    const message = typeof record.message === "string" ? record.message : "";
    const digest = typeof record.digest === "string" ? record.digest : "";
    return `${message} ${digest}`;
  }

  return typeof error === "string" ? error : "";
}

function getErrorStatusCode(error: unknown): number | null {
  const text = getErrorText(error);
  const fallbackMatch = /NEXT_HTTP_ERROR_FALLBACK;(\d{3})/.exec(text);

  if (fallbackMatch) {
    return Number(fallbackMatch[1]);
  }

  const statusMatch = /\bstatus(?:Code)?[=:]\s*(\d{3})\b/i.exec(text);
  return statusMatch ? Number(statusMatch[1]) : null;
}

export function resolveErrorPageContent(
  error: unknown,
  options: ResolveErrorPageContentOptions = {},
): ErrorPageContent {
  if (getErrorStatusCode(error) === NOT_FOUND_STATUS) {
    return {
      code: "404",
      title: "Pagina non trovata",
      description: "La pagina che stai cercando non esiste oppure e stata spostata.",
      shouldCapture: false,
    };
  }

  return {
    code: options.fallbackCode ?? "500",
    title: options.fallbackTitle ?? "Si e verificato un errore",
    description:
      options.fallbackDescription ?? "Si e verificato un errore imprevisto. Riprova piu tardi.",
    shouldCapture: true,
  };
}

export function getNotFoundPageContent(): ErrorPageContent {
  return {
    code: "404",
    title: "Pagina non trovata",
    description: "La pagina che stai cercando non esiste oppure e stata spostata.",
    shouldCapture: false,
  };
}
