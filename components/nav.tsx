import Link from "next/link";

export default function Nav() {
  return (
    <nav className="border-b border-border-c">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-foreground flex items-center justify-center">
            <span className="font-display text-[13px] font-semibold text-white">S</span>
          </div>
          <span className="font-display font-semibold text-[15px] tracking-tight">
            StackForge
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-muted">
          <Link href="#features" className="hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="#pricing" className="hover:text-foreground transition-colors">
            Pricing
          </Link>
          <Link href="#roadmap" className="hover:text-foreground transition-colors">
            Roadmap
          </Link>
        </div>
        <div className="flex items-center gap-5">
          <Link href="/login" className="text-sm text-muted hover:text-foreground transition-colors">
            Log in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-medium bg-foreground text-white px-4 py-2 rounded-md hover:bg-black transition"
          >
            Start building
          </Link>
        </div>
      </div>
    </nav>
  );
}
