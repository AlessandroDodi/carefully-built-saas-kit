import { defineKitTexts } from "../locale/kit-texts";

import type { KitLocale } from "../locale/kit-locale";

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

export const errorPageTexts = defineKitTexts({
  en: {
    notFoundTitle: "Page not found",
    notFoundDescription: "The page you are looking for does not exist or has been moved.",
    errorTitle: "An error occurred",
    errorDescription: "An unexpected error occurred. Please try again later.",
    homeLabel: "Back to home",
    retryLabel: "Try again",
  },
  it: {
    notFoundTitle: "Pagina non trovata",
    notFoundDescription: "La pagina cercata non esiste o è stata spostata.",
    errorTitle: "Si è verificato un errore",
    errorDescription: "Si è verificato un errore imprevisto. Riprova più tardi.",
    homeLabel: "Torna alla home",
    retryLabel: "Riprova",
  },
});

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
  locale: KitLocale = "en",
): ErrorPageContent {
  if (getErrorStatusCode(error) === NOT_FOUND_STATUS) {
    return getNotFoundPageContent(locale);
  }

  const texts = errorPageTexts[locale];
  return {
    code: options.fallbackCode ?? "500",
    title: options.fallbackTitle ?? texts.errorTitle,
    description: options.fallbackDescription ?? texts.errorDescription,
    shouldCapture: true,
  };
}

export function getNotFoundPageContent(locale: KitLocale = "en"): ErrorPageContent {
  const texts = errorPageTexts[locale];
  return {
    code: "404",
    title: texts.notFoundTitle,
    description: texts.notFoundDescription,
    shouldCapture: false,
  };
}
