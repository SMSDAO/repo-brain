# Admin Guide

This guide covers administration of the Repo Brain Hospital platform.

## Roles and Permissions

The platform uses Role-Based Access Control (RBAC) with the following roles:

| Role | Level | Capabilities |
|------|-------|-------------|
| `admin` | 5 | Full platform access, user management, config |
| `developer` | 4 | Developer console, API monitoring, log access |
| `operator` | 3 | Brain scans, CI trigger, PR creation |
| `auditor` | 2 | Read-only access to audit logs, alerts |
| `user` | 1 | Dashboard, own account settings |
| `viewer` | 1 | Read-only dashboard access |

## User Management

Navigate to **Users** in the sidebar to:

- View all registered users
- Filter by role or search by email
- Change a user's role via the dropdown in the Actions column

> **Note:** Only admins can access the Users page.

## Admin Dashboard

Navigate to **Admin → Overview** for:

- System health metrics
- Brain status distribution charts
- Unresolved alert counts
- Recent run history

Navigate to **Admin → Brains** to inspect all registered repos (brains).

Navigate to **Admin → Alerts** to view and resolve security findings.

Navigate to **Admin → Config** to adjust platform configuration settings.

## Audit Logs

Audit events are stored in the `runs` table in Supabase. Each run records:
- Type (`doctor`, `surgeon`, `autopsy`)
- Start/finish timestamps
- Status (`running`, `success`, `failed`)
- Log URL

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | ✅ | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | ✅ | Supabase anonymous API key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Service role key for admin operations |
| `VITE_GEMINI_API_KEY` | Optional | Google Gemini API key for AI features |

Copy `.env.example` to `.env.local` and fill in your values before running locally.

## Security

- All routes are protected by Supabase Auth
- Admin routes require `admin` role
- Developer routes require `developer` or higher
- Security headers are applied via `vercel.json` for production deployments
- Password management is delegated to Supabase Auth
