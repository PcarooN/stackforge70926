import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";
import { readProfile, readPreferences } from "../../../../lib/profile";
export const dynamic = "force-dynamic";
export async function GET() {
  const headers = {
    "Cache-Control": "private, no-store, max-age=0",
    "X-Content-Type-Options": "nosniff",
  };
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user?.email_confirmed_at)
      return NextResponse.json(
        { error: "Sign in to export your account details." },
        { status: 401, headers },
      );
    const user = data.user;
    return NextResponse.json(
      {
        format: "stackforge-account/v1",
        email: user.email,
        createdAt: user.created_at,
        emailVerified: Boolean(user.email_confirmed_at),
        profile: readProfile(user.user_metadata),
        preferences: readPreferences(user.user_metadata),
        scope:
          "Account profile and display preferences only. This is not a complete export of provider logs or future product data.",
      },
      {
        headers: {
          ...headers,
          "Content-Disposition":
            'attachment; filename="stackforge-account.json"',
        },
      },
    );
  } catch {
    return NextResponse.json(
      { error: "Account export is temporarily unavailable." },
      { status: 503, headers },
    );
  }
}
