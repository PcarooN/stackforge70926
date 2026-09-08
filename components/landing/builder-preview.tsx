"use client";
import { useId, useState } from "react";
import { SCENARIOS, createBlueprint, type Scenario } from "../../lib/blueprint";
import { Arrow } from "./primitives";
export default function BuilderPreview() {
  const [scenarioId, setScenarioId] = useState<Scenario["id"]>(SCENARIOS[0].id);
  const [value, setValue] = useState<number>(SCENARIOS[0].value);
  const [view, setView] = useState<"flow" | "blueprint">("flow");
  const scenario =
    SCENARIOS.find((item) => item.id === scenarioId) ?? SCENARIOS[0];
  const selectId = useId();
  const rangeId = useId();
  const panelId = useId();
  const blueprint = JSON.stringify(createBlueprint(scenarioId, value), null, 2);
  const [exportMessage, setExportMessage] = useState("");
  function downloadBlueprint() {
    try {
      const url = URL.createObjectURL(
        new Blob([blueprint + "\n"], { type: "application/json" }),
      );
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `stackforge-${scenarioId}.json`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setExportMessage(
        "Blueprint downloaded. This JSON is a concept specification, not a game script.",
      );
    } catch {
      setExportMessage(
        "Download unavailable. Open Blueprint to select and copy the JSON instead.",
      );
    }
  }

  return (
    <section
      id="preview"
      className="sf-shell sf-preview-section"
      aria-label="Interactive product concept"
    >
      <div className="sf-preview">
        <div className="sf-preview-toolbar">
          <div className="sf-preview-project">
            <span className="sf-project-icon" aria-hidden="true">
              ◇
            </span>
            <span>
              My first system{" "}
              <span className="sf-muted">/ Concept workspace</span>
            </span>
          </div>
          <span className="sf-status">Interactive concept</span>
        </div>
        <div className="sf-preview-body">
          <aside className="sf-library">
            <label className="sf-field-label" htmlFor={selectId}>
              START WITH AN IDEA
            </label>
            <select
              id={selectId}
              value={scenarioId}
              onChange={(event) => {
                const next = SCENARIOS.find(
                  (item) => item.id === event.target.value,
                );
                if (next) {
                  setScenarioId(next.id);
                  setValue(next.value);
                }
              }}
            >
              {SCENARIOS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <p className="sf-library-caption">BUILDING BLOCKS</p>
            <ul className="sf-block-list">
              <li>
                <span className="sf-block-symbol sf-blue">↗</span>Triggers
              </li>
              <li>
                <span className="sf-block-symbol sf-amber">◇</span>Conditions
              </li>
              <li>
                <span className="sf-block-symbol sf-green">＋</span>Actions
              </li>
            </ul>
            <p className="sf-library-foot">
              Small parts.
              <br />
              <strong>Systems that feel like yours.</strong>
            </p>
          </aside>
          <div className="sf-workspace">
            <div className="sf-workspace-toolbar">
              <span>
                {scenario.category}{" "}
                <span className="sf-muted">/ {scenario.name}</span>
              </span>
              <div
                className="sf-view-switch"
                role="group"
                aria-label="Preview display"
              >
                <button
                  type="button"
                  aria-pressed={view === "flow"}
                  aria-controls={panelId}
                  onClick={() => setView("flow")}
                >
                  Flow
                </button>
                <button
                  type="button"
                  aria-pressed={view === "blueprint"}
                  aria-controls={panelId}
                  onClick={() => setView("blueprint")}
                >
                  Blueprint
                </button>
              </div>
            </div>
            <div
              id={panelId}
              className={view === "flow" ? "sf-canvas" : "sf-code-pane"}
            >
              {view === "flow" ? (
                <>
                  <div className="sf-canvas-label">
                    ONE IDEA. THREE CONNECTED BLOCKS.
                  </div>
                  <ol className="sf-flow">
                    {[
                      {
                        kind: "TRIGGER",
                        text: scenario.trigger,
                        symbol: "↗",
                        style: "sf-blue",
                      },
                      {
                        kind: "CONDITION",
                        text: scenario.condition,
                        symbol: "◇",
                        style: "sf-amber",
                      },
                      {
                        kind: "ACTION",
                        text: scenario.action,
                        symbol: "＋",
                        style: "sf-green",
                      },
                    ].map((node, index) => (
                      <li key={node.kind} className="sf-node">
                        <div className="sf-node-top">
                          <span
                            className={`sf-block-symbol ${node.style}`}
                            aria-hidden="true"
                          >
                            {node.symbol}
                          </span>
                          <span>{node.kind}</span>
                          <span className="sf-node-index">0{index + 1}</span>
                        </div>
                        <strong>{node.text}</strong>
                        <span className="sf-node-bottom">
                          {index === 2
                            ? `${value} ${scenario.unit}`
                            : index === 0
                              ? "Start the flow"
                              : "Continue when true"}
                        </span>
                      </li>
                    ))}
                  </ol>
                  <p className="sf-canvas-caption">
                    Choose a template. Adjust a value. Inspect the blueprint.
                  </p>
                </>
              ) : (
                <>
                  <p className="sf-code-caption">
                    Illustrative blueprint · Not a deployable game script
                  </p>
                  <pre tabIndex={0} aria-label="Illustrative JSON blueprint">
                    <code>{blueprint}</code>
                  </pre>
                </>
              )}
            </div>
            <div className="sf-parameter">
              <div>
                <label htmlFor={rangeId}>{scenario.param}</label>
                <p>Try changing this value.</p>
              </div>
              <div className="sf-range-wrap">
                <input
                  id={rangeId}
                  type="range"
                  min={scenario.min}
                  max={scenario.max}
                  step={scenario.step}
                  value={value}
                  aria-valuetext={`${value} ${scenario.unit}`}
                  onChange={(event) => setValue(Number(event.target.value))}
                />
                <output htmlFor={rangeId}>
                  {value} {scenario.unit}
                </output>
              </div>
            </div>
          </div>
        </div>
        <div className="sf-export-row">
          <div>
            <strong>Take the idea with you.</strong>
            <p>
              Download the current blueprint as JSON. No account or server
              connection.
            </p>
          </div>
          <button
            type="button"
            className="sf-button sf-button-secondary"
            onClick={downloadBlueprint}
          >
            Download blueprint <Arrow />
          </button>
        </div>
        <p className="sf-export-message" role="status" aria-live="polite">
          {exportMessage}
        </p>
        <div className="sf-preview-footer">
          <span>
            <strong>Preview only.</strong> No drag-and-drop, compilation or
            server connection in this demo.
          </span>
          <span>LOCAL INTERACTION</span>
        </div>
      </div>
      <div
        className="sf-preview-description"
        aria-live="polite"
        aria-atomic="true"
      >
        <h2>{scenario.outcome}</h2>
        <p>{scenario.detail}</p>
      </div>
    </section>
  );
}
