import type { LegalLinkConfig } from "../types";
import { cn } from "@carefully-built/ui";

export function LegalConsent({
  termsHref = "/terms",
  privacyHref = "/privacy",
  cookieHref,
  consentText = "By continuing, you agree to our",
  className,
  linkClassName,
}: LegalLinkConfig): React.ReactElement {
  return (
    <p className={cn("text-muted-foreground mt-4 text-center text-xs", className)}>
      {consentText}{" "}
      <a
        className={cn("underline", linkClassName)}
        href={termsHref}
        rel="noopener noreferrer"
        target="_blank"
      >
        Terms of Service
      </a>{" "}
      and{" "}
      <a
        className={cn("underline", linkClassName)}
        href={privacyHref}
        rel="noopener noreferrer"
        target="_blank"
      >
        Privacy Policy
      </a>
      {cookieHref ? (
        <>
          {" "}
          and{" "}
          <a
            className={cn("underline", linkClassName)}
            href={cookieHref}
            rel="noopener noreferrer"
            target="_blank"
          >
            Cookie policy
          </a>
        </>
      ) : null}
      .
    </p>
  );
}
