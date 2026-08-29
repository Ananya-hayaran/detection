export default function FusionNode({ active }) {
  return (
    <div
      className="fusion-node relative flex flex-col items-center justify-center mx-auto"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? "scale(1)" : "scale(0.85)",
      }}
    >
      <div className="relative w-[132px] h-[132px] md:w-[152px] md:h-[152px] flex items-center justify-center">
        <span className="ring-spin absolute inset-0 rounded-full border border-dashed border-[rgba(255,84,104,.35)]" />
        <span
          className={`absolute inset-3 rounded-full bg-[rgba(255,36,56,.08)] border border-[rgba(255,36,56,.4)] ${
            active ? "fusion-glow" : ""
          }`}
        />
        <div className="relative flex flex-col items-center text-center px-3">
          <span className="blink-dot w-1.5 h-1.5 rounded-full bg-[var(--red-core)] mb-1.5" />
          <span className="font-mono text-[9px] tracking-[0.14em] text-white/85 leading-tight uppercase">
            Cross&#8209;Modal
            <br />
            Fusion Engine
          </span>
        </div>
      </div>
    </div>
  );
}
