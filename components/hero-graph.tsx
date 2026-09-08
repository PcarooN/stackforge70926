export default function HeroGraph() {
  return (
    <svg
      viewBox="0 0 480 380"
      fill="none"
      className="w-full h-auto max-w-md"
      role="img"
      aria-label="Diagram of connected blocks representing a game system, including an economy trigger, a payout action, and a permission check"
    >
      {/* connector lines */}
      <path d="M120 90 L 240 150" stroke="#2A2E38" strokeWidth="2" />
      <path d="M240 150 L 380 90" stroke="#2A2E38" strokeWidth="2" />
      <path d="M240 150 L 240 260" stroke="#2A2E38" strokeWidth="2" />
      <path d="M240 260 L 120 320" stroke="#2A2E38" strokeWidth="2" />
      <path d="M240 260 L 360 320" stroke="#2A2E38" strokeWidth="2" />

      {/* animated signal dots along the primary path */}
      <circle r="3.5" fill="#FF9F43">
        <animateMotion dur="3.2s" repeatCount="indefinite" path="M120 90 L 240 150 L 240 260 L 360 320" />
      </circle>

      {/* node: trigger */}
      <g>
        <rect x="60" y="66" width="120" height="48" rx="8" fill="#1A1D24" stroke="#2A2E38" strokeWidth="1.5" />
        <circle cx="78" cy="90" r="4" fill="#5FB8A8" />
        <text x="92" y="94" fill="#EDEBE4" fontSize="12" fontFamily="var(--font-body)">
          On player join
        </text>
      </g>

      {/* node: condition */}
      <g>
        <rect x="180" y="126" width="120" height="48" rx="8" fill="#1A1D24" stroke="#2A2E38" strokeWidth="1.5" />
        <circle cx="198" cy="150" r="4" fill="#FF9F43" />
        <text x="212" y="154" fill="#EDEBE4" fontSize="12" fontFamily="var(--font-body)">
          Check balance
        </text>
      </g>

      {/* node: side action */}
      <g>
        <rect x="320" y="66" width="120" height="48" rx="8" fill="#1A1D24" stroke="#2A2E38" strokeWidth="1.5" />
        <circle cx="338" cy="90" r="4" fill="#5FB8A8" />
        <text x="352" y="94" fill="#EDEBE4" fontSize="12" fontFamily="var(--font-body)">
          Assign role
        </text>
      </g>

      {/* node: payout */}
      <g>
        <rect x="180" y="236" width="120" height="48" rx="8" fill="#1A1D24" stroke="#2A2E38" strokeWidth="1.5" />
        <circle cx="198" cy="260" r="4" fill="#FF9F43" />
        <text x="212" y="264" fill="#EDEBE4" fontSize="12" fontFamily="var(--font-body)">
          Grant starter pack
        </text>
      </g>

      {/* node: log */}
      <g>
        <rect x="60" y="296" width="120" height="48" rx="8" fill="#1A1D24" stroke="#2A2E38" strokeWidth="1.5" />
        <circle cx="78" cy="320" r="4" fill="#5FB8A8" />
        <text x="92" y="324" fill="#EDEBE4" fontSize="12" fontFamily="var(--font-body)">
          Log to Discord
        </text>
      </g>

      {/* node: notify */}
      <g>
        <rect x="300" y="296" width="120" height="48" rx="8" fill="#1A1D24" stroke="#2A2E38" strokeWidth="1.5" />
        <circle cx="318" cy="320" r="4" fill="#5FB8A8" />
        <text x="332" y="324" fill="#EDEBE4" fontSize="12" fontFamily="var(--font-body)">
          Send welcome DM
        </text>
      </g>
    </svg>
  );
}
