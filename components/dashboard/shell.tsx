"use client";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AVATAR_TONES, type PublicViewer } from "../../lib/profile";
import { SignOutButton } from "../auth/auth-form";
import { signOut } from "../../app/auth/actions";
import SessionRefresh from "../auth/session-refresh";
import { Mark } from "../landing/primitives";
import { Icon } from "./icon";
const links = [
  { href: "/dashboard", label: "Overview", icon: "home" },
  { href: "/dashboard/projects", label: "Local projects", icon: "grid" },
  { href: "/dashboard/templates", label: "Concept library", icon: "grid" },
  { href: "/dashboard/settings", label: "Account settings", icon: "settings" },
] as const;
export default function DashboardShell({
  viewer,
  children,
}: {
  viewer: PublicViewer;
  children: ReactNode;
}) {
  const path = usePathname();
  const name = viewer.displayName || viewer.email.split("@")[0];
  const tone = AVATAR_TONES[viewer.avatarTone];
  return (
    <div
      className="studio"
      data-reduced-motion={viewer.preferences.reducedMotion || undefined}
      data-compact={viewer.preferences.compact || undefined}
    >
      <SessionRefresh />
      <a className="studio-skip" href="#studio-content">
        Skip to content
      </a>
      <aside className="studio-sidebar">
        <a href="/" className="studio-brand">
          <Mark />
          StackForge<span>WORKSPACE</span>
        </a>
        <div className="studio-workspace-label">
          <span className="studio-workspace-icon">
            <Icon name="grid" />
          </span>
          <div>
            <strong>Personal workspace</strong>
            <small>Early development</small>
          </div>
        </div>
        <nav aria-label="Workspace">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={path === link.href ? "page" : undefined}
            >
              <Icon name={link.icon} />
              {link.label}
              {path === link.href && <span className="studio-active-dot" />}
            </a>
          ))}
        </nav>
        <div className="studio-sidebar-note">
          <Icon name="spark" />
          <strong>Built one block at a time.</strong>
          <p>The web builder comes first. Follow what’s planned next.</p>
          <a href="/#roadmap">
            Explore roadmap <Icon name="arrow" />
          </a>
        </div>
        <div className="studio-sidebar-user">
          <span
            className="studio-avatar"
            style={{ background: tone.background, color: tone.color }}
          >
            {Array.from(name)[0]?.toUpperCase() || "S"}
          </span>
          <div>
            <strong>{name}</strong>
            <span>{viewer.email}</span>
          </div>
        </div>
      </aside>
      <div className="studio-body">
        <header className="studio-topbar">
          <div className="studio-breadcrumb">
            Workspace <span>/</span>
            <strong>
              {links.find((x) => x.href === path)?.label || "Account"}
            </strong>
          </div>
          <div className="studio-top-actions">
            <span className="studio-verified">
              <Icon name="check" />
              Verified account
            </span>
            <a href="/" className="studio-website">
              Website <Icon name="arrow" />
            </a>
            <SignOutButton action={signOut} />
          </div>
        </header>
        <main id="studio-content" className="studio-main">
          {children}
        </main>
        <footer className="studio-footer">
          Your world, block by block.
          <span>Account access · No paid subscription</span>
        </footer>
      </div>
    </div>
  );
}
