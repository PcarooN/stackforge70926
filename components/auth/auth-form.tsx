"use client";
import { useActionState, useId, useState } from "react";
import {
  INITIAL_AUTH_STATE,
  type AuthMode,
  type AuthState,
} from "../../lib/auth/validation";

type Action = (state: AuthState, form: FormData) => Promise<AuthState>;
const labels = {
  login: "Sign in",
  signup: "Create account",
  forgot: "Send reset email",
  reset: "Save new password",
};
export function AuthForm({ mode, action }: { mode: AuthMode; action: Action }) {
  const [state, formAction, pending] = useActionState(
    action,
    INITIAL_AUTH_STATE,
  );
  const [show, setShow] = useState(false);
  const id = useId();
  const hasPassword = mode !== "forgot";
  const isNew = mode === "signup" || mode === "reset";
  if (state.status === "success")
    return (
      <div className="auth-success" role="status">
        <span className="auth-success-mark" aria-hidden="true">
          ✓
        </span>
        <h2>Check your inbox</h2>
        <p>{state.message}</p>
        <a className="auth-button auth-secondary" href="/login">
          Back to sign in
        </a>
      </div>
    );
  return (
    <form action={formAction} className="auth-form" aria-busy={pending}>
      <fieldset disabled={pending}>
        {mode !== "reset" && (
          <div className="auth-field">
            <label htmlFor={`${id}-email`}>Email address</label>
            <input
              id={`${id}-email`}
              name="email"
              type="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              maxLength={254}
              defaultValue={state.email}
              placeholder="you@example.com"
              required
              aria-describedby={`${id}-message`}
            />
          </div>
        )}
        {hasPassword && (
          <div className="auth-field">
            <label htmlFor={`${id}-password`}>
              {mode === "reset" ? "New password" : "Password"}
            </label>
            <div className="auth-password">
              <input
                id={`${id}-password`}
                name="password"
                type={show ? "text" : "password"}
                autoComplete={isNew ? "new-password" : "current-password"}
                minLength={isNew ? 12 : undefined}
                maxLength={isNew ? 72 : 1024}
                required
                aria-describedby={`${id}-message${isNew ? ` ${id}-hint` : ""}`}
              />
              <button
                type="button"
                onClick={() => setShow((value) => !value)}
                aria-label={show ? "Hide passwords" : "Show passwords"}
                aria-pressed={show}
              >
                {show ? "Hide" : "Show"}
              </button>
            </div>
            {isNew && (
              <p className="auth-hint" id={`${id}-hint`}>
                At least 12 characters. Use a unique password or passphrase;
                maximum 72 UTF-8 bytes.
              </p>
            )}
          </div>
        )}
        {isNew && (
          <div className="auth-field">
            <label htmlFor={`${id}-confirm`}>Confirm password</label>
            <input
              id={`${id}-confirm`}
              name="confirmPassword"
              type={show ? "text" : "password"}
              autoComplete="new-password"
              minLength={12}
              maxLength={72}
              required
              aria-describedby={`${id}-message`}
            />
          </div>
        )}
        {mode === "login" && (
          <a className="auth-forgot" href="/forgot-password">
            Forgot password?
          </a>
        )}
        <p
          id={`${id}-message`}
          className={
            state.status === "error"
              ? "auth-message auth-error"
              : "auth-message"
          }
          role="status"
          aria-live="polite"
        >
          {state.message}
        </p>
        <button className="auth-button" type="submit" disabled={pending}>
          {pending ? "Please wait…" : labels[mode]}
          <span aria-hidden="true">→</span>
        </button>
      </fieldset>
      {mode === "login" && (
        <p className="auth-form-footer">
          New to StackForge? <a href="/signup">Create an account</a>
        </p>
      )}
      {mode === "signup" && (
        <p className="auth-form-footer">
          Already have an account? <a href="/login">Sign in</a>
        </p>
      )}
      {(mode === "forgot" || mode === "reset") && (
        <p className="auth-form-footer">
          <a href="/login">Back to sign in</a>
        </p>
      )}
    </form>
  );
}

export function ConfirmationForm({
  action,
  token,
  type,
}: {
  action: Action;
  token: string;
  type: "email" | "recovery";
}) {
  const [state, formAction, pending] = useActionState(
    action,
    INITIAL_AUTH_STATE,
  );
  return (
    <form action={formAction} aria-busy={pending}>
      <input type="hidden" name="token_hash" value={token} />
      <input type="hidden" name="type" value={type} />
      <p className="auth-message auth-error" role="status">
        {state.message}
      </p>
      <button className="auth-button" type="submit" disabled={pending}>
        {pending
          ? "Verifying…"
          : type === "recovery"
            ? "Continue to password reset"
            : "Confirm my email"}
        <span aria-hidden="true">→</span>
      </button>
      <p className="auth-form-footer">
        <a href="/forgot-password">Request a new reset email</a> ·{" "}
        <a href="/signup">Back to sign up</a>
      </p>
    </form>
  );
}

export function SignOutButton({
  action,
}: {
  action: () => Promise<AuthState>;
}) {
  const [state, formAction, pending] = useActionState(
    action,
    INITIAL_AUTH_STATE,
  );
  return (
    <form action={formAction}>
      <button
        type="submit"
        className="auth-button auth-secondary"
        disabled={pending}
      >
        {pending ? "Signing out…" : "Sign out"}
      </button>
      {state.message && (
        <p role="status" className="auth-message auth-error">
          {state.message}
        </p>
      )}
    </form>
  );
}
