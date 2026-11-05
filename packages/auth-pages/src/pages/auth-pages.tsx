"use client";

import type { ReactNode } from "react";
import { Suspense } from "react";

import { useKitTexts } from "@carefully-built/ui";

import {
  useForgotPasswordForm,
  useLoginForm,
  useSignupForm,
  useUpdatePasswordForm,
  type AuthActionResult,
} from "../controllers/password-forms";
import {
  AuthBottomNav,
  AuthLayout,
  LegalConsent,
} from "../index";
import {
  ForgotPasswordForm,
  LoginEmailForm,
  SignupEmailForm,
  UpdatePasswordForm,
} from "../forms";
import { useAuthPagesConfig } from "../config/auth-pages-config";
import { authPageTexts } from "../locale/auth-texts";
import { SocialLoginButtons, type SocialProvider } from "../social";
import type { AuthLayoutBranding, LegalLinkConfig } from "../types";

export interface AuthPageBranding extends AuthLayoutBranding {
  readonly legal?: LegalLinkConfig;
}

interface AuthPageShellProps extends AuthPageBranding {
  readonly title: string;
  readonly subtitle?: string;
  readonly showLegal?: boolean;
  readonly children: ReactNode;
}

const INVITATION_PARAM_NAMES = ["invitation_token", "invitationToken", "token"];

function getUrlParam(names: readonly string[]): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const searchParams = new URLSearchParams(window.location.search);

  for (const name of names) {
    const value = searchParams.get(name)?.trim();
    if (value) {
      return value;
    }
  }

  return null;
}

function getInvitationToken(): string | null {
  return getUrlParam(INVITATION_PARAM_NAMES);
}

function getPasswordResetToken(): string | null {
  return getUrlParam(["token"]);
}

function withInvitationToken(href: string, invitationToken: string | null): string {
  if (!invitationToken) {
    return href;
  }

  const separator = href.includes("?") ? "&" : "?";
  return `${href}${separator}invitation_token=${encodeURIComponent(invitationToken)}`;
}

function redirectTo(href: string): void {
  window.location.assign(href);
}

function AuthPageShell({
  title,
  subtitle,
  children,
  legal,
  showLegal = false,
  ...branding
}: AuthPageShellProps): React.ReactElement {
  const config = useAuthPagesConfig();
  const { legal: configLegal, ...configBranding } = config ?? {};
  const resolvedLegal = legal ?? (showLegal ? configLegal : undefined);

  return (
    <AuthLayout
      title={title}
      subtitle={subtitle}
      {...configBranding}
      {...branding}
    >
      {children}
      {resolvedLegal ? <LegalConsent {...resolvedLegal} /> : null}
    </AuthLayout>
  );
}

export interface AuthLoginPageProps extends AuthPageBranding {
  readonly providers: readonly SocialProvider[];
  readonly title?: string;
  readonly emailHref?: string;
  readonly emailLabel?: string;
  readonly children?: ReactNode;
}

export function AuthLoginPage({
  providers,
  title: titleProp,
  emailHref = "/login/email",
  emailLabel,
  children,
  ...branding
}: AuthLoginPageProps): React.ReactElement {
  const texts = useKitTexts(authPageTexts);
  const title = titleProp ?? texts.loginTitle;
  const invitationToken = getInvitationToken();

  return (
    <AuthPageShell title={title} showLegal {...branding}>
      {children ?? (
        <Suspense>
          <SocialLoginButtons
            providers={providers}
            invitationToken={invitationToken}
            emailHref={withInvitationToken(emailHref, invitationToken)}
            emailLabel={emailLabel}
          />
        </Suspense>
      )}
    </AuthPageShell>
  );
}

export interface AuthEmailLoginPageProps extends AuthPageBranding {
  readonly signIn: (formData: FormData) => Promise<AuthActionResult>;
  readonly title?: string;
  readonly signupPromptText?: string;
  readonly signupLinkText?: string;
  readonly signupHref?: string;
  readonly successHref?: string;
  readonly children?: ReactNode;
}

