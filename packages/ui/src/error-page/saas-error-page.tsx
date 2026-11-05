"use client";

import { useEffect, useMemo, useState } from "react";

import { useKitLocale } from "../locale/kit-locale";
import { Button } from "../primitives/button";
import { cn } from "../utils/cn";
import { ErrorCode } from "./error-code";
import {
  errorPageTexts,
  getNotFoundPageContent,
  resolveErrorPageContent,
  type ErrorPageContent,
} from "./error-page-content";
import { captureErrorToPostHog, createErrorReference } from "./posthog-error-capture";

import type { KitLocale } from "../locale/kit-locale";

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
  locale: KitLocale,
): ErrorPageContent {
  const resolvedContent = error
    ? resolveErrorPageContent(error, {}, locale)
    : getNotFoundPageContent(locale);

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
  homeLabel,
  retryLabel,
  source,
  metadata,
  content,
  className,
  classes,
}: SaasErrorPageProps): React.ReactElement {
  const locale = useKitLocale();
  const resolvedContent = useMemo(
    () => resolveContent(error, content, locale),
    [content, error, locale],
  );
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
            {retryLabel ?? errorPageTexts[locale].retryLabel}
          </Button>
        ) : null}
        <Button asChild>
          <a href={homeHref}>{homeLabel ?? errorPageTexts[locale].homeLabel}</a>
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
  const notFound = getNotFoundPageContent(useKitLocale());

  return (
    <SaasErrorPage
      {...props}
      content={{
        ...notFound,
        title: title ?? notFound.title,
        description: description ?? notFound.description,
      }}
    />
  );
}
