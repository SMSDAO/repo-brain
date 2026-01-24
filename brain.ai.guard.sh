#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
BRAIN="$ROOT/.repo-brain"
OUT_DIR="$BRAIN/auto-comments"

mkdir -p "$OUT_DIR"

log() { echo "🛡️ [ai-guard] $1"; }

scan_file() {
  local file="$1"
  local rel="${file#$ROOT/}"
  local out_file="$OUT_DIR/$(echo "$rel" | tr '/\\' '_').md"

  # Pattern Detection
  RISKS=()
  grep -E "child_process|subprocess|os.system" "$file" >/dev/null 2>&1 && RISKS+=("Unsafe execution pattern (subprocess/os.system)")
  grep -Ei "OPENAI_API_KEY|openai.api_key|apiKey|SECRET_KEY|PRIVATE_KEY" "$file" >/dev/null 2>&1 && RISKS+=("Potential hardcoded secret or API key")

  if [ ${#RISKS[@]} -gt 0 ]; then
    {
      echo "# AI Guard Security Advisory"
      echo "- File: \`$rel\`"
      echo ""
      echo "### Findings:"
      for r in "${RISKS[@]}"; do echo "- $r"; done
      echo ""
      echo "> Review this file for compliance with the MERMEDA security spec."
    } > "$out_file"
    log "Flagged: $rel"
  fi
}

log "Scanning for unsafe patterns and secrets..."

find "$ROOT" -type f \
  ! -path "*/node_modules/*" \
  ! -path "*/.git/*" \
  ! -path "*/dist/*" \
  ! -path "*/build/*" \
  ! -path "*/.next/*" \
  ! -path "*/out/*" \
  ! -path "*/coverage/*" \
  \( -name "*.js" -o -name "*.ts" -o -name "*.py" -o -name "*.sol" -o -name "*.rs" -o -name ".env*" \) \
  | while read -r f; do
      scan_file "$f"
    done
