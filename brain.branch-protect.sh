#!/usr/bin/env bash
set -euo pipefail

# REPO BRAIN HOSPITAL - Automatic Branch Protection (v1.0.0)
# Purpose: Enforce branch protection rules on the default branch.
#          When GITHUB_TOKEN + GITHUB_REPOSITORY are set, applies rules via the GitHub API.
#          Always writes a local spec file for audit purposes.

ROOT="${ROOT:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
BRAIN="$ROOT/.repo-brain"
OUT="$BRAIN/branch-protection.json"

log() { echo "🔒 [branch-protect] $1"; }

# Resolve default branch
DEFAULT_BRANCH="${GITHUB_REF_NAME:-$(git -C "$ROOT" rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")}"
# Normalize: strip refs/heads/ prefix if present
DEFAULT_BRANCH="${DEFAULT_BRANCH#refs/heads/}"

# Detect repo from environment or git remote
if [ -n "${GITHUB_REPOSITORY:-}" ]; then
  REPO="$GITHUB_REPOSITORY"
else
  remote_url=$(git -C "$ROOT" remote get-url origin 2>/dev/null || echo "")
  # Parse owner/repo from https://github.com/owner/repo or git@github.com:owner/repo
  REPO=$(echo "$remote_url" | sed -E 's|.*github\.com[:/]||;s|\.git$||')
fi

# -------------------------------------------------------
# 1. Write branch protection spec (always, for audit trail)
# -------------------------------------------------------
cat > "$OUT" <<JSON
{
  "repository": "${REPO:-unknown}",
  "branch": "$DEFAULT_BRANCH",
  "protection_spec": {
    "required_status_checks": {
      "strict": true,
      "contexts": []
    },
    "enforce_admins": false,
    "required_pull_request_reviews": {
      "dismiss_stale_reviews": true,
      "require_code_owner_reviews": false,
      "required_approving_review_count": 1
    },
    "restrictions": null,
    "allow_force_pushes": false,
    "allow_deletions": false,
    "block_creations": false,
    "required_conversation_resolution": true,
    "lock_branch": false
  },
  "applied": false,
  "applied_at": null,
  "generated_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
JSON

log "Branch protection spec written for '$DEFAULT_BRANCH' on '${REPO:-unknown}'."

# -------------------------------------------------------
# 2. Apply via GitHub API when token is available
# -------------------------------------------------------
if [ -z "${GITHUB_TOKEN:-}" ]; then
  log "ℹ️  GITHUB_TOKEN not set — skipping live API enforcement (spec available at $OUT)."
  log "    To apply manually, use the GitHub UI or run:"
  log "    GITHUB_TOKEN=<token> GITHUB_REPOSITORY=<owner/repo> bash .repo-brain/brain.branch-protect.sh"
  exit 0
fi

if [ -z "${REPO:-}" ] || [ "$REPO" = "unknown" ]; then
  log "⚠️  Cannot determine repository name — set GITHUB_REPOSITORY env var."
  exit 0
fi

API_URL="${GITHUB_API_URL:-https://api.github.com}"
ENDPOINT="$API_URL/repos/$REPO/branches/$DEFAULT_BRANCH/protection"

log "Applying branch protection to $REPO:$DEFAULT_BRANCH via GitHub API..."

http_status=$(curl -s -o /tmp/bp_response.json -w "%{http_code}" \
  -X PUT \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  "$ENDPOINT" \
  -d '{
    "required_status_checks": null,
    "enforce_admins": false,
    "required_pull_request_reviews": {
      "dismiss_stale_reviews": true,
      "require_code_owner_reviews": false,
      "required_approving_review_count": 1
    },
    "restrictions": null,
    "allow_force_pushes": false,
    "allow_deletions": false,
    "required_conversation_resolution": true
  }')

if [ "$http_status" = "200" ]; then
  log "✅ Branch protection successfully applied to $DEFAULT_BRANCH."
  # Update spec to mark as applied
  tmp=$(mktemp)
  sed 's/"applied": false/"applied": true/' "$OUT" \
    | sed "s|\"applied_at\": null|\"applied_at\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\"|" > "$tmp"
  mv "$tmp" "$OUT"
else
  log "⚠️  GitHub API returned HTTP $http_status — check $OUT for details."
  cat /tmp/bp_response.json >> "$OUT" 2>/dev/null || true
fi
