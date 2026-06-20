const INVITATION_TOKEN_STATE_PARAM = "invitation_token";

export interface WorkOSAuthActionResult {
  readonly success: boolean;
  readonly error?: string;
}

export interface WorkOSAuthenticatedUser {
  readonly id?: string;
  readonly email?: string;
  readonly [key: string]: unknown;
}

export interface WorkOSCreateSessionArgs<TUser = WorkOSAuthenticatedUser> {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly user: TUser;
  readonly organizationId?: string;
}

interface AuthenticateWithPasswordResult<TUser> {
  readonly user: TUser;
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly organizationId?: string;
}

export interface WorkOSAuthProvider<TUser = WorkOSAuthenticatedUser> {
  readonly userManagement: {
    readonly getAuthorizationUrl: (args: {
      readonly clientId: string;
      readonly redirectUri: string;
      readonly provider: "GoogleOAuth" | string;
      readonly state?: string;
    }) => string;
    readonly createUser: (args: {
      readonly email: string;
      readonly password: string;
      readonly emailVerified?: boolean;
    }) => Promise<unknown>;
    readonly authenticateWithPassword: (args: {
      readonly clientId: string;
      readonly email: string;
      readonly password: string;
      readonly invitationToken?: string;
    }) => Promise<AuthenticateWithPasswordResult<TUser>>;
    readonly createPasswordReset: (args: {
      readonly email: string;
    }) => Promise<unknown>;
    readonly resetPassword: (args: {
      readonly token: string;
      readonly newPassword: string;
    }) => Promise<unknown>;
  };
}

export interface WorkOSAuthMessages {
  readonly signInFailed?: string;
  readonly signUpFailed?: string;
  readonly resetEmailFailed?: string;
  readonly resetPasswordFailed?: string;
}

export interface WorkOSAuthActionsConfig<TUser = WorkOSAuthenticatedUser> {
  readonly workos: WorkOSAuthProvider<TUser>;
  readonly clientId: string;
  readonly getRedirectUri: () => Promise<string> | string;
  readonly createSession: (args: WorkOSCreateSessionArgs<TUser>) => Promise<void>;
  readonly deleteSession: () => Promise<void>;
  readonly redirect: (path: string) => never;
  readonly onAuthenticated?: (
    user: TUser,
    organizationId?: string,
  ) => Promise<void> | void;
  readonly defaultAuthenticatedPath?: string;
  readonly afterSignOutPath?: string;
  readonly getUserFacingErrorMessage?: (
    error: unknown,
    fallback: string,
  ) => string;
  readonly messages?: WorkOSAuthMessages;
}

export interface WorkOSAuthActions {
  readonly getGoogleAuthUrl: (invitationToken?: string) => Promise<string>;
  readonly signUp: (formData: FormData) => Promise<WorkOSAuthActionResult>;
  readonly signIn: (formData: FormData) => Promise<WorkOSAuthActionResult>;
  readonly sendPasswordResetEmail: (
    email: string,
  ) => Promise<WorkOSAuthActionResult>;
  readonly resetPassword: (
    token: string,
    newPassword: string,
  ) => Promise<WorkOSAuthActionResult>;
  readonly signOutAction: () => Promise<void>;
}

function getStringFormValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export function getFormInvitationToken(formData: FormData): string | undefined {
  const invitationToken = formData.get("invitationToken");

  if (typeof invitationToken !== "string") {
    return undefined;
  }

  return invitationToken.trim() || undefined;
}

