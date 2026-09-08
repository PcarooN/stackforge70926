"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Re-check the server session after focus/return/back-forward navigation.
// No access tokens or auth flags are stored in localStorage.
export default function SessionRefresh() {
  const router = useRouter();
  useEffect(() => {
    let last = 0;
    function refresh() {
      if (document.visibilityState !== "visible" || Date.now() - last < 1000)
        return;
      last = Date.now();
      router.refresh();
    }
    function onPageShow(event: PageTransitionEvent) {
      if (event.persisted) refresh();
    }
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [router]);
  return null;
}
