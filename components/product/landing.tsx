"use client";
import { useState } from "react";
import { SCENARIOS } from "../../lib/blueprint";
import { FAQS, PLANS } from "../../lib/landing-content";
import { Arrow, Mark } from "../landing/primitives";
import { Icon } from "../dashboard/icon";
import Flow from "./flow";

export default function ProductLanding({
  signedIn = false,
}: {
  signedIn?: boolean;
}) {
  const [scenario, setScenario] = useState<string>(SCENARIOS[0].id);
  const selected = SCENARIOS.find((s) => s.id === scenario)!;
  return (
    <>
      <section className="forge-hero forge-shell" aria-labelledby="hero-title">
        <div className="forge-hero-copy">
          <a href="#roadmap" className="forge-release">
            <span className="forge-live-dot" /> The next chapter of server
            building <Arrow />
          </a>
          <p className="forge-eyebrow">FOR THE WORLD YOU WANT TO BUILD</p>
          <h1 id="hero-title">
            Big server ideas.
            <br />
            <span>Small building blocks.</span>
          </h1>
          <p className="forge-lede">
            Design the systems that make your community yours. Connect events,
            set the rules, and turn your next idea into a clear, reusable
            blueprint.
          </p>
          <div className="forge-actions">
            <a className="forge-button" href="/playground">
              Open the playground <Arrow />
            </a>
            <a className="forge-button forge-secondary" href="#how-it-works">
              See how it works <Arrow down />
            </a>
          </div>
          <p className="forge-caption">
            <Icon name="check" /> No signup needed <span>·</span> Free browser
            playground
          </p>
        </div>
        <div className="forge-hero-meta">
          <span>LESS SETUP. MORE POSSIBILITY.</span>
          <span>01 / THE BUILDER</span>
        </div>
        <section
          id="preview"
          className="forge-product-window"
          aria-label="Interactive blueprint preview"
        >
          <div className="forge-window-top">
            <div>
              <Mark />
              <strong>StackForge Studio</strong>
              <span className="forge-tag">Concept preview</span>
            </div>
            <a href="/playground">
              Open playground <Arrow />
            </a>
          </div>
          <div className="forge-window-body">
            <aside className="forge-preview-sidebar">
              <p className="forge-eyebrow">START WITH A SYSTEM</p>
              {SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setScenario(s.id)}
                  aria-pressed={scenario === s.id}
                >
                  <Icon
                    name={
                      s.id === "welcome-reward"
                        ? "home"
                        : s.id === "scheduled-reward"
                          ? "spark"
                          : "shield"
                    }
                  />
                  <span>
                    {s.name}
                    <small>{s.category}</small>
                  </span>
                  <Arrow />
                </button>
              ))}
              <div className="forge-sidebar-hint">
                <Icon name="grid" />
                <strong>
                  A little structure.
                  <br />A lot of possibility.
                </strong>
                <p>Three building blocks. One connected idea.</p>
              </div>
            </aside>
            <div className="forge-preview-canvas">
              <div className="forge-canvas-heading">
                <span>
                  {selected.name} <small>/ blueprint</small>
                </span>
                <span className="forge-tag">3 connected blocks</span>
              </div>
              <Flow template={scenario} value={selected.value} />
              <div className="forge-canvas-footer">
                <span>
                  <span className="forge-live-dot" /> Browser-only concept
                </span>
                <span>Trigger → Condition → Action</span>
              </div>
            </div>
            <aside className="forge-preview-inspector">
              <p className="forge-eyebrow">SYSTEM OVERVIEW</p>
              <span className="forge-feature-icon">
                <Icon name="settings" />
              </span>
              <h3>{selected.name}</h3>
              <p>{selected.detail}</p>
              <div className="forge-property">
                <span>{selected.param}</span>
                <strong>
                  {selected.value.toLocaleString("en-US")}{" "}
                  <small>{selected.unit}</small>
                </strong>
              </div>
              <a
                className="forge-button forge-secondary"
                href={`/playground?template=${scenario}`}
              >
                Make it yours <Arrow />
              </a>
              <p className="forge-caption">
                Blueprint JSON, not deployable game code.
              </p>
            </aside>
          </div>
        </section>
        <div className="forge-platforms">
          <p>
            One visual language.
            <br />
            <strong>A bigger world ahead.</strong>
          </p>
          <span>
            <b>F</b> FiveM <small>First target</small>
          </span>
          <span>
            <b>M</b> Minecraft <small>Exploring</small>
          </span>
          <span>
            <b>U</b> Unturned <small>Exploring</small>
          </span>
          <p className="forge-platform-note">
            Planned compatibility.
            <br />
            No game runtime is live yet.
          </p>
        </div>
      </section>
      <section className="forge-section forge-shell" id="how-it-works">
        <div className="forge-section-head">
          <div>
            <p className="forge-eyebrow">FROM “WHAT IF” TO “HERE’S HOW”</p>
            <h2>Your idea, with a little structure.</h2>
          </div>
          <p>
            Skip the blank page. Start with a pattern, make it your own, and
            test the logic before you take it further.
          </p>
        </div>
        <div className="forge-steps">
          {[
            {
              n: "01",
              title: "Find your starting point",
              text: "Choose a welcome reward, timed event, or progression system. Each comes with a readable, connected blueprint.",
              icon: "grid" as const,
            },
            {
              n: "02",
              title: "Make the rules yours",
              text: "Adjust parameters and run sample events. See exactly why an action would run—or why it would stop.",
              icon: "settings" as const,
            },
            {
              n: "03",
              title: "Keep what you build",
              text: "Save a draft in this browser or download versioned JSON. Bring it back later and pick up where you left off.",
              icon: "download" as const,
            },
          ].map((s) => (
            <article key={s.n}>
              <div>
                <span>{s.n}</span>
                <Icon name={s.icon} />
              </div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="forge-feature-section">
        <div className="forge-shell">
          <div className="forge-section-head">
            <div>
              <p className="forge-eyebrow">
                A WORKSPACE, NOT ANOTHER BLANK CANVAS
              </p>
              <h2>
                Less guesswork.
                <br />
                More building.
              </h2>
            </div>
            <a href="/playground" className="forge-text-link">
              Explore the playground <Arrow />
            </a>
          </div>
          <div className="forge-feature-grid">
            <article className="forge-feature-large">
              <p className="forge-eyebrow">LOGIC YOU CAN FOLLOW</p>
              <h3>
                Every event has a story.
                <br />
                See yours, end to end.
              </h3>
              <p>
                Readable blocks keep the trigger, condition, and action
                together. Select any block to understand its role.
              </p>
              <div className="forge-mini-flow">
                <span>
                  <Icon name="spark" />
                  Event
                </span>
                <i>→</i>
                <span>
                  <Icon name="shield" />
                  Rule
                </span>
                <i>→</i>
                <span>
                  <Icon name="grid" />
                  Action
                </span>
              </div>
              <a href="/playground" className="forge-text-link">
                Build your first blueprint <Arrow />
              </a>
            </article>
            <article className="forge-feature-small">
              <span className="forge-feature-icon">
                <Icon name="check" />
              </span>
              <h3>Test the “what if.”</h3>
              <p>
                Try a first-time player or a returning one. The simulation
                explains which rules passed and what would happen next.
              </p>
              <div className="forge-code-lines">
                <span>
                  01 <b>Event received</b>
                </span>
                <span>
                  02 <b>First visit? Yes</b>
                </span>
                <span>
                  03 <b>Would grant 500 credits</b>
                </span>
              </div>
            </article>
            <article className="forge-feature-strip">
              <Icon name="download" />
              <div>
                <h3>Your ideas, not locked in.</h3>
                <p>
                  Local drafts and readable JSON export. No subscription
                  required to explore.
                </p>
              </div>
              <span className="forge-tag">Available now</span>
            </article>
          </div>
        </div>
      </section>
      <section className="forge-section forge-shell" id="templates">
        <div className="forge-section-head">
          <div>
            <p className="forge-eyebrow">A HEAD START FOR YOUR NEXT IDEA</p>
            <h2>Start with something useful.</h2>
          </div>
          <a
            className="forge-text-link"
            href={signedIn ? "/dashboard/templates" : "/playground"}
          >
            Explore all concepts <Arrow />
          </a>
        </div>
        <div className="forge-template-list">
          {SCENARIOS.map((s, i) => (
            <a
              href={`/playground?template=${s.id}`}
              className="forge-template-link"
              key={s.id}
            >
              <span className={`forge-template-number template-${i}`}>
                0{i + 1}
              </span>
              <div>
                <small>{s.category}</small>
                <h3>{s.name}</h3>
                <p>{s.outcome}</p>
              </div>
              <span className="forge-tag">3 blocks</span>
              <Arrow />
            </a>
          ))}
        </div>
      </section>
      <section className="forge-section forge-shell" id="pricing">
        <div className="forge-section-head">
          <div>
            <p className="forge-eyebrow">FREE TO EXPLORE. ROOM TO GROW.</p>
            <h2>Start building, not subscribing.</h2>
          </div>
          <p>
            The playground is free today. These monthly USD plans are a proposal
            for the future product—not live subscriptions.
          </p>
        </div>
        <div className="forge-pricing">
          {PLANS.map((p) => (
            <article className={p.featured ? "is-featured" : ""} key={p.name}>
              <div className="forge-plan-title">
                <h3>{p.name}</h3>
                {p.featured && (
                  <span className="forge-tag">For growing ideas</span>
                )}
              </div>
              <p>{p.audience}</p>
              <div className="forge-price">
                ${p.price}
                <span>/ month</span>
              </div>
              <p>{p.description}</p>
              <ul>
                {p.features.map((f) => (
                  <li key={f}>
                    <Icon name="check" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                className={`forge-button ${p.featured ? "" : "forge-secondary"}`}
                href={p.name === "Free" ? "/playground" : "#pricing-details"}
              >
                {p.name === "Free"
                  ? "Try free playground"
                  : "Review proposed scope"}
                <Arrow />
              </a>
            </article>
          ))}
        </div>
        <details id="pricing-details" className="forge-pricing-details">
          <summary>
            What’s included today—and what’s still being defined?
          </summary>
          <p>
            Today: three concept templates, parameter editing, local project
            saves, browser simulation, and JSON import/export. No deployable
            scripts, cloud project storage, build credits, or payment
            processing. Future build limits, revision allowances*, licensing,
            refunds, and fair-use terms must be finalized before any paid
            launch. Free-plan trial builds above refer to the proposed compiler,
            not a limit on this playground.
          </p>
        </details>
      </section>
      <section className="forge-roadmap forge-shell" id="roadmap">
        <div>
          <p className="forge-eyebrow">BUILT IN THE OPEN</p>
          <h2>
            A clear direction.
            <br />
            No imaginary features.
          </h2>
          <p>
            We’re starting with a useful foundation and making the next steps
            explicit. There are no promised release dates.
          </p>
        </div>
        <ol>
          <li>
            <span className="forge-roadmap-dot" />
            <div>
              <span className="forge-tag">Available in this frontend</span>
              <h3>Explore. Configure. Test.</h3>
              <p>
                Blueprint playground, local projects, JSON exports, and account
                screens.
              </p>
            </div>
          </li>
          <li>
            <span />
            <div>
              <span className="forge-tag">Next to validate</span>
              <h3>From blueprint to game system.</h3>
              <p>
                A focused block library, one initial game framework, secure
                server-side validation, and reliable code exports.
              </p>
            </div>
          </li>
          <li>
            <span />
            <div>
              <span className="forge-tag">Longer-term direction</span>
              <h3>Expand when the foundation works.</h3>
              <p>
                Cloud projects, subscriptions, a desktop client, and a
                publishing bridge—after the core builder is proven.
              </p>
            </div>
          </li>
        </ol>
      </section>
      <section className="forge-section forge-shell forge-faq" id="faq">
        <div>
          <p className="forge-eyebrow">GOOD QUESTIONS</p>
          <h2>A little more clarity.</h2>
          <p>
            What you can do now.
            <br />
            What we’re working toward.
          </p>
        </div>
        <div>
          {[
            {
              question: "What can I actually use today?",
              answer:
                "The frontend playground lets you configure three workflows, run illustrative pass/fail simulations, save drafts on this device, and import or export blueprint JSON. The account screens use your existing Supabase setup. No generated game scripts or paid plans are available.",
            },
            {
              question: "Where are my projects saved?",
              answer:
                "Drafts are stored in this browser’s local storage, not in the cloud. Signed-in project lists use an account-specific key, but this is not encryption or a security boundary on a shared device. Export important work as JSON. Clearing site data removes local drafts.",
            },
            ...FAQS.slice(1, 5),
          ].map((f) => (
            <details key={f.question}>
              <summary>
                {f.question}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{f.answer}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="forge-final-cta forge-shell">
        <div className="forge-cta-symbol">
          <Mark />
        </div>
        <p className="forge-eyebrow">YOUR NEXT IDEA STARTS HERE</p>
        <h2>
          Build something
          <br />
          your players will remember.
        </h2>
        <p>Start small. Connect a few blocks. See where it takes you.</p>
        <a className="forge-button" href="/playground">
          Open the free playground <Arrow />
        </a>
        <span className="forge-caption">
          No signup. No payment. Just your next idea.
        </span>
      </section>
      <footer className="forge-footer forge-shell">
        <div>
          <a href="/" className="forge-brand">
            <Mark />
            StackForge
          </a>
          <p>Your world, block by block.</p>
        </div>
        <nav aria-label="Footer">
          <a href="/playground">Playground</a>
          <a href="#roadmap">Roadmap</a>
          <a href="#faq">Questions</a>
          <a href={signedIn ? "/dashboard" : "/login"}>
            {signedIn ? "Workspace" : "Sign in"}
          </a>
        </nav>
        <div className="forge-footer-bottom">
          <span>StackForge · Independent project · Pre-launch</span>
          <span>
            Game names belong to their owners. No affiliation implied.
          </span>
        </div>
      </footer>
    </>
  );
}
