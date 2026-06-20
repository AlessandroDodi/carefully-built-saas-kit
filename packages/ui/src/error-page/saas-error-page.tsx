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
  readonly classes?: SaasErrorPageClassNames;
}

export interface SaasErrorPageClassNames {
  readonly root?: string;
  readonly content?: string;
  readonly code?: string;
  readonly text?: string;
  readonly title?: string;
  readonly description?: string;
  readonly actions?: string;
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
  classes,
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
        classes?.root,
      )}
    >
      <div className={cn("space-y-3", classes?.content)}>
        <p
          className={cn(
            "text-8xl font-semibold leading-none text-muted-foreground/25 sm:text-9xl",
            classes?.code,
          )}
        >
          {resolvedContent.code}
        </p>
        <div className={cn("space-y-2", classes?.text)}>
          <h1 className={cn("text-2xl font-semibold tracking-tight", classes?.title)}>
            {resolvedContent.title}
          </h1>
          <p className={cn("mx-auto max-w-md text-sm text-muted-foreground", classes?.description)}>
            {resolvedContent.description}
          </p>
        </div>
      </div>

      <ErrorCode code={resolvedContent.code} reference={reference} />

      <div className={cn("mt-2 flex flex-wrap justify-center gap-3", classes?.actions)}>
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
        title: title ?? "Page not found",
        description:
          description ?? "The page you are looking for does not exist or has been moved.",
        shouldCapture: false,
      }}
    />
  );
}
