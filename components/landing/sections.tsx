import { PLANS, FAQS } from "../../lib/landing-content";
import { Arrow, Label } from "./primitives";
export function Hero() {
  return (
    <section className="sf-shell sf-hero" aria-labelledby="hero-title">
      <div className="sf-hero-copy">
        <Label>
          <span className="sf-dot" /> YOUR SERVER. YOUR RULES.
        </Label>
        <h1 id="hero-title">
          Great game systems.
          <br />
          <span>Not another line of code.</span>
        </h1>
        <p className="sf-lead">
          Your ideas, connected. StackForge is a visual builder in development
          for creating custom game-server systems from tested, reusable blocks.
        </p>
        <div className="sf-actions">
          <a className="sf-button" href="#preview">
            Explore the concept <Arrow />
          </a>
          <a className="sf-text-link" href="#how-it-works">
            See how it works <Arrow down />
          </a>
        </div>
        <p className="sf-note">
          Web-first MVP planned. No live editor or checkout yet.
        </p>
      </div>
      <aside className="sf-hero-note" aria-label="Product principle">
        <span className="sf-note-number">01 / THE IDEA</span>
        <p>
          Build the system
          <br />
          you wish existed.
        </p>
        <span>
          Connect a trigger, a condition and an action. Make it yours.
        </span>
        <a href="#preview" aria-label="Explore the interactive concept preview">
          <Arrow down />
        </a>
      </aside>
    </section>
  );
}

