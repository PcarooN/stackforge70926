import type { Metadata } from "next";
import { AuthForm } from "../../../components/auth/auth-form";
import { AuthCard } from "../../../components/auth/auth-shell";
import { requireUser } from "../../../lib/auth/require-user";
import { updatePassword } from "../../auth/actions";
import { redirect } from "next/navigation";
import { hasRecovery } from "../../../lib/auth/recovery";
export const metadata: Metadata = { title: "Reset password" };
export default async function ResetPasswordPage() {
  const { supabase } = await requireUser();
  if (!(await hasRecovery(supabase))) redirect("/forgot-password");
  return (
    <AuthCard
      title="A fresh start."
      description="Choose a new password for the verified account in this browser. You’ll sign in again after saving."
    >
      <AuthForm mode="reset" action={updatePassword} />
    </AuthCard>
  );
}
