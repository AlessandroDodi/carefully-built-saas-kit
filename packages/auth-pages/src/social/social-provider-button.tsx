"use client";

import { useTransition } from "react";

import { Button, cn } from "@carefully-built/ui";

export interface SocialProvider {
  readonly name: string;
  readonly icon: string;
  readonly action: (invitationToken?: string) => Promise<string>;
}

interface SocialProviderButtonProps {
  readonly invitationToken?: string | null;
  readonly provider: SocialProvider;
  readonly className?: string;
  readonly iconClassName?: string;
}

export function SocialProviderButton({
  invitationToken,
  provider,
  className,
  iconClassName,
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
      className={cn("w-full", className)}
      disabled={isPending}
      onClick={handleClick}
    >
      <img
        src={provider.icon}
        alt=""
        width={16}
        height={16}
        aria-hidden
        className={iconClassName}
      />
      Continua con {provider.name}
    </Button>
  );
}
