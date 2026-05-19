"use client";

import { FormProvider } from "react-hook-form";

import type { FieldValues, Path } from "react-hook-form";

import { CustomInputField, CustomPasswordField } from "@carefully-built/forms";
import { Button } from "@carefully-built/ui";

import type { AuthFormState } from "../types";

import { AuthError } from "./auth-error";

interface LoginEmailFormProps<
  TValues extends FieldValues,
> extends AuthFormState<TValues> {
  readonly forgotPasswordHref?: string;
}

export function LoginEmailForm<TValues extends FieldValues>({
  form,
  onSubmit,
  loading = false,
  error,
  forgotPasswordHref = "/forgot-password",
}: LoginEmailFormProps<TValues>): React.ReactElement {
  return (
    <FormProvider {...form}>
      <form
        className="space-y-3"
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

        <div className="space-y-2">
          <CustomPasswordField<TValues>
            name={"password" as Path<TValues>}
            label="Password"
            autoComplete="current-password"
            disabled={loading}
          />
          <div className="flex justify-end">
            <a
              className="text-sm underline-offset-4 hover:underline"
              href={forgotPasswordHref}
            >
              Hai dimenticato la password?
            </a>
          </div>
        </div>

        <AuthError error={error} />

        <Button className="w-full" disabled={loading} type="submit">
          {loading ? "Accesso in corso..." : "Accedi"}
        </Button>
      </form>
    </FormProvider>
  );
}