export function GameSupport() {
  return (
    <section className="sf-games" aria-label="Planned game support">
      <div className="sf-shell sf-games-inner">
        <div>
          <Label>ONE VISION. DIFFERENT WORLDS.</Label>
          <p>Game support is planned, not live.</p>
        </div>
        <ul>
          <li>
            <strong>FiveM</strong>
            <span>Likely first · scope TBD</span>
          </li>
          <li>
            <strong>Minecraft</strong>
            <span>Future candidate</span>
          </li>
          <li>
            <strong>Unturned</strong>
            <span>Future candidate</span>
          </li>
        </ul>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="sf-shell sf-section"
      aria-labelledby="how-title"
    >
      <div className="sf-section-heading">
        <div>
          <Label>THE PLANNED WORKFLOW</Label>
          <h2 id="how-title">
            From an idea
            <br />
            to your own server.
          </h2>
        </div>
        <p>
          The goal is simple: spend more time shaping your server, and less time
          piecing together scripts.
        </p>
      </div>
      <div className="sf-steps">
        {[
          {
            title: "Connect the logic",
            body: "Start with a template or connect events, conditions and actions on a visual web canvas.",
          },
          {
            title: "Make it your own",
            body: "Set values, permissions and rules. The planned backend composes tested modules from your specification.",
          },
          {
            title: "Export for your server",
            body: "Generate a game-specific package. Supported versions, installation steps and validation checks will be defined for the MVP.",
          },
        ].map((step, index) => (
          <article key={step.title}>
            <span className="sf-step-number">0{index + 1}</span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Principles() {
  return (
    <section className="sf-principles">
      <div className="sf-shell sf-principles-inner">
        <div>
          <Label>STRUCTURE BEFORE GENERATION</Label>
          <h2>
            Reusable blocks.
            <br />
            Not a black box.
          </h2>
          <p>
            StackForge is being designed around a library of tested modules—not
            unrestricted AI-written scripts.
          </p>
          <a className="sf-text-link" href="#faq">
            Understand the approach <Arrow />
          </a>
        </div>
        <div className="sf-principle-list">
          <article>
            <span>01</span>
            <div>
              <h3>A deliberate starting library</h3>
              <p>
                Use the game-mod studio as a testing ground for reusable
                systems. Final MVP block scope is still open.
              </p>
            </div>
          </article>
          <article>
            <span>02</span>
            <div>
              <h3>Validation between the blocks</h3>
              <p>
                Tested components are a starting point. Their combinations,
                permissions and game compatibility need checks too.
              </p>
            </div>
          </article>
          <article>
            <span>03</span>
            <div>
              <h3>Clear boundaries from day one</h3>
              <p>
                Tenant isolation, resource limits and export safety remain
                engineering work—not security claims made by this page.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export function Pricing() {
  return (
    <section
      id="pricing"
      className="sf-shell sf-section"
      aria-labelledby="pricing-title"
    >
      <div className="sf-section-heading">
        <div>
          <Label>PLANNED PRICING</Label>
          <h2 id="pricing-title">
            Start small.
            <br />
            Build from there.
          </h2>
        </div>
        <p>
          Monthly USD plans from the roadmap. Prices and allowances are
          proposals, not a live offer. No payment is collected here.
        </p>
      </div>
      <div className="sf-plans">
        {PLANS.map((plan) => (
          <article
            key={plan.name}
            className={`sf-plan${plan.featured ? " sf-plan-featured" : ""}`}
          >
            <div className="sf-plan-top">
              <h3>{plan.name}</h3>
              {plan.featured && (
                <span className="sf-plan-label">MORE CAPACITY</span>
              )}
            </div>
            <p className="sf-plan-audience">{plan.audience}</p>
            <div className="sf-price">
              ${plan.price}
              <span>{plan.price === 0 ? "/ trial" : "/ month"}</span>
            </div>
            <p className="sf-plan-description">{plan.description}</p>
            <ul>
              {plan.features.map((feature) => (
                <li key={feature}>
                  <span aria-hidden="true">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <a
              className={`sf-button ${plan.featured ? "" : "sf-button-secondary"}`}
              href="#early-access"
              aria-label={`See early access information for the proposed ${plan.name} plan`}
            >
              Early access <Arrow />
            </a>
          </article>
        ))}
      </div>
      <div className="sf-pricing-notes">
        <p>
          * Revision counts follow the roadmap. Whether they apply per build or
          per month is not defined. Business unlimited revisions remain a
          proposal, subject to cost validation and published usage terms.
        </p>
        <p>
          Trial reset rules, failed builds, taxes and any future credit system
          must be clarified before checkout. No annual discount has been
          assumed.
        </p>
      </div>
    </section>
  );
}

export function Roadmap() {
  return (
    <section id="roadmap" className="sf-roadmap">
      <div className="sf-shell sf-section">
        <div className="sf-section-heading">
          <div>
            <Label>FOCUSED BY DESIGN</Label>
            <h2>
              One useful product.
              <br />
              Then the next chapter.
            </h2>
          </div>
          <p>
            The roadmap sets an order, not release dates. Expansion follows
            evidence of demand—not the other way around.
          </p>
        </div>
        <ol className="sf-timeline">
          <li>
            <span className="sf-phase sf-phase-active">01</span>
            <div>
              <span className="sf-phase-label">MVP SCOPE · VALIDATE FIRST</span>
              <h3>Build for the web</h3>
              <p>
                Validate demand, choose the first game and build a focused block
                library. Next.js and React Flow are the planned web foundation.
              </p>
              <span className="sf-scope">
                Visual canvas · Modular blocks · Export validation
              </span>
            </div>
          </li>
          <li>
            <span className="sf-phase">02</span>
            <div>
              <span className="sf-phase-label">AFTER REAL PRODUCT DEMAND</span>
              <h3>Make exporting easier</h3>
              <p>
                Consider a Tauri desktop client for local file access and a
                Tebex bridge for publishing. A native marketplace comes later,
                with extra legal and moderation work.
              </p>
              <span className="sf-scope">Desktop · Tebex bridge</span>
            </div>
          </li>
          <li>
            <span className="sf-phase">03</span>
            <div>
              <span className="sf-phase-label">LONGER-TERM EXPLORATION</span>
              <h3>Extend—not replace—the core</h3>
              <p>
                A mobile companion for notifications, monitoring and light
                edits. Personal AI agency workflows only after the core platform
                is validated.
              </p>
              <span className="sf-scope">
                Companion app · Optional agency workflows
              </span>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}

export function FAQ() {
  return (
    <section
      id="faq"
      className="sf-shell sf-faq sf-section"
      aria-labelledby="faq-title"
    >
      <div>
        <Label>A FEW HONEST ANSWERS</Label>
        <h2 id="faq-title">Before you build.</h2>
      </div>
      <div className="sf-faq-list">
        {FAQS.map((faq) => (
          <details key={faq.question}>
            <summary>
              {faq.question}
              <span aria-hidden="true">+</span>
            </summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
