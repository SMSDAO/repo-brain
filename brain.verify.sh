#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
BRAIN="$ROOT/.repo-brain"
OUT="$BRAIN/verification.log"

log() { echo "🧪 [verify] $1"; }

run_cmd() {
  log "Running: $1"
  if eval "$1" >> "$OUT" 2>&1; then
    log "✅ Success"
    return 0
  else
    log "❌ Failed"
    return 1
  fi
}

# Clear previous log
echo "--- Verification Session $(date) ---" > "$OUT"

SUCCESS=true

# Node verification
if [ -f "$ROOT/package.json" ]; then
  if grep -q '"build"' "$ROOT/package.json"; then
    run_cmd "npm run build" || SUCCESS=false
  fi
fi

# Rust verification
if [ -f "$ROOT/Cargo.toml" ]; then
  run_cmd "cargo check" || SUCCESS=false
fi

# Solidity verification
if [ -f "$BRAIN/solidity_ci_cmd" ]; then
  run_cmd "$(cat "$BRAIN/solidity_ci_cmd")" || SUCCESS=false
fi

[ "$SUCCESS" = true ] && log "All verification steps passed." || log "Verification sequence failed."
