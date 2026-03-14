# Developer Guide

This guide covers the Repo Brain Hospital platform for developers integrating or extending it.

## Developer Console

Navigate to **Developer** in the sidebar to access:

- **API Monitor** — Live status of Supabase REST API calls with method, path, latency, and status codes
- **Log Viewer** — Streaming log console showing system events in real time
- **Environment** — Inspect configured environment variables (sensitive values are masked)
- **Deployment** — Build diagnostics: Vite version, output directory, TypeScript config, bundle size

> Developer console access requires the `developer` or `admin` role.

## Local Development

```bash
# Clone and install
git clone https://github.com/SMSDAO/repo-brain.git
cd repo-brain
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Start development server
npm run dev
# App runs at http://localhost:3000
```

## Building

```bash
npm run build
# Output goes to dist/
```

## TypeScript

```bash
npx tsc --noEmit   # Type check only
```

## Brain Scripts

The `.repo-brain/` directory contains the governance automation scripts:

| Script | Purpose |
|--------|---------|
| `brain.test.sh` | Integration test suite |
| `brain.run.sh` | Master orchestration runner |
| `brain.ai.guard.sh` | Security pattern scanner |
| `brain.doctor.sh` | Health diagnosis |
| `brain.surgeon.sh` | Auto-repair |
| `brain.autopsy.sh` | Forensic analysis |
| `brain.immunizer.sh` | Vulnerability patching |
| `brain.vitals.sh` | Vitals collection |

Run tests:

```bash
bash .repo-brain/brain.test.sh
```

## REST API

The platform uses the Supabase auto-generated REST API. Key tables:

| Endpoint | Description |
|----------|-------------|
| `GET /rest/v1/brains` | List all repos (brains) |
| `GET /rest/v1/alerts` | List security alerts |
| `GET /rest/v1/runs` | List execution runs |
| `GET /rest/v1/users` | List users (admin only) |
| `PATCH /rest/v1/brains` | Update brain status |
| `POST /rest/v1/runs` | Create a new run |

All requests require the `apikey` header with your anon or service role key.

## CI/CD

GitHub Actions workflows:

| Workflow | Trigger | Steps |
|----------|---------|-------|
| `ci.yml` | push, PR | Install → Typecheck → Build → Brain tests |
| `docs-ci.yml` | push to main, PR | Install → Build → Validate docs tree |
| `brain-auto-comments.yml` | PR opened/sync | Run brain scan → Post auto-comments |

## Deployment

Deployment is configured for Vercel:

```bash
npm run deploy:vercel   # or: vercel --prod
```

See `vercel.json` for SPA rewrite rules and security headers.
