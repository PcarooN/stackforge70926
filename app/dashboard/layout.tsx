import type { Metadata } from "next";
import type { ReactNode } from "react";
import { requireUser } from "../../lib/auth/require-user";
import { readProfile, readPreferences } from "../../lib/profile";
import DashboardShell from "../../components/dashboard/shell";
import "../../components/dashboard/studio.css";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: { default: "Workspace | StackForge", template: "%s | StackForge" },
  robots: { index: false, follow: false },
};
export default async function Layout({ children }: { children: ReactNode }) {
  const { user } = await requireUser();
  const profile = readProfile(user.user_metadata);
  return (
    <DashboardShell
      viewer={{
        email: user.email!,
        displayName: profile.displayName,
        avatarTone: profile.avatarTone,
        preferences: readPreferences(user.user_metadata),
      }}
    >
      {children}
    </DashboardShell>
  );
}
