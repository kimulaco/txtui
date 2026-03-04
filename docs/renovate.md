# Renovate Policy

## Scope

This repository uses Renovate for dependency updates.

## Branching

- Default branch is `main`.
- Renovate opens pull requests against `develop`.
- Production releases continue through `develop -> main`.

## Merge Policy

- `patch` and `minor` updates are automerged after required CI checks pass.
- `major` updates are never automerged and require manual review.

## Safety Guard

- `pnpm-workspace.yaml` sets `minimumReleaseAge: 1440` (24 hours).
- Renovate also applies a 1-day minimum release age for npm updates.
