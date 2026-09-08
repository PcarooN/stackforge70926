import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  authEnvironment,
  authCookieOptions,
  isAuthConfigured,
} from "../auth/environment";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const secureHeaders = (res: NextResponse) => {
    res.headers.set("Cache-Control", "private, no-store, max-age=0");
    res.headers.set("Pragma", "no-cache");
    res.headers.set("Expires", "0");
    res.headers.set("Referrer-Policy", "no-referrer");
    res.headers.set("X-Content-Type-Options", "nosniff");
    res.headers.set("X-Frame-Options", "DENY");
    return res;
  };
  if (!isAuthConfigured()) return secureHeaders(response);
  const { url, key } = authEnvironment();
  const supabase = createServerClient(url, key, {
    cookieOptions: authCookieOptions,
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(values, cacheHeaders?: Record<string, string>) {
        values.forEach(({ name, value }) => request.cookies.set(name, value));
        const previous = response;
        response = NextResponse.next({ request });
        previous.headers.forEach((value, name) => {
          if (name.toLowerCase() !== "set-cookie")
            response.headers.set(name, value);
        });
        previous.cookies
          .getAll()
          .forEach((cookie) => response.cookies.set(cookie));
        values.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
        Object.entries(cacheHeaders ?? {}).forEach(([name, value]) =>
          response.headers.set(name, value),
        );
      },
    },
  });
  // Verify/refresh the JWT, not the unvalidated user object from getSession().
  // Authorization happens again beside protected data in requireUser().
  try {
    await supabase.auth.getClaims();
  } catch {
    /* Protected pages fail closed. */
  }
  return secureHeaders(response);
}
