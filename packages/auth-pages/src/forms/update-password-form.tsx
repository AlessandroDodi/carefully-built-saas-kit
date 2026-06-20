"use client";

import { FormProvider } from "react-hook-form";

import type { FieldValues, Path } from "react-hook-form";

import { CustomPasswordField } from "@carefully-built/forms";
import { Button, cn } from "@carefully-built/ui";

import type { AuthFormState } from "../types";

import { AuthError } from "./auth-error";

interface UpdatePasswordFormProps<
  TValues extends FieldValues,
> extends AuthFormState<TValues> {
  readonly token?: string | null;
  readonly missingTokenMessage?: string;
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
  missingTokenMessage = "Invalid or missing reset token. Request a new password reset link.",
  className,
  errorClassName,
  missingTokenClassName,
  buttonClassName,
}: UpdatePasswordFormProps<TValues>): React.ReactElement {
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
          name={"password" as Path<TValues>}
          label="Nuova password"
          placeholder="Almeno 8 caratteri"
          autoComplete="new-password"
          disabled={loading}
        />

        <CustomPasswordField<TValues>
          name={"confirmPassword" as Path<TValues>}
          label="Conferma password"
          placeholder="Reinserisci la password"
          autoComplete="new-password"
          disabled={loading}
        />

        <AuthError error={error} className={errorClassName} />

        <Button className={cn("w-full", buttonClassName)} disabled={loading} type="submit">
          {loading ? "Aggiornamento..." : "Aggiorna password"}
        </Button>
      </form>
    </FormProvider>
  );
}
