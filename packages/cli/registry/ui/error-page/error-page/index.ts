export { ErrorCode, type ErrorCodeProps } from "@/components/ui/error-page/error-code";
export {
  getNotFoundPageContent,
  resolveErrorPageContent,
  type ErrorPageContent,
  type ErrorPageKind,
  type ResolveErrorPageContentOptions,
} from "@/components/ui/error-page/error-page-content";
export {
  captureErrorToPostHog,
  createErrorReference,
  type PostHogErrorCapturePayload,
} from "@/components/ui/error-page/posthog-error-capture";
export {
  SaasErrorPage,
  SaasNotFoundPage,
  type SaasErrorPageProps,
  type SaasNotFoundPageProps,
} from "@/components/ui/error-page/saas-error-page";
