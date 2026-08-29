import Particles from "./hero/Particles.jsx";
import PulseTravelers from "./hero/PulseTravelers.jsx";
import HUD from "./hero/HUD.jsx";

// Local DNA image
const DNA_SRC = "/images/dna-background.png";

export default function Hero() {
  return (
    <section className="relative w-full h-screen min-h-[640px] overflow-hidden bg-[var(--bg-black)]">

      {/* ================= BACKGROUND ================= */}
      <div className="absolute inset-0">

        {/* DNA Image */}
        <div className="dna-wrap absolute inset-0">
          <img
            src={DNA_SRC}
            alt="Red DNA double helix"
            className="w-full h-full object-cover object-[62%_center] md:object-[58%_center]"
          />
        </div>

        {/* Left readability gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(5,4,4,0.97) 0%, rgba(5,4,4,0.88) 26%, rgba(5,4,4,0.5) 50%, rgba(5,4,4,0.14) 72%, rgba(5,4,4,0.05) 100%)",
          }}
        />

        {/* Top / bottom gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(5,4,4,0.55) 0%, rgba(5,4,4,0) 22%, rgba(5,4,4,0) 72%, rgba(5,4,4,0.85) 100%)",
          }}
        />

        {/* Radial gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 15% 45%, rgba(5,4,4,0.35) 0%, transparent 55%)",
          }}
        />

        {/* ================= DIAGNOSTIC SCANLINE ================= */}
        <div
          className="scan-bar absolute left-0 right-0 h-24 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, transparent, rgba(255,36,56,.16) 45%, rgba(255,84,104,.28) 50%, rgba(255,36,56,.16) 55%, transparent)",
            mixBlendMode: "screen",
          }}
        />

        {/* Animated elements */}
        <PulseTravelers />
        <Particles />
        <HUD />

      </div>

     
     
{/* ================= AI DIAGNOSTIC STATUS ================= */}
<div className="absolute left-1/2 -translate-x-1/2 bottom-[185px] z-20 text-center pointer-events-none">

  <div className="font-mono text-sm md:text-base tracking-[0.28em] text-white/90 uppercase">
    SIGNAL ANALYSIS ACTIVE
  </div>

  <div className="mt-2 font-mono text-[9px] md:text-[11px] tracking-[0.25em] text-[var(--red-core)] uppercase">
    MULTIMODAL CORRELATION IN PROGRESS
  </div>

</div>


{/* ================= CENTERED BUTTONS ================= */}
<div className="absolute left-1/2 -translate-x-1/2 bottom-24 z-20 flex flex-row items-center justify-center gap-4">

  <button className="btn-primary text-white font-body font-medium text-sm px-7 py-3.5 rounded-md">
    Explore MedSense
  </button>

  <button className="btn-secondary text-white/90 font-body font-medium text-sm px-7 py-3.5 rounded-md">
    View Live Demo
  </button>

</div>
      {/* ================= SCROLL INDICATOR ================= */}
      <div
        className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] tracking-[0.24em] text-white/45 uppercase">
          Scroll to explore
        </span>

        <svg
          className="chevron w-3.5 h-3.5 text-[var(--red-core)]"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

    </section>
  );
}
