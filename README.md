# MedSense AI — Marketing Site

A cinematic, dark, red-accented landing page for **MedSense AI**, an AI-powered
diagnostic and real-time patient monitoring platform. Built with **React 18**,
**Vite 5**, and **Tailwind CSS 3** (installed locally — no CDN).

## What's included

- **Hero section** — full-screen cinematic hero with the red DNA double-helix
  background (`public/images/dna-background.png`), animated headline, HUD
  vitals readouts, a diagnostic scanline, traveling light pulses along the
  helix, ambient particles, and CTA buttons.
- **Signal Fusion section** — "THE SIGNAL IS NEVER JUST ONE THING." An
  animated, scroll-triggered diagram showing three independent data streams
  (medical imaging, clinical report, live vitals) converging into a
  Cross-Modal Fusion Engine, which resolves into a Unified Patient Risk score
  (87 / Critical) and an early-warning indicator.
- Fully responsive (desktop, tablet, mobile), with distinct desktop
  (curved SVG convergence) and mobile (stacked) layouts for the fusion
  diagram.
- Respects `prefers-reduced-motion` throughout — every custom animation is
  disabled for users who request reduced motion, without hiding any content.

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (typically `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

`npm run build` outputs a production bundle to `dist/`. `npm run preview`
serves that build locally so you can verify it before deploying.

## Project structure

```
MedSense-AI/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── README.md
├── public/
│   └── images/
│       └── dna-background.png      # the reference DNA image, served locally
└── src/
    ├── main.jsx                    # React entry point
    ├── App.jsx                     # composes Navbar + Hero + SignalFusion
    ├── index.css                   # Tailwind directives + all custom
    │                                #   keyframes/utilities (glow, scanline,
    │                                #   particles, reveal, etc.)
    ├── hooks/
    │   ├── useReveal.js            # delayed fade-in on page load
    │   ├── useInView.js            # fires once when scrolled into view
    │   └── useCountUp.js           # eased number tween (risk score)
    └── components/
        ├── Navbar.jsx
        ├── Hero.jsx
        ├── SignalFusion.jsx
        ├── hero/
        │   ├── Particles.jsx       # ambient drifting particles
        │   ├── PulseTravelers.jsx  # red light pulses along the helix
        │   └── HUD.jsx             # floating vitals readouts
        └── fusion/
            ├── icons.jsx           # imaging / clinical / vitals icons
            ├── StreamCard.jsx      # one data-stream card
            ├── ConnectorSVG.jsx    # desktop curved convergence lines
            ├── FusionNode.jsx      # Cross-Modal Fusion Engine node
            ├── RiskCard.jsx        # Unified Patient Risk score card
            └── MobileConnector.jsx # straight connector for mobile layout
```

## Design tokens

Defined as CSS custom properties in `src/index.css` and mirrored in
`tailwind.config.js`:

| Token | Value | Use |
|---|---|---|
| `--bg-black` | `#050404` | Primary background |
| `--bg-panel` | `#0b0808` | Panel/card background |
| `--crimson-deep` | `#5c0e16` | Deep accent |
| `--red-core` | `#ff2438` | Primary red accent / glow |
| `--red-glow` | `#ff5468` | Lighter red for highlights |
| `--white-warm` | `#f5f1ee` | Off-white text |

Typography: **Space Grotesk** (headings), **Inter** (body copy), **IBM Plex
Mono** (system/data labels, nav, HUD, eyebrows) — loaded via Google Fonts in
`index.html`.

## Notes

- The DNA background image is a real local asset at
  `public/images/dna-background.png`. Vite serves everything in `public/`
  from the site root, so it's referenced in `Hero.jsx` as `/images/dna-background.png`
  — no external or temporary URLs anywhere in the project.
- Google Fonts are loaded from Google's CDN in `index.html`, which is
  standard practice and unrelated to the Tailwind-CDN warning this project
  intentionally avoids (Tailwind is a local dependency compiled at build
  time via PostCSS).
- No unused dependencies: the only runtime dependencies are `react` and
  `react-dom`; everything else (`vite`, `@vitejs/plugin-react`,
  `tailwindcss`, `postcss`, `autoprefixer`) is a dev/build-time dependency.
