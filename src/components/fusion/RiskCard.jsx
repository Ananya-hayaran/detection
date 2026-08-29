import { useCountUp } from "../../hooks/useCountUp.js";

const CIRCUMFERENCE = 326.7;
const RISK_SCORE = 87;

export default function RiskCard({ active }) {
  const score = useCountUp(RISK_SCORE, active, 1000);
  const targetOffset = CIRCUMFERENCE * (1 - RISK_SCORE / 100);

  return (
    <div
      className="risk-card mx-auto max-w-[280px] rounded-xl border border-[rgba(255,36,56,.35)] bg-white/[0.025] backdrop-blur-sm px-7 py-7 text-center"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0)" : "translateY(16px)",
      }}
    >
      <span className="font-mono text-[10px] tracking-[0.2em] text-white/45 uppercase">Unified Patient Risk</span>

      <div className="relative w-[128px] h-[128px] mx-auto my-5">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="4" />
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="url(#riskRingGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            style={{
              strokeDasharray: CIRCUMFERENCE,
              strokeDashoffset: active ? targetOffset : CIRCUMFERENCE,
              transition: "stroke-dashoffset 1s cubic-bezier(.16,.9,.28,1)",
              transitionDelay: "80ms",
            }}
          />
          <defs>
            <linearGradient id="riskRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff5468" />
              <stop offset="100%" stopColor="#ff2438" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="risk-glow font-display font-semibold text-white text-[42px] leading-none">{score}</span>
        </div>
      </div>

      <span className="font-mono font-medium text-[13px] tracking-[0.22em] text-[var(--red-core)] uppercase">
        Critical
      </span>

      <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[rgba(255,36,56,.35)] bg-[rgba(255,36,56,.08)] px-3 py-1.5">
        <span className="blink-dot w-1.5 h-1.5 rounded-full bg-[var(--red-core)]" />
        <span className="font-mono text-[9px] tracking-[0.14em] text-white/75 uppercase">Early Warning Triggered</span>
      </div>
    </div>
  );
}
