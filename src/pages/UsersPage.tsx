import React, { useEffect, useState } from 'react';
import { Users, Shield, UserPlus, UserCheck, UserX, RefreshCw, Search } from 'lucide-react';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { supabase } from '../lib/supabaseClient';
import { User, UserRole } from '../types/supabase';

const ROLE_COLORS: Record<UserRole, string> = {
  admin: 'bg-red-600/20 text-red-400 border border-red-600/30',
  developer: 'bg-purple-600/20 text-purple-400 border border-purple-600/30',
  operator: 'bg-blue-600/20 text-blue-400 border border-blue-600/30',
  auditor: 'bg-amber-600/20 text-amber-400 border border-amber-600/30',
  user: 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30',
  viewer: 'bg-slate-600/20 text-slate-400 border border-slate-600/30',
};

const UsersPage: React.FC = () => {
  useRequireAuth('admin');

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Ensure you have admin permissions.');
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (userId: string, role: UserRole) => {
    const { error: updateError } = await supabase
      .from('users')
      .update({ role })
      .eq('id', userId);

    if (updateError) {
      console.error('Failed to update role:', updateError);
      return;
    }

    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const roleCounts = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">Loading users…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-widest">User Management</h1>
          <p className="text-slate-500 text-sm font-mono mt-1">Manage roles and access control</p>
        </div>
        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm text-slate-300 font-mono transition-colors"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 text-red-400 text-sm flex items-center gap-2">
          <UserX size={16} />
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: users.length, icon: Users, color: 'text-blue-400' },
          { label: 'Admins', value: roleCounts['admin'] || 0, icon: Shield, color: 'text-red-400' },
          { label: 'Developers', value: roleCounts['developer'] || 0, icon: UserCheck, color: 'text-purple-400' },
          { label: 'Users/Viewers', value: (roleCounts['user'] || 0) + (roleCounts['viewer'] || 0), icon: UserPlus, color: 'text-emerald-400' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={16} className={stat.color} />
                <p className="text-xs text-slate-500 uppercase font-mono tracking-widest">{stat.label}</p>
              </div>
              <p className={`text-2xl font-black font-mono ${stat.color}`}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value as UserRole | 'all')}
          className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500 transition-colors"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="developer">Developer</option>
          <option value="operator">Operator</option>
          <option value="auditor">Auditor</option>
          <option value="user">User</option>
          <option value="viewer">Viewer</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left px-4 py-3 text-xs font-mono text-slate-500 uppercase tracking-widest">Email</th>
                <th className="text-left px-4 py-3 text-xs font-mono text-slate-500 uppercase tracking-widest">Role</th>
                <th className="text-left px-4 py-3 text-xs font-mono text-slate-500 uppercase tracking-widest">Joined</th>
                <th className="text-left px-4 py-3 text-xs font-mono text-slate-500 uppercase tracking-widest">Last Login</th>
                <th className="text-right px-4 py-3 text-xs font-mono text-slate-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-600 font-mono text-sm">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-slate-300 font-mono text-xs">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-mono px-2 py-0.5 rounded ${ROLE_COLORS[user.role] ?? ROLE_COLORS.viewer}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-mono text-xs">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-mono text-xs">
                      {user.last_login_at ? new Date(user.last_login_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <select
                        value={user.role}
                        onChange={e => updateRole(user.id, e.target.value as UserRole)}
                        className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-blue-500 transition-colors"
                      >
                        <option value="admin">Admin</option>
                        <option value="developer">Developer</option>
                        <option value="operator">Operator</option>
                        <option value="auditor">Auditor</option>
                        <option value="user">User</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
