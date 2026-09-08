import type { Metadata } from "next";
import { ConfirmationForm } from "../../../../components/auth/auth-form";
import {
  AuthCard,
  AuthSetupNotice,
} from "../../../../components/auth/auth-shell";
import { isAuthConfigured } from "../../../../lib/auth/environment";
import { confirmationType, validToken } from "../../../../lib/auth/validation";
import { confirmEmail } from "../../../auth/actions";
export const metadata: Metadata = { title: "Confirm account access" };
export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token_hash?: string; type?: string }>;
}) {
  const params = await searchParams;
  const type = confirmationType(params.type);
  if (!type || !validToken(params.token_hash))
    return (
      <AuthCard
        title="This link isn’t valid."
        description="Open the newest email from StackForge, or request another link."
      >
        <a href="/forgot-password" className="auth-button">
          Reset password
        </a>
        <p className="auth-form-footer">
          <a href="/signup">Back to sign up</a>
        </p>
      </AuthCard>
    );
  return (
    <AuthCard
      title={
        type === "recovery" ? "Reset your password." : "You’re one step away."
      }
      description={
        type === "recovery"
          ? "Continue to verify the email link and choose a new password."
          : "Confirm your email address to finish setting up your account."
      }
    >
      {isAuthConfigured() ? (
        <ConfirmationForm
          action={confirmEmail}
          token={params.token_hash}
          type={type}
        />
      ) : (
        <AuthSetupNotice />
      )}
    </AuthCard>
  );
}
