"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.email("Enter a valid email address"),
});

export const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signupSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;

export interface AuthActionResult {
  readonly success: boolean;
  readonly error?: string;
}

interface AuthControllerMessages {
  readonly unexpectedError?: string;
}

interface EmailPasswordAuthOptions {
  readonly invitationToken?: string | null;
  readonly onSuccess?: () => void;
  readonly messages?: AuthControllerMessages;
}

export interface UseLoginFormOptions extends EmailPasswordAuthOptions {
  readonly signIn: (formData: FormData) => Promise<AuthActionResult>;
}

export interface UseLoginFormResult {
  readonly form: ReturnType<typeof useForm<LoginFormData>>;
  readonly onSubmit: (data: LoginFormData) => Promise<void>;
  readonly loading: boolean;
  readonly error: string | undefined;
}

function buildEmailPasswordFormData(
  data: LoginFormData | SignupFormData,
  invitationToken?: string | null,
): FormData {
  const formData = new FormData();
  formData.append("email", data.email);
  formData.append("password", data.password);

  if (invitationToken) {
    formData.append("invitationToken", invitationToken);
  }

  return formData;
}

export function useLoginForm({
  signIn,
  invitationToken,
  onSuccess,
  messages,
}: UseLoginFormOptions): UseLoginFormResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormData): Promise<void> {
    setLoading(true);
    setError(undefined);

    try {
      const result = await signIn(buildEmailPasswordFormData(data, invitationToken));

      if (result.success) {
        onSuccess?.();
        return;
      }

      setError(result.error);
      form.setValue("password", "");
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : messages?.unexpectedError ?? "An unexpected error occurred",
      );
      form.setValue("password", "");
    } finally {
      setLoading(false);
    }
  }

  return {
    form,
    onSubmit,
    loading,
    error,
  };
}

export interface UseSignupFormOptions extends EmailPasswordAuthOptions {
  readonly signUp: (formData: FormData) => Promise<AuthActionResult>;
}

export interface UseSignupFormResult {
  readonly form: ReturnType<typeof useForm<SignupFormData>>;
  readonly onSubmit: (data: SignupFormData) => Promise<void>;
  readonly loading: boolean;
  readonly error: string | undefined;
}

export function useSignupForm({
  signUp,
  invitationToken,
  onSuccess,
  messages,
}: UseSignupFormOptions): UseSignupFormResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: SignupFormData): Promise<void> {
    setLoading(true);
    setError(undefined);

    try {
      const result = await signUp(buildEmailPasswordFormData(data, invitationToken));

      if (result.success) {
        onSuccess?.();
        return;
      }

      setError(result.error);
      form.setValue("password", "");
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : messages?.unexpectedError ?? "An unexpected error occurred",
      );
      form.setValue("password", "");
    } finally {
      setLoading(false);
    }
  }

  return {
    form,
    onSubmit,
    loading,
    error,
  };
}

export interface UseForgotPasswordFormOptions {
  readonly sendPasswordResetEmail: (email: string) => Promise<AuthActionResult>;
  readonly messages?: AuthControllerMessages;
}

export interface UseForgotPasswordFormResult {
  readonly form: ReturnType<typeof useForm<ForgotPasswordFormData>>;
  readonly onSubmit: (data: ForgotPasswordFormData) => Promise<void>;
  readonly loading: boolean;
  readonly sent: boolean;
  readonly error: string | undefined;
  readonly email: string;
}

export function useForgotPasswordForm({
  sendPasswordResetEmail,
  messages,
}: UseForgotPasswordFormOptions): UseForgotPasswordFormResult {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [email, setEmail] = useState("");

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: ForgotPasswordFormData): Promise<void> {
    setLoading(true);
    setError(undefined);
    setEmail(data.email);

    try {
      const result = await sendPasswordResetEmail(data.email);

      if (result.success) {
        setSent(true);
      } else {
        setError(result.error);
      }
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : messages?.unexpectedError ?? "An unexpected error occurred",
      );
    } finally {
      setLoading(false);
    }
  }

  return {
    form,
    onSubmit,
    loading,
    sent,
    error,
    email,
  };
}

export interface UseUpdatePasswordFormOptions {
  readonly token: string | null;
  readonly resetPassword: (
    token: string,
    newPassword: string,
  ) => Promise<AuthActionResult>;
  readonly onSuccess?: () => void;
  readonly messages?: AuthControllerMessages & {
    readonly invalidToken?: string;
  };
}

export interface UseUpdatePasswordFormResult {
  readonly form: ReturnType<typeof useForm<ResetPasswordFormData>>;
  readonly onSubmit: (data: ResetPasswordFormData) => Promise<void>;
  readonly loading: boolean;
  readonly error: string | undefined;
  readonly token: string | null;
}

export function useUpdatePasswordForm({
  token,
  resetPassword,
  onSuccess,
  messages,
}: UseUpdatePasswordFormOptions): UseUpdatePasswordFormResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: ResetPasswordFormData): Promise<void> {
    setLoading(true);
    setError(undefined);

    if (!token) {
      setError(messages?.invalidToken ?? "Invalid reset token");
      setLoading(false);
      return;
    }

    try {
      const result = await resetPassword(token, data.password);

      if (result.success) {
        onSuccess?.();
      } else {
        setError(result.error);
      }
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : messages?.unexpectedError ?? "An unexpected error occurred",
      );
    } finally {
      setLoading(false);
    }
  }

  return {
    form,
    onSubmit,
    loading,
    error,
    token,
  };
}
