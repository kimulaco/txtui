# Renovate Policy

## Scope

This repository uses Renovate for dependency updates.

## Branching

- Default branch is `main`.
- Renovate opens pull requests against `develop`.
- Production releases continue through `develop -> main`.

## Merge Policy

- `patch` and `minor` npm updates are automerged after required CI checks pass.
- `major` npm updates are never automerged and require manual review.
- GitHub Actions updates are grouped and require manual review (`automerge: false`).

## GitHub Actions Pinning Coexistence

- Renovate updates pinned GitHub Actions references.
- `aqua + pinact` validates that all `uses:` references remain pinned to commit SHAs.
- This repository keeps both for complementary roles: update proposal (Renovate) + pin validation (pinact).

## Safety Guard

- `pnpm-workspace.yaml` sets `minimumReleaseAge: 1440` (24 hours).
- Renovate also applies a 1-day minimum release age for npm updates.
