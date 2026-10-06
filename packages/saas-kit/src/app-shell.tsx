'use client';

import NextLink from 'next/link';

import {
  AppNavigationShell as BaseAppNavigationShell,
  type AppNavigationShellProps,
  type NavigationLinkProps,
} from '@carefully-built/app-shell';

export * from '@carefully-built/app-shell';

/** `next/link` adapter for the shell's navigation links. */
export function NextNavigationLink({
  children,
  className,
  href,
  onClick,
}: NavigationLinkProps): React.ReactElement {
  return (
    <NextLink href={href} className={className} onClick={onClick}>
      {children}
    </NextLink>
  );
}

/**
 * `AppNavigationShell` for Next.js apps: identical to the framework-agnostic
 * shell, but navigation links default to `next/link`, so clicking a nav item
 * is a client-side transition instead of a full page load (which would drop
 * every React context / store the app keeps in memory). Pass `linkComponent`
 * to override.
 */
export function AppNavigationShell(props: AppNavigationShellProps): React.ReactElement {
  return <BaseAppNavigationShell linkComponent={NextNavigationLink} {...props} />;
}
