#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
BRAIN="$ROOT/.repo-brain"

cmd="${1:-help}"
arg1="${2:-}"
arg2="${3:-}"

case "$cmd" in
  run)
    "$BRAIN/brain.run.sh"
    ;;

  doctor)
    "$BRAIN/brain.doctor.sh"
    ;;

  surgeon)
    "$BRAIN/brain.surgeon.sh" "$arg1"
    ;;

  autopsy)
    "$BRAIN/brain.autopsy.sh"
    ;;

  genome)
    "$BRAIN/brain.genome.sh" "$arg1" "$arg2"
    ;;

  firewall-install)
    cp "$BRAIN/brain.firewall.sh" "$ROOT/.git/hooks/pre-commit"
    chmod +x "$ROOT/.git/hooks/pre-commit"
    echo "🧠 Firewall installed"
    ;;

  vitals)
    "$BRAIN/brain.vitals.sh"
    ;;

  fleet)
    "$BRAIN/brain.fleet.sh" "$arg1" "$arg2"
    ;;

  dashboard-dev)
    cd "$BRAIN/brain.operator-dashboard"
    npm install
    npm run dev
    ;;

  dashboard-build)
    cd "$BRAIN/brain.operator-dashboard"
    npm install
    npm run build
    npm start
    ;;

  *)
    echo "🧠 brainctl — Repo Brain Control Plane"
    echo ""
    echo "Commands:"
    echo "  run                 Run full brain pipeline"
    echo "  doctor              Diagnose repo brain"
    echo "  surgeon <version>   Repair brain from version"
    echo "  autopsy             Full execution trace"
    echo "  genome <from> <to>  Diff brain versions"
    echo "  firewall-install    Install pre-commit firewall"
    echo "  vitals              Collect repo vitals"
    echo "  fleet <mode>        Run fleet operations"
    echo "  dashboard-dev       Run operator dashboard locally"
    echo "  dashboard-build     Build dashboard for production"
    ;;
esac
