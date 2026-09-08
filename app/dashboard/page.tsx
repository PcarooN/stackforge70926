import { requireUser } from "../../lib/auth/require-user";
import { readProfile } from "../../lib/profile";
import { Icon } from "../../components/dashboard/icon";
export default async function DashboardPage() {
  const { user } = await requireUser();
  const profile = readProfile(user.user_metadata);
  const name = profile.displayName || user.email?.split("@")[0] || "builder";
  return (
    <>
      <div className="studio-page-heading">
        <div>
          <p className="studio-eyebrow">YOUR STARTING POINT</p>
          <h1>
            Welcome, {name}
            <span className="studio-blue-dot">.</span>
          </h1>
          <p>
            A little structure. A lot of possibility. Make this workspace yours.
          </p>
        </div>
        <a
          href="/dashboard/settings"
          className="studio-button studio-secondary"
        >
          <Icon name="settings" />
          Account settings
        </a>
      </div>
      <section className="studio-welcome">
        <div>
          <span className="studio-badge">THE STACKFORGE VISION</span>
          <h2>
            Your next great idea
            <br />
            starts with a few blocks.
          </h2>
          <p>
            Configure events, conditions, and actions. Save local blueprints,
            test sample events, and export JSON—not deployable game scripts.
          </p>
          <a className="studio-button" href="/dashboard/projects">
            Open your projects <Icon name="arrow" />
          </a>
        </div>
        <div
          className="studio-welcome-graph"
          aria-label="Concept workflow: player joins, check rules, grant reward"
        >
          <span>
            <i className="studio-node-dot" />
            Player joins<small>TRIGGER</small>
          </span>
          <b aria-hidden="true">↓</b>
          <span>
            <i className="studio-node-dot amber" />
            Check your rules<small>CONDITION</small>
          </span>
          <b aria-hidden="true">↓</b>
          <span>
            <i className="studio-node-dot green" />
            Make something happen<small>ACTION</small>
          </span>
        </div>
      </section>
      <div className="studio-section-title">
        <h2>Your account, at a glance</h2>
        <span>Live account details</span>
      </div>
      <div className="studio-summary-grid">
        <article className="studio-card">
          <span className="studio-card-icon">
            <Icon name="shield" />
          </span>
          <h3>Email verified</h3>
          <p className="studio-wrap">{user.email}</p>
          <span className="studio-small-label">Account access enabled</span>
        </article>
        <article className="studio-card">
          <span className="studio-card-icon">
            <Icon name="user" />
          </span>
          <h3>
            {profile.displayName ? "Profile personalized" : "Make it yours"}
          </h3>
          <p>
            {profile.displayName
              ? "Your display name and avatar are ready."
              : "Add a display name and choose your avatar color."}
          </p>
          <a href="/dashboard/settings">
            Edit profile <Icon name="arrow" />
          </a>
        </article>
        <article className="studio-card">
          <span className="studio-card-icon">
            <Icon name="grid" />
          </span>
          <h3>No active subscription</h3>
          <p>Paid plans and usage tracking are not active yet.</p>
          <a href="/#pricing">
            See proposed plans <Icon name="arrow" />
          </a>
        </article>
      </div>
      <div className="studio-bottom-grid">
        <section className="studio-card studio-next">
          <p className="studio-eyebrow">WHAT’S NEXT</p>
          <h2>Focus first. Expand later.</h2>
          <ol>
            <li>
              <span>01</span>
              <div>
                <strong>Validate the web builder</strong>
                <p>
                  One initial game, a focused block library and reliable
                  exports.
                </p>
              </div>
              <em>First</em>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>Desktop & publishing</strong>
                <p>Tauri and a Tebex bridge, after real demand.</p>
              </div>
              <em>Later</em>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>A companion, not another editor</strong>
                <p>Mobile monitoring and optional advanced workflows.</p>
              </div>
              <em>Future</em>
            </li>
          </ol>
        </section>
        <section className="studio-card studio-shortcuts">
          <p className="studio-eyebrow">GOOD FOUNDATIONS</p>
          <h2>
            Small things.
            <br />
            Done properly.
          </h2>
          <a href="/dashboard/settings?section=security">
            <Icon name="shield" />
            <div>
              <strong>Account security</strong>
              <span>Password recovery and sign-out controls</span>
            </div>
            <Icon name="arrow" />
          </a>
          <a href="/dashboard/settings?section=preferences">
            <Icon name="settings" />
            <div>
              <strong>Your preferences</strong>
              <span>Motion and workspace density</span>
            </div>
            <Icon name="arrow" />
          </a>
        </section>
      </div>
    </>
  );
}
