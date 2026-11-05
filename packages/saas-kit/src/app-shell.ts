// No 'use client' here: Next.js rejects `export *` inside a client module, and
// this entry is imported by Server Components too. The client-only Next.js
// adapters live in their own module, which carries the directive.
export * from '@carefully-built/app-shell';
export { AppNavigationShell, NextNavigationLink } from './app-shell/next-navigation-shell';
