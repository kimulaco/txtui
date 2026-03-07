#!/usr/bin/env bash
set -euo pipefail

corepack enable
pnpm install --frozen-lockfile
pnpm astro sync

if ! git config --global --get core.editor >/dev/null 2>&1; then
  git config --global core.editor "vim"
fi

echo "post-create setup complete"
