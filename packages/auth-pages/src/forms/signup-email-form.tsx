"use client";

import { FormProvider } from "react-hook-form";

import type { FieldValues, Path } from "react-hook-form";

import { CustomInputField, CustomPasswordField } from "@carefully-built/forms";
import { Button } from "@carefully-built/ui";

import type { AuthFormState } from "../types";

import { AuthError } from "./auth-error";

export function SignupEmailForm<TValues extends FieldValues>({
  form,
  onSubmit,
  loading = false,
  error,
}: AuthFormState<TValues>): React.ReactElement {
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

        <CustomPasswordField<TValues>
          name={"password" as Path<TValues>}
          label="Password"
          placeholder="Almeno 8 caratteri"
          autoComplete="new-password"
          disabled={loading}
        />

        <AuthError error={error} />

        <Button className="w-full" disabled={loading} type="submit">
          {loading ? "Creazione account..." : "Registrati"}
        </Button>
      </form>
    </FormProvider>
  );
}
