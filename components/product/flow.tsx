import { SCENARIOS } from "../../lib/blueprint";
import { Icon } from "../dashboard/icon";
export default function Flow({
  template = "welcome-reward",
  value = 500,
  active = -1,
  onSelect,
}: {
  template?: string;
  value?: number;
  active?: number;
  onSelect?: (index: number) => void;
}) {
  const s = SCENARIOS.find((x) => x.id === template) || SCENARIOS[0];
  return (
    <div
      className="forge-flow"
      aria-label={`${s.trigger}, then ${s.condition}, then ${s.action}`}
    >
      {[
        {
          label: "Trigger",
          title: s.trigger,
          detail: "Listen for a game event",
          icon: "spark" as const,
        },
        {
          label: "Condition",
          title: s.condition,
          detail: "Continue only when the rule passes",
          icon: "shield" as const,
        },
        {
          label: "Action",
          title: s.action,
          detail: `${value.toLocaleString("en-US")} ${s.unit}`,
          icon: "grid" as const,
        },
      ].map((node, i) => (
        <div className="forge-flow-step" key={node.label}>
          {i > 0 && (
            <div className="forge-wire" aria-hidden="true">
              <span>{i === 2 ? "PASS" : ""}</span>
            </div>
          )}
          {onSelect ? (
            <button
              type="button"
              className={`forge-node node-${i} ${active === i ? "is-selected" : ""}`}
              onClick={() => onSelect(i)}
              aria-pressed={active === i}
            >
              <span className="forge-node-icon">
                <Icon name={node.icon} />
              </span>
              <span>
                <small>{node.label}</small>
                <strong>{node.title}</strong>
                <span className="forge-node-detail">{node.detail}</span>
              </span>
              <span className="forge-node-index">0{i + 1}</span>
            </button>
          ) : (
            <div className={`forge-node node-${i}`}>
              <span className="forge-node-icon">
                <Icon name={node.icon} />
              </span>
              <span>
                <small>{node.label}</small>
                <strong>{node.title}</strong>
                <span className="forge-node-detail">{node.detail}</span>
              </span>
              <span className="forge-node-index">0{i + 1}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
