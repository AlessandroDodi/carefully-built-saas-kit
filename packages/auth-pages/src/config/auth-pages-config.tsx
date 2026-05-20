"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";

import type { AuthLayoutBranding, LegalLinkConfig } from "../types";

export interface AuthPagesConfig extends AuthLayoutBranding {
  readonly legal?: LegalLinkConfig;
}

interface AuthPagesConfigProviderProps {
  readonly config: AuthPagesConfig;
  readonly children: ReactNode;
}

const AuthPagesConfigContext = createContext<AuthPagesConfig | null>(null);

export function AuthPagesConfigProvider({
  config,
  children,
}: AuthPagesConfigProviderProps): React.ReactElement {
  return (
    <AuthPagesConfigContext.Provider value={config}>
      {children}
    </AuthPagesConfigContext.Provider>
  );
}

export function useAuthPagesConfig(): AuthPagesConfig | null {
  return useContext(AuthPagesConfigContext);
}
