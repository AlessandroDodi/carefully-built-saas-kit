import { ConvexError } from 'convex/values';

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';
export type ErrorCategory = 'api' | 'auth' | 'database' | 'validation' | 'network' | 'unknown';

interface ErrorContext {
  readonly userId?: string;
  readonly sessionId?: string;
  readonly url?: string;
  readonly component?: string;
  readonly action?: string;
  readonly metadata?: Record<string, unknown>;
}

interface ErrorReport {
  readonly message: string;
  readonly stack?: string;
  readonly category: ErrorCategory;
  readonly severity: ErrorSeverity;
  readonly context: ErrorContext;
  readonly timestamp: string;
  readonly fingerprint: string;
}

const RAW_SERVER_ERROR_PATTERNS = ['[CONVEX ', 'Server Error', 'Request ID:', 'Uncaught Error'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getConvexErrorMessage(error: unknown): string | null {
  if (!(error instanceof ConvexError)) {
    return null;
  }

  if (typeof error.data === 'string') {
    return error.data;
  }

  if (isRecord(error.data) && typeof error.data.message === 'string') {
    return error.data.message;
  }

  return null;
}

function isRawServerErrorMessage(message: string): boolean {
  return RAW_SERVER_ERROR_PATTERNS.some((pattern) => message.includes(pattern));
}

export function getUserFacingErrorMessage(
  error: unknown,
  fallback = 'Si è verificato un problema. Riprova tra poco.',
): string {
  const convexMessage = getConvexErrorMessage(error);
  if (convexMessage) {
    return convexMessage;
  }

  if (!(error instanceof Error)) {
    return fallback;
  }

  if (!error.message || isRawServerErrorMessage(error.message)) {
    return fallback;
  }

  return error.message;
}

function generateFingerprint(error: Error, category: ErrorCategory): string {
  const message = error.message.slice(0, 100);
  const stack = error.stack?.split('\n')[1]?.trim() ?? '';
  return `${category}:${message}:${stack}`.replace(/\s+/g, '_').slice(0, 200);
}

function determineSeverity(
  error: Error,
  category: ErrorCategory,
  explicitSeverity?: ErrorSeverity,
): ErrorSeverity {
  if (explicitSeverity) {
    return explicitSeverity;
  }

  if (category === 'auth' && error.message.includes('unauthorized')) {
    return 'high';
  }

  if (category === 'database') {
    return 'critical';
  }

  if (error.message.includes('FATAL') || error.message.includes('CRITICAL')) {
    return 'critical';
  }

  if (category === 'api' && error.message.includes('500')) {
    return 'high';
  }

  if (category === 'validation' || category === 'network') {
    return 'medium';
  }

  return 'low';
}

function getUserFriendlyMessage(category: ErrorCategory): string {
  const messages: Record<ErrorCategory, string> = {
    api: 'Unable to complete the request. Please try again.',
    auth: 'Authentication error. Please sign in again.',
    database: 'A temporary issue occurred. Please try again shortly.',
    validation: 'Please check your input and try again.',
    network: 'Connection issue. Please check your internet and try again.',
    unknown: 'Something went wrong. Please try again.',
  };

  return messages[category];
}

export function captureError(
  error: unknown,
  options: {
    readonly category?: ErrorCategory;
    readonly severity?: ErrorSeverity;
    readonly context?: ErrorContext;
    readonly silent?: boolean;
  } = {},
): { readonly userMessage: string; readonly errorId: string } {
  const {
    category = 'unknown',
    severity: explicitSeverity,
    context = {},
    silent = false,
  } = options;
  const normalizedError = error instanceof Error ? error : new Error(String(error));
  const severity = determineSeverity(normalizedError, category, explicitSeverity);
  const fingerprint = generateFingerprint(normalizedError, category);
  const errorId = `err_${String(Date.now())}_${Math.random().toString(36).slice(2, 9)}`;
  const report: ErrorReport = {
    message: normalizedError.message,
    stack: normalizedError.stack,
    category,
    severity,
    context: {
      ...context,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    },
    timestamp: new Date().toISOString(),
    fingerprint,
  };

  if (typeof window !== 'undefined') {
    console.error(`[${category.toUpperCase()}] Error captured:`, {
      errorId,
      message: report.message,
      severity,
      ...report.context,
      ...report.context.metadata,
    });
  }

  const globalRecord = globalThis as Record<string, unknown>;
  const environment = isRecord(globalRecord.process)
    ? globalRecord.process.env
    : undefined;

  if (!silent && isRecord(environment) && environment.NODE_ENV === 'development') {
    console.error(`[${severity.toUpperCase()}] ${category}:`, normalizedError);
  }

  return {
    userMessage: getUserFriendlyMessage(category),
    errorId,
  };
}

export function withErrorHandler<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  options: {
    readonly category?: ErrorCategory;
    readonly context?: ErrorContext;
  } = {},
): (...args: Parameters<T>) => Promise<ReturnType<T> | { readonly error: string; readonly errorId: string }> {
  return async (...args: Parameters<T>) => {
    try {
      return (await fn(...args)) as ReturnType<T>;
    } catch (error) {
      const { userMessage, errorId } = captureError(error, options);
      return { error: userMessage, errorId };
    }
  };
}

export function captureReactError(
  error: Error,
  errorInfo: { readonly componentStack?: string },
  componentName?: string,
): { readonly userMessage: string; readonly errorId: string } {
  return captureError(error, {
    category: 'unknown',
    severity: 'high',
    context: {
      component: componentName,
      metadata: {
        componentStack: errorInfo.componentStack,
      },
    },
  });
}

export function captureApiError(
  error: unknown,
  endpoint: string,
  method: string,
  statusCode?: number,
): { readonly userMessage: string; readonly errorId: string } {
  return captureError(error, {
    category: 'api',
    severity: statusCode && statusCode >= 500 ? 'high' : 'medium',
    context: {
      action: `${method} ${endpoint}`,
      metadata: { statusCode },
    },
  });
}
