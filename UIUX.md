# Cast Brain / Repo-Brain UI & UX Specification

**Operator Dashboard for Autonomous Multi-Repo Governance**

---

## 1. UX Goals

- **Operator-first:** Designed for engineers who govern fleets, not end-users.
- **At-a-glance clarity:** Fleet health status must be digestible in under 3 seconds.
- **Traceability:** Every diagnosis, fix, and autopsy is traceable to source logs and commits.
- **Non-destructive posture:** UI reflects the system's core guarantee—no destructive changes without explicit intent.
- **Progressive disclosure:** Show high-level summaries by default; drill down to details on demand.

---

## 2. Information Architecture

The dashboard is organized into four primary views:

### 2.1 Fleet Overview

**Route:** `/` or `/fleet`

**Purpose:** Show fleet-wide health distribution at a glance.

**Key elements:**

- **Fleet health summary card:**
  - Total repos.
  - Green repos (passing all checks).
  - Yellow repos (warnings, non-blocking).
  - Red repos (critical issues).
  - Gray repos (not yet processed).

- **Status distribution chart:**
  - Pie or donut chart showing green/yellow/red/gray proportions.

- **Repo list table:**
  - Columns:
    - Repo name (clickable to Repo Detail view).
    - Status badge (green/yellow/red/gray).
    - Last run timestamp.
    - Key metrics: test duration, build duration, file count.
  - Filters:
    - By status.
    - By language/framework.
    - By last run date.
  - Search:
    - By repo name.

### 2.2 Repo Detail

**Route:** `/repos/:repoName`

**Purpose:** Deep dive into a single repo's health.

**Key elements:**

- **Repo header:**
  - Repo name and status badge.
  - Last run timestamp.
  - Quick actions:
    - "Run Doctor"
    - "Run Surgeon"
    - "View Autopsy"
    - "View Genome"

- **Health summary:**
  - Diagnosis result (from `brain.health.json`).
  - Key dimensions:
    - Script integrity.
    - CI coverage.
    - Framework alignment.
    - Security posture.

- **Vitals panel:**
  - Repo size, file count, test duration, build duration, Git history depth.
  - Largest directories.

- **Recent activity timeline:**
  - List of recent pipeline runs with:
    - Timestamp.
    - Status (success/failure).
    - Duration.
    - Link to autopsy (if available).

- **Diagnosis detail:**
  - Full `brain.health.md` rendered as markdown.
  - Annotated with severity levels (info/warning/error).

### 2.3 Autopsy & Timeline

**Route:** `/repos/:repoName/autopsy/:timestamp`

**Purpose:** Forensic view of a specific pipeline run.

**Key elements:**

- **Execution timeline:**
  - Visual timeline of each pipeline step with:
    - Step name.
    - Start/end time.
    - Duration.
    - Status (success/failure).
    - Expandable section for logs.

- **Environment snapshot:**
  - Git state (commit hash, branch, dirty status).
  - System info (OS, shell, Node/jq version).

- **Blackbox logs:**
  - Full execution trace from `brain.blackbox.sh`.
  - Searchable and filterable.

- **Artifacts:**
  - Links to generated JSON files (e.g., `brain.detect.json`, `brain.frameworks.json`).
  - Download all artifacts as ZIP.

### 2.4 Genome & Evolution

**Route:** `/repos/:repoName/genome`

**Purpose:** Visualize changes between `.repo-brain` versions.

**Key elements:**

- **Version selector:**
  - Dropdown to select two versions (from/to).

- **Diff view:**
  - Side-by-side or unified diff of:
    - Scripts (`.sh` files).
    - Configs (JSON files).
  - Highlighted changes (added/removed/modified).

- **Genome summary:**
  - Rendered from `brain.genome.md`:
    - Scripts changed.
    - Configs changed.
    - Breaking changes (if any).

---

## 3. Visual Design

### 3.1 Layout

- **Top navigation bar:**
  - Logo ("Cast Brain" or custom).
  - Primary navigation links:
    - Fleet Overview.
    - Settings (optional).
  - Theme toggle (light/dark).

- **Main content area:**
  - Responsive grid or flexbox layout.
  - Cards for summaries, tables for detailed data.

- **Sidebar (optional):**
  - Contextual filters or quick actions.

### 3.2 Color scheme

- **Green (`#10B981`):** Healthy/passing.
- **Yellow (`#F59E0B`):** Warnings/non-blocking issues.
- **Red (`#EF4444`):** Critical/blocking issues.
- **Gray (`#6B7280`):** Unprocessed/unknown state.
- **Background:**
  - Light mode: `#FFFFFF` (primary), `#F3F4F6` (secondary).
  - Dark mode: `#1F2937` (primary), `#111827` (secondary).

### 3.3 Typography

- **Headers:** Sans-serif, medium weight (e.g., Inter, system-ui).
- **Body:** Sans-serif, regular weight.
- **Code:** Monospace (e.g., `JetBrains Mono`, `Fira Code`).

### 3.4 Theming

- **Support for light and dark modes:**
  - Persisted in `localStorage`.
  - System preference detection.

---

## 4. Interaction Patterns

### 4.1 Navigation

- **Primary navigation:**
  - Top nav bar links for major views.

- **Secondary navigation:**
  - Breadcrumbs for nested views (e.g., Fleet > Repo > Autopsy).

