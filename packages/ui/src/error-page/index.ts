export { ErrorCode, type ErrorCodeProps } from "./error-code";
export {
  getNotFoundPageContent,
  resolveErrorPageContent,
  type ErrorPageContent,
  type ErrorPageKind,
  type ResolveErrorPageContentOptions,
} from "./error-page-content";
export {
  captureErrorToPostHog,
  createErrorReference,
  type PostHogErrorCapturePayload,
} from "./posthog-error-capture";
export {
  SaasErrorPage,
  SaasNotFoundPage,
  type SaasErrorPageProps,
  type SaasNotFoundPageProps,
} from "./saas-error-page";
