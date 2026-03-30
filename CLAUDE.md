# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Official website and documentation for Gridea Pro — a static blog/CMS tool. Built with Astro 5 + Starlight, deployed on Vercel.

## Commands

```bash
npm run dev       # Dev server at http://localhost:4321
npm run build     # Production build
npm run preview   # Preview production build locally
```

No test runner or linter is configured.

## Architecture

**Two distinct page types with separate layout systems:**

1. **Marketing pages** (`src/pages/`) — `index.astro`, `themes.astro`, `download.astro`, `changelog.astro` — use `src/layouts/BaseLayout.astro` with shared `Header.astro` / `Footer.astro` components.

2. **Documentation** (`src/content/docs/`) — Markdown/MDX files powered by Starlight, which provides its own layout, sidebar, search, and i18n. Starlight config (sidebar structure, locales, custom CSS) lives in `astro.config.mjs`.

**i18n:** Default locale is `zh-CN` (root), with `en` as secondary. Sidebar labels use `translations` objects for English equivalents.

**Styling:** Starlight theme overrides in `src/assets/styles/starlight-overrides.css`. Global tokens/reset in `src/assets/styles/global.css`. Design uses warm cream backgrounds (`#FAFAF8`, `#F5F3F0`) with amber accent (`#D4870E`).

**Fonts:** Plus Jakarta Sans (display), Figtree (body), JetBrains Mono (code).

**Path alias:** `@/*` maps to `src/*` (configured in tsconfig.json).
