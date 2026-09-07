import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StackForge",
  description: "Kod yazmadan, sürükle-bırak ile oyun sistemi üretimi.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
