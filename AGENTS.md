# AGENTS.md

※ 規則: 開発者とは必ず日本語で話すこと

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

txtui is a plain-text UI component catalog site. Users browse and copy-paste text-based UI components (buttons, forms, tables, etc.) to share with AI agents. It is not a generator or editor — it is a searchable catalog of pre-made components.

- Domain: txtui.dev
- Hosting: Cloudflare Pages
- Plan details: `.agents/docs/PLAN.md`

## Commands

```sh
pnpm install        # Install dependencies
pnpm dev            # Dev server at localhost:4321
pnpm build          # Production build to ./dist/
pnpm preview        # Preview production build locally
```

## Tech Stack

- **Framework**: Astro (static site generation, Content Collections for component data)
- **Styling**: Tailwind CSS (not yet configured)
- **Search**: Pagefind (not yet configured)
- **Content**: Markdown / MDX files for component definitions
- **TypeScript**: Strict mode (`astro/tsconfigs/strict`)
- **Package manager**: pnpm

## Architecture

The project uses Astro's standard structure:

- `src/pages/` — Route pages (file-based routing)
- `src/layouts/` — Page layout wrappers
- `src/components/` — Astro components
- `src/assets/` — Static assets processed by Astro
- `public/` — Static assets served as-is

## Language

The project targets a Japanese-speaking audience. UI text and documentation should be in Japanese unless otherwise specified.
