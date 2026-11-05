"use client";

import { cn, useKitTexts } from "@carefully-built/ui";

import { legalConsentTexts } from "../locale/auth-texts";

import type { LegalLinkConfig } from "../types";

export function LegalConsent({
  termsHref = "/terms",
  privacyHref = "/privacy",
  cookieHref,
  consentText: consentTextProp,
  termsLabel: termsLabelProp,
  privacyLabel: privacyLabelProp,
  cookieLabel: cookieLabelProp,
  conjunctionText: conjunctionTextProp,
  className,
  linkClassName,
}: LegalLinkConfig): React.ReactElement {
  const {
    consentText,
    termsLabel,
    privacyLabel,
    cookieLabel,
    conjunctionText,
  } = useKitTexts(legalConsentTexts, {
    consentText: consentTextProp,
    termsLabel: termsLabelProp,
    privacyLabel: privacyLabelProp,
    cookieLabel: cookieLabelProp,
    conjunctionText: conjunctionTextProp,
  });

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
