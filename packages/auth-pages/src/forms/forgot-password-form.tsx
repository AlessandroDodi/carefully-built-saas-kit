"use client";

import { FormProvider } from "react-hook-form";

import type { FieldValues, Path } from "react-hook-form";

import { CustomInputField } from "@carefully-built/forms";
import { Button } from "@carefully-built/ui";

import type { AuthFormState } from "../types";

import { AuthError } from "./auth-error";

interface ForgotPasswordFormProps<
  TValues extends FieldValues,
> extends AuthFormState<TValues> {
  readonly sent?: boolean;
  readonly email?: string;
  readonly loginHref?: string;
}

export function ForgotPasswordForm<TValues extends FieldValues>({
  form,
  onSubmit,
  loading = false,
  sent = false,
  error,
  email,
  loginHref = "/login/email",
}: ForgotPasswordFormProps<TValues>): React.ReactElement {
  if (sent) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-muted-foreground text-sm">
          Abbiamo inviato un link per reimpostare la password
          {email ? (
            <>
              {" "}
              a <strong>{email}</strong>
            </>
          ) : null}
        </p>
        <a className="text-sm underline" href={loginHref}>
          Torna al login
        </a>
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <form
        className="space-y-4"
        onSubmit={(event) => {
          void form.handleSubmit(onSubmit)(event);
        }}
      >
        <CustomInputField<TValues>
          name={"email" as Path<TValues>}
          label="Email"
          placeholder="tuaemail@gmail.com"
          type="email"
          autoFocus
          disabled={loading}
        />

        <AuthError error={error} />

        <Button className="w-full" disabled={loading} type="submit">
          {loading ? "Invio in corso..." : "Invia link di reset"}
        </Button>

        <p className="text-muted-foreground text-center text-sm">
          <a className="underline" href={loginHref}>
            Torna al login
          </a>
        </p>
      </form>
    </FormProvider>
  );
}
