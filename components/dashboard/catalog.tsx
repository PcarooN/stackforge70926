"use client";
import { useRef, useState } from "react";
import { SCENARIOS, createBlueprint, type Scenario } from "../../lib/blueprint";
import { Icon } from "./icon";
function download(id: string, value: number) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(createBlueprint(id, value), null, 2)], {
      type: "application/json",
    }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = `stackforge-${id}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export default function Catalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [selected, setSelected] = useState<Scenario>(SCENARIOS[0]);
  const dialog = useRef<HTMLDialogElement>(null);
  const [feedback, setFeedback] = useState("");
  const items = SCENARIOS.filter(
    (s) =>
      (category === "All categories" || s.category === category) &&
      `${s.name} ${s.detail}`
        .toLowerCase()
        .includes(query.toLowerCase().trim()),
  );
  return (
    <>
      <div className="studio-page-heading">
        <div>
          <p className="studio-eyebrow">SMALL PARTS. BIG POSSIBILITIES.</p>
          <h1>
            Concept library<span className="studio-blue-dot">.</span>
          </h1>
          <p>Explore illustrative workflows before the full editor arrives.</p>
        </div>
        <span className="studio-badge">Preview collection</span>
      </div>
      <div className="studio-library-filter">
        <div>
          <label htmlFor="concept-search">Find a concept</label>
          <input
            id="concept-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search rewards, events, progression…"
          />
        </div>
        <div>
          <label htmlFor="concept-category">Category</label>
          <select
            id="concept-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {[
              "All categories",
              ...new Set(SCENARIOS.map((x) => x.category)),
            ].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>
      <p className="studio-library-count" role="status">
        {items.length} {items.length === 1 ? "concept" : "concepts"} · JSON
        specifications, not game scripts
      </p>
      <div className="studio-template-grid">
        {items.map((s, i) => (
          <article className="studio-template" key={s.id}>
            <div
              className={`studio-template-art tone-${i % 3}`}
              aria-label="Three connected blocks"
            >
              <span>{s.trigger}</span>
              <b aria-hidden="true">↓</b>
              <span>{s.condition}</span>
              <b aria-hidden="true">↓</b>
              <span>{s.action}</span>
            </div>
            <div className="studio-template-body">
              <span className="studio-badge">{s.category}</span>
              <h2>{s.name}</h2>
              <p>{s.detail}</p>
              <button
                className="studio-button studio-secondary"
                type="button"
                onClick={() => {
                  setSelected(s);
                  setFeedback("");
                  dialog.current?.showModal();
                }}
              >
                Inspect blueprint <Icon name="arrow" />
              </button>
            </div>
          </article>
        ))}
      </div>
      {items.length === 0 && (
        <div className="studio-empty">
          <Icon name="grid" />
          <h2>No matching concepts</h2>
          <p>Try another search or clear the category filter.</p>
          <button
            className="studio-button studio-secondary"
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("All categories");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
      <dialog
        ref={dialog}
        className="studio-dialog"
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
        aria-labelledby="concept-dialog-title"
      >
        <div className="studio-dialog-heading">
          <div>
            <p className="studio-eyebrow">ILLUSTRATIVE SPECIFICATION</p>
            <h2 id="concept-dialog-title">{selected.name}</h2>
          </div>
          <form method="dialog">
            <button
              className="studio-dialog-close"
              aria-label="Close blueprint"
            >
              ×
            </button>
          </form>
        </div>
        <p>
          This is a versioned concept blueprint. It does not contain deployable
          game code.
        </p>
        <pre tabIndex={0}>
          <code>
            {JSON.stringify(
              createBlueprint(selected.id, selected.value),
              null,
              2,
            )}
          </code>
        </pre>
        <p role="status">{feedback}</p>
        <button
          className="studio-button"
          type="button"
          onClick={() => {
            try {
              download(selected.id, selected.value);
              setFeedback("Download started.");
            } catch {
              setFeedback(
                "Download unavailable. Select and copy the JSON above.",
              );
            }
          }}
        >
          <Icon name="download" />
          Download JSON
        </button>
      </dialog>
    </>
  );
}
