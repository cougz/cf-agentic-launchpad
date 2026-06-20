#!/usr/bin/env bash
#
# Enable the repo's committed git hooks (em-dash guard).
# Run once after cloning:  bash scripts/setup-hooks.sh
#
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
git config core.hooksPath .githooks
chmod +x .githooks/* 2>/dev/null || true
echo "Hooks enabled: core.hooksPath = .githooks"
