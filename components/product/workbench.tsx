"use client";
import { useEffect, useRef, useState } from "react";
import { SCENARIOS, createBlueprint } from "../../lib/blueprint";
import {
  importBlueprint,
  MAX_DRAFTS,
  parseDrafts,
  simulate,
  validateDraft,
  type Draft,
  type Simulation,
} from "../../lib/workspace";
import { Icon } from "../dashboard/icon";
import { Arrow, Mark } from "../landing/primitives";
import Flow from "./flow";

type View = "editor" | "projects";
export default function Workbench({
  scope = "guest",
  initialView = "editor",
  embedded = false,
}: {
  scope?: string;
  initialView?: View;
  embedded?: boolean;
}) {
  const storageKey = `stackforge:projects:v1:${scope}`;
  const [view, setView] = useState<View>(initialView);
  const [template, setTemplate] = useState<string>("welcome-reward");
  const [value, setValue] = useState(500);
  const [name, setName] = useState("My welcome reward");
  const [id, setId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState("");
  const [message, setMessage] = useState("");
  const [dirty, setDirty] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [activeNode, setActiveNode] = useState(2);
  const [tab, setTab] = useState<"configure" | "json">("configure");
  const [eligible, setEligible] = useState(true);
  const [level, setLevel] = useState(10);
  const [result, setResult] = useState<Simulation | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const createDialog = useRef<HTMLDialogElement>(null);
  const [newName, setNewName] = useState("");
  const [newTemplate, setNewTemplate] = useState<string>("welcome-reward");
  const [newError, setNewError] = useState("");
  const scenario = SCENARIOS.find((s) => s.id === template)!;
  const blueprint = JSON.stringify(createBlueprint(template, value), null, 2);
  useEffect(() => {
    const selected = SCENARIOS.find(
      (s) =>
        s.id === new URLSearchParams(window.location.search).get("template"),
    );
    if (selected) {
      setTemplate(selected.id);
      setValue(selected.value);
      setName(`My ${selected.name.toLowerCase()}`);
    }
    function load() {
      try {
        setDrafts(parseDrafts(localStorage.getItem(storageKey) || "[]"));
        setStorageError("");
      } catch {
        setStorageError(
          "Local storage is unavailable or contains invalid data. Existing data has not been changed. Export your current blueprint to keep it safe.",
        );
      }
      setReady(true);
    }
    load();
    const onStorage = (event: StorageEvent) => {
      if (event.key === storageKey || event.key === null) load();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [storageKey]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  function acceptDiscard() {
    return (
      !dirty || window.confirm("Discard unsaved changes to this blueprint?")
    );
  }
  function change() {
    setDirty(true);
    setResult(null);
    setMessage("");
  }
  function persist(update: (current: Draft[]) => Draft[]) {
    if (!ready || storageError)
      throw new Error("Local saves are unavailable. Export JSON instead.");
    const next = update(parseDrafts(localStorage.getItem(storageKey) || "[]"));
    parseDrafts(JSON.stringify(next));
    localStorage.setItem(storageKey, JSON.stringify(next));
    setDrafts(next);
  }
  function save() {
    try {
      const draft = validateDraft({
        id: id || crypto.randomUUID(),
        name,
        template,
        value,
        updatedAt: new Date().toISOString(),
      });
      persist((current) => {
        if (
          !current.some((d) => d.id === draft.id) &&
          current.length >= MAX_DRAFTS
        )
          throw new Error(
            "You have 50 local projects. Export and delete one before saving another.",
          );
        return [draft, ...current.filter((d) => d.id !== draft.id)];
      });
      setId(draft.id);
      setName(draft.name);
      setDirty(false);
      setMessage("Project saved on this device. Export JSON for a backup.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not save. Local storage may be full or blocked. Export JSON instead.",
      );
    }
  }
  function download() {
    try {
      const url = URL.createObjectURL(
        new Blob([blueprint], { type: "application/json" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = `${name.replace(/[^a-z0-9_-]+/gi, "-").slice(0, 64) || "blueprint"}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage(
        "JSON download started. This file is a concept, not a game script.",
      );
    } catch {
      setTab("json");
      setMessage("Download unavailable. Copy the JSON from the inspector.");
    }
  }
  async function importFile(file?: File) {
    if (!file) return;
    try {
      if (file.size > 100_000)
        throw new Error("Choose a JSON file smaller than 100 KB.");
      const parsed = importBlueprint(await file.text());
      if (!acceptDiscard()) return;
      setTemplate(parsed.template);
      setValue(parsed.value);
      setName(
        file.name.replace(/\.json$/i, "").slice(0, 64) || "Imported blueprint",
      );
      setId(null);
      setDirty(true);
      setResult(null);
      setView("editor");
      setTab("configure");
      setMessage("Blueprint imported. Save it to keep a local draft.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not read this file.",
      );
    }
  }
  function openDraft(d: Draft) {
    if (!acceptDiscard()) return;
    setTemplate(d.template);
    setValue(d.value);
    setName(d.name);
    setId(d.id);
    setDirty(false);
    setResult(null);
    setMessage("");
    setView("editor");
    setTab("configure");
  }
  function remove(d: Draft) {
    if (
      !window.confirm(
        `Delete “${d.name}” from this device? This cannot be undone. Export it first if you need a backup.`,
      )
    )
      return;
    try {
      persist((current) => current.filter((x) => x.id !== d.id));
      if (id === d.id) {
        setId(null);
        setDirty(true);
      }
      setMessage("Local project deleted.");
    } catch {
      setMessage(
        "Could not delete this project. Local storage may be blocked.",
      );
    }
  }
  const items = drafts
    .filter(
      (d) =>
        (category === "All" ||
          SCENARIOS.find((s) => s.id === d.template)?.category === category) &&
        d.name.toLowerCase().includes(query.trim().toLowerCase()),
    )
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return (
    <div
      className={`forge forge-workbench ${embedded ? "forge-embedded" : ""}`}
    >
      {!embedded && (
        <>
          <a className="forge-skip" href="#workbench-main">
            Skip to workspace
          </a>
          <header className="forge-workbench-nav">
            <a className="forge-brand" href="/">
              <Mark />
              StackForge<span className="forge-tag">Playground</span>
            </a>
            <a href="/" className="forge-text-link">
              Back to website <Arrow />
            </a>
          </header>
        </>
      )}
      <div className="forge-workspace-layout">
        <aside className="forge-workspace-sidebar">
          <div className="forge-workspace-label">
            <span className="forge-feature-icon">
              <Icon name="grid" />
            </span>
            <div>
              <strong>
                {embedded ? "Your local studio" : "Personal playground"}
              </strong>
              <small>Stored on this device</small>
            </div>
          </div>
          <nav aria-label="Playground">
            <button
              onClick={() => setView("editor")}
              aria-current={view === "editor" ? "page" : undefined}
            >
              <Icon name="grid" />
              Blueprint editor
            </button>
            <button
              onClick={() => setView("projects")}
              aria-current={view === "projects" ? "page" : undefined}
            >
              <Icon name="home" />
              My projects<span className="forge-count">{drafts.length}</span>
            </button>
          </nav>
          <div className="forge-workspace-templates">
            <p className="forge-eyebrow">QUICK START</p>
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  if (!acceptDiscard()) return;
                  setTemplate(s.id);
                  setValue(s.value);
                  setName(`My ${s.name.toLowerCase()}`);
                  setId(null);
                  setDirty(false);
                  setResult(null);
                  setMessage("");
                  setView("editor");
                }}
              >
                <Icon name="spark" />
                {s.name}
              </button>
            ))}
          </div>
          <div className="forge-workspace-disclaimer">
            <Icon name="shield" />
            <strong>Your browser. Your drafts.</strong>
            <p>
              No cloud sync. Export important work. Don’t store secrets on a
              shared device.
            </p>
            <a href="/#roadmap">
              What’s coming next <Arrow />
            </a>
          </div>
        </aside>
        <main id="workbench-main" className="forge-workspace-main">
          <div className="forge-workspace-title">
            <div>
              <p className="forge-eyebrow">
                WORKSPACE /{" "}
                {view === "editor" ? "BLUEPRINT EDITOR" : "PROJECTS"}
              </p>
              <h1>
                {view === "editor"
                  ? "Your next idea, connected."
                  : "A home for your next idea."}
              </h1>
              <p>
                {view === "editor"
                  ? "Configure the logic. Try a sample event. Keep what works."
                  : "Pick up where you left off. All projects stay in this browser."}
              </p>
            </div>
            <button
              className="forge-button"
              onClick={() => {
                setNewName("");
                setNewTemplate("welcome-reward");
                setNewError("");
                createDialog.current?.showModal();
              }}
            >
              <span aria-hidden="true">＋</span> New project
            </button>
          </div>
          <div className="forge-notice">
            <Icon name="spark" />
            <p>
              <strong>A real playground. An illustrative runtime.</strong> Save
              and export working blueprints; simulations do not connect to a
              game server or produce game code.
            </p>
          </div>
          {storageError && (
            <p className="forge-error" role="alert">
              {storageError}
            </p>
          )}
          <p
            className={`forge-feedback ${message ? "has-message" : ""}`}
            role="status"
            aria-live="polite"
          >
            {message}
          </p>
          {view === "projects" ? (
            <>
              <div className="forge-project-tools">
                <div>
                  <label htmlFor="project-search">Search projects</label>
                  <input
                    id="project-search"
                    type="search"
                    placeholder="Find a project…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="project-category">Category</label>
                  <select
                    id="project-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {["All", ...SCENARIOS.map((s) => s.category)].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <button
                  className="forge-button forge-secondary"
                  onClick={() => fileInput.current?.click()}
                >
                  <Icon name="download" />
                  Import JSON
                </button>
              </div>
              <p className="forge-caption" role="status">
                {ready
                  ? `${items.length} ${items.length === 1 ? "project" : "projects"} · Most recently saved first`
                  : "Loading local projects…"}
              </p>
              {items.length ? (
                <div className="forge-project-grid">
                  {items.map((d) => (
                    <article key={d.id} className="forge-project-card">
                      <div className="forge-project-art">
                        <span>
                          {SCENARIOS.find((s) => s.id === d.template)?.trigger}
                        </span>
                        <i>↓</i>
                        <span>
                          {SCENARIOS.find((s) => s.id === d.template)?.action}
                        </span>
                      </div>
                      <div>
                        <span className="forge-tag">
                          {SCENARIOS.find((s) => s.id === d.template)?.category}
                        </span>
                        <h2>{d.name}</h2>
                        <p>
                          Saved{" "}
                          {new Date(d.updatedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        <div className="forge-project-card-actions">
                          <button
                            className="forge-button forge-secondary"
                            onClick={() => openDraft(d)}
                          >
                            Open project <Arrow />
                          </button>
                          <button
                            className="forge-delete"
                            aria-label={`Delete ${d.name}`}
                            onClick={() => remove(d)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                ready && (
                  <div className="forge-empty">
                    <span className="forge-feature-icon">
                      <Icon name="grid" />
                    </span>
                    <h2>
                      {drafts.length
                        ? "No projects match your search."
                        : "Every great system starts somewhere."}
                    </h2>
                    <p>
                      {drafts.length
                        ? "Try a different name or category."
                        : "Create your first blueprint, or import an existing StackForge JSON file."}
                    </p>
                    <button
                      className="forge-button"
                      onClick={() => {
                        if (drafts.length) {
                          setQuery("");
                          setCategory("All");
                        } else {
                          setNewName("");
                          setNewError("");
                          createDialog.current?.showModal();
                        }
                      }}
                    >
                      {drafts.length
                        ? "Clear filters"
                        : "Create your first project"}
                      <Arrow />
                    </button>
                  </div>
                )
              )}
            </>
          ) : (
            <>
              <section className="forge-editor" aria-label="Blueprint editor">
                <div className="forge-editor-toolbar">
                  <div className="forge-name-field">
                    <label htmlFor="blueprint-name">Project name</label>
                    <input
                      id="blueprint-name"
                      maxLength={64}
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        change();
                      }}
                    />
                    <span className="forge-caption">
                      {dirty
                        ? "Unsaved changes"
                        : id
                          ? "Saved on this device"
                          : "Unsaved starter blueprint"}
                    </span>
                  </div>
                  <div className="forge-actions">
                    <button
                      className="forge-button forge-secondary"
                      onClick={download}
                    >
                      <Icon name="download" />
                      Export JSON
                    </button>
                    <button
                      className="forge-button"
                      disabled={!ready || !!storageError}
                      onClick={save}
                    >
                      Save project <Icon name="check" />
                    </button>
                  </div>
                </div>
                <div className="forge-editor-body">
                  <div className="forge-editor-canvas">
                    <div className="forge-canvas-heading">
                      <span>{scenario.name}</span>
                      <span className="forge-tag">
                        3 blocks · Fixed workflow
                      </span>
                    </div>
                    <Flow
                      template={template}
                      value={value}
                      active={activeNode}
                      onSelect={setActiveNode}
                    />
                    <div className="forge-canvas-footer">
                      <span>Select a block to inspect it</span>
                      <span>Concept / v0</span>
                    </div>
                  </div>
                  <aside
                    className="forge-inspector"
                    aria-label="Blueprint inspector"
                  >
                    <div
                      className="forge-inspector-tabs"
                      role="tablist"
                      aria-label="Inspector view"
                    >
                      <button
                        role="tab"
                        id="configure-tab"
                        aria-controls="configure-panel"
                        aria-selected={tab === "configure"}
                        tabIndex={tab === "configure" ? 0 : -1}
                        onClick={() => setTab("configure")}
                        onKeyDown={(e) => {
                          if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                            e.preventDefault();
                            setTab("json");
                            document.getElementById("json-tab")?.focus();
                          }
                        }}
                      >
                        Configure
                      </button>
                      <button
                        role="tab"
                        id="json-tab"
                        aria-controls="json-panel"
                        aria-selected={tab === "json"}
                        tabIndex={tab === "json" ? 0 : -1}
                        onClick={() => setTab("json")}
                        onKeyDown={(e) => {
                          if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                            e.preventDefault();
                            setTab("configure");
                            document.getElementById("configure-tab")?.focus();
                          }
                        }}
                      >
                        JSON
                      </button>
                    </div>
                    {tab === "configure" ? (
                      <div
                        id="configure-panel"
                        role="tabpanel"
                        aria-labelledby="configure-tab"
                      >
                        <p className="forge-eyebrow">
                          BLOCK 0{activeNode + 1} /{" "}
                          {["TRIGGER", "CONDITION", "ACTION"][activeNode]}
                        </p>
                        <h2>
                          {
                            [
                              scenario.trigger,
                              scenario.condition,
                              scenario.action,
                            ][activeNode]
                          }
                        </h2>
                        <p>
                          {
                            [
                              "This event starts the workflow. Events here are samples, not live server events.",
                              "The action runs only if this rule passes. Change the sample input below to test both paths.",
                              scenario.detail,
                            ][activeNode]
                          }
                        </p>
                        <div className="forge-value-field">
                          <label htmlFor="blueprint-value">
                            {scenario.param}
                            <output htmlFor="blueprint-value">
                              {value.toLocaleString("en-US")} {scenario.unit}
                            </output>
                          </label>
                          <input
                            id="blueprint-value"
                            type="range"
                            min={scenario.min}
                            max={scenario.max}
                            step={scenario.step}
                            value={value}
                            onChange={(e) => {
                              setValue(Number(e.target.value));
                              change();
                            }}
                          />
                          <div>
                            <span>{scenario.min}</span>
                            <span>{scenario.max}</span>
                          </div>
                        </div>
                        <div className="forge-inspector-note">
                          <Icon name="shield" />
                          <p>
                            Server permissions, abuse prevention, and framework
                            compatibility still require backend validation.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div
                        id="json-panel"
                        role="tabpanel"
                        aria-labelledby="json-tab"
                      >
                        <p className="forge-caption">
                          Versioned, readable, and yours to keep.
                        </p>
                        <pre tabIndex={0}>
                          <code>{blueprint}</code>
                        </pre>
                        <button
                          className="forge-button forge-secondary"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(blueprint);
                              setMessage("Blueprint JSON copied.");
                            } catch {
                              setMessage(
                                "Clipboard unavailable. Select and copy the JSON above.",
                              );
                            }
                          }}
                        >
                          Copy JSON <Icon name="grid" />
                        </button>
                      </div>
                    )}
                  </aside>
                </div>
              </section>
              <section
                className="forge-simulation"
                aria-labelledby="simulation-title"
              >
                <div className="forge-simulation-head">
                  <div>
                    <p className="forge-eyebrow">
                      TEST BEFORE YOU TAKE IT FURTHER
                    </p>
                    <h2 id="simulation-title">Try a sample event.</h2>
                    <p>Local simulation only. No live player data.</p>
                  </div>
                  <button
                    className="forge-button forge-dark"
                    onClick={() => {
                      setResult(simulate(template, value, eligible, level));
                      setMessage(
                        "Sample simulation complete. No live server was changed.",
                      );
                    }}
                  >
                    <span aria-hidden="true">▷</span> Run simulation
                  </button>
                </div>
                <div className="forge-simulation-body">
                  <div className="forge-sample-input">
                    <span className="forge-tag">Sample player</span>
                    {template === "progression-unlock" ? (
                      <>
                        <label htmlFor="sample-level">
                          Player level: {level}
                        </label>
                        <input
                          id="sample-level"
                          type="range"
                          min={0}
                          max={100}
                          step={1}
                          value={level}
                          onChange={(e) => {
                            setLevel(Number(e.target.value));
                            setResult(null);
                          }}
                        />
                      </>
                    ) : (
                      <label className="forge-checkbox">
                        <input
                          type="checkbox"
                          checked={eligible}
                          onChange={(e) => {
                            setEligible(e.target.checked);
                            setResult(null);
                          }}
                        />
                        {template === "welcome-reward"
                          ? "This is the player’s first visit"
                          : "The player is online"}
                      </label>
                    )}
                    <p>
                      {template === "progression-unlock"
                        ? "Set a level below the threshold to test a skipped action."
                        : "Uncheck to test the path where the condition fails."}
                    </p>
                  </div>
                  <div
                    className="forge-simulation-log"
                    role="status"
                    aria-live="polite"
                  >
                    {result ? (
                      <>
                        <span
                          className={`forge-tag ${result.passed ? "forge-success" : "forge-warning"}`}
                        >
                          {result.passed
                            ? "Condition passed"
                            : "Action skipped"}
                        </span>
                        <ol>
                          {result.steps.map((step, i) => (
                            <li key={step}>
                              <span>0{i + 1}</span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </>
                    ) : (
                      <div className="forge-simulation-placeholder">
                        <Icon name="spark" />
                        <strong>Your test results will appear here.</strong>
                        <p>Change a sample input, then run the simulation.</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
              <div className="forge-editor-bottom">
                <button
                  className="forge-text-link"
                  onClick={() => fileInput.current?.click()}
                >
                  Already have a blueprint? Import JSON <Arrow />
                </button>
                <span>Local projects are not cloud backups.</span>
              </div>
            </>
          )}
          <input
            type="file"
            accept=".json,application/json"
            ref={fileInput}
            className="forge-file-input"
            aria-label="Import blueprint JSON"
            onChange={(e) => {
              void importFile(e.target.files?.[0]);
              e.currentTarget.value = "";
            }}
          />
        </main>
      </div>
      <dialog
        className="forge-dialog"
        ref={createDialog}
        aria-labelledby="create-project-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) createDialog.current?.close();
        }}
      >
        <div className="forge-dialog-heading">
          <span className="forge-feature-icon">
            <Icon name="grid" />
          </span>
          <button
            className="forge-close"
            aria-label="Close new project"
            onClick={() => createDialog.current?.close()}
          >
            ×
          </button>
        </div>
        <p className="forge-eyebrow">SMALL PARTS. BIG POSSIBILITIES.</p>
        <h2 id="create-project-title">Give your idea a starting point.</h2>
        <p>
          This creates an editable draft. Use Save project to keep it on this
          device.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newName.trim() || /[\x00-\x1f\x7f]/.test(newName)) {
              setNewError("Enter a valid project name.");
              return;
            }
            if (!acceptDiscard()) return;
            const s = SCENARIOS.find((s) => s.id === newTemplate)!;
            setName(newName.trim());
            setTemplate(s.id);
            setValue(s.value);
            setId(null);
            setDirty(true);
            setResult(null);
            setMessage("");
            setView("editor");
            setTab("configure");
            createDialog.current?.close();
          }}
        >
          <label htmlFor="new-project-name">Project name</label>
          <input
            id="new-project-name"
            autoFocus
            required
            maxLength={64}
            placeholder="e.g. Riverside welcome bonus"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <label htmlFor="new-project-template">Starting template</label>
          <select
            id="new-project-template"
            value={newTemplate}
            onChange={(e) => setNewTemplate(e.target.value)}
          >
            {SCENARIOS.map((s) => (
              <option value={s.id} key={s.id}>
                {s.name} · {s.category}
              </option>
            ))}
          </select>
          {newError && (
            <p className="forge-error" role="alert">
              {newError}
            </p>
          )}
          <button className="forge-button" type="submit">
            Create blueprint <Arrow />
          </button>
        </form>
      </dialog>
    </div>
  );
}
