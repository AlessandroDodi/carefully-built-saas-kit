import type { LegalLinkConfig } from "../types";

export function LegalConsent({
  termsHref = "/terms",
  privacyHref = "/privacy",
  cookieHref,
  consentText = "Continuando, accetti",
}: LegalLinkConfig): React.ReactElement {
  return (
    <p className="text-muted-foreground mt-4 text-center text-xs">
      {consentText}{" "}
      <a
        className="underline"
        href={termsHref}
        rel="noopener noreferrer"
        target="_blank"
      >
        Termini di servizio
      </a>{" "}
      e{" "}
      <a
        className="underline"
        href={privacyHref}
        rel="noopener noreferrer"
        target="_blank"
      >
        Informativa sulla privacy
      </a>
      {cookieHref ? (
        <>
          {" "}
          e{" "}
          <a
            className="underline"
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
