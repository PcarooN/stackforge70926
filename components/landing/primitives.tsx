import type { ReactNode } from "react";
export function Arrow({ down = false }: { down?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      style={down ? { transform: "rotate(90deg)" } : undefined}
    >
      <path
        d="M5 12h14m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Mark() {
  return (
    <span className="sf-mark" aria-hidden="true">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="2" fill="currentColor" />
        <rect x="14" y="14" width="7" height="7" rx="2" fill="currentColor" />
        <path d="M10 6.5h7.5V14" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    </span>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return <p className="sf-eyebrow">{children}</p>;
}
