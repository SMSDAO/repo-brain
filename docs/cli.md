# CLI Reference (`brainctl`)

## Commands

- `brainctl run` — run full pipeline.
- `brainctl doctor` — run doctor subset.
- `brainctl surgeon` — run safe-fix subset.
- `brainctl autopsy` — run autopsy and export traces.
- `brainctl genome` — generate genome diffs.
- `brainctl firewall-install` — install pre-commit firewall.
- `brainctl vitals` — collect vitals.
- `brainctl fleet` — run fleet orchestrator.

Each command wraps one or more `brain.*.sh` modules and writes artifacts into `.repo-brain/`.
