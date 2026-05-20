"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "../primitives/button";
import { cn } from "../utils/cn";
import { ErrorCode } from "./error-code";
import {
  getNotFoundPageContent,
  resolveErrorPageContent,
  type ErrorPageContent,
} from "./error-page-content";
import { captureErrorToPostHog, createErrorReference } from "./posthog-error-capture";

export interface SaasErrorPageProps {
  readonly error?: Error & { readonly digest?: string };
  readonly reset?: () => void;
  readonly homeHref?: string;
  readonly homeLabel?: string;
  readonly retryLabel?: string;
  readonly source?: string;
  readonly metadata?: Record<string, unknown>;
  readonly content?: Partial<ErrorPageContent>;
  readonly className?: string;
}

function resolveContent(
  error: SaasErrorPageProps["error"],
  content: SaasErrorPageProps["content"],
): ErrorPageContent {
  const resolvedContent = error ? resolveErrorPageContent(error) : getNotFoundPageContent();

  return {
    ...resolvedContent,
    ...content,
    shouldCapture: content?.shouldCapture ?? resolvedContent.shouldCapture,
  };
}

export function SaasErrorPage({
  error,
  reset,
  homeHref = "/",
  homeLabel = "Torna alla home",
  retryLabel = "Riprova",
  source,
  metadata,
  content,
  className,
}: SaasErrorPageProps): React.ReactElement {
  const resolvedContent = useMemo(() => resolveContent(error, content), [content, error]);
  const [reference] = useState(() => (error ? createErrorReference(error) : null));

  useEffect(() => {
    if (!error || !resolvedContent.shouldCapture || !reference) {
      return;
    }

    captureErrorToPostHog({
      error,
      code: resolvedContent.code,
      reference,
      source,
      metadata,
    });
  }, [error, metadata, reference, resolvedContent.code, resolvedContent.shouldCapture, source]);

  return (
    <main
      className={cn(
        "bg-background text-foreground flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center",
        className,
      )}
    >
      <div className="space-y-3">
        <p className="text-8xl font-semibold leading-none text-muted-foreground/25 sm:text-9xl">
          {resolvedContent.code}
        </p>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">{resolvedContent.title}</h1>
          <p className="mx-auto max-w-md text-sm text-muted-foreground">
            {resolvedContent.description}
          </p>
        </div>
      </div>

      <ErrorCode code={resolvedContent.code} reference={reference} />

      <div className="mt-2 flex flex-wrap justify-center gap-3">
        {reset ? (
          <Button type="button" variant="outline" onClick={reset}>
            {retryLabel}
          </Button>
        ) : null}
        <Button asChild>
          <a href={homeHref}>{homeLabel}</a>
        </Button>
      </div>
    </main>
  );
}

export interface SaasNotFoundPageProps
  extends Omit<SaasErrorPageProps, "error" | "reset" | "content"> {
  readonly title?: string;
  readonly description?: string;
}

export function SaasNotFoundPage({
  title,
  description,
  ...props
}: SaasNotFoundPageProps): React.ReactElement {
  return (
    <SaasErrorPage
      {...props}
      content={{
        code: "404",
        title: title ?? "Pagina non trovata",
        description:
          description ?? "La pagina che stai cercando non esiste oppure e stata spostata.",
        shouldCapture: false,
      }}
    />
  );
}