export function appendInvitationToken(
  path: string,
  invitationToken: string | null,
): string {
  if (!invitationToken) {
    return path;
  }

  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${INVITATION_TOKEN_STATE_PARAM}=${encodeURIComponent(invitationToken)}`;
}

function getUserFacingErrorMessage<TUser>(
  config: WorkOSAuthActionsConfig<TUser>,
  error: unknown,
  fallback: string,
): string {
  return config.getUserFacingErrorMessage?.(error, fallback) ?? fallback;
}

async function completePasswordAuthentication<TUser>(
  config: WorkOSAuthActionsConfig<TUser>,
  args: {
    readonly email: string;
    readonly password: string;
    readonly invitationToken?: string;
  },
): Promise<void> {
  const { user, accessToken, refreshToken, organizationId } =
    await config.workos.userManagement.authenticateWithPassword({
      clientId: config.clientId,
      email: args.email,
      password: args.password,
      invitationToken: args.invitationToken,
    });

  await config.createSession({
    accessToken,
    refreshToken,
    user,
    organizationId,
  });
  await config.onAuthenticated?.(user, organizationId);
}

export function createWorkOSAuthActions<TUser = WorkOSAuthenticatedUser>(
  config: WorkOSAuthActionsConfig<TUser>,
): WorkOSAuthActions {
  async function getGoogleAuthUrl(invitationToken?: string): Promise<string> {
    const redirectUri = await config.getRedirectUri();

    return config.workos.userManagement.getAuthorizationUrl({
      clientId: config.clientId,
      redirectUri,
      provider: "GoogleOAuth",
      state: appendInvitationToken(
        config.defaultAuthenticatedPath ?? "/dashboard",
        invitationToken ?? null,
      ),
    });
  }

  async function signUp(
    formData: FormData,
  ): Promise<WorkOSAuthActionResult> {
    const email = getStringFormValue(formData, "email");
    const password = getStringFormValue(formData, "password");
    const invitationToken = getFormInvitationToken(formData);

    try {
      await config.workos.userManagement.createUser({
        email,
        password,
        emailVerified: true,
      });

      await completePasswordAuthentication(config, {
        email,
        password,
        invitationToken,
      });

      return { success: true };
    } catch (error) {
      console.error("Sign up error:", error);
      return {
        success: false,
        error: getUserFacingErrorMessage(
          config,
          error,
          config.messages?.signUpFailed ?? "Unable to create the account",
        ),
      };
    }
  }

  async function signIn(
    formData: FormData,
  ): Promise<WorkOSAuthActionResult> {
    const email = getStringFormValue(formData, "email");
    const password = getStringFormValue(formData, "password");
    const invitationToken = getFormInvitationToken(formData);

    try {
      await completePasswordAuthentication(config, {
        email,
        password,
        invitationToken,
      });

      return { success: true };
    } catch (error) {
      console.error("Sign in error:", error);
      return {
        success: false,
        error: getUserFacingErrorMessage(
          config,
          error,
          config.messages?.signInFailed ?? "Invalid email or password",
        ),
      };
    }
  }

  async function sendPasswordResetEmail(
    email: string,
  ): Promise<WorkOSAuthActionResult> {
    try {
      await config.workos.userManagement.createPasswordReset({
        email,
      });

      return { success: true };
    } catch (error) {
      console.error("Password reset error:", error);
      return {
        success: false,
        error: getUserFacingErrorMessage(
          config,
          error,
          config.messages?.resetEmailFailed ??
            "Unable to send the reset email",
        ),
      };
    }
  }

  async function resetPassword(
    token: string,
    newPassword: string,
  ): Promise<WorkOSAuthActionResult> {
    try {
      await config.workos.userManagement.resetPassword({
        token,
        newPassword,
      });

      return { success: true };
    } catch (error) {
      console.error("Password reset error:", error);
      return {
        success: false,
        error: getUserFacingErrorMessage(
          config,
          error,
          config.messages?.resetPasswordFailed ??
            "Unable to reset the password",
        ),
      };
    }
  }

  async function signOutAction(): Promise<void> {
    await config.deleteSession();
    config.redirect(config.afterSignOutPath ?? "/");
  }

  return {
    getGoogleAuthUrl,
    signUp,
    signIn,
    sendPasswordResetEmail,
    resetPassword,
    signOutAction,
  };
}
