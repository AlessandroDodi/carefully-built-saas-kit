import type { ReactNode } from "react";
import type {
  FieldValues,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";

export interface AuthVisualConfig {
  readonly backgroundSrc?: string;
  readonly foregroundSrc?: string;
  readonly alt?: string;
}

export interface LegalLinkConfig {
  readonly termsHref?: string;
  readonly privacyHref?: string;
  readonly cookieHref?: string;
  readonly consentText?: string;
}

export interface AuthLayoutBranding {
  readonly logo?: ReactNode;
  readonly logoHref?: string;
  readonly visual?: AuthVisualConfig;
  readonly sidePanel?: ReactNode;
}

export interface AuthFormState<TValues extends FieldValues> {
  readonly form: UseFormReturn<TValues>;
  readonly onSubmit: SubmitHandler<TValues>;
  readonly loading?: boolean;
  readonly error?: string;
}
