"use client";
import { useActionState, useEffect, useState } from "react";
import {
  AVATAR_TONES,
  GAMES,
  EMPTY_SETTINGS,
  type Profile,
  type Preferences,
  type AvatarTone,
} from "../../lib/profile";
import {
  saveProfile,
  savePreferences,
  sendOwnReset,
  endAllSessions,
} from "../../app/dashboard/settings/actions";
import { Icon } from "./icon";
type Section = "profile" | "security" | "preferences";
function Feedback({ state }: { state: { status: string; message: string } }) {
  return state.message ? (
    <p
      className={`studio-feedback ${state.status}`}
      role="status"
      aria-live="polite"
    >
      {state.message}
    </p>
  ) : null;
}
export default function Settings({
  profile,
  preferences,
  email,
  createdAt,
  section,
}: {
  profile: Profile;
  preferences: Preferences;
  email: string;
  createdAt: string;
  section: Section;
}) {
  const [tab, setTab] = useState<Section>(section);
  // React actions request a native form reset after completion. Keep controlled
  // drafts intact, including selects, on both successful and failed requests.
  useEffect(() => {
    const preserveDraft = (event: Event) => {
      if (
        event.target instanceof HTMLFormElement &&
        event.target.dataset.preserveDraft === "true"
      )
        event.preventDefault();
    };
    document.addEventListener("reset", preserveDraft, true);
    return () => document.removeEventListener("reset", preserveDraft, true);
  }, []);
  const [name, setName] = useState(profile.displayName);
  const [bio, setBio] = useState(profile.bio);
  const [game, setGame] = useState(profile.game);
  const [tone, setTone] = useState<AvatarTone>(profile.avatarTone);
  const [motion, setMotion] = useState(preferences.reducedMotion);
  const [compact, setCompact] = useState(preferences.compact);
  const [profileState, profileAction, profilePending] = useActionState(
    saveProfile,
    EMPTY_SETTINGS,
  );
  const [prefState, prefAction, prefPending] = useActionState(
    savePreferences,
    EMPTY_SETTINGS,
  );
  const [resetState, resetAction, resetPending] = useActionState(
    sendOwnReset,
    EMPTY_SETTINGS,
  );
  const [logoutState, logoutAction, logoutPending] = useActionState(
    endAllSessions,
    EMPTY_SETTINGS,
  );
  const [confirmLogout, setConfirmLogout] = useState(false);
  const dirty =
    name.trim() !== profile.displayName ||
    bio.trim() !== profile.bio ||
    game !== profile.game ||
    tone !== profile.avatarTone ||
    motion !== preferences.reducedMotion ||
    compact !== preferences.compact;
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  return (
    <>
      <div className="studio-page-heading">
        <div>
          <p className="studio-eyebrow">A SPACE THAT FEELS LIKE YOU</p>
          <h1>
            Account settings<span className="studio-blue-dot">.</span>
          </h1>
          <p>Your identity, your preferences, your peace of mind.</p>
        </div>
        {dirty && <span className="studio-unsaved">Unsaved changes</span>}
      </div>
      <div
        className="studio-settings-tabs"
        role="group"
        aria-label="Account settings sections"
      >
        {(["profile", "security", "preferences"] as const).map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={tab === item}
            aria-controls={`settings-${item}`}
            onClick={() => setTab(item)}
          >
            <Icon
              name={
                item === "profile"
                  ? "user"
                  : item === "security"
                    ? "shield"
                    : "settings"
              }
            />
            {item[0].toUpperCase() + item.slice(1)}
          </button>
        ))}
      </div>
      <section
        id="settings-profile"
        hidden={tab !== "profile"}
        className="studio-settings-grid"
      >
        <div className="studio-settings-intro">
          <h2>Personal profile</h2>
          <p>
            Choose how you appear in your workspace. Your email remains the
            sign-in identity.
          </p>
          <div className="studio-preview-identity">
            <span
              className="studio-avatar large"
              style={{
                background: AVATAR_TONES[tone].background,
                color: AVATAR_TONES[tone].color,
              }}
            >
              {Array.from(name.trim() || email)[0]?.toUpperCase()}
            </span>
            <strong>{name.trim() || "Your display name"}</strong>
            <span>{email}</span>
          </div>
        </div>
        <form
          data-preserve-draft="true"
          action={profileAction}
          className="studio-card studio-settings-form"
        >
          <fieldset disabled={profilePending}>
            <div className="studio-form-heading">
              <h3>Profile details</h3>
              <span>Visible in your account</span>
            </div>
            <label htmlFor="profile-name">Display name</label>
            <input
              id="profile-name"
              name="displayName"
              autoComplete="nickname"
              required
              maxLength={50}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="How should we call you?"
            />
            <label htmlFor="profile-bio">
              A little about you <span>Optional</span>
            </label>
            <textarea
              id="profile-bio"
              name="bio"
              rows={3}
              maxLength={240}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="What kind of world are you building?"
            />
            <p className="studio-field-hint">{bio.length}/240 characters</p>
            <label htmlFor="profile-game">Game you’re interested in</label>
            <select
              id="profile-game"
              name="game"
              value={game}
              onChange={(e) => setGame(e.target.value)}
            >
              {GAMES.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
            <p className="studio-field-hint">
              A preference only—not a claim of game compatibility.
            </p>
            <fieldset className="studio-tone-field">
              <legend>Avatar color</legend>
              <div className="studio-tones">
                {Object.entries(AVATAR_TONES).map(([key, color]) => (
                  <label key={key} className={tone === key ? "selected" : ""}>
                    <input
                      type="radio"
                      name="avatarTone"
                      value={key}
                      checked={tone === key}
                      onChange={() => setTone(key as AvatarTone)}
                    />
                    <span
                      style={{
                        background: color.background,
                        color: color.color,
                      }}
                    >
                      {color.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <Feedback state={profileState} />
            <div className="studio-form-footer">
              <span>No external avatar upload required.</span>
              <button
                className="studio-button"
                disabled={profilePending}
                type="submit"
              >
                {profilePending ? "Saving…" : "Save profile"}
                <Icon name="check" />
              </button>
            </div>
          </fieldset>
        </form>
      </section>
      <section
        id="settings-security"
        hidden={tab !== "security"}
        className="studio-settings-grid"
      >
        <div className="studio-settings-intro">
          <h2>Security & access</h2>
          <p>
            Keep your account yours. Sensitive changes use your verified email
            address.
          </p>
          <span className="studio-verified">
            <Icon name="check" />
            Email verified
          </span>
        </div>
        <div className="studio-settings-stack">
          <section className="studio-card">
            <div className="studio-form-heading">
              <h3>Sign-in details</h3>
              <Icon name="shield" />
            </div>
            <dl className="studio-detail-list">
              <dt>Email</dt>
              <dd>{email}</dd>
              <dt>Account created</dt>
              <dd>{createdAt}</dd>
              <dt>Method</dt>
              <dd>Email & password</dd>
            </dl>
            <p className="studio-field-hint">
              Email changes and MFA are not included in this release.
            </p>
          </section>
          <section className="studio-card">
            <h3>Password recovery</h3>
            <p>
              We’ll send a secure reset link to your verified address. Your
              current password is never displayed.
            </p>
            <form data-preserve-draft="true" action={resetAction}>
              <Feedback state={resetState} />
              <button
                className="studio-button studio-secondary"
                type="submit"
                disabled={resetPending}
              >
                {resetPending ? "Requesting…" : "Send password-reset email"}
                <Icon name="arrow" />
              </button>
            </form>
          </section>
          <section className="studio-card">
            <h3>Your account data</h3>
            <p>
              Download your profile and display preferences as JSON. This is not
              an export of provider logs or future project data.
            </p>
            <a
              className="studio-button studio-secondary"
              href="/dashboard/settings/export"
            >
              <Icon name="download" />
              Download account details
            </a>
          </section>
          <section className="studio-card studio-sensitive">
            <h3>Sign out all sessions</h3>
            <p>
              Revoke refresh sessions across your devices. Existing access
              tokens may remain valid until they expire.
            </p>
            <form data-preserve-draft="true" action={logoutAction}>
              <label className="studio-checkbox-row">
                <input
                  type="checkbox"
                  name="confirmAll"
                  checked={confirmLogout}
                  onChange={(e) => setConfirmLogout(e.target.checked)}
                />
                <span>I understand this also signs me out here.</span>
              </label>
              <Feedback state={logoutState} />
              <button
                className="studio-button studio-danger"
                type="submit"
                disabled={!confirmLogout || logoutPending}
              >
                {logoutPending ? "Signing out…" : "Sign out all devices"}
              </button>
            </form>
          </section>
        </div>
      </section>
      <section
        id="settings-preferences"
        hidden={tab !== "preferences"}
        className="studio-settings-grid"
      >
        <div className="studio-settings-intro">
          <h2>Make yourself comfortable</h2>
          <p>
            These preferences are saved to your account. The white visual theme
            stays consistent.
          </p>
        </div>
        <form
          data-preserve-draft="true"
          action={prefAction}
          className="studio-card studio-settings-form"
        >
          <fieldset disabled={prefPending}>
            <div className="studio-form-heading">
              <h3>Interface preferences</h3>
              <Icon name="settings" />
            </div>
            <label className="studio-setting-switch">
              <span>
                <strong>Reduce motion</strong>
                <small>
                  Minimize decorative movement and transitions. Your system
                  preference always takes priority.
                </small>
              </span>
              <input
                type="checkbox"
                name="reducedMotion"
                checked={motion}
                onChange={(e) => setMotion(e.target.checked)}
              />
            </label>
            <label className="studio-setting-switch">
              <span>
                <strong>Compact workspace</strong>
                <small>
                  Use tighter card spacing in the dashboard, without shrinking
                  text or controls.
                </small>
              </span>
              <input
                type="checkbox"
                name="compact"
                checked={compact}
                onChange={(e) => setCompact(e.target.checked)}
              />
            </label>
            <div className="studio-theme-sample">
              <span />
              <div>
                <strong>White edition</strong>
                <small>Clear surfaces. Soft light. Your ideas in focus.</small>
              </div>
              <Icon name="check" />
            </div>
            <Feedback state={prefState} />
            <div className="studio-form-footer">
              <span>Saved across sessions.</span>
              <button
                className="studio-button"
                type="submit"
                disabled={prefPending}
              >
                {prefPending ? "Saving…" : "Save preferences"}
                <Icon name="check" />
              </button>
            </div>
          </fieldset>
        </form>
      </section>
    </>
  );
}
