export default function ProductMockup() {
  return (
    <div className="rounded-xl border border-border-c bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-16px_rgba(0,0,0,0.12)] overflow-hidden">
      {/* browser chrome */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border-c bg-surface">
        <span className="h-2.5 w-2.5 rounded-full bg-[#E7E7EA]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#E7E7EA]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#E7E7EA]" />
        <div className="ml-3 h-5 flex-1 max-w-[200px] rounded bg-[#EFEFF1]" />
      </div>

      {/* canvas area */}
      <div className="relative h-72 dot-bg bg-white">
        {/* connector lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 460 288" fill="none">
          <path d="M110 70 L 230 110" stroke="#D8D9DD" strokeWidth="1.5" />
          <path d="M230 110 L 350 70" stroke="#D8D9DD" strokeWidth="1.5" />
          <path d="M230 110 L 230 190" stroke="#D8D9DD" strokeWidth="1.5" />
          <path d="M230 190 L 120 220" stroke="#D8D9DD" strokeWidth="1.5" />
          <path d="M230 190 L 340 220" stroke="#D8D9DD" strokeWidth="1.5" />
        </svg>

        {/* nodes */}
        <div className="absolute left-[52px] top-[46px] w-[116px] rounded-lg border border-border-c bg-white shadow-sm px-3 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="text-[11px] font-medium text-foreground">On player join</span>
          </div>
        </div>

        <div className="absolute left-[172px] top-[86px] w-[116px] rounded-lg border border-accent bg-accent-soft shadow-sm px-3 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="text-[11px] font-medium text-foreground">Check balance</span>
          </div>
        </div>

        <div className="absolute left-[292px] top-[46px] w-[116px] rounded-lg border border-border-c bg-white shadow-sm px-3 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#9AE6B4]" />
            <span className="text-[11px] font-medium text-foreground">Assign role</span>
          </div>
        </div>

        <div className="absolute left-[172px] top-[166px] w-[116px] rounded-lg border border-border-c bg-white shadow-sm px-3 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#9AE6B4]" />
            <span className="text-[11px] font-medium text-foreground">Grant starter pack</span>
          </div>
        </div>

        <div className="absolute left-[62px] top-[196px] w-[116px] rounded-lg border border-border-c bg-white shadow-sm px-3 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#9AE6B4]" />
            <span className="text-[11px] font-medium text-foreground">Log to Discord</span>
          </div>
        </div>

        <div className="absolute left-[282px] top-[196px] w-[116px] rounded-lg border border-border-c bg-white shadow-sm px-3 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#9AE6B4]" />
            <span className="text-[11px] font-medium text-foreground">Send welcome DM</span>
          </div>
        </div>
      </div>
    </div>
  );
}