export function AuthEmailLoginPage({
  signIn,
  title: titleProp,
  signupPromptText: signupPromptTextProp,
  signupLinkText: signupLinkTextProp,
  signupHref = "/signup/email",
  successHref = "/dashboard",
  children,
  ...branding
}: AuthEmailLoginPageProps): React.ReactElement {
  const texts = useKitTexts(authPageTexts);
  const title = titleProp ?? texts.emailLoginTitle;
  const signupPromptText = signupPromptTextProp ?? texts.signupPromptText;
  const signupLinkText = signupLinkTextProp ?? texts.signupLinkText;
  const invitationToken = getInvitationToken();
  const state = useLoginForm({
    signIn,
    invitationToken,
    onSuccess: () => redirectTo(successHref),
  });

  return (
    <AuthPageShell title={title} {...branding}>
      {children ?? (
        <>
          <AuthBottomNav
            linkPath={withInvitationToken(signupHref, invitationToken)}
            linkText={signupLinkText}
            text={signupPromptText}
          />
          <LoginEmailForm {...state} />
        </>
      )}
    </AuthPageShell>
  );
}

export interface AuthSignupPageProps extends AuthPageBranding {
  readonly signUp: (formData: FormData) => Promise<AuthActionResult>;
  readonly title?: string;
  readonly loginPromptText?: string;
  readonly loginLinkText?: string;
  readonly loginHref?: string;
  readonly successHref?: string;
  readonly children?: ReactNode;
}

export function AuthSignupPage({
  signUp,
  title: titleProp,
  loginPromptText: loginPromptTextProp,
  loginLinkText: loginLinkTextProp,
  loginHref = "/login/email",
  successHref = "/dashboard",
  children,
  ...branding
}: AuthSignupPageProps): React.ReactElement {
  const texts = useKitTexts(authPageTexts);
  const title = titleProp ?? texts.signupTitle;
  const loginPromptText = loginPromptTextProp ?? texts.loginPromptText;
  const loginLinkText = loginLinkTextProp ?? texts.loginLinkText;
  const invitationToken = getInvitationToken();
  const state = useSignupForm({
    signUp,
    invitationToken,
    onSuccess: () => redirectTo(successHref),
  });

  return (
    <AuthPageShell title={title} showLegal {...branding}>
      {children ?? (
        <>
          <AuthBottomNav
            linkPath={withInvitationToken(loginHref, invitationToken)}
            linkText={loginLinkText}
            text={loginPromptText}
          />
          <SignupEmailForm {...state} />
        </>
      )}
    </AuthPageShell>
  );
}

export interface AuthForgotPasswordPageProps extends AuthPageBranding {
  readonly sendPasswordResetEmail: (email: string) => Promise<AuthActionResult>;
  readonly title?: string;
  readonly subtitle?: string;
  readonly children?: ReactNode;
}

export function AuthForgotPasswordPage({
  sendPasswordResetEmail,
  title: titleProp,
  subtitle: subtitleProp,
  children,
  ...branding
}: AuthForgotPasswordPageProps): React.ReactElement {
  const texts = useKitTexts(authPageTexts);
  const title = titleProp ?? texts.forgotPasswordTitle;
  const subtitle = subtitleProp ?? texts.forgotPasswordSubtitle;
  const state = useForgotPasswordForm({ sendPasswordResetEmail });

  return (
    <AuthPageShell title={title} subtitle={subtitle} {...branding}>
      {children ?? <ForgotPasswordForm {...state} />}
    </AuthPageShell>
  );
}

export interface AuthUpdatePasswordPageProps extends AuthPageBranding {
  readonly resetPassword: (
    token: string,
    newPassword: string,
  ) => Promise<AuthActionResult>;
  readonly title?: string;
  readonly subtitle?: string;
  readonly successHref?: string;
  readonly children?: ReactNode;
}

export function AuthUpdatePasswordPage({
  resetPassword,
  title: titleProp,
  subtitle: subtitleProp,
  successHref = "/login/email?reset=success",
  children,
  ...branding
}: AuthUpdatePasswordPageProps): React.ReactElement {
  const texts = useKitTexts(authPageTexts);
  const title = titleProp ?? texts.updatePasswordTitle;
  const subtitle = subtitleProp ?? texts.updatePasswordSubtitle;
  const token = getPasswordResetToken();
  const state = useUpdatePasswordForm({
    token,
    resetPassword,
    onSuccess: () => redirectTo(successHref),
  });

  return (
    <AuthPageShell title={title} subtitle={subtitle} {...branding}>
      {children ?? <UpdatePasswordForm {...state} />}
    </AuthPageShell>
  );
}
