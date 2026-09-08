const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "",
    blurb: "Try the canvas and ship one small system.",
    limit: "3 productions",
    features: ["1 game target", "Community blocks only", "Watermarked exports"],
    highlight: false,
  },
  {
    name: "Starter",
    price: "$15",
    period: "/mo",
    blurb: "For a single server you actively run.",
    limit: "20 productions/mo + 2 revisions",
    features: ["All game targets", "Full block library", "Email support"],
    highlight: false,
  },
  {
    name: "Pro",
    price: "$30",
    period: "/mo",
    blurb: "For builders shipping systems regularly.",
    limit: "60 productions/mo + 5 revisions",
    features: ["Everything in Starter", "Desktop app (local export)", "Priority block requests"],
    highlight: true,
  },
  {
    name: "Business",
    price: "$75",
    period: "/mo",
    blurb: "For networks running several servers.",
    limit: "200 productions/mo + unlimited revisions",
    features: ["Everything in Pro", "Priority generation queue", "Team seats"],
    highlight: false,
  },
];

export default function PricingTable() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {tiers.map((tier) => (
        <div
          key={tier.name}
          className={`rounded-xl border p-6 flex flex-col bg-white ${
            tier.highlight ? "border-accent" : "border-border-c"
          }`}
        >
          {tier.highlight && (
            <span className="text-[11px] font-medium text-accent mb-3">Most popular</span>
          )}
          <span className="font-display font-semibold text-sm">{tier.name}</span>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="font-display font-semibold text-3xl">{tier.price}</span>
            {tier.period && <span className="text-muted text-sm">{tier.period}</span>}
          </div>
          <p className="mt-3 text-sm text-muted leading-relaxed">{tier.blurb}</p>
          <div className="mt-4 pt-4 border-t border-border-c text-sm">{tier.limit}</div>
          <ul className="mt-4 space-y-2 flex-1">
            {tier.features.map((f) => (
              <li key={f} className="text-sm text-muted flex gap-2">
                <span className="text-accent mt-0.5">＋</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <button
            className={`mt-6 w-full text-sm font-medium py-2.5 rounded-md transition ${
              tier.highlight
                ? "bg-accent text-white hover:brightness-105"
                : "border border-border-c hover:border-foreground"
            }`}
          >
            {tier.name === "Free" ? "Start free" : `Choose ${tier.name}`}
          </button>
        </div>
      ))}
    </div>
  );
}
