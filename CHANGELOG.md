# Changelog

All notable changes to Repo Brain Hospital are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.3.0] — 2026-03-14

### Added

- **Navigation** — Full 7-tab navigation: Home, Dashboard, Users, Admin, Developer, Settings, Docs
- **HomePage** — Enterprise landing page with feature overview, status banner, and quick-link navigation
- **UsersPage** — Admin-only user management page with role assignment, search, and filter controls
- **DeveloperPage** — Developer console with API monitor, live log viewer, environment inspector, and deployment diagnostics
- **SettingsPage** — User profile, notification preferences, security, and appearance settings
- **DocsPage** — Documentation hub with sections for Architecture, Deployment, User Guide, Admin Guide, Developer Guide, and Security
- **RBAC extended** — Added roles `developer` and `auditor` alongside existing `admin`, `operator`, and `viewer`; updated role hierarchy in `AuthContext`
- **isDeveloper / isAuditor** — New boolean flags exposed from `AuthContext` for role-gated UI
- **PWA support** — Added `public/manifest.json` and PWA meta tags in `index.html` for installable progressive web app
- **Favicon** — Added `public/favicon.svg` brain icon
- **Security headers** — Added `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, and `Content-Security-Policy` headers to `vercel.json`
- **Asset caching** — Added `Cache-Control: immutable` header for built assets in `vercel.json`
- **Keyboard navigation** — `aria-label`, `aria-current`, and `role` attributes added to navigation elements
- **Sub-navigation** — Admin section now shows a contextual sub-nav when on `/admin/*` routes
- **Mobile UX** — Updated viewport meta to allow user scaling (`maximum-scale=5.0`) for accessibility compliance

### Changed

- **AppLayout** — Replaced duplicate admin-only nav items with unified 7-tab navigation; added conditional rendering for admin and developer roles
- **AuthContext** — Extended `UserRole` type to include `developer`, `auditor`; updated `hasRole` hierarchy; removed hardcoded 3-level map
- **index.html** — Removed inline `importmap` (CDN ESM shim); removed Tailwind CDN `<script>` tag (bundled by Vite); added PWA and accessibility meta tags
- **App.tsx** — Added routes for `/`, `/users`, `/developer`, `/settings`, `/docs`; home route now serves `HomePage` instead of redirect
- **Main content** — Removed wrapping padding `div` from `AppLayout`; individual pages now control their own padding for layout flexibility

### Fixed

- **Role hierarchy** — Fixed `hasRole` to correctly handle the full extended role set without throwing on unknown roles
- **Route `/`** — Was previously a redirect to `/dashboard`; now serves the `HomePage` component as the app entry point

### Security

- Added HTTP security headers via Vercel configuration (`X-Frame-Options: DENY`, CSP, `X-Content-Type-Options: nosniff`)
- Removed deprecated `X-XSS-Protection` header; rely on CSP for XSS protection
- Removed `'unsafe-inline'` from CSP `script-src`
- Removed CDN-loaded Tailwind and ESM shim from `index.html` to reduce external script surface area
- `DeveloperPage` access gated to `developer` role minimum via `useRequireAuth`
- `UsersPage` (role management) gated to `admin` only

---

## [2.2.0] — Prior release

- MERMEDA v2.0 protocol established
- CyberAI Oracle integration
- Fleet management dashboard
- Brain scan pipeline (doctor, surgeon, autopsy, immunizer)
- Supabase authentication and RBAC (admin, operator, viewer)
- Admin dashboard (Overview, Brains, Alerts, Settings)
- GitHub Actions CI/CD workflows

[Unreleased]: https://github.com/SMSDAO/repo-brain/compare/v2.3.0...HEAD
[2.3.0]: https://github.com/SMSDAO/repo-brain/compare/v2.2.0...v2.3.0
