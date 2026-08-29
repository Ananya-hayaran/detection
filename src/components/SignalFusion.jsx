import { useEffect, useState } from "react";
import { useInView } from "../hooks/useInView.js";
import { STREAM_ICONS } from "./fusion/icons.jsx";
import StreamCard from "./fusion/StreamCard.jsx";
import ConnectorSVG from "./fusion/ConnectorSVG.jsx";
import FusionNode from "./fusion/FusionNode.jsx";
import RiskCard from "./fusion/RiskCard.jsx";
import MobileConnector from "./fusion/MobileConnector.jsx";

export default function SignalFusion() {
  const [sectionRef, inView] = useInView(0.2);
  const [phase, setPhase] = useState({
    streams: false,
    lines: false,
    fusion: false,
    fusionLine: false,
    risk: false,
  });

  useEffect(() => {
    if (!inView) return;
    const timers = [
      setTimeout(() => setPhase((p) => ({ ...p, streams: true })), 60),
      setTimeout(() => setPhase((p) => ({ ...p, lines: true })), 560),
      setTimeout(() => setPhase((p) => ({ ...p, fusion: true })), 1500),
      setTimeout(() => setPhase((p) => ({ ...p, fusionLine: true })), 1850),
      setTimeout(() => setPhase((p) => ({ ...p, risk: true })), 2650),
    ];
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  return (
    <section ref={sectionRef} className="relative w-full bg-[var(--bg-black)] py-24 md:py-32 overflow-hidden">
      {/* ambient texture matching hero */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(70% 50% at 50% 0%, rgba(255,36,56,.05), transparent 60%)" }}
      />
      <div
        className="section-scan absolute left-0 right-0 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, transparent, rgba(255,36,56,.08) 45%, rgba(255,84,104,.14) 50%, rgba(255,36,56,.08) 55%, transparent)",
          mixBlendMode: "screen",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10">
        {/* header */}
        <div className={`reveal ${inView ? "in" : ""} text-center max-w-2xl mx-auto mb-16 md:mb-20`}>
          <span className="font-mono text-[10px] tracking-[0.28em] text-white/40 uppercase block mb-4">
            System Architecture
          </span>
          <h2
            className="font-display font-semibold text-white leading-[1.1] tracking-tight uppercase"
            style={{ fontSize: "clamp(1.6rem, 3.6vw, 2.6rem)" }}
          >
            The <span className="signal-word">signal</span> is never just one thing.
          </h2>
          <p className="font-body text-white/55 text-[15px] md:text-base leading-relaxed mt-5">
            Critical deterioration rarely begins with a single dramatic warning. MedSense AI connects subtle changes
            across medical imaging, clinical reports, and real&#8209;time patient vitals.
          </p>
        </div>

        {/* ===== desktop / tablet flow ===== */}
        <div className="hidden md:block">
          <div className="relative">
            <div className="grid grid-cols-3 gap-6 lg:gap-8">
              <StreamCard
                tag="Stream 01 · Imaging"
                icon={STREAM_ICONS.imaging}
                title="Chest X&#8209;Ray"
                status="Image abnormality detected"
                active={phase.streams}
                delayMs={0}
                align="-10px"
              />
              <StreamCard
                tag="Stream 02 · Clinical"
                icon={STREAM_ICONS.clinical}
                title="Diagnostic Report"
                status="Key findings extracted"
                active={phase.streams}
                delayMs={140}
                align="0px"
              />
              <StreamCard
                tag="Stream 03 · Vitals"
                icon={STREAM_ICONS.vitals}
                title="Wearable Stream"
                status={"SpO\u2082 \u2193   HRV \u2193"}
                active={phase.streams}
                delayMs={280}
                align="10px"
              />
            </div>

            <div className="relative h-[130px] lg:h-[150px] mt-2">
              <ConnectorSVG active={phase.lines} />
              <span className="absolute font-mono text-[13px] text-white/25" style={{ left: "32%", top: "46%" }}>
                +
              </span>
              <span className="absolute font-mono text-[13px] text-white/25" style={{ left: "65%", top: "46%" }}>
                +
              </span>
            </div>

            <FusionNode active={phase.fusion} />

            <div className="flex justify-center my-3">
              <MobileConnector active={phase.fusionLine} className="h-10" />
            </div>

            <RiskCard active={phase.risk} />
          </div>
        </div>

        {/* ===== mobile flow (stacked) ===== */}
        <div className="md:hidden flex flex-col items-stretch max-w-sm mx-auto">
          <StreamCard
            tag="Stream 01 · Imaging"
            icon={STREAM_ICONS.imaging}
            title="Chest X&#8209;Ray"
            status="Image abnormality detected"
            active={phase.streams}
            delayMs={0}
            align="0px"
          />
          <MobileConnector active={phase.lines} className="h-8" />
          <StreamCard
            tag="Stream 02 · Clinical"
            icon={STREAM_ICONS.clinical}
            title="Diagnostic Report"
            status="Key findings extracted"
            active={phase.streams}
            delayMs={120}
            align="0px"
          />
          <MobileConnector active={phase.lines} className="h-8" />
          <StreamCard
            tag="Stream 03 · Vitals"
            icon={STREAM_ICONS.vitals}
            title="Wearable Stream"
            status={"SpO\u2082 \u2193   HRV \u2193"}
            active={phase.streams}
            delayMs={240}
            align="0px"
          />
          <MobileConnector active={phase.lines} className="h-10" />

          <FusionNode active={phase.fusion} />
          <MobileConnector active={phase.fusionLine} className="h-10" />
          <RiskCard active={phase.risk} />
        </div>

        {/* closing statement */}
        <div className={`reveal ${phase.risk ? "in" : ""} flex items-center justify-center gap-4 mt-20 md:mt-24`}>
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-white/20" />
          <p className="font-mono text-[11px] md:text-xs tracking-[0.14em] text-white/45 uppercase text-center">
            From isolated signals to actionable intelligence.
          </p>
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-white/20" />
        </div>
      </div>
    </section>
  );
}
