# txtui

A catalog of plain text UI patterns designed for communicating UI intentions to AI agents.

https://txtui.dev

## Development

### Setup

```sh
pnpm install
pnpm dev
```

### Commands

| Command            | Action                                |
| :----------------- | :------------------------------------ |
| `pnpm dev`         | Start dev server                      |
| `pnpm build`       | Build for production                  |
| `pnpm fmt`         | Run format                            |
| `pnpm lint`        | Run lint                              |
| `pnpm typecheck`   | Run lint                              |
| `pnpm test`        | Run test                              |
| `pnpm allcheck`    | Run format, lint, typecheck, and test |
| `pnpm deploy:dev`  | Deploy to dev environment             |
| `pnpm deploy:prod` | Deploy to production                  |

### GitHub Actions Pinning (aqua + pinact)

This repository uses `aqua` + `pinact` to pin external GitHub Actions (`uses:`) to commit SHAs.

```sh
# 1) Update checksums required by aqua (because require_checksum: true)
aqua update-checksum --prune

# 2) Check if any workflow action is not pinned
aqua exec -- pinact run --check

# 3) Apply pinning updates
aqua exec -- pinact run

# 4) Re-check
aqua exec -- pinact run --check
```

## License

[MIT](./LICENSE)
