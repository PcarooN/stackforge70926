const features = [
  {
    title: "Prebuilt, tested blocks",
    body: "Every block comes from a system that already passed QA in production. Compose them on the canvas instead of writing free-form scripts from scratch.",
    big: true,
  },
  {
    title: "Multi-game targets",
    body: "FiveM, Minecraft, and Unturned today, with the same block model extending to new targets as demand shows up.",
    big: false,
  },
  {
    title: "Local export",
    body: "The desktop app writes straight into your server's file structure for Pro and Business plans.",
    big: false,
  },
  {
    title: "Revision history",
    body: "Every generation is versioned, so you can roll back a system that broke something without starting over.",
    big: false,
  },
];

export default function FeaturesGrid() {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {features.map((f) => (
        <div
          key={f.title}
          className={`rounded-xl border border-border-c bg-white p-6 ${
            f.big ? "sm:col-span-2" : ""
          }`}
        >
          <h3 className="font-display font-semibold text-base">{f.title}</h3>
          <p className="mt-2 text-sm text-muted leading-relaxed max-w-lg">{f.body}</p>
        </div>
      ))}
    </div>
  );
}
