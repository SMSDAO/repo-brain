#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
BRAIN="$ROOT/.repo-brain"
DETECT_FILE="$BRAIN/detect.json"

[ -f "$DETECT_FILE" ] || exit 0

langs=$(${JQ_BIN:-jq} -r '.languages[]' "$DETECT_FILE")
mkdir -p "$ROOT/.github/workflows"

deploy_template() {
  local src="$BRAIN/github-actions/$1"
  local dest="$ROOT/.github/workflows/$1"
  if [ -f "$src" ] && [ ! -f "$dest" ]; then
    cp "$src" "$dest"
    echo "Normalized: $1 deployed"
  fi
}

for lang in $langs; do
  case "$lang" in
    node) deploy_template "ci.yml" ;;
    python) deploy_template "python-ci.yml" ;;
    rust) deploy_template "rust-ci.yml" ;;
    solidity) deploy_template "solidity-ci.yml" ;;
  esac
done
