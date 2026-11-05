"use client";

import { FormProvider } from "react-hook-form";

import type { FieldValues, Path } from "react-hook-form";

import { CustomInputField, CustomPasswordField } from "@carefully-built/forms";
import { Button, cn, useKitTexts } from "@carefully-built/ui";
import { loginEmailFormTexts } from "../locale/auth-texts";

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
  readonly showPasswordLabel?: string;
  readonly hidePasswordLabel?: string;
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
  emailLabel: emailLabelProp,
  emailPlaceholder: emailPlaceholderProp,
  passwordLabel: passwordLabelProp,
  forgotPasswordLabel: forgotPasswordLabelProp,
  submitLabel: submitLabelProp,
  loadingLabel: loadingLabelProp,
  forgotPasswordHref = "/forgot-password",
  showPasswordLabel,
  hidePasswordLabel,
  className,
  forgotPasswordClassName,
  errorClassName,
  buttonClassName,
}: LoginEmailFormProps<TValues>): React.ReactElement {
  const {
    emailLabel,
    emailPlaceholder,
    passwordLabel,
    forgotPasswordLabel,
    submitLabel,
    loadingLabel,
  } = useKitTexts(loginEmailFormTexts, {
    emailLabel: emailLabelProp,
    emailPlaceholder: emailPlaceholderProp,
    passwordLabel: passwordLabelProp,
    forgotPasswordLabel: forgotPasswordLabelProp,
    submitLabel: submitLabelProp,
    loadingLabel: loadingLabelProp,
  });

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
            showPasswordLabel={showPasswordLabel}
            hidePasswordLabel={hidePasswordLabel}
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