- **Direct links:**
  - Repo names in tables link to Repo Detail.
  - Timestamps in timelines link to Autopsy.

### 4.2 Filters and Search

- **Filters:**
  - Applied via dropdown menus or checkboxes.
  - Persist in URL query params for shareability.

- **Search:**
  - Real-time filtering of repo list.
  - Fuzzy matching on repo name.

### 4.3 Empty and Error States

- **Empty fleet:**
  - "No repositories found. Run `brainctl fleet --dashboard` to populate."

- **Missing data:**
  - "No autopsy data available. Run `brainctl autopsy` to generate."

- **Errors:**
  - Clear error messages with suggested actions.
  - Link to documentation or support.

---

## 5. Data Contracts

The dashboard consumes JSON artifacts produced by the hospital pipeline and fleet orchestrator.

### 5.1 Fleet Overview Data

**File:** `brain.fleet.json`

**Schema:**

```json
{
  "timestamp": "2025-01-20T12:00:00Z",
  "repos": [
    {
      "name": "repo-name",
      "status": "green" | "yellow" | "red" | "gray",
      "lastRun": "2025-01-20T11:50:00Z",
      "vitals": {
        "repoSize": "123MB",
        "fileCount": 456,
        "testDuration": "12s",
        "buildDuration": "34s",
        "gitDepth": 789
      },
      "diagnosis": {
        "scriptIntegrity": "pass" | "warn" | "fail",
        "ciCoverage": "pass" | "warn" | "fail",
        "frameworkAlignment": "pass" | "warn" | "fail",
        "securityPosture": "pass" | "warn" | "fail"
      }
    }
  ]
}
```

### 5.2 Repo Detail Data

**Files:**

- `brain.health.json` (diagnosis).
- `brain.vitals.json` (metrics).
- `brain.health.md` (human-readable diagnosis).

**Schema (health.json):**

```json
{
  "status": "green" | "yellow" | "red" | "gray",
  "timestamp": "2025-01-20T12:00:00Z",
  "dimensions": {
    "scriptIntegrity": {
      "status": "pass" | "warn" | "fail",
      "details": "All scripts are executable and well-formed."
    },
    "ciCoverage": {
      "status": "pass" | "warn" | "fail",
      "details": "CI workflows are present and up-to-date."
    },
    "frameworkAlignment": {
      "status": "pass" | "warn" | "fail",
      "details": "Framework detection matches project structure."
    },
    "securityPosture": {
      "status": "pass" | "warn" | "fail",
      "details": "No hardcoded secrets or dangerous patterns detected."
    }
  }
}
```

### 5.3 Autopsy Data

**Directory:** `.repo-brain/autopsy/<timestamp>/`

**Files:**

- `trace.json` (execution trace).
- `env.json` (environment snapshot).
- `blackbox.log` (raw blackbox logs).
- `artifacts/` (all generated JSON files).

**Schema (trace.json):**

```json
{
  "timestamp": "2025-01-20T12:00:00Z",
  "steps": [
    {
      "name": "brain.detect.sh",
      "startTime": "2025-01-20T12:00:01Z",
      "endTime": "2025-01-20T12:00:03Z",
      "duration": "2s",
      "status": "success" | "failure",
      "logs": "Detection complete. Found TypeScript, React, Vite."
    }
  ]
}
```

---

## 6. Accessibility

- **Semantic HTML:**
  - Use `<nav>`, `<main>`, `<header>`, `<footer>`, etc.

- **ARIA labels:**
  - For interactive elements (buttons, links, dropdowns).

- **Keyboard navigation:**
  - All interactive elements must be keyboard-accessible.
  - Focus indicators clearly visible.

- **Color contrast:**
  - WCAG AA compliance (minimum 4.5:1 for normal text, 3:1 for large text).

- **Screen reader support:**
  - Status badges and charts must have accessible text equivalents.

---

## 7. Extensibility

- **Custom views:**
  - New views can be added by:
    - Defining a new route in the router.
    - Creating a new React component.
    - Consuming the same JSON artifacts or extending the schema.

- **Custom data sources:**
  - The dashboard can be extended to consume additional JSON files or APIs.

- **Theming:**
  - Color schemes and typography can be customized via CSS variables or a theme config.

---

## 8. Technology Stack

The operator dashboard is implemented using:

- **Framework:** React (v19.x) with TypeScript.
- **Build tool:** Vite (v6.x).
- **UI library:** Custom components (no heavy framework dependencies).
- **Data visualization:** Recharts (for charts and graphs).
- **Routing:** React Router (or similar).
- **Deployment:** Vercel (via `vercel.json`).

---

## 9. Future Enhancements

- **Real-time updates:**
  - WebSocket or polling for live fleet status updates.

- **Alerting:**
  - Email or Slack notifications for critical repo status changes.

- **Org policies:**
  - Visual editor for fleet-level policies (e.g., "All repos must have CI coverage").

- **AI insights:**
  - LLM-powered recommendations for fixing common issues.

---

## 10. References

- **ARCHITECTURE.md:** Detailed system architecture and pipeline description.
- **MERMEDA spec:** Core specification for hospital modules.
- **Recharts docs:** https://recharts.org/
- **React docs:** https://react.dev/

---

Built by **CyberAI Network** & **GXQ STUDIO**  
[GitHub](https://github.com/SolanaRemix/repo-brain) | [Web](https://cyberai.network)
