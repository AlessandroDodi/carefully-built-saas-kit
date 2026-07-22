"use client";

import { useTransition } from "react";

import { Button, cn } from "@carefully-built/ui";

export interface SocialProvider {
  readonly name: string;
  readonly icon: string;
  /**
   * Starts the provider's OAuth flow. Two shapes are supported:
   *
   * 1. **Server-side redirect (recommended, Safari-safe).** The action calls
   *    the framework's `redirect(authUrl)` (e.g. Next.js `redirect()`) and
   *    resolves to `void`. The navigation is performed by the framework, so it
   *    is unaffected by browser transient-activation rules and works on every
   *    browser, including Safari/WebKit.
   *
   * 2. **Return the authorization URL (legacy).** The action resolves to the
   *    URL string and the button navigates with `window.location.assign(url)`.
   *
   *    ⚠️ Safari/WebKit caveat: this path is unreliable. The `await` before the
   *    client-side navigation consumes the transient user activation, so WebKit
   *    silently blocks `window.location.assign` and the button appears to do
   *    nothing. Chromium/Gecko are permissive and navigate fine. Prefer shape
   *    (1) whenever Safari support matters.
   */
  readonly action: (invitationToken?: string) => Promise<string | void>;
}

interface SocialProviderButtonProps {
  readonly invitationToken?: string | null;
  readonly provider: SocialProvider;
  readonly label?: string;
  readonly className?: string;
  readonly iconClassName?: string;
}

export function SocialProviderButton({
  invitationToken,
  provider,
  label = `Continue with ${provider.name}`,
  className,
  iconClassName,
}: SocialProviderButtonProps): React.ReactElement {
  const [isPending, startTransition] = useTransition();

  const handleClick = (): void => {
    startTransition(async () => {
      const authUrl = await provider.action(invitationToken ?? undefined);

      // Shape (1): the action performed a server-side redirect and resolved to
      // nothing — the framework handles navigation, so there is nothing to do.
      // Shape (2): the action returned a URL to navigate to on the client.
      // NOTE: this client-side assign is unreliable on Safari/WebKit because
      // the await above consumes the user activation — see SocialProvider.action.
      if (typeof authUrl === "string" && authUrl.length > 0) {
        window.location.assign(authUrl);
      }
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
      {label}
    </Button>
  );
}
