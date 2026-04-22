import React, { useEffect, useState } from 'react';
import { UserCheck, Search, Loader2, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const RoleBadge = ({ role }) => {
  const cls = role === 'tenant_admin' ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
  return <span className={cn('inline-flex rounded-md px-2 py-0.5 text-[10.5px] font-bold uppercase', cls)}>{role.replace('_', ' ')}</span>;
};

const ImpersonatePage = () => {
  const { startImpersonation } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pending, setPending] = useState(null);
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/platform/impersonate/candidates');
        setUsers(data);
      } finally { setLoading(false); }
    })();
  }, []);

  const filtered = users.filter((u) => {
    const matchesSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()) || (u.tenant_name || '').toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const impersonate = async (u) => {
    if (!window.confirm(`Impersonate ${u.name} (${u.email})? Your actions will be logged.`)) return;
    setPending(u.id);
    try {
      await startImpersonation(u.id);
      navigate('/');
    } catch (e) {
      alert(e?.response?.data?.detail || 'Failed to impersonate');
    } finally {
      setPending(null);
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-foreground">Impersonate User</h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">
            View the app as another user for support or debugging. Every impersonation is audit logged.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900/50 p-4 flex items-start gap-3">
        <Shield className="h-5 w-5 text-amber-600 shrink-0" />
        <div className="text-[12.5px] text-amber-900 dark:text-amber-200">
          While impersonating, a yellow banner will appear at the top. Click <b>Exit impersonation</b> there to return to your super admin session.
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email or tenant" className="w-full h-11 rounded-xl border border-border bg-background pl-10 pr-3 text-[13px]" data-testid="impersonate-search" />
          </div>
          <div className="inline-flex rounded-xl bg-secondary p-1">
            {[{ k: 'all', l: 'All' }, { k: 'tenant_admin', l: 'Tenant Admins' }, { k: 'employee', l: 'Employees' }].map((o) => (
              <button key={o.k} onClick={() => setRoleFilter(o.k)} className={cn('px-3 py-1.5 rounded-lg text-[12px] font-semibold', roleFilter === o.k ? 'bg-card shadow-sm' : 'text-muted-foreground')}>{o.l}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="min-h-[200px] grid place-items-center"><Loader2 className="h-6 w-6 text-primary animate-spin" /></div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-[13px] min-w-[640px]">
              <thead className="text-left text-muted-foreground border-b border-border">
                <tr>
                  <th className="py-3 px-2 font-semibold">User</th>
                  <th className="py-3 px-2 font-semibold">Email</th>
                  <th className="py-3 px-2 font-semibold">Tenant</th>
                  <th className="py-3 px-2 font-semibold">Role</th>
                  <th className="py-3 px-2 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-secondary/30" data-testid={`impersonate-row-${u.id}`}>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        {u.avatar ? <img src={u.avatar} alt="" className="h-9 w-9 rounded-full object-cover" /> : <div className="h-9 w-9 rounded-full bg-secondary grid place-items-center text-[12px] font-bold text-foreground">{u.name[0]}</div>}
                        <div className="font-semibold text-foreground">{u.name}</div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">{u.email}</td>
                    <td className="py-3 px-2 text-foreground">{u.tenant_name || '—'}</td>
                    <td className="py-3 px-2"><RoleBadge role={u.role} /></td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() => impersonate(u)}
                        disabled={pending === u.id}
                        className="inline-flex items-center gap-1.5 h-9 rounded-lg bg-primary text-white px-3 text-[12.5px] font-semibold hover:bg-primary/90 disabled:opacity-50"
                        data-testid={`impersonate-btn-${u.id}`}
                      >
                        <UserCheck className="h-3.5 w-3.5" />
                        {pending === u.id ? 'Switching…' : 'Login as'}
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">No users found</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImpersonatePage;
