-- Users table (extends Supabase auth.users)
-- Role hierarchy: admin (full access) > operator (moderate) > viewer (read-only)
-- Roles:
--   - admin: Can modify all data (brains, runs, alerts)
--   - operator: Can read all data, future: trigger scans
--   - viewer: Can only read all data
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer', -- admin, operator, viewer
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

-- Brains table (monitored repositories)
CREATE TABLE IF NOT EXISTS public.brains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repo TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL, -- green, auto_fixable, red
  last_scan_at TIMESTAMPTZ,
  risk_score INTEGER DEFAULT 0,
  framework TEXT,
  languages TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Runs table (pipeline executions)
CREATE TABLE IF NOT EXISTS public.runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brain_id UUID REFERENCES public.brains(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- doctor, surgeon, autopsy
  started_at TIMESTAMPTZ DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  status TEXT NOT NULL, -- running, success, failed
  logs_url TEXT,
  duration_ms INTEGER
);

-- Alerts table (security findings)
CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brain_id UUID REFERENCES public.brains(id) ON DELETE CASCADE,
  severity TEXT NOT NULL, -- critical, pathological, warning
  message TEXT NOT NULL,
  file TEXT,
  line INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved BOOLEAN DEFAULT FALSE
);

-- RLS policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all
CREATE POLICY "Allow authenticated read brains" ON public.brains FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read runs" ON public.runs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read alerts" ON public.alerts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow users to read own data" ON public.users FOR SELECT TO authenticated USING (auth.uid() = id);

-- Admin users can modify everything
CREATE POLICY "Allow admin full access to brains" ON public.brains FOR ALL TO authenticated 
  USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Allow admin full access to runs" ON public.runs FOR ALL TO authenticated 
  USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Allow admin full access to alerts" ON public.alerts FOR ALL TO authenticated 
  USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');
