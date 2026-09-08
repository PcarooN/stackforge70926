import SessionRefresh from "../../components/auth/session-refresh";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthShell } from "../../components/auth/auth-shell";
import "../../components/auth/auth.css";
import "../../components/auth/white-auth.css";
export const metadata: Metadata = {
  title: { default: "Account | StackForge", template: "%s | StackForge" },
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};
export const dynamic = "force-dynamic";
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AuthShell>
      <SessionRefresh />
      {children}
    </AuthShell>
  );
}
