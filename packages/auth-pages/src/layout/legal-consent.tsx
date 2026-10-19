import type { LegalLinkConfig } from "../types";
import { cn } from "@carefully-built/ui";

export function LegalConsent({
  termsHref = "/terms",
  privacyHref = "/privacy",
  cookieHref,
  consentText = "By continuing, you agree to our",
  termsLabel = "Terms of Service",
  privacyLabel = "Privacy Policy",
  cookieLabel = "Cookie policy",
  conjunctionText = "and",
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
        {termsLabel}
      </a>{" "}
      {conjunctionText}{" "}
      <a
        className={cn("underline", linkClassName)}
        href={privacyHref}
        rel="noopener noreferrer"
        target="_blank"
      >
        {privacyLabel}
      </a>
      {cookieHref ? (
        <>
          {" "}
          {conjunctionText}{" "}
          <a
            className={cn("underline", linkClassName)}
            href={cookieHref}
            rel="noopener noreferrer"
            target="_blank"
          >
            {cookieLabel}
          </a>
        </>
      ) : null}
      .
    </p>
  );
}
