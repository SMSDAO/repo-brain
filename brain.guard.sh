#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
BRAIN="$ROOT/.repo-brain"
DIAG="$BRAIN/diagnosis.json"
OUT="$BRAIN/copilot-instructions.md"

[ -f "$DIAG" ] || exit 0

status=$(${JQ_BIN:-jq} -r '.status' "$DIAG")
reason=$(${JQ_BIN:-jq} -r '.reason' "$DIAG")

cat > "$OUT" <<EOF
# Copilot Governance Instructions

## Context
- **Repo Status**: $status
- **Diagnostic**: $reason

## Hard Rules for AI Coding
1. **Fix Plumbing, Not Logic**: Address configuration, CI workflows, and infrastructure drift. Do not modify business logic unless explicitly requested.
2. **Intent Preservation**: Do not rewrite tests or change the intended outcome of existing logic.
3. **No Unsafe Patterns**: Avoid injecting \`subprocess\`, \`child_process\`, or \`os.system\` calls.
4. **Secret Hygiene**: Do not hardcode API keys or secrets. Use environment variables.
5. **Reference Alerts**: See \`.repo-brain/auto-comments/\` for specific files that require security review.
EOF
