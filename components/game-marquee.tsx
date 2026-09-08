type Game = {
  name: string;
  color: string;
  icon: React.ReactNode;
};

// Simple original glyphs representing each game's theme —
// not the games' official trademarked logos.
const games: Game[] = [
  {
    name: "FiveM",
    color: "#F97316",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 16l2-7a2 2 0 0 1 2-1.4h8A2 2 0 0 1 18 9l2 7"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M4 16h16v2a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-.8L16 17H8l-.5 1.2a1 1 0 0 1-1 .8H5a1 1 0 0 1-1-1v-2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="8" cy="16" r="1.1" fill="currentColor" />
        <circle cx="16" cy="16" r="1.1" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "Minecraft",
    color: "#4D7C0F",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="4" width="7" height="7" fill="currentColor" />
        <rect x="13" y="4" width="7" height="7" fill="currentColor" opacity="0.55" />
        <rect x="4" y="13" width="7" height="7" fill="currentColor" opacity="0.55" />
        <rect x="13" y="13" width="7" height="7" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "Unturned",
    color: "#0F766E",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3l7 3.2v5.4c0 4.4-2.9 7.9-7 9.4-4.1-1.5-7-5-7-9.4V6.2L12 3z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "Rust",
    color: "#B45309",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3l8 4.6v8.8L12 21l-8-4.6V7.6L12 3z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M12 8v8M8.5 10l7 4M15.5 10l-7 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "ARK",
    color: "#1D4ED8",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 18c2-6 6-11 8-13 2 2 6 7 8 13-2.6-1.6-5.3-2.4-8-2.4S6.6 16.4 4 18z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function GameMarquee() {
  const row = [...games, ...games];

  return (
    <div className="marquee-track relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="flex w-max gap-3 animate-marquee">
        {row.map((game, i) => (
          <div
            key={`${game.name}-${i}`}
            className="flex items-center gap-2.5 rounded-full border border-border-c bg-white pl-3 pr-4 py-2 shrink-0"
          >
            <span
              className="flex items-center justify-center h-7 w-7 rounded-full"
              style={{ color: game.color, backgroundColor: `${game.color}1A` }}
            >
              {game.icon}
            </span>
            <span className="font-display font-medium text-sm whitespace-nowrap">
              {game.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
