import { redirectIfAuthenticated } from "../../../lib/auth/current-user";
import type { Metadata } from "next";
import { AuthForm } from "../../../components/auth/auth-form";
import { AuthCard, AuthSetupNotice } from "../../../components/auth/auth-shell";
import { isAuthConfigured } from "../../../lib/auth/environment";
import { signUp } from "../../auth/actions";
export const metadata: Metadata = { title: "Your next chapter." };
export default async function Page() {
  await redirectIfAuthenticated();
  return (
    <AuthCard
      title="Your next chapter."
      description="Create an account. Confirm your email to get started."
    >
      {isAuthConfigured() ? (
        <AuthForm mode="signup" action={signUp} />
      ) : (
        <AuthSetupNotice />
      )}
    </AuthCard>
  );
}
