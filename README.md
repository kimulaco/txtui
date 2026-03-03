# txtui

A catalog of plain text UI components designed for communicating UI intentions to AI agents.

https://txtui.dev

## Development

### Setup

```sh
pnpm install
pnpm dev
```

### Commands

| Command | Action |
| :--- | :--- |
| `pnpm dev` | Start dev server |
| `pnpm build` | Build for production |
| `pnpm fmt` | Run format |
| `pnpm lint` | Run lint |
| `pnpm typecheck` | Run lint |
| `pnpm test` | Run test |
| `pnpm allcheck` | Run format, lint, typecheck, and test |
| `pnpm deploy:dev` | Deploy to dev environment |
| `pnpm deploy:prod` | Deploy to production |

### Environment Variables

Copy `.env.example` to `.env` and set values as needed.

| Variable | Description |
| :--- | :--- |
| `PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 measurement ID (optional) |

## License

[MIT](./LICENSE)
