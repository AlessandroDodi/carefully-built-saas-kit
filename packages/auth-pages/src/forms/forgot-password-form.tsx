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
  readonly emailLabel?: string;
  readonly emailPlaceholder?: string;
  readonly submitLabel?: string;
  readonly loadingLabel?: string;
  readonly backToLoginLabel?: string;
  /** Message shown once the link is sent. Default: Italian copy naming the address. */
  readonly renderSentMessage?: (email: string | undefined) => React.ReactNode;
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
  emailLabel = "Email",
  emailPlaceholder = "tuaemail@gmail.com",
  submitLabel = "Send reset link",
  loadingLabel = "Sending...",
  backToLoginLabel = "Back to login",
  renderSentMessage,
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
          {renderSentMessage ? (
            renderSentMessage(email)
          ) : (
            <>
              Abbiamo inviato un link per reimpostare la password
              {email ? (
                <>
                  {" "}
                  a <strong>{email}</strong>
                </>
              ) : null}
            </>
          )}
        </p>
        <a className={cn("text-sm underline", linkClassName)} href={loginHref}>
          {backToLoginLabel}
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
          label={emailLabel}
          placeholder={emailPlaceholder}
          type="email"
          autoFocus
          disabled={loading}
        />

        <AuthError error={error} className={errorClassName} />

        <Button className={cn("w-full", buttonClassName)} disabled={loading} type="submit">
          {loading ? loadingLabel : submitLabel}
        </Button>

        <p className="text-muted-foreground text-center text-sm">
          <a className={cn("underline", linkClassName)} href={loginHref}>
            {backToLoginLabel}
          </a>
        </p>
      </form>
    </FormProvider>
  );
}
