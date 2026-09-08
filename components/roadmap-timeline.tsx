const phases = [
  {
    tag: "Phase 1",
    title: "Web canvas",
    body: "Drag-and-drop system builder in the browser. The fastest path to validating demand, with a free tier as the main entry point.",
  },
  {
    tag: "Phase 2",
    title: "Desktop app",
    body: "A lightweight desktop build for Pro and Business users who need direct file-system access to export straight into their server directories.",
  },
  {
    tag: "Phase 3",
    title: "Companion app",
    body: "A mobile app for monitoring servers, approving changes, and adjusting parameters on the go — not for building systems from scratch.",
  },
];

export default function RoadmapTimeline() {
  return (
    <div className="grid sm:grid-cols-3 gap-4">
      {phases.map((phase) => (
        <div
          key={phase.tag}
          className="rounded-xl border border-border-c bg-white p-6"
        >
          <span className="text-[11px] font-medium text-accent">{phase.tag}</span>
          <h3 className="font-display font-semibold text-base mt-2">{phase.title}</h3>
          <p className="text-sm text-muted mt-2 leading-relaxed">{phase.body}</p>
        </div>
      ))}
    </div>
  );
}
