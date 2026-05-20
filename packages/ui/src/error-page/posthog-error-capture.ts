export interface PostHogErrorCapturePayload {
  readonly error: unknown;
  readonly code: string;
  readonly reference: string;
  readonly source?: string;
  readonly metadata?: Record<string, unknown>;
}

interface PostHogClient {
  capture: (eventName: string, properties?: Record<string, unknown>) => void;
}

function getPostHogClient(): PostHogClient | null {
  if (typeof window === "undefined") {
    return null;
  }

  const client = (window as typeof window & { readonly posthog?: PostHogClient }).posthog;
  return typeof client?.capture === "function" ? client : null;
}

function normalizeError(error: unknown): {
  readonly name: string;
  readonly message: string;
  readonly stack?: string;
  readonly digest?: string;
} {
  if (error instanceof Error) {
    const digest = "digest" in error && typeof error.digest === "string" ? error.digest : undefined;

    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      digest,
    };
  }

  return {
    name: "UnknownError",
    message: typeof error === "string" ? error : "Unknown error",
  };
}

export function createErrorReference(error: unknown): string {
  if (error instanceof Error && "digest" in error && typeof error.digest === "string") {
    return error.digest;
  }

  return `err_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function captureErrorToPostHog({
  error,
  code,
  reference,
  source = "error-page",
  metadata,
}: PostHogErrorCapturePayload): void {
  const posthog = getPostHogClient();

  if (!posthog) {
    return;
  }

  const normalizedError = normalizeError(error);

  try {
    posthog.capture("$exception", {
      $exception_type: normalizedError.name,
      $exception_message: normalizedError.message,
      $exception_stack_trace: normalizedError.stack,
      code,
      digest: normalizedError.digest,
      error_reference: reference,
      pathname: window.location.pathname,
      source,
      ...metadata,
    });
  } catch {
    // Error pages must never fail while reporting an error.
  }
}
