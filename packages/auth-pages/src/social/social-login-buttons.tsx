"use client";

import { Button } from "@carefully-built/ui";

import {
  SocialProviderButton,
  type SocialProvider,
} from "./social-provider-button";

interface SocialLoginButtonsProps {
  readonly providers: readonly SocialProvider[];
  readonly invitationToken?: string | null;
  readonly emailHref: string;
  readonly emailLabel?: string;
}

export function SocialLoginButtons({
  providers,
  invitationToken,
  emailHref,
  emailLabel = "Continua con email",
}: SocialLoginButtonsProps): React.ReactElement {
  return (
    <div className="mt-4 space-y-2">
      {providers.map((provider) => (
        <SocialProviderButton
          invitationToken={invitationToken}
          key={provider.name}
          provider={provider}
        />
      ))}

      <a className="block" href={emailHref}>
        <Button variant="outline" className="w-full">
          {emailLabel}
        </Button>
      </a>
    </div>
  );
}
