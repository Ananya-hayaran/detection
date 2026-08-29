const PATHS = [
  "M200 0 C 200 130, 460 150, 600 258",
  "M600 0 C 600 110, 600 170, 600 258",
  "M1000 0 C 1000 130, 740 150, 600 258",
];
const DELAYS = [0, 180, 360];

export default function ConnectorSVG({ active }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full hidden md:block pointer-events-none"
      viewBox="0 0 1200 260"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="flowDotGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff5468" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ff2438" stopOpacity="0" />
        </radialGradient>
      </defs>
      {PATHS.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="rgba(255,84,104,.4)"
          strokeWidth="1.4"
          className="draw-line"
          style={{
            strokeDasharray: 700,
            strokeDashoffset: active ? 0 : 700,
            transitionDelay: `${DELAYS[i]}ms`,
          }}
        />
      ))}
      {active &&
        PATHS.map((d, i) => (
          <circle
            key={`dot-${i}`}
            r="3.5"
            fill="url(#flowDotGlow)"
            className="flow-dot"
            style={{
              offsetPath: `path('${d}')`,
              animationName: "travelA",
              animationDuration: "3.2s",
              animationDelay: `${1.1 + i * 0.5}s`,
            }}
          />
        ))}
    </svg>
  );
}
