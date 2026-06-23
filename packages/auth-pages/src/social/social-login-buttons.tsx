"use client";

import { Button, cn } from "@carefully-built/ui";

import {
  SocialProviderButton,
  type SocialProvider,
} from "./social-provider-button";

interface SocialLoginButtonsProps {
  readonly providers: readonly SocialProvider[];
  readonly invitationToken?: string | null;
  readonly emailHref: string;
  readonly emailLabel?: string;
  readonly getProviderLabel?: (provider: SocialProvider) => string;
  readonly className?: string;
  readonly providerButtonClassName?: string;
  readonly emailLinkClassName?: string;
  readonly emailButtonClassName?: string;
}

export function SocialLoginButtons({
  providers,
  invitationToken,
  emailHref,
  emailLabel = "Continue with email",
  getProviderLabel,
  className,
  providerButtonClassName,
  emailLinkClassName,
  emailButtonClassName,
}: SocialLoginButtonsProps): React.ReactElement {
  return (
    <div className={cn("mt-4 space-y-2", className)}>
      {providers.map((provider) => (
        <SocialProviderButton
          invitationToken={invitationToken}
          key={provider.name}
          provider={provider}
          label={getProviderLabel?.(provider)}
          className={providerButtonClassName}
        />
      ))}

      <a className={cn("block", emailLinkClassName)} href={emailHref}>
        <Button variant="outline" className={cn("w-full", emailButtonClassName)}>
          {emailLabel}
        </Button>
      </a>
    </div>
  );
}
