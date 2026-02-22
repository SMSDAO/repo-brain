# Quick Start: Supabase Integration

This guide will get you up and running with Supabase in 5 minutes.

## 1. Setup Supabase (3 minutes)

### Create Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization, enter project name and password
4. Wait for database provisioning (~2 minutes)

### Run Database Migration
1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the entire contents of `src/lib/supabase-schema.sql`
4. Click "Run" or press Cmd/Ctrl + Enter
5. You should see success messages for all CREATE statements

### Get API Keys
1. Go to **Project Settings** → **API**
2. Copy these values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (safe for client-side use)

## 2. Configure Environment (1 minute)

```bash
# Copy template
cp .env.example .env

# Edit .env and add your keys
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Restart your dev server** after saving .env!

## 3. Wrap Your App (1 minute)

```tsx
// src/main.tsx or src/index.tsx
import { AuthProvider } from './contexts/AuthContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```

## 4. Use Authentication

### In Any Component
```tsx
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, userProfile, isAdmin, signOut } = useAuth();
  
  if (!user) {
    return <LoginForm />;
  }
  
  return (
    <div>
      <h1>Welcome, {userProfile?.email}</h1>
      <p>Role: {userProfile?.role}</p>
      {isAdmin && <AdminPanel />}
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### Protected Routes
```tsx
import { useRequireAuth } from './hooks/useRequireAuth';

function AdminDashboard() {
  const { loading } = useRequireAuth({ requiredRole: 'admin' });
  
  if (loading) return <div>Loading...</div>;
  
  return <div>Admin Only Content</div>;
}
```

## 5. Query Database

```tsx
import { supabase } from './lib/supabaseClient';

// Fetch brains
const { data: brains, error } = await supabase
  .from('brains')
  .select('*')
  .eq('status', 'red')
  .order('created_at', { ascending: false });

// Insert alert
const { error } = await supabase
  .from('alerts')
  .insert({
    brain_id: 'uuid-here',
    severity: 'critical',
    message: 'Security issue detected',
  });

// Real-time subscriptions
supabase
  .channel('alerts')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'alerts' },
    (payload) => console.log('New alert:', payload)
  )
  .subscribe();
```

## Troubleshooting

**❌ Error: Missing required Supabase environment variables**
- Check `.env` file exists in project root (not in `src/`)
- Variable names must be exact: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart dev server: `npm run dev`

**❌ relation "public.users" does not exist**
- You forgot to run the SQL migration
- Go to Supabase SQL Editor and run `supabase-schema.sql`

**❌ Row Level Security policy violation**
- User isn't authenticated (check with `useAuth().user`)
- User doesn't have required role (check with `useAuth().hasRole('admin')`)
- For admin actions, user must have `role = 'admin'` in users table

**❌ Cannot read properties of null**
- Forgot to wrap app with `<AuthProvider>`
- Using `useAuth()` outside of `<AuthProvider>`

## Create First Admin User

After signing up your first user, you need to manually set them as admin:

1. Go to Supabase dashboard → **Table Editor** → `users` table
2. Find your user row
3. Edit the `role` column and change from `viewer` to `admin`
4. Save changes
5. Refresh your app - you should now have admin access

## Next Steps

- Read full documentation in `src/lib/README.md`
- Check out Supabase docs: https://supabase.com/docs
- Implement login/signup pages using `useAuth()`
- Add role-based UI components
- Set up real-time subscriptions for live updates
