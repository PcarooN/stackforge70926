import { redirectIfAuthenticated } from "../../../lib/auth/current-user";
import type { Metadata } from "next";
import { AuthForm } from "../../../components/auth/auth-form";
import { AuthCard, AuthSetupNotice } from "../../../components/auth/auth-shell";
import { isAuthConfigured } from "../../../lib/auth/environment";
import { signIn } from "../../auth/actions";
export const metadata: Metadata = { title: "Sign in" };
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  await redirectIfAuthenticated();
  const { notice } = await searchParams;
  const message =
    notice === "password-updated"
      ? "Password updated. Sign in with your new password."
      : notice === "signed-out"
        ? "You have been signed out of this browser."
        : null;
  return (
    <AuthCard
      title="Welcome back."
      description="Sign in to your StackForge account."
    >
      {message && (
        <p className="auth-message auth-notice" role="status">
          {message}
        </p>
      )}
      {isAuthConfigured() ? (
        <AuthForm mode="login" action={signIn} />
      ) : (
        <AuthSetupNotice />
      )}
    </AuthCard>
  );
}
