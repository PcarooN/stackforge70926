import LandingMotion from "../components/landing/motion";
import "./white-edition.css";
import { getCurrentViewer } from "../lib/auth/current-user";
import Header from "../components/landing/header";
import BuilderPreview from "../components/landing/builder-preview";
import EarlyAccess from "../components/landing/early-access";
import { Arrow, Mark } from "../components/landing/primitives";
import {
  Hero,
  GameSupport,
  HowItWorks,
  Principles,
  Pricing,
  Roadmap,
  FAQ,
} from "../components/landing/sections";

export const dynamic = "force-dynamic";

export default async function Home() {
  const viewer = await getCurrentViewer();
  return (
    <div
      className="sf sf-white-edition"
      id="top"
      data-reduced-motion={viewer?.preferences.reducedMotion || undefined}
    >
      <LandingMotion />
      <a className="sf-skip" href="#main">
        Skip to content
      </a>
      <Header viewer={viewer} />
      <main id="main">
        <Hero />
        <BuilderPreview />
        <GameSupport />
        <HowItWorks />
        <Principles />
        <Pricing />
        <Roadmap />
        <EarlyAccess />
        <FAQ />
      </main>
      <footer className="sf-footer">
        <div className="sf-shell">
          <a className="sf-brand" href="#top">
            <Mark />
            StackForge
          </a>
          <p>Build your world. Block by block.</p>
          <a href="#roadmap">
            See what’s planned <Arrow />
          </a>
        </div>
        <div className="sf-shell sf-footer-bottom">
          <span>Independent project · Pre-launch concept</span>
          <span>
            Game names belong to their respective owners. No affiliation
            implied.
          </span>
        </div>
      </footer>
    </div>
  );
}
