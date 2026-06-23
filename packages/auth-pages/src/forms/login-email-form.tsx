"use client";

import { FormProvider } from "react-hook-form";

import type { FieldValues, Path } from "react-hook-form";

import { CustomInputField, CustomPasswordField } from "@carefully-built/forms";
import { Button, cn } from "@carefully-built/ui";

import type { AuthFormState } from "../types";

import { AuthError } from "./auth-error";

interface LoginEmailFormProps<
  TValues extends FieldValues,
> extends AuthFormState<TValues> {
  readonly emailLabel?: string;
  readonly emailPlaceholder?: string;
  readonly passwordLabel?: string;
  readonly forgotPasswordLabel?: string;
  readonly submitLabel?: string;
  readonly loadingLabel?: string;
  readonly forgotPasswordHref?: string;
  readonly className?: string;
  readonly forgotPasswordClassName?: string;
  readonly errorClassName?: string;
  readonly buttonClassName?: string;
}

export function LoginEmailForm<TValues extends FieldValues>({
  form,
  onSubmit,
  loading = false,
  error,
  emailLabel = "Email",
  emailPlaceholder = "you@example.com",
  passwordLabel = "Password",
  forgotPasswordLabel = "Forgot password?",
  submitLabel = "Sign in",
  loadingLabel = "Signing in...",
  forgotPasswordHref = "/forgot-password",
  className,
  forgotPasswordClassName,
  errorClassName,
  buttonClassName,
}: LoginEmailFormProps<TValues>): React.ReactElement {
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

        <div className="space-y-2">
          <CustomPasswordField<TValues>
            name={"password" as Path<TValues>}
            label={passwordLabel}
            autoComplete="current-password"
            disabled={loading}
          />
          <div className="flex justify-end">
            <a
              className={cn(
                "text-sm underline-offset-4 hover:underline",
                forgotPasswordClassName,
              )}
              href={forgotPasswordHref}
            >
              {forgotPasswordLabel}
            </a>
          </div>
        </div>

        <AuthError error={error} className={errorClassName} />

        <Button className={cn("w-full", buttonClassName)} disabled={loading} type="submit">
          {loading ? loadingLabel : submitLabel}
        </Button>
      </form>
    </FormProvider>
  );
}
