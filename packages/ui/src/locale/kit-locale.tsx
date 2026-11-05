'use client';

import { createContext, useContext } from 'react';

import type { ReactNode } from 'react';

/**
 * Languages the kit ships default copy for. Every user-visible string is still
 * a prop: the locale only decides which built-in default is used when the app
 * does not pass one, so a host sets the language once instead of threading
 * labels through every component.
 */
export type KitLocale = 'en' | 'it';

// No provider means English, so apps that never opt in see no change.
const KitLocaleContext = createContext<KitLocale>('en');

export interface KitLocaleProviderProps {
  readonly locale: KitLocale;
  readonly children: ReactNode;
}

export function KitLocaleProvider({ locale, children }: KitLocaleProviderProps): React.ReactElement {
  return <KitLocaleContext.Provider value={locale}>{children}</KitLocaleContext.Provider>;
}

export function useKitLocale(): KitLocale {
  return useContext(KitLocaleContext);
}
