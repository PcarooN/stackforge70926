import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "StackForge — Build your world, block by block",
  description:
    "Explore StackForge: a web-first visual game-system builder in development. Try an interactive concept, inspect a blueprint and discover the planned roadmap.",
  openGraph: {
    title: "StackForge — Build your world, block by block",
    description:
      "A visual game-system builder in development. Explore the concept and planned roadmap.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "StackForge — Build your world, block by block",
    description:
      "Explore the interactive concept for a web-first visual game-system builder.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
