"use client";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { SITE } from "../../lib/site-config";
import { Arrow, Label } from "./primitives";
type FormStatus = {
  state: "idle" | "submitting" | "success" | "error";
  message: string;
};

export default function EarlyAccess() {
  const [status, setStatus] = useState<FormStatus>({
    state: "idle",
    message: "",
  });
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const requestRef = useRef<AbortController | null>(null);
  const emailId = useId();
  const consentId = useId();
  const feedbackId = useId();
  // Same-origin endpoint only. A real privacy notice is required to enable collection.
  const endpoint = SITE.waitlistEndpoint;
  const enabled = Boolean(
    endpoint?.startsWith("/") && !endpoint.startsWith("//") && SITE.privacyUrl,
  );

  useEffect(() => () => requestRef.current?.abort(), []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enabled || !endpoint || !consent || requestRef.current) return;
    const controller = new AbortController();
    requestRef.current = controller;
    setStatus({ state: "submitting", message: "Submitting your request…" });
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          email: email.trim(),
          source: "stackforge-landing",
        }),
        signal: controller.signal,
      });
      const body: unknown = await response.json().catch(() => null);
      if (
        !response.ok ||
        typeof body !== "object" ||
        body === null ||
        !("ok" in body) ||
        body.ok !== true
      ) {
        throw new Error(
          response.status === 429
            ? "Too many attempts. Please try again later."
            : "We couldn’t confirm your request. Please try again.",
        );
      }
      setStatus({
        state: "success",
        message:
          "Your request was received. Check your inbox for any confirmation steps.",
      });
      setEmail("");
      setConsent(false);
    } catch (error) {
      setStatus({
        state: "error",
        message: controller.signal.aborted
          ? "The request timed out. Please try again."
          : error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      window.clearTimeout(timeout);
      requestRef.current = null;
    }
  }

  return (
    <section
      id="early-access"
      className="sf-shell sf-section"
      aria-labelledby="access-title"
    >
      <div className="sf-access">
        <div>
          <Label>BUILT WITH SERVER OWNERS</Label>
          <h2 id="access-title">
            Help shape
            <br />
            the first version.
          </h2>
          <p>
            The next step is listening to real server owners: what you want to
            build, what breaks today, and what would actually save you time.
          </p>
        </div>
        <div className="sf-access-form">
          {enabled ? (
            <form onSubmit={onSubmit} aria-busy={status.state === "submitting"}>
              <label htmlFor={emailId}>Email address</label>
              <div className="sf-email-row">
                <input
                  id={emailId}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  disabled={status.state === "submitting"}
                  aria-describedby={feedbackId}
                />
                <button
                  className="sf-button"
                  type="submit"
                  disabled={status.state === "submitting" || !consent}
                >
                  {status.state === "submitting" ? "Sending…" : "Join waitlist"}
                  <Arrow />
                </button>
              </div>
              <div className="sf-consent">
                <input
                  id={consentId}
                  type="checkbox"
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                  required
                  disabled={status.state === "submitting"}
                />
                <label htmlFor={consentId}>
                  I agree to receive StackForge early-access emails. See the{" "}
                  <a href={SITE.privacyUrl ?? undefined}>privacy notice</a>.
                </label>
              </div>
              <p
                id={feedbackId}
                className={`sf-form-message${status.state === "error" ? " sf-form-error" : ""}`}
                role="status"
                aria-live="polite"
              >
                {status.message ||
                  "Early access is not a purchase or a guarantee of admission."}
              </p>
            </form>
          ) : (
            <div className="sf-registration-note">
              <span className="sf-status">Registration not open yet</span>
              <h3>Explore first. Sign up later.</h3>
              <p>
                Waitlist registration will open when the signup service and
                privacy notice are ready. This preview does not collect your
                email.
              </p>
              <a className="sf-button" href="#preview">
                Try the concept <Arrow />
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
