# Hospital Pipeline

This document describes the execution pipeline orchestrated by `brain.run.sh`.

1. Detection (`brain.detect.sh`)
2. CI scan (`brain.scan-actions.sh`)
3. Framework mapping (`brain.frameworks.sh`)
4. CI synthesis (`brain.frameworks.ci.sh`)
5. Solidity/Rust detection and CI wiring
6. Normalization (`brain.normalize.sh`)
7. Diagnosis (`brain.diagnose.sh`)
8. Safe fixes (`brain.fix.safe.sh`)
9. Verification (`brain.verify.sh`)
10. AI guard (`brain.ai.guard.sh`)
11. Greenlock (`brain.greenlock.sh`)
12. Guard / firewall (`brain.guard.sh`)
13. Optional fleet run (`brain.fleet.sh`)

Each step produces JSON artifacts under `.repo-brain/` that power the operator dashboard.
