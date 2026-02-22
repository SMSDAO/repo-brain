# Supabase Integration Setup

This directory contains the core Supabase infrastructure for the Repo Brain Hospital application.

## Files Created

1. **supabaseClient.ts** - Supabase client singleton with environment validation
2. **supabase-schema.sql** - Database schema with RLS policies

## Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be provisioned

### 2. Run Database Migration

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase-schema.sql`
4. Execute the SQL script

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env` in the project root
2. Get your Supabase credentials:
   - Go to **Project Settings** → **API**
   - Copy **Project URL** → Set as `VITE_SUPABASE_URL`
   - Copy **anon/public key** → Set as `VITE_SUPABASE_ANON_KEY`
   - Copy **service_role key** → Set as `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

### 4. Enable Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates as needed

## Usage

### Using the Auth Context

```tsx
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Wrap your app
function App() {
  return (
    <AuthProvider>
      <YourApp />
    </AuthProvider>
  );
}

// In components
function Dashboard() {
  const { user, userProfile, isAdmin, signOut } = useAuth();
  
  return (
    <div>
      <p>Welcome, {userProfile?.email}</p>
      {isAdmin && <AdminPanel />}
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### Using the Auth Guard Hook

```tsx
import { useRequireAuth } from './hooks/useRequireAuth';

function AdminPage() {
  const { loading } = useRequireAuth({ requiredRole: 'admin' });
  
  if (loading) return <div>Loading...</div>;
  
  return <div>Admin Dashboard</div>;
}
```

### Direct Database Queries

```tsx
import { supabase } from './lib/supabaseClient';

// Fetch brains
const { data: brains, error } = await supabase
  .from('brains')
  .select('*')
  .order('created_at', { ascending: false });

// Insert alert
const { error } = await supabase
  .from('alerts')
  .insert({
    brain_id: brainId,
    severity: 'critical',
    message: 'Security vulnerability detected',
  });
```

## Security Notes

- **Never commit `.env` file** - It contains sensitive keys
- **Service role key** should only be used in backend/server contexts
- **RLS policies** are enforced - users can only access data they're authorized for
- **Admin role** is required to modify brains, runs, and alerts

## TypeScript Support

All database types are defined in `src/types/supabase.ts` and are fully typed with the Supabase client.

## Troubleshooting

**Error: Missing required Supabase environment variables**
- Ensure `.env` file exists in project root
- Verify variable names match exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart dev server after adding environment variables

**Error: Row Level Security policy violation**
- Check user is authenticated
- Verify user has correct role in `users` table
- Review RLS policies in Supabase dashboard

**Error: relation "public.users" does not exist**
- Run the `supabase-schema.sql` migration script
- Check SQL Editor for any execution errors
