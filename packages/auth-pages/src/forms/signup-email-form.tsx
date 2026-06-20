"use client";

import { FormProvider } from "react-hook-form";

import type { FieldValues, Path } from "react-hook-form";

import { CustomInputField, CustomPasswordField } from "@carefully-built/forms";
import { Button, cn } from "@carefully-built/ui";

import type { AuthFormState } from "../types";

import { AuthError } from "./auth-error";

interface SignupEmailFormProps<TValues extends FieldValues>
  extends AuthFormState<TValues> {
  readonly className?: string;
  readonly errorClassName?: string;
  readonly buttonClassName?: string;
}

export function SignupEmailForm<TValues extends FieldValues>({
  form,
  onSubmit,
  loading = false,
  error,
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
          label="Email"
          placeholder="tuaemail@gmail.com"
          type="email"
          disabled={loading}
        />

        <CustomPasswordField<TValues>
          name={"password" as Path<TValues>}
          label="Password"
          placeholder="Almeno 8 caratteri"
          autoComplete="new-password"
          disabled={loading}
        />

        <AuthError error={error} className={errorClassName} />

        <Button className={cn("w-full", buttonClassName)} disabled={loading} type="submit">
          {loading ? "Creazione account..." : "Registrati"}
        </Button>
      </form>
    </FormProvider>
  );
}
