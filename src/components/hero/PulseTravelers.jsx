const HELIX_PATH =
  "M -100 470 C 100 300, 250 300, 450 470 C 650 640, 800 640, 1000 470 C 1200 300, 1350 300, 1550 470 C 1700 560, 1780 560, 1850 470";

export default function PulseTravelers() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1600 900"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <path id="helixPath" d={HELIX_PATH} fill="none" />
        <radialGradient id="dotGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff5468" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ff2438" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle
        r="7"
        fill="url(#dotGlow)"
        style={{
          offsetPath: `path('${HELIX_PATH}')`,
          offsetRotate: "0deg",
          animation: "travelA 13s linear infinite",
        }}
      />
      <circle
        r="5"
        fill="url(#dotGlow)"
        style={{
          offsetPath: `path('${HELIX_PATH}')`,
          offsetRotate: "0deg",
          animation: "travelB 17s linear infinite",
          animationDelay: "4s",
        }}
      />
      <style>{`
        @media (prefers-reduced-motion: reduce){ circle{ animation:none !important; opacity:0 !important; } }
      `}</style>
    </svg>
  );
}
