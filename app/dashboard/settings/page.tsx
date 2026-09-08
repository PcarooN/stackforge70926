import type { Metadata } from "next";
import { requireUser } from "../../../lib/auth/require-user";
import { readProfile, readPreferences } from "../../../lib/profile";
import Settings from "../../../components/dashboard/settings";
export const metadata: Metadata = { title: "Account settings" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ section?: string }>;
}) {
  const { user } = await requireUser();
  const params = await searchParams;
  const section =
    params.section === "security" || params.section === "preferences"
      ? params.section
      : "profile";
  const date = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(user.created_at));
  return (
    <Settings
      profile={readProfile(user.user_metadata)}
      preferences={readPreferences(user.user_metadata)}
      email={user.email!}
      createdAt={date}
      section={section}
    />
  );
}
