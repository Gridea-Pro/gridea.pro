# Gridea Pro — Official Website

Static site built with [Astro 5](https://astro.build/) + [Starlight](https://starlight.astro.build/) for documentation, deployed on [Vercel](https://vercel.com/).

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:4321)
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

## Project Structure

```
gridea.pro/
├── public/                  # Static assets (favicon, images)
├── src/
│   ├── assets/
│   │   └── styles/
│   │       ├── global.css               # Shared design tokens & reset
│   │       └── starlight-overrides.css   # Starlight theme overrides
│   ├── components/
│   │   ├── Header.astro     # Site-wide navigation bar
│   │   └── Footer.astro     # Site-wide footer
│   ├── content/
│   │   └── docs/            # Starlight documentation (Markdown/MDX)
│   ├── layouts/
│   │   └── BaseLayout.astro # Shell layout for marketing pages
│   └── pages/
│       └── index.astro      # Homepage
├── astro.config.mjs         # Astro + Starlight + Vercel config
├── package.json
└── tsconfig.json
```

## Key Design Decisions

- **Marketing pages** (`/`, `/themes/`, `/download/`, `/changelog/`) use `BaseLayout.astro` with the shared Header/Footer components.
- **Documentation** (`/docs/*`) is powered by Starlight, which provides its own layout, sidebar, search, and i18n. Starlight's theme colors are overridden in `starlight-overrides.css` to match the warm cream/amber palette from the V2 design.
- **Color scheme**: warm cream backgrounds (`#FAFAF8`, `#F5F3F0`) with amber accent (`#D4870E`) — extracted from the V2 HTML pages.
- **Fonts**: Plus Jakarta Sans (display), Figtree (body), JetBrains Mono (code).

## Deployment

Configured for Vercel static adapter. Connect the repo to Vercel and it will build automatically.

## License

GPL-3.0
