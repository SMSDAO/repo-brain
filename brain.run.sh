#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
BRAIN="$ROOT/.repo-brain"
AUTO_COMMENT="$BRAIN/auto-comments"
FLEET_JSON="$BRAIN/brain.fleet.json"

log() { echo "🧠 [BRAIN] $1"; }
mkdir -p "$AUTO_COMMENT"

# Node fallback for jq
if ! command -v jq >/dev/null 2>&1; then
  log "⚠️ jq not found, using Node fallback"
  export JQ_BIN="node $BRAIN/tools/json-cli.js"
else
  export JQ_BIN="jq"
fi

require() { [[ -x "$BRAIN/$1" ]] || { log "Missing $1 — brain incomplete"; exit 1; } }

# All 15 phases orchestrated by MERMEDA
SCRIPTS=(
  brain.detect.sh
  brain.scan-actions.sh
  brain.frameworks.sh
  brain.frameworks.ci.sh
  brain.solidity.detect.sh
  brain.solidity.ci.sh
  brain.rust.sh
  brain.normalize.sh
  brain.diagnose.sh
  brain.fix.safe.sh
  brain.verify.sh
  brain.ai.guard.sh
  brain.greenlock.sh
  brain.guard.sh
  brain.fleet.sh
)

for s in "${SCRIPTS[@]}"; do require "$s"; done

for s in "${SCRIPTS[@]}"; do
  log "Executing $s"
  "$BRAIN/$s" || log "⚠️ $s failed, continuing..."
done

# Auto-copy GitHub Actions YAMLs distributed by normalize phase
mkdir -p "$ROOT/.github/workflows"
cp -u "$BRAIN/github-actions/"*.yml "$ROOT/.github/workflows/" 2>/dev/null || true

log "✅ Repo brain run completed"
