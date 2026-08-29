export default function Navbar() {
  return (
    <nav className="absolute top-0 left-0 w-full z-50 px-6 md:px-10 py-5">
      <div className="w-full flex items-center justify-center">

        <div className="flex items-center gap-6 md:gap-8 lg:gap-10">

          {/* Logo */}
          <a
            href="#"
            className="font-display font-semibold text-white text-lg tracking-tight whitespace-nowrap"
          >
            <span className="text-white">MedSense</span>{" "}
            <span className="text-[var(--red-core)]">AI</span>
          </a>

          {/* Navigation */}
          <div className="flex items-center gap-5 md:gap-7 lg:gap-9">
            <a
              href="#platform"
              className="font-mono text-[10px] md:text-[11px] tracking-[0.18em] text-white/60 hover:text-white transition-colors"
            >
              PLATFORM
            </a>

            <a
              href="#intelligence"
              className="font-mono text-[10px] md:text-[11px] tracking-[0.18em] text-white/60 hover:text-white transition-colors"
            >
              INTELLIGENCE
            </a>

            <a
              href="#monitoring"
              className="font-mono text-[10px] md:text-[11px] tracking-[0.18em] text-white/60 hover:text-white transition-colors"
            >
              MONITORING
            </a>

            <a
              href="#about"
              className="font-mono text-[10px] md:text-[11px] tracking-[0.18em] text-white/60 hover:text-white transition-colors"
            >
              ABOUT
            </a>
          </div>

          {/* System status */}
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-[var(--red-core)] shadow-[0_0_10px_var(--red-core)]" />

            <span className="font-mono text-[10px] md:text-[11px] tracking-[0.15em] text-white/55">
              AI SYSTEM ONLINE
            </span>
          </div>

        </div>
      </div>
    </nav>
  );
}