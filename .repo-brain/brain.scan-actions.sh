#!/usr/bin/env bash
set -euo pipefail

# REPO BRAIN HOSPITAL - CI Surface Scan (v2.5.0)
# Purpose: Scan GitHub Actions workflows for:
#   - Inventory (existing)
#   - Permission hardening: detect missing/overly-broad permissions blocks
#   - Malicious workflow detection: crypto-mining, exfiltration, reverse shells

ROOT="${ROOT:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
BRAIN="$ROOT/.repo-brain"
OUT="$BRAIN/actions.json"
QUARANTINE_DIR="$BRAIN/quarantine"

log() { echo "🔍 [scan-actions] $1"; }

if [ ! -d "$ROOT/.github/workflows" ]; then
  log "No workflows directory found."
  echo '{"workflows": [], "jobs": [], "permission_issues": [], "malicious_workflows": []}' > "$OUT"
  exit 0
fi

mkdir -p "$QUARANTINE_DIR"

# -------------------------------------------------------
# 1. Workflow Inventory
# -------------------------------------------------------
workflows=()
for f in "$ROOT"/.github/workflows/*.yml; do
  [ -f "$f" ] || continue
  workflows+=("\"$(basename "$f")\"")
done

# Simple job detection
jobs=()
while read -r line; do
  if [[ "$line" =~ ^[[:space:]]+([a-zA-Z0-9_-]+):$ ]]; then
    jobs+=("\"${BASH_REMATCH[1]}\"")
  fi
done < <(grep -E "^[[:space:]]+[a-zA-Z0-9_-]+:" "$ROOT"/.github/workflows/*.yml 2>/dev/null || true)

# -------------------------------------------------------
# 2. Permission Hardening Audit
# -------------------------------------------------------
permission_issues=()

for f in "$ROOT"/.github/workflows/*.yml; do
  [ -f "$f" ] || continue
  name="$(basename "$f")"

  # Check for top-level permissions block (overly broad)
  if grep -qE "^permissions:[[:space:]]*write-all" "$f" 2>/dev/null; then
    permission_issues+=("\"OVERLY_BROAD: $name has permissions: write-all — restrict to minimal required scopes\"")
    log "⚠️  Overly broad permissions in $name"
  fi

  # Check for jobs that are missing a permissions block and don't inherit from top-level
  # A workflow without ANY permissions block defaults to write on most scopes (pre-2023)
  if ! grep -qE "^permissions:" "$f" 2>/dev/null && ! grep -qE "^[[:space:]]+permissions:" "$f" 2>/dev/null; then
    permission_issues+=("\"MISSING_PERMISSIONS: $name has no permissions block — add 'permissions: contents: read' as a minimum\"")
    log "⚠️  Missing permissions block in $name — patching..."
    # Surgical patch: insert 'permissions: contents: read' after the 'on:' block
    # Only patch if this is not a file we already own (avoid double-patching)
    if ! grep -q "# brain-hardened" "$f" 2>/dev/null; then
      tmpfile=$(mktemp)
      awk '
        /^on:/ { print; in_on=1; next }
        in_on && /^[a-zA-Z]/ && !/^on:/ {
          print "permissions:"
          print "  contents: read"
          print ""
          in_on=0
        }
        { print }
      ' "$f" > "$tmpfile"
      # Only overwrite if awk actually inserted the block
      if grep -q "permissions:" "$tmpfile"; then
        echo "# brain-hardened" >> "$tmpfile"
        mv "$tmpfile" "$f"
        log "✅ Patched permissions in $name"
      else
        rm -f "$tmpfile"
      fi
    fi
  fi
done

# -------------------------------------------------------
# 3. Malicious Workflow Detection & Quarantine
# -------------------------------------------------------
malicious_workflows=()

# Patterns indicative of malicious workflows
MALICIOUS_PATTERNS=(
  "xmrig"           # Crypto miner binary
  "coinhive"        # Crypto mining JS
  "cryptonight"     # Mining algorithm
  "monero"          # Common mining target coin
  "stratum+tcp"     # Mining pool protocol
  "minerd"          # CPU miner
  "curl.*\|.*bash"  # curl-pipe-bash (remote code execution)
  "curl.*\|.*sh"    # curl-pipe-sh
  "wget.*-O-.*\|"   # wget-pipe
  "nc -e /bin"      # Netcat reverse shell
  "bash -i.*>&"     # Interactive reverse shell redirect
  "0\.0\.0\.0.*443" # Suspicious bind on all interfaces
  "/dev/tcp/"        # Bash TCP reverse shell
)

for f in "$ROOT"/.github/workflows/*.yml; do
  [ -f "$f" ] || continue
  name="$(basename "$f")"
  found_malicious=false

  for pattern in "${MALICIOUS_PATTERNS[@]}"; do
    if grep -qE "$pattern" "$f" 2>/dev/null; then
      malicious_workflows+=("\"MALICIOUS: $name contains suspicious pattern matching '$pattern'\"")
      log "🚨 MALICIOUS pattern '$pattern' found in $name — quarantining..."
      found_malicious=true
      break
    fi
  done

  if [ "$found_malicious" = true ]; then
    cp "$f" "$QUARANTINE_DIR/$(basename "$f").quarantined"
    # Remove the malicious workflow
    rm -f "$f"
    log "🗑️  Removed malicious workflow: $name (backup in $QUARANTINE_DIR)"
  fi
done

# -------------------------------------------------------
# 4. Output JSON
# -------------------------------------------------------
# Build JSON arrays safely
perm_issues_json=$(printf '%s\n' "${permission_issues[@]+"${permission_issues[@]}"}" | awk 'NF' | paste -sd, - || true)
malicious_json=$(printf '%s\n' "${malicious_workflows[@]+"${malicious_workflows[@]}"}" | awk 'NF' | paste -sd, - || true)
workflows_json=$(printf '%s\n' "${workflows[@]+"${workflows[@]}"}" | awk 'NF' | paste -sd, - || true)
jobs_json=$(printf '%s\n' "${jobs[@]+"${jobs[@]}"}" | awk 'NF' | paste -sd, - || true)

cat > "$OUT" <<JSON
{
  "workflows": [${workflows_json:-}],
  "jobs": [${jobs_json:-}],
  "permission_issues": [${perm_issues_json:-}],
  "malicious_workflows": [${malicious_json:-}],
  "scanned_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
JSON

log "Actions scan complete. Found ${#permission_issues[@]} permission issue(s), ${#malicious_workflows[@]} malicious workflow(s)."
