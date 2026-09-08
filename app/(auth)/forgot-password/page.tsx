import type { Metadata } from "next";
import { AuthForm } from "../../../components/auth/auth-form";
import { AuthCard, AuthSetupNotice } from "../../../components/auth/auth-shell";
import { isAuthConfigured } from "../../../lib/auth/environment";
import { requestPasswordReset } from "../../auth/actions";
export const metadata: Metadata = { title: "Let’s get you back in." };
export default function Page() {
  return (
    <AuthCard
      title="Let’s get you back in."
      description="Enter your account email and we’ll send instructions to reset your password."
    >
      {isAuthConfigured() ? (
        <AuthForm mode="forgot" action={requestPasswordReset} />
      ) : (
        <AuthSetupNotice />
      )}
    </AuthCard>
  );
}
