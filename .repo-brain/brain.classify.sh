#!/usr/bin/env bash
set -euo pipefail

# REPO BRAIN HOSPITAL - Repository Classification Engine (v1.0.0)
# Purpose: Classify the repository type and purpose from its detected tech stack,
#          file structure, and framework, producing classification.json.

ROOT="${ROOT:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
BRAIN="$ROOT/.repo-brain"
DETECT="$BRAIN/detect.json"
OUT="$BRAIN/classification.json"

log() { echo "🏷️  [classify] $1"; }

JQ="${JQ_BIN:-jq}"

# -------------------------------------------------------
# 1. Load detection data if available; else re-detect inline
# -------------------------------------------------------
if [ -f "$DETECT" ]; then
  framework=$("$JQ" -r '.framework // "none"' "$DETECT" 2>/dev/null || echo "none")
  languages=$("$JQ" -r '.languages[]? // empty' "$DETECT" 2>/dev/null || echo "")
else
  framework="none"
  languages=""
fi

# -------------------------------------------------------
# 2. Classification Rules (ordered by specificity)
# -------------------------------------------------------
repo_type="unknown"
description=""
confidence=0

# Smart contract / blockchain repo
if echo "$languages" | grep -q "solidity" \
   || [ -f "$ROOT/foundry.toml" ] || [ -f "$ROOT/hardhat.config.js" ] || [ -f "$ROOT/hardhat.config.ts" ] \
   || [ -f "$ROOT/Anchor.toml" ]; then
  repo_type="smart-contract"
  description="Blockchain smart contract project (Solidity/Rust on-chain)"
  confidence=95

# Mobile app
elif [ "$framework" = "react-native" ] || [ "$framework" = "expo" ] \
     || [ -f "$ROOT/app.json" ] && grep -q "expo" "$ROOT/app.json" 2>/dev/null \
     || [ -f "$ROOT/android/build.gradle" ] || [ -f "$ROOT/ios/Podfile" ]; then
  repo_type="mobile-app"
  description="Mobile application (React Native / Expo / native iOS or Android)"
  confidence=90

# Desktop app (Electron)
elif grep -q '"electron"' "$ROOT/package.json" 2>/dev/null; then
  repo_type="desktop-app"
  description="Desktop application (Electron)"
  confidence=90

# Full-stack web app (Next.js, Nuxt, Remix, SvelteKit)
elif [ "$framework" = "next" ] || [ "$framework" = "nuxt" ] \
     || [ "$framework" = "remix" ] || [ "$framework" = "sveltekit" ]; then
  repo_type="web-app"
  description="Full-stack web application ($framework)"
  confidence=95

# Frontend-only SPA
elif [ "$framework" = "react" ] || [ "$framework" = "vue" ] \
     || [ "$framework" = "svelte" ] || [ "$framework" = "astro" ] \
     || [ "$framework" = "angular" ]; then
  repo_type="web-app"
  description="Frontend single-page application ($framework)"
  confidence=88

# Rust CLI/service
elif echo "$languages" | grep -q "rust" && [ -f "$ROOT/Cargo.toml" ]; then
  if grep -q '\[\[bin\]\]' "$ROOT/Cargo.toml" 2>/dev/null \
     || grep -qE '^name = ' "$ROOT/Cargo.toml" 2>/dev/null; then
    repo_type="cli-tool"
    description="Rust CLI tool or binary"
    confidence=82
  else
    repo_type="library"
    description="Rust library crate"
    confidence=78
  fi

# Python API / service
elif echo "$languages" | grep -q "python"; then
  if [ -f "$ROOT/main.py" ] || [ -f "$ROOT/app.py" ] \
     || grep -qE "fastapi|flask|django" "$ROOT/requirements.txt" 2>/dev/null \
     || grep -qE "fastapi|flask|django" "$ROOT/pyproject.toml" 2>/dev/null; then
    repo_type="api-service"
    description="Python web API or service (FastAPI / Flask / Django)"
    confidence=88
  else
    repo_type="library"
    description="Python library or script collection"
    confidence=70
  fi

# Node.js API / service (no frontend framework)
elif echo "$languages" | grep -q "node"; then
  if [ -f "$ROOT/package.json" ]; then
    if grep -qE '"express"|"fastify"|"koa"|"hapi"' "$ROOT/package.json" 2>/dev/null; then
      repo_type="api-service"
      description="Node.js API service (Express / Fastify / Koa)"
      confidence=88
    elif grep -q '"bin"' "$ROOT/package.json" 2>/dev/null; then
      repo_type="cli-tool"
      description="Node.js CLI tool"
      confidence=85
    else
      repo_type="library"
      description="Node.js library or utility package"
      confidence=72
    fi
  fi

# Documentation site
elif [ -f "$ROOT/docusaurus.config.js" ] || [ -f "$ROOT/docusaurus.config.ts" ] \
     || [ -f "$ROOT/vitepress.config.ts" ] || [ -f "$ROOT/.vitepress/config.ts" ] \
     || ([ -f "$ROOT/package.json" ] && grep -qE '"docusaurus|vitepress"' "$ROOT/package.json" 2>/dev/null); then
  repo_type="documentation"
  description="Documentation or knowledge-base site"
  confidence=90

# Infrastructure / DevOps
elif [ -f "$ROOT/Dockerfile" ] || [ -f "$ROOT/docker-compose.yml" ] \
     || [ -d "$ROOT/terraform" ] || [ -d "$ROOT/infra" ] \
     || [ -f "$ROOT/ansible.cfg" ] || find "$ROOT" -maxdepth 2 -name "*.tf" 2>/dev/null | grep -q .; then
  repo_type="infrastructure"
  description="Infrastructure-as-code or DevOps automation repository"
  confidence=85

else
  repo_type="generic"
  description="Repository type could not be determined from available signals"
  confidence=40
fi

# -------------------------------------------------------
# 3. Write classification.json
# -------------------------------------------------------
cat > "$OUT" <<JSON
{
  "repo_type": "$repo_type",
  "description": "$description",
  "confidence_pct": $confidence,
  "framework": "$framework",
  "classified_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
JSON

log "Classified as '$repo_type' ($confidence% confidence): $description"
