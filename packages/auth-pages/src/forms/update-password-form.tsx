"use client";

import { FormProvider } from "react-hook-form";

import type { FieldValues, Path } from "react-hook-form";

import { CustomPasswordField } from "@carefully-built/forms";
import { Button, cn, useKitTexts } from "@carefully-built/ui";
import { updatePasswordFormTexts } from "../locale/auth-texts";

import type { AuthFormState } from "../types";

import { AuthError } from "./auth-error";

interface UpdatePasswordFormProps<
  TValues extends FieldValues,
> extends AuthFormState<TValues> {
  readonly token?: string | null;
  readonly missingTokenMessage?: string;
  readonly passwordLabel?: string;
  readonly passwordPlaceholder?: string;
  readonly confirmPasswordLabel?: string;
  readonly confirmPasswordPlaceholder?: string;
  readonly submitLabel?: string;
  readonly loadingLabel?: string;
  readonly showPasswordLabel?: string;
  readonly hidePasswordLabel?: string;
  readonly className?: string;
  readonly errorClassName?: string;
  readonly missingTokenClassName?: string;
  readonly buttonClassName?: string;
}

export function UpdatePasswordForm<TValues extends FieldValues>({
  form,
  onSubmit,
  loading = false,
  error,
  token,
  missingTokenMessage: missingTokenMessageProp,
  passwordLabel: passwordLabelProp,
  passwordPlaceholder: passwordPlaceholderProp,
  confirmPasswordLabel: confirmPasswordLabelProp,
  confirmPasswordPlaceholder: confirmPasswordPlaceholderProp,
  submitLabel: submitLabelProp,
  loadingLabel: loadingLabelProp,
  showPasswordLabel,
  hidePasswordLabel,
  className,
  errorClassName,
  missingTokenClassName,
  buttonClassName,
}: UpdatePasswordFormProps<TValues>): React.ReactElement {
  const {
    missingTokenMessage,
    passwordLabel,
    passwordPlaceholder,
    confirmPasswordLabel,
    confirmPasswordPlaceholder,
    submitLabel,
    loadingLabel,
  } = useKitTexts(updatePasswordFormTexts, {
    missingTokenMessage: missingTokenMessageProp,
    passwordLabel: passwordLabelProp,
    passwordPlaceholder: passwordPlaceholderProp,
    confirmPasswordLabel: confirmPasswordLabelProp,
    confirmPasswordPlaceholder: confirmPasswordPlaceholderProp,
    submitLabel: submitLabelProp,
    loadingLabel: loadingLabelProp,
  });
  if (!token) {
    return (
      <div
        className={cn(
          "bg-destructive/15 text-destructive rounded-md p-3 text-sm",
          missingTokenClassName,
        )}
      >
        {missingTokenMessage}
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <form
        className={cn("space-y-4", className)}
        onSubmit={(event) => {
          void form.handleSubmit(onSubmit)(event);
        }}
      >
        <CustomPasswordField<TValues>
          showPasswordLabel={showPasswordLabel}
          hidePasswordLabel={hidePasswordLabel}
          name={"password" as Path<TValues>}
          label={passwordLabel}
          placeholder={passwordPlaceholder}
          autoComplete="new-password"
          disabled={loading}
        />

        <CustomPasswordField<TValues>
          showPasswordLabel={showPasswordLabel}
          hidePasswordLabel={hidePasswordLabel}
          name={"confirmPassword" as Path<TValues>}
          label={confirmPasswordLabel}
          placeholder={confirmPasswordPlaceholder}
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
