# Supabase Setup & Migration Scripts

This directory contains SQL scripts for initializing the Repo Brain Hospital database.

## Quick Setup

### 1. Create Supabase Project
1. Go to https://supabase.com
2. Create a new project
3. Wait for the database to be provisioned
4. Copy your project URL and anon key

### 2. Run Database Schema
In your Supabase project's SQL Editor, run:

```sql
-- Copy and paste the contents of supabase-schema.sql
```

This creates:
- `users` table (extends auth.users with roles)
- `brains` table (monitored repositories)
- `runs` table (pipeline execution history)
- `alerts` table (security findings)
- Row Level Security (RLS) policies for all tables

### 3. Create Default Admin User

**Option A: Via Supabase Auth UI**
1. Go to Authentication → Users in Supabase dashboard
2. Click "Add user"
3. Email: `admin@admin.com`
4. Password: `admin123`
5. Auto-confirm user

Then run this SQL to set the role:
```sql
INSERT INTO public.users (id, email, role)
SELECT id, 'admin@admin.com', 'admin' 
FROM auth.users 
WHERE email = 'admin@admin.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

**Option B: Pure SQL** (if using psql or SQL editor)
```sql
-- Create auth user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  email_change_token_current,
  email_change_token_new
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@admin.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  FALSE,
  '',
  '',
  ''
)
RETURNING id;

-- Then create the user profile
INSERT INTO public.users (id, email, role)
SELECT id, email, 'admin' 
FROM auth.users 
WHERE email = 'admin@admin.com';
```

### 4. Verify Setup
Run these queries to check everything is working:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'brains', 'runs', 'alerts');

-- Check admin user exists
SELECT u.email, u.role, u.created_at
FROM public.users u
WHERE u.email = 'admin@admin.com';

-- Check RLS policies
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

### 5. Connect Your Application
Update your `.env` file:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Security Notes

⚠️ **IMPORTANT**: The default admin password (`admin123`) is for initial setup only!

After first login:
1. Change the admin password immediately
2. Consider enabling 2FA in Supabase
3. Never commit real credentials to git
4. Use environment variables for all secrets

## Seed Data (Optional)

To populate with test data for development:

```sql
-- Insert sample brains
INSERT INTO public.brains (repo, status, framework, languages, risk_score) VALUES
  ('example-api', 'green', 'next', ARRAY['node', 'typescript'], 5),
  ('vault-service', 'red', 'none', ARRAY['python'], 85),
  ('contracts-core', 'auto_fixable', 'none', ARRAY['solidity'], 45);

-- Insert sample alerts
INSERT INTO public.alerts (brain_id, severity, message, file) 
SELECT 
  b.id,
  'critical',
  'Hardcoded API key detected',
  'src/config.ts'
FROM public.brains b
WHERE b.repo = 'vault-service';

INSERT INTO public.alerts (brain_id, severity, message, file)
SELECT 
  b.id,
  'warning',
  'Missing CI configuration',
  '.github/workflows/ci.yml'
FROM public.brains b
WHERE b.repo = 'contracts-core';
```

## Troubleshooting

### "relation already exists" error
The schema is idempotent and uses `IF NOT EXISTS`. Safe to run multiple times.

### Cannot insert into auth.users
You may need to use Supabase Auth API or dashboard instead of direct SQL. Use Option A above.

### RLS policies preventing access
Check that:
1. User is authenticated
2. User role is set correctly in `public.users`
3. The auth JWT contains the user ID

### Database connection issues
- Verify Supabase project is not paused (free tier pauses after inactivity)
- Check IP allowlist settings
- Verify API keys are correct

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
