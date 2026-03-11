#!/usr/bin/env bash
set -euo pipefail

# 🛠️ brainctl — REPO BRAIN HOSPITAL CLI (v2.2.0)
# Governance Control Plane for Windows & POSIX

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
BRAIN="$ROOT/.repo-brain"

# Branding
echo -e "\033[1;34m🧠 REPO BRAIN CONTROL PLANE — CyberAI Oracle\033[0m"

cmd="${1:-help}"
shift || true

case "$cmd" in
  run)
    bash "$BRAIN/brain.run.sh"
    ;;

  heal)
    echo "💉 Initiating Self-Healing Protocol..."
    bash "$BRAIN/brain.surgeon.sh" "${1:-v2.2.0}"
    ;;

  doctor)
    bash "$BRAIN/brain.doctor.sh"
    ;;

  autopsy)
    bash "$BRAIN/brain.autopsy.sh"
    ;;

  firewall-install)
    cp "$BRAIN/brain.firewall.sh" "$ROOT/.git/hooks/pre-commit"
    chmod +x "$ROOT/.git/hooks/pre-commit"
    echo "🛡️ Safety Firewall Active on pre-commit"
    ;;

  dashboard)
    echo "🚀 Launching Operator Dashboard (Cloud/Vercel Mode)..."
    npm run dev
    ;;

  pack)
    echo "📦 Packaging Standalone Dashboard (brain.exe)..."
    npm run pack:win
    echo "✅ brain.exe generated in project root."
    ;;

  vitals)
    bash "$BRAIN/brain.vitals.sh"
    ;;

  test)
    bash "$BRAIN/brain.test.sh"
    ;;

  deps)
    bash "$BRAIN/brain.deps.sh"
    ;;

  branch-protect)
    bash "$BRAIN/brain.branch-protect.sh"
    ;;

  classify)
    bash "$BRAIN/brain.classify.sh"
    ;;

  docs)
    bash "$BRAIN/brain.docs.sh"
    ;;

  help|*)
    echo -e "\nUsage: brainctl <command> [args]"
    echo -e "\nCommands:"
    echo "  run                Start 19-Phase Admission Pipeline"
    echo "  heal [v]           Surgical self-repair of brain modules"
    echo "  doctor             Audit brain health & script integrity"
    echo "  dashboard          Run the React UI (Local Dev)"
    echo "  pack               Build standalone brain.exe for Windows"
    echo "  autopsy            Perform a forensic execution trace"
    echo "  vitals             Capture repo size/build/test metrics"
    echo "  test               Run Phase 19 Autonomous Test Suite"
    echo "  firewall-install   Install safety pre-commit hook"
    echo "  deps               Audit & patch dependency vulnerabilities"
    echo "  branch-protect     Enforce branch protection rules"
    echo "  classify           Classify repository type and purpose"
    echo "  docs               Generate security & module documentation"
    echo ""
    echo "Copyrights@ www.CyberAi.network"
    ;;
esac
