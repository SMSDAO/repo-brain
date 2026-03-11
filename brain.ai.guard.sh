#!/usr/bin/env bash
set -euo pipefail

# REPO BRAIN HOSPITAL - AI Guard: Pathological Security Scan (v2.5.0)
# Purpose: Deep forensic scan for LLM credentials, unsafe execution, arbitrary code injection,
#          and expanded secret key detection (GitHub, AWS, Azure, Slack, Stripe, SSH, JWT, DB URLs).

ROOT="${ROOT:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
BRAIN="$ROOT/.repo-brain"
OUT_DIR="$BRAIN/auto-comments"

mkdir -p "$OUT_DIR"

log() { echo "🛡️ [ai-guard:surgeon] $1"; }

scan_file() {
  local file="$1"
  local rel="${file#$ROOT/}"
  local out_file="$OUT_DIR/$(echo "$rel" | tr '/.' '_').md"

  # Pattern Detection State
  RISKS=()
  WEB3_DETECTED=false

  # 1. Critical Execution Risks (Injection & Unsafe Shell)
  grep -E "child_process|subprocess|os.system|exec\(" "$file" >/dev/null 2>&1 && RISKS+=("CRITICAL: Unsafe shell execution pattern (High risk of Command Injection)")
  grep -E "eval\(|new Function\(|setTimeout\(.*['\"].*['\"]\)" "$file" >/dev/null 2>&1 && RISKS+=("CRITICAL: Arbitrary Code Injection vulnerability detected (Usage of eval or dynamic code evaluation)")
  grep -E "sh -c|bash -c" "$file" >/dev/null 2>&1 && RISKS+=("WARNING: Potential shell wrapping vulnerability via -c flag")

  # 2. LLM / AI API Credentials
  grep -Ei "OPENAI_API_KEY|openai.api_key|sk-[a-zA-Z0-9]{48}" "$file" >/dev/null 2>&1 && RISKS+=("PATHOLOGICAL: OpenAI Secret Key exposure detected")
  grep -Ei "ANTHROPIC_API_KEY|ant-api-[a-zA-Z0-9]{60}" "$file" >/dev/null 2>&1 && RISKS+=("PATHOLOGICAL: Anthropic API Key exposure detected")
  grep -Ei "GEMINI_API_KEY|GOOGLE_API_KEY|AIzaSy[a-zA-Z0-9_-]{33}" "$file" >/dev/null 2>&1 && RISKS+=("PATHOLOGICAL: Google/Gemini API Key exposure detected")

  # 3. GitHub Tokens
  grep -E "ghp_[a-zA-Z0-9]{36}|ghs_[a-zA-Z0-9]{36}|gho_[a-zA-Z0-9]{36}|github_pat_[a-zA-Z0-9_]{82}" "$file" >/dev/null 2>&1 && RISKS+=("PATHOLOGICAL: GitHub Personal Access Token or App Token exposure detected")

  # 4. AWS Credentials
  grep -E "AKIA[A-Z0-9]{16}" "$file" >/dev/null 2>&1 && RISKS+=("PATHOLOGICAL: AWS Access Key ID exposure detected")
  grep -Ei "aws_secret_access_key|AWS_SECRET_ACCESS_KEY" "$file" >/dev/null 2>&1 && RISKS+=("PATHOLOGICAL: AWS Secret Access Key identifier exposure detected")

  # 5. Azure / GCP Service Account Credentials
  grep -Ei "\"client_secret\"[[:space:]]*:[[:space:]]*\"[a-zA-Z0-9_~.-]{34,40}\"" "$file" >/dev/null 2>&1 && RISKS+=("PATHOLOGICAL: Azure/GCP client_secret value detected in JSON")
  grep -Ei "AZURE_CLIENT_SECRET|AZURE_STORAGE_CONNECTION_STRING" "$file" >/dev/null 2>&1 && RISKS+=("WARNING: Azure credential identifier detected — ensure value is not hardcoded")

  # 6. Slack Tokens
  grep -E "xoxb-[0-9]{11}-[0-9]{11}-[a-zA-Z0-9]{24}|xoxp-[0-9]+-[0-9]+-[0-9]+-[a-zA-Z0-9]{32}" "$file" >/dev/null 2>&1 && RISKS+=("PATHOLOGICAL: Slack Bot/User OAuth Token exposure detected")

  # 7. Stripe Keys
  grep -E "sk_live_[a-zA-Z0-9]{24,}|rk_live_[a-zA-Z0-9]{24,}" "$file" >/dev/null 2>&1 && RISKS+=("PATHOLOGICAL: Stripe Live Secret/Restricted Key exposure detected")

  # 8. SSH Private Keys
  grep -E "\-\-\-\-\-BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY\-\-\-\-\-" "$file" >/dev/null 2>&1 && RISKS+=("PATHOLOGICAL: SSH/TLS Private Key material detected in file")

  # 9. JWT Tokens (hardcoded bearer tokens)
  grep -E "eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}" "$file" >/dev/null 2>&1 && RISKS+=("WARNING: Hardcoded JWT token detected — tokens must not be committed to source control")

  # 10. Database Connection Strings with embedded credentials
  grep -Ei "(postgres|mysql|mongodb|redis)://[^[:space:]\"']+:[^[:space:]\"'@]+@" "$file" >/dev/null 2>&1 && RISKS+=("PATHOLOGICAL: Database connection string with embedded credentials detected")

  # 11. Generic secret identifiers
  grep -Ei "SECRET_KEY|API_SECRET|PRIVATE_KEY" "$file" >/dev/null 2>&1 && RISKS+=("WARNING: Generic sensitive credential identifier detected")

  # 12. Web3 Stack Detection & Specific Risks
  if grep -E "ethers|web3|solana/web3.js" "$file" >/dev/null 2>&1; then
    WEB3_DETECTED=true
    grep -E "0x[a-fA-F0-9]{64}" "$file" >/dev/null 2>&1 && RISKS+=("CRITICAL: Hardcoded 64-char hex string (Possible Ethereum/EVM Private Key leak)")
    grep -E "new Wallet\(|privateKeyToAccount\(|mnemonicToSeed" "$file" >/dev/null 2>&1 && RISKS+=("CRITICAL: Unsafe wallet initialization with potential hardcoded entropy")
    grep -E "http://" "$file" | grep -E "infura|alchemy|quicknode" >/dev/null 2>&1 && RISKS+=("WARNING: Unsafe HTTP RPC endpoint (Use TLS/HTTPS for provider security)")
  fi

  if [ ${#RISKS[@]} -gt 0 ]; then
    {
      echo "# 🛡️ REPO BRAIN: Pathological Advisory"
      echo "- **Target File**: \`$rel\`"
      echo "- **Genome Signature**: $([ "$WEB3_DETECTED" = true ] && echo "Web3-Enhanced" || echo "Standard Stack")"
      echo ""
      echo "### ⚠️ Security Pathologies Detected:"
      for r in "${RISKS[@]}"; do echo "- $r"; done
      echo ""
      echo "### 🩺 Surgical Recommendation:"
      echo "1. **Credential Hygiene**: NEVER hardcode API keys or secrets. Transition to encrypted environment variables or Secret Management systems (e.g., GitHub Secrets, HashiCorp Vault)."
      echo "2. **Shell Security**: Avoid shell-based execution. If necessary, use parameterized arguments and avoid string concatenation."
      echo "3. **Input Validation**: Sanitize all inputs before passing them to dynamic execution contexts."
      echo "4. **Token Rotation**: If a live secret was detected, rotate it immediately in the issuing platform."
      if [ "$WEB3_DETECTED" = true ]; then
        echo "5. **Web3 Hardening**: Use HTTPS for RPC endpoints and ensure mnemonics/private keys are only accessed via secure vaulting."
      fi
      echo ""
      echo "> This report was autonomously generated by the AI Guard module of REPO BRAIN HOSPITAL V2."
    } > "$out_file"
    log "Flagged Pathological Pattern: $rel"
  fi
}

log "Initiating Deep Trace Security Scan (LLM Credential & Injection Guard active)..."

find "$ROOT" -type f \
  ! -path "*/node_modules/*" \
  ! -path "*/.git/*" \
  ! -path "*/dist/*" \
  ! -path "*/build/*" \
  ! -path "*/.next/*" \
  ! -path "*/out/*" \
  ! -path "*/.repo-brain/autopsy/*" \
  \( -name "*.js" -o -name "*.ts" -o -name "*.py" -o -name "*.sol" -o -name "*.rs" -o -name ".env*" -o -name "*.tsx" -o -name "*.jsx" -o -name "*.sh" -o -name "*.json" -o -name "*.yml" -o -name "*.yaml" -o -name "*.pem" -o -name "*.key" \) \
  | while read -r f; do
      scan_file "$f"
    done

log "Scan Cycle Complete. Forensic advisories archived in $OUT_DIR"