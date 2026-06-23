"use client";

import { FormProvider } from "react-hook-form";

import type { FieldValues, Path } from "react-hook-form";

import { CustomInputField, CustomPasswordField } from "@carefully-built/forms";
import { Button, cn } from "@carefully-built/ui";

import type { AuthFormState } from "../types";

import { AuthError } from "./auth-error";

interface SignupEmailFormProps<TValues extends FieldValues>
  extends AuthFormState<TValues> {
  readonly emailLabel?: string;
  readonly emailPlaceholder?: string;
  readonly passwordLabel?: string;
  readonly passwordPlaceholder?: string;
  readonly submitLabel?: string;
  readonly loadingLabel?: string;
  readonly className?: string;
  readonly errorClassName?: string;
  readonly buttonClassName?: string;
}

export function SignupEmailForm<TValues extends FieldValues>({
  form,
  onSubmit,
  loading = false,
  error,
  emailLabel = "Email",
  emailPlaceholder = "you@example.com",
  passwordLabel = "Password",
  passwordPlaceholder = "At least 8 characters",
  submitLabel = "Sign up",
  loadingLabel = "Creating account...",
  className,
  errorClassName,
  buttonClassName,
}: SignupEmailFormProps<TValues>): React.ReactElement {
  return (
    <FormProvider {...form}>
      <form
        className={cn("space-y-3", className)}
        onSubmit={(event) => {
          void form.handleSubmit(onSubmit)(event);
        }}
      >
        <CustomInputField<TValues>
          name={"email" as Path<TValues>}
          label={emailLabel}
          placeholder={emailPlaceholder}
          type="email"
          disabled={loading}
        />

        <CustomPasswordField<TValues>
          name={"password" as Path<TValues>}
          label={passwordLabel}
          placeholder={passwordPlaceholder}
          autoComplete="new-password"
          disabled={loading}
        />

        <AuthError error={error} className={errorClassName} />

        <Button className={cn("w-full", buttonClassName)} disabled={loading} type="submit">
          {loading ? loadingLabel : submitLabel}
        </Button>
      </form>
    </FormProvider>
  );
}
