"use client";

import { useTransition } from "react";

import { Button } from "@carefully-built/ui";

export interface SocialProvider {
  readonly name: string;
  readonly icon: string;
  readonly action: (invitationToken?: string) => Promise<string>;
}

interface SocialProviderButtonProps {
  readonly invitationToken?: string | null;
  readonly provider: SocialProvider;
}

export function SocialProviderButton({
  invitationToken,
  provider,
}: SocialProviderButtonProps): React.ReactElement {
  const [isPending, startTransition] = useTransition();

  const handleClick = (): void => {
    startTransition(async () => {
      const authUrl = await provider.action(invitationToken ?? undefined);
      window.location.assign(authUrl);
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      disabled={isPending}
      onClick={handleClick}
    >
      <img src={provider.icon} alt="" width={16} height={16} aria-hidden />
      Continua con {provider.name}
    </Button>
  );
}
