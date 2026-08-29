const ITEMS = [
  { label: "CARDIAC", value: "72 BPM", top: "20%", left: "64%", delay: "0s" },
  { label: "SPO\u2082", value: "98%", top: "38%", left: "84%", delay: "1.4s" },
  { label: "RESP RATE", value: "16 /MIN", top: "66%", left: "70%", delay: "2.8s" },
  { label: "ANOMALY SCORE", value: "0.02", top: "78%", left: "88%", delay: "4.2s" },
];

export default function HUD() {
  return (
    <div className="absolute inset-0 hidden md:block pointer-events-none" aria-hidden="true">
      {ITEMS.map((it, i) => (
        <div
          key={i}
          className="hud-node absolute font-mono text-[10px] tracking-[0.18em] text-white/70"
          style={{ top: it.top, left: it.left, animationDelay: it.delay }}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-[var(--red-core)]" />
            <span className="opacity-70">{it.label}</span>
          </div>
          <div className="mt-0.5 text-white/85">{it.value}</div>
          <div className="mt-1 h-px w-10 bg-gradient-to-r from-[rgba(255,36,56,.5)] to-transparent" />
        </div>
      ))}
    </div>
  );
}
