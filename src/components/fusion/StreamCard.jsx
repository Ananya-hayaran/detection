export default function StreamCard({ tag, icon, title, status, active, delayMs, align }) {
  const style = {
    transitionDelay: `${delayMs}ms`,
    opacity: active ? 1 : 0,
    transform: active ? "translate(0,0)" : `translate(${align}, 14px)`,
  };

  return (
    <div
      className="stream-card relative rounded-lg border border-white/10 bg-white/[0.025] backdrop-blur-sm px-5 py-5 md:px-6 md:py-6"
      style={style}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-[9.5px] tracking-[0.16em] text-white/40 uppercase">{tag}</span>
        <span className="w-1 h-1 rounded-full bg-[var(--red-core)] blink-dot" />
      </div>
      <div className="flex items-center gap-3 mb-3">
        <span className="flex items-center justify-center w-9 h-9 rounded-md border border-[rgba(255,36,56,.3)] bg-[rgba(255,36,56,.06)] text-[var(--red-glow)]">
          {icon}
        </span>
        <h3 className="font-display font-medium text-white text-[15px] md:text-base">{title}</h3>
      </div>
      <p className="font-body text-white/55 text-[13px] leading-relaxed pl-[3px]">{status}</p>
    </div>
  );
}
