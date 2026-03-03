# AGENTS.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

txtui is a plain-text UI component catalog site. Users browse and copy-paste text-based UI components (buttons, forms, tables, etc.) to share with AI agents. It is not a generator or editor — it is a searchable catalog of pre-made components.

## Commands

```sh
pnpm install        # Install dependencies
pnpm dev            # Dev server at localhost:4321
pnpm build          # Production build to ./dist/
pnpm allcheck       # Run format, lint, typecheck, and test
pnpm deploy:dev     # Deploy to dev environment
pnpm deploy:prod    # Deploy to production
```

## Tech Stack

- **Framework**: Astro (static site generation, Content Collections for component data)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Sitemap**: `@astrojs/sitemap`
- **Content**: Markdown files in `src/content/components/`
- **TypeScript**: Strict mode (`astro/tsconfigs/strict`)
- **Package manager**: pnpm
- **Linting**: ESLint, Prettier, secretlint, Knip
- **Testing**: Vitest

## Architecture

The project uses Astro's standard structure:

- `src/pages/` — Route pages (`index.astro`, `about.astro`, `404.astro`, `components/[slug].astro`)
- `src/layouts/` — Page layout wrappers
- `src/components/` — Astro components
- `src/content/components/` — Markdown files for each UI component (32 components)
- `src/styles/global.css` — Tailwind CSS v4 theme configuration
- `public/` — Static assets (favicon, robots.txt)

## Language

The project targets a Japanese-speaking audience. UI text and documentation should be in Japanese unless otherwise specified.
