import type { ReactNode } from "react";
export function AuthBrand() {
  return (
    <a className="auth-brand" href="/" aria-label="StackForge home">
      <span className="auth-mark" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="7" height="7" rx="2" fill="currentColor" />
          <rect x="14" y="14" width="7" height="7" rx="2" fill="currentColor" />
          <path d="M10 6.5h7.5V14" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      </span>
      StackForge
    </a>
  );
}
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="auth-root">
      <a className="auth-skip" href="#auth-content">
        Skip to form
      </a>
      <header className="auth-header">
        <AuthBrand />
        <a href="/">
          Back to website <span aria-hidden="true">↗</span>
        </a>
      </header>
      <main className="auth-layout">
        <aside className="auth-story">
          <p className="auth-eyebrow">YOUR SERVER. YOUR RULES.</p>
          <h1>
            Start with an idea.
            <br />
            <span>Make it your world.</span>
          </h1>
          <p>
            Your StackForge account is the first step. The visual game-system
            builder is still in development.
          </p>
          <div
            className="auth-story-flow"
            aria-label="Concept: trigger, condition, action"
          >
            <span>01 · Trigger</span>
            <i aria-hidden="true">↓</i>
            <span>02 · Condition</span>
            <i aria-hidden="true">↓</i>
            <span>03 · Action</span>
          </div>
          <p className="auth-story-foot">
            An account today. More to build next.
          </p>
        </aside>
        <section className="auth-main" id="auth-content">
          {children}
        </section>
      </main>
      <footer className="auth-footer">
        StackForge · Early development
        <span>No payment required to create an account.</span>
      </footer>
    </div>
  );
}
export function AuthCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="auth-card">
      <p className="auth-eyebrow">STACKFORGE ACCOUNT</p>
      <h2>{title}</h2>
      <p className="auth-description">{description}</p>
      {children}
    </div>
  );
}
export function AuthSetupNotice() {
  return (
    <div className="auth-message auth-notice" role="status">
      Account access is not configured yet. Please check back soon.
    </div>
  );
}
