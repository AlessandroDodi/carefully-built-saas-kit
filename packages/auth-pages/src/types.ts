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
  readonly className?: string;
  readonly backgroundClassName?: string;
  readonly foregroundWrapperClassName?: string;
  readonly foregroundClassName?: string;
}

export interface LegalLinkConfig {
  readonly termsHref?: string;
  readonly privacyHref?: string;
  readonly cookieHref?: string;
  readonly consentText?: string;
  readonly className?: string;
  readonly linkClassName?: string;
}

export interface AuthLayoutClassNames {
  readonly root?: string;
  readonly grid?: string;
  readonly section?: string;
  readonly logoLink?: string;
  readonly content?: string;
  readonly header?: string;
  readonly title?: string;
  readonly subtitle?: string;
  readonly visualAside?: string;
  readonly visualFrame?: string;
}

export interface AuthLayoutBranding {
  readonly logo?: ReactNode;
  readonly logoHref?: string;
  readonly visual?: AuthVisualConfig;
  readonly sidePanel?: ReactNode;
  readonly className?: string;
  readonly classes?: AuthLayoutClassNames;
}

export interface AuthFormState<TValues extends FieldValues> {
  readonly form: UseFormReturn<TValues>;
  readonly onSubmit: SubmitHandler<TValues>;
  readonly loading?: boolean;
  readonly error?: string;
}
