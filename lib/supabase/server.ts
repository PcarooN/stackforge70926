import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { authEnvironment, authCookieOptions } from "../auth/environment";

// All authentication is server-side. Do not add a browser client using these
// HttpOnly session cookies without deliberately revisiting this architecture.
export async function createClient(mode: "read" | "write" = "read") {
  const { url, key } = authEnvironment();
  const store = await cookies();
  return createServerClient(url, key, {
    cookieOptions: authCookieOptions,
    cookies: {
      getAll() {
        return store.getAll();
      },
      setAll(values) {
        if (mode === "write") {
          values.forEach(({ name, value, options }) =>
            store.set(name, value, options),
          );
          return;
        }
        try {
          values.forEach(({ name, value, options }) =>
            store.set(name, value, options),
          );
        } catch {
          /* Read-only Server Component; proxy refreshes cookies first. */
        }
      },
    },
  });
}
