Cast-Brain Repo Hospital
Autonomous Fleet Governance • Self-Healing • Self-Auditing • Operator-Grade
The Repo-Brain Hospital is the complete ecosystem that maintains, diagnoses, repairs, audits, and observes your entire multi-repo fleet. It is built on the MERMEDA specification and includes:
Brain Doctor — health diagnostics
Brain Surgeon — repair from known-good versions
Brain Autopsy — full execution replay
Brain Genome — version diffing
Brain Firewall — pre-commit safety
Brain Vitals — performance metrics
Brain Operator Dashboard — Next.js UI
Brain Fleet Mode — multi-repo orchestration
Brain Control Plane (brainctl) — unified CLI
🏥 Hospital Modules
1. Brain Doctor
Runs a full health check on .repo-brain:
Missing scripts
Non-executable files
MERMEDA presence
jq/Node fallback
Dry-run failures
JSON schema validation
Output:
.repo-brain/brain.health.json
.repo-brain/brain.health.md run brainctl doctor
2. Brain Surgeon
Repairs .repo-brain from a known-good version:
3. Brain Autopsy
Captures:
Full execution trace
Environment snapshot
Git state
Script logs
Timing
Run:brainctl autopsy
Output:
.repo-brain/autopsy/<timestamp>/
4. Brain Genome
Diffs two versions of .repo-brain:
brain.genome.json
brain.genome.md
5. Brain Firewall
Pre-commit hook that blocks:
Secrets
Subprocess calls
Dangerous patterns
Hardcoded tokens
Install:
6. Brain Vitals
Collects live metrics:
Repo size
File count
Test duration
Build duration
Git history depth
Largest directories
Run:brainctl vitals brainctl dashboard-build
Deploy to Vercel using vercel.json.
8. Brain Fleet Mode
Runs the brain across all repos:
Modes:
--dashboard
--autopsy-all
--doctor-all
--surgeon-all <version>
--genome <from> <to>
🧬 Versioning
Versions live in:
.repo-brain.versions/
Active version is copied into: .repo-brain/ build by GXQ STUDIO @SolanaRemix @CastQuest @SmartBrain
7. Brain Operator Dashboard
Next.js UI for:
Fleet health
Repo vitals
Diagnosis summaries
Status distribution

Living .repo-brain by GXQ STUDO & SOLANA REMIX
This document defines the architecture, flow, responsibilities, and guarantees
of the autonomous multi-repo brain system that governs your fleet of repositories.
It covers:
The core brain pipeline
The hospital (doctor/surgeon/autopsy/genome/immunizer/vitals/blackbox/firewall)
The fleet orchestrator
The operator dashboard
The CLI control plane (brainctl)
Versioning and cross-platform guarantees
1. Purpose
The .repo-brain governs every repository in the fleet by:
Detection
Detects languages, frameworks, and CI configuration.
Normalization
Normalizes repo structure and corrects workflow/drift issues.
Diagnosis
Diagnoses repo health into diagnosis.json.
Aggregates fleet-wide results into brain.fleet.json.
Safe Fixes
Applies safe fixes without touching business logic or tests.
Verification
Runs verification builds/tests.
AI Guard
Flags unsafe AI patterns or secrets.
Generates auto-comments for flagged files in .repo-brain/auto-comments/.
Green Maintenance
Maintains green repos permanently while enabling fleet-wide monitoring.
Cross-Platform JSON Handling
Uses jq when available.
Has Node fallback for JSON manipulation if jq is missing (Windows Git Bash compatible).
CI Autodeploy
Auto-deploys GitHub Actions YAMLs for:
Next.js
Nuxt
SvelteKit
Astro
Remix
Rust
Solidity (Foundry / Hardhat)
Python (pytest / unittest)
Generic Node projects.
2. Master Runner (brain.run.sh)
File: .repo-brain/brain.run.sh
Role: Single entrypoint for each repo — humans and CI only call this.
Responsibilities:
Resolve repo root and .repo-brain path.
Ensure all required scripts exist and are executable.
Configure jq or Node JSON fallback.
Execute the full brain pipeline in order:
brain.detect.sh
brain.scan-actions.sh
brain.frameworks.sh
brain.frameworks.ci.sh
brain.solidity.detect.sh
brain.solidity.ci.sh
brain.rust.sh
brain.normalize.sh
brain.diagnose.sh
brain.fix.safe.sh
brain.verify.sh
brain.ai.guard.sh
brain.greenlock.sh
brain.guard.sh
Optionally call brain.fleet.sh for fleet updates.
Auto-copy GitHub Actions YAMLs into .github/workflows/ if missing.
Guarantees:
Fails fast if core scripts are missing.
Continues on non-critical script failures, logging warnings.
Never modifies business logic or tests without explicit instruction.
