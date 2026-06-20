"use client";

import { FormProvider } from "react-hook-form";

import type { FieldValues, Path } from "react-hook-form";

import { CustomInputField } from "@carefully-built/forms";
import { Button, cn } from "@carefully-built/ui";

import type { AuthFormState } from "../types";

import { AuthError } from "./auth-error";

interface ForgotPasswordFormProps<
  TValues extends FieldValues,
> extends AuthFormState<TValues> {
  readonly sent?: boolean;
  readonly email?: string;
  readonly loginHref?: string;
  readonly className?: string;
  readonly sentClassName?: string;
  readonly linkClassName?: string;
  readonly errorClassName?: string;
  readonly buttonClassName?: string;
}

export function ForgotPasswordForm<TValues extends FieldValues>({
  form,
  onSubmit,
  loading = false,
  sent = false,
  error,
  email,
  loginHref = "/login/email",
  className,
  sentClassName,
  linkClassName,
  errorClassName,
  buttonClassName,
}: ForgotPasswordFormProps<TValues>): React.ReactElement {
  if (sent) {
    return (
      <div className={cn("space-y-4 text-center", sentClassName)}>
        <p className="text-muted-foreground text-sm">
          Abbiamo inviato un link per reimpostare la password
          {email ? (
            <>
              {" "}
              a <strong>{email}</strong>
            </>
          ) : null}
        </p>
        <a className={cn("text-sm underline", linkClassName)} href={loginHref}>
          Torna al login
        </a>
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
        <CustomInputField<TValues>
          name={"email" as Path<TValues>}
          label="Email"
          placeholder="tuaemail@gmail.com"
          type="email"
          autoFocus
          disabled={loading}
        />

        <AuthError error={error} className={errorClassName} />

        <Button className={cn("w-full", buttonClassName)} disabled={loading} type="submit">
          {loading ? "Sending..." : "Send reset link"}
        </Button>

        <p className="text-muted-foreground text-center text-sm">
          <a className={cn("underline", linkClassName)} href={loginHref}>
            Back to login
          </a>
        </p>
      </form>
    </FormProvider>
  );
}
