#!/usr/bin/env bash
set -euo pipefail

# REPO BRAIN HOSPITAL - Dependency Vulnerability Patching (v1.0.0)
# Purpose: Audit and auto-patch known vulnerabilities in project dependencies.
#          Supports: npm (Node.js), pip (Python), cargo (Rust).

ROOT="${ROOT:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
BRAIN="$ROOT/.repo-brain"
OUT="$BRAIN/deps.json"

log() { echo "📦 [deps] $1"; }

# Accumulators
audited=()
findings=()
patched=()
errors=()

# -------------------------------------------------------
# 1. npm Audit (Node.js)
# -------------------------------------------------------
if [ -f "$ROOT/package.json" ]; then
  log "Running npm audit..."
  cd "$ROOT"

  if command -v npm >/dev/null 2>&1; then
    # Capture audit output; npm audit exits non-zero when vulnerabilities exist
    raw_audit=$(npm audit --json 2>/dev/null || true)
    vuln_count=$(echo "$raw_audit" | grep -o '"total":[0-9]*' | head -1 | grep -o '[0-9]*' || echo "0")

    audited+=("\"npm\"")

    if [ "${vuln_count:-0}" -gt 0 ]; then
      findings+=("\"npm: $vuln_count vulnerabilit$([ "$vuln_count" -eq 1 ] && echo 'y' || echo 'ies') found\"")
      log "Found $vuln_count npm vulnerabilities — attempting safe patch..."

      # Auto-patch: only apply non-breaking (semver-compatible) fixes
      patch_out=$(npm audit fix --json 2>/dev/null || true)
      fixed_count=$(echo "$patch_out" | grep -o '"fixed":[0-9]*' | head -1 | grep -o '[0-9]*' || echo "0")

      if [ "${fixed_count:-0}" -gt 0 ]; then
        patched+=("\"npm: $fixed_count vulnerabilit$([ "$fixed_count" -eq 1 ] && echo 'y' || echo 'ies') patched\"")
        log "✅ Patched $fixed_count npm vulnerabilities."
      else
        log "ℹ️  No automatically patchable npm vulnerabilities (may require manual semver bump)."
      fi
    else
      log "✅ npm: No vulnerabilities found."
    fi
  else
    errors+=("\"npm not found in PATH — skipping Node.js audit\"")
    log "⚠️  npm not available."
  fi
fi

# -------------------------------------------------------
# 2. pip / pip-audit (Python)
# -------------------------------------------------------
if [ -f "$ROOT/requirements.txt" ] || [ -f "$ROOT/pyproject.toml" ]; then
  log "Checking Python dependencies..."
  audited+=("\"python\"")

  if command -v pip-audit >/dev/null 2>&1; then
    cd "$ROOT"
    pip_audit_out=$(pip-audit --format json 2>/dev/null || true)
    pip_vuln_count=$(echo "$pip_audit_out" | grep -o '"name"' | wc -l | tr -d ' ' || echo "0")

    if [ "${pip_vuln_count:-0}" -gt 0 ]; then
      findings+=("\"python: $pip_vuln_count vulnerable package(s) found via pip-audit\"")
      log "⚠️  Python: $pip_vuln_count vulnerable package(s) found."
    else
      log "✅ Python: No vulnerabilities found."
    fi
  else
    errors+=("\"pip-audit not installed — run 'pip install pip-audit' to enable Python vulnerability scanning\"")
    log "ℹ️  pip-audit not available — skipping (install with: pip install pip-audit)."
  fi
fi

# -------------------------------------------------------
# 3. cargo audit (Rust)
# -------------------------------------------------------
if [ -f "$ROOT/Cargo.toml" ]; then
  log "Checking Rust dependencies..."
  audited+=("\"rust\"")

  if command -v cargo >/dev/null 2>&1 && cargo audit --version >/dev/null 2>&1; then
    cd "$ROOT"
    cargo_out=$(cargo audit --json 2>/dev/null || true)
    cargo_vuln_count=$(echo "$cargo_out" | grep -o '"count":[0-9]*' | head -1 | grep -o '[0-9]*' || echo "0")

    if [ "${cargo_vuln_count:-0}" -gt 0 ]; then
      findings+=("\"rust: $cargo_vuln_count vulnerable crate(s) found via cargo audit\"")
      log "⚠️  Rust: $cargo_vuln_count vulnerable crate(s) found."
    else
      log "✅ Rust: No vulnerabilities found."
    fi
  else
    errors+=("\"cargo-audit not installed — run 'cargo install cargo-audit' to enable Rust vulnerability scanning\"")
    log "ℹ️  cargo-audit not available — skipping (install with: cargo install cargo-audit)."
  fi
fi

# -------------------------------------------------------
# 4. Output JSON report
# -------------------------------------------------------
audited_json=$(printf '%s\n' "${audited[@]+"${audited[@]}"}" | awk 'NF' | paste -sd, - || true)
findings_json=$(printf '%s\n' "${findings[@]+"${findings[@]}"}" | awk 'NF' | paste -sd, - || true)
patched_json=$(printf '%s\n' "${patched[@]+"${patched[@]}"}" | awk 'NF' | paste -sd, - || true)
errors_json=$(printf '%s\n' "${errors[@]+"${errors[@]}"}" | awk 'NF' | paste -sd, - || true)

cat > "$OUT" <<JSON
{
  "audited_ecosystems": [${audited_json:-}],
  "findings": [${findings_json:-}],
  "patched": [${patched_json:-}],
  "errors": [${errors_json:-}],
  "scanned_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
JSON

log "Dependency audit complete. Report at $OUT"
