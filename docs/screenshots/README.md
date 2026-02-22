# Screenshots Guide

This directory contains UI screenshots for the README and documentation.

## Required Screenshots

To complete the documentation, capture the following screens:

### 1. dashboard.png
**Main Fleet Dashboard**
- URL: `http://localhost:3000/dashboard`
- Shows: Fleet monitoring dashboard with status distribution, repo cards, telemetry stats
- View: Full page after logging in

### 2. login.png
**Login Screen**
- URL: `http://localhost:3000/login`
- Shows: Email/password login form with glassmorphism design
- View: Full page before authentication

### 3. admin-overview.png
**Admin Overview Dashboard**
- URL: `http://localhost:3000/admin/overview`
- Shows: Admin metrics, total brains, alerts by severity chart, recent activity
- View: Full page, logged in as admin

### 4. brains.png
**Brain Management Table**
- URL: `http://localhost:3000/admin/brains`
- Shows: Table of monitored repositories with status, risk scores, frameworks
- View: Full page showing search and filters

### 5. alerts.png
**Alerts List**
- URL: `http://localhost:3000/admin/alerts`
- Shows: Security findings table with severity, messages, files
- View: Full page with filter options visible

## How to Capture

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Navigate to each URL** in your browser

3. **Take screenshots**:
   - Use browser's built-in screenshot tool
   - Or press Ctrl+Shift+P (Chrome) → "Capture full size screenshot"
   - Recommended size: 1920x1080 or higher
   - Format: PNG for best quality

4. **Name files** exactly as listed above

5. **Place in this directory** (`docs/screenshots/`)

## Tips for Good Screenshots

- Use dark mode (default theme)
- Ensure data is visible (login and populate some test data)
- Capture full browser window
- Remove any sensitive information
- Use consistent browser zoom level (100%)

## Placeholder Until Real Screenshots

Until actual screenshots are captured, the README references will display as broken image links. This is expected and should be fixed by adding the actual screenshot files.
