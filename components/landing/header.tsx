"use client";
import { useActionState, useEffect, useId, useRef, useState } from "react";
import { AVATAR_TONES, type PublicViewer } from "../../lib/profile";
import { NAV } from "../../lib/landing-content";
import { INITIAL_AUTH_STATE } from "../../lib/auth/validation";
import { signOut } from "../../app/auth/actions";
import SessionRefresh from "../auth/session-refresh";
import { Arrow, Mark } from "./primitives";
import "./session-nav.css";

type Viewer = PublicViewer | null;
function LogoutControl() {
  const [state, action, pending] = useActionState(signOut, INITIAL_AUTH_STATE);
  return (
    <form action={action} className="sf-session-logout">
      <button type="submit" disabled={pending}>
        {pending ? "Signing out…" : "Sign out"}
        <span aria-hidden="true">↗</span>
      </button>
      {state.message && (
        <p className="sf-session-error" role="status">
          {state.message}
        </p>
      )}
    </form>
  );
}
function Profile({ email, displayName, avatarTone }: PublicViewer) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const name = displayName || email.split("@")[0] || "Account";
  const initial = Array.from(name)[0]?.toUpperCase() || "A";
  useEffect(() => {
    if (!open) return;
    function pointer(event: PointerEvent) {
      if (event.target instanceof Node && !root.current?.contains(event.target))
        setOpen(false);
    }
    function key(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    }
    document.addEventListener("pointerdown", pointer);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", pointer);
      document.removeEventListener("keydown", key);
    };
  }, [open]);
  return (
    <div
      className="sf-session-profile"
      ref={root}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          setOpen(false);
      }}
    >
      <button
        ref={trigger}
        type="button"
        className="sf-session-trigger"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="Account options"
        onClick={() => setOpen((value) => !value)}
      >
        <span
          className="sf-session-avatar"
          style={{
            background: AVATAR_TONES[avatarTone].background,
            color: AVATAR_TONES[avatarTone].color,
          }}
          aria-hidden="true"
        >
          {initial}
        </span>
        <span className="sf-session-name">{name}</span>
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="m4 6 4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div id={panelId} className="sf-session-panel" hidden={!open}>
        <div className="sf-session-identity">
          <strong>Your account</strong>
          <span>{email}</span>
          <small>Signed in · Email verified</small>
        </div>
        <a href="/dashboard">
          My dashboard <Arrow />
        </a>
        <a href="/dashboard/settings">
          Account settings <Arrow />
        </a>
        <LogoutControl />
      </div>
    </div>
  );
}
export default function Header({ viewer = null }: { viewer?: Viewer }) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  useEffect(() => {
    if (!open) return;
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    const desktop = window.matchMedia("(min-width: 900px)");
    const resize = () => {
      if (desktop.matches) setOpen(false);
    };
    window.addEventListener("keydown", escape);
    desktop.addEventListener("change", resize);
    return () => {
      window.removeEventListener("keydown", escape);
      desktop.removeEventListener("change", resize);
    };
  }, [open]);
  return (
    <header className="sf-header sf-session-header">
      <SessionRefresh />
      <div className="sf-shell sf-header-inner">
        <a className="sf-brand" href="#top" aria-label="StackForge home">
          <Mark />
          StackForge<span className="sf-alpha">PRE-LAUNCH</span>
        </a>
        <nav className="sf-desktop-nav" aria-label="Main navigation">
          {NAV.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="sf-session-actions">
          {viewer ? (
            <Profile key={viewer.email} {...viewer} />
          ) : (
            <div className="sf-session-guest">
              <a href="/login" className="sf-session-login">
                Sign in
              </a>
              <a href="/signup" className="sf-button sf-button-small">
                Create account <Arrow />
              </a>
            </div>
          )}
          <button
            ref={toggleRef}
            type="button"
            className="sf-menu-button"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close navigation" : "Open navigation"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "Close" : "Menu"}
            <span aria-hidden="true">{open ? "×" : "="}</span>
          </button>
        </div>
      </div>
      <nav
        id={menuId}
        className="sf-mobile-nav"
        aria-label="Mobile navigation"
        hidden={!open}
      >
        {NAV.map((item) => (
          <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
            {item.label}
            <Arrow />
          </a>
        ))}
        {viewer ? (
          <>
            <div className="sf-session-mobile-identity">
              Signed in as <strong>{viewer.email}</strong>
            </div>
            <a href="/dashboard">
              My dashboard <Arrow />
            </a>
            <LogoutControl />
          </>
        ) : (
          <>
            <a href="/login">
              Sign in <Arrow />
            </a>
            <a href="/signup">
              Create account <Arrow />
            </a>
          </>
        )}
      </nav>
    </header>
  );
}
