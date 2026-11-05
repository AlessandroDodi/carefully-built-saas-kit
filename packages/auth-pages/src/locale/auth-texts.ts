import { defineKitTexts } from "@carefully-built/ui";

/**
 * Default copy of the auth pages, per kit locale (set by the host with
 * `KitLocaleProvider`). Every entry is still a prop on its component; these
 * only apply when the app leaves the prop out.
 */

export const authMessageTexts = defineKitTexts({
  en: {
    invalidEmail: "Enter a valid email address",
    passwordTooShort: "Password must be at least 8 characters",
    passwordMismatch: "Passwords do not match",
    unexpectedError: "An unexpected error occurred",
    invalidToken: "Invalid reset token",
  },
  it: {
    invalidEmail: "Inserisci un indirizzo email valido",
    passwordTooShort: "La password deve avere almeno 8 caratteri",
    passwordMismatch: "Le password non coincidono",
    unexpectedError: "Si è verificato un errore imprevisto",
    invalidToken: "Link di reimpostazione non valido",
  },
});

export const loginEmailFormTexts = defineKitTexts({
  en: {
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    passwordLabel: "Password",
    forgotPasswordLabel: "Forgot password?",
    submitLabel: "Sign in",
    loadingLabel: "Signing in...",
  },
  it: {
    emailLabel: "Email",
    emailPlaceholder: "nome@esempio.it",
    passwordLabel: "Password",
    forgotPasswordLabel: "Password dimenticata?",
    submitLabel: "Accedi",
    loadingLabel: "Accesso in corso…",
  },
});

export const signupEmailFormTexts = defineKitTexts({
  en: {
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    passwordLabel: "Password",
    passwordPlaceholder: "At least 8 characters",
    submitLabel: "Sign up",
    loadingLabel: "Creating account...",
  },
  it: {
    emailLabel: "Email",
    emailPlaceholder: "nome@esempio.it",
    passwordLabel: "Password",
    passwordPlaceholder: "Almeno 8 caratteri",
    submitLabel: "Registrati",
    loadingLabel: "Creazione dell’account…",
  },
});

export const forgotPasswordFormTexts = defineKitTexts({
  en: {
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    submitLabel: "Send reset link",
    loadingLabel: "Sending...",
    backToLoginLabel: "Back to login",
  },
  it: {
    emailLabel: "Email",
    emailPlaceholder: "nome@esempio.it",
    submitLabel: "Invia il link",
    loadingLabel: "Invio in corso…",
    backToLoginLabel: "Torna all’accesso",
  },
});

export const updatePasswordFormTexts = defineKitTexts({
  en: {
    missingTokenMessage: "Invalid or missing reset token. Request a new password reset link.",
    passwordLabel: "New password",
    passwordPlaceholder: "At least 8 characters",
    confirmPasswordLabel: "Confirm password",
    confirmPasswordPlaceholder: "Enter the password again",
    submitLabel: "Update password",
    loadingLabel: "Updating...",
  },
  it: {
    missingTokenMessage: "Link di reimpostazione non valido o scaduto. Richiedine uno nuovo.",
    passwordLabel: "Nuova password",
    passwordPlaceholder: "Almeno 8 caratteri",
    confirmPasswordLabel: "Conferma password",
    confirmPasswordPlaceholder: "Ripeti la password",
    submitLabel: "Aggiorna password",
    loadingLabel: "Aggiornamento…",
  },
});

export const legalConsentTexts = defineKitTexts({
  en: {
    consentText: "By continuing, you agree to our",
    termsLabel: "Terms of Service",
    privacyLabel: "Privacy Policy",
    cookieLabel: "Cookie policy",
    conjunctionText: "and",
  },
  it: {
    consentText: "Continuando, accetti i",
    termsLabel: "Termini di servizio",
    privacyLabel: "Privacy policy",
    cookieLabel: "Cookie policy",
    conjunctionText: "e la",
  },
});

export const socialLoginTexts = defineKitTexts<{
  readonly emailLabel: string;
  readonly providerLabel: (providerName: string) => string;
}>({
  en: {
    emailLabel: "Continue with email",
    providerLabel: (providerName) => `Continue with ${providerName}`,
  },
  it: {
    emailLabel: "Continua con email",
    providerLabel: (providerName) => `Continua con ${providerName}`,
  },
});

export const organizationSelectorTexts = defineKitTexts({
  en: {
    searchPlaceholder: "Search organization...",
    emptyTitle: "No organization found",
    emptyDescription: "Try searching with a different name.",
    itemDescription: "Continue with this organization",
  },
  it: {
    searchPlaceholder: "Cerca organizzazione…",
    emptyTitle: "Nessuna organizzazione trovata",
    emptyDescription: "Prova a cercare con un altro nome.",
    itemDescription: "Continua con questa organizzazione",
  },
});

export const organizationSelectionPageTexts = defineKitTexts({
  en: {
    title: "Welcome",
    description:
      "You have access to multiple organizations. Select the one you want to continue with.",
    noOrganizationsTitle: "No organization available",
    noOrganizationsDescription:
      "Your account is authenticated, but you still need to choose or create an organization.",
    dashboardLabel: "Go to dashboard",
    loginLabel: "Back to login",
  },
  it: {
    title: "Benvenuto",
    description: "L’account ha accesso a più organizzazioni. Scegli quella con cui continuare.",
    noOrganizationsTitle: "Nessuna organizzazione disponibile",
    noOrganizationsDescription:
      "L’accesso è avvenuto, ma serve ancora scegliere o creare un’organizzazione.",
    dashboardLabel: "Vai alla dashboard",
    loginLabel: "Torna all’accesso",
  },
});

export const authPageTexts = defineKitTexts({
  en: {
    loginTitle: "Sign in",
    emailLoginTitle: "Sign in with email",
    signupPromptText: "Do not have an account?",
    signupLinkText: "Sign up",
    signupTitle: "Sign up with email",
    loginPromptText: "Already have an account?",
    loginLinkText: "Sign in",
    forgotPasswordTitle: "Forgot password",
    forgotPasswordSubtitle: "Enter your email to receive a password reset link",
    updatePasswordTitle: "Update password",
    updatePasswordSubtitle: "Enter your new password",
  },
  it: {
    loginTitle: "Accedi",
    emailLoginTitle: "Accedi con email",
    signupPromptText: "Non hai un account?",
    signupLinkText: "Registrati",
    signupTitle: "Registrati con email",
    loginPromptText: "Hai già un account?",
    loginLinkText: "Accedi",
    forgotPasswordTitle: "Password dimenticata",
    forgotPasswordSubtitle: "Inserisci l’email per ricevere il link di reimpostazione",
    updatePasswordTitle: "Aggiorna password",
    updatePasswordSubtitle: "Inserisci la nuova password",
  },
});
