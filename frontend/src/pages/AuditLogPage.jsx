import React, { useEffect, useState } from 'react';
import { Loader2, Shield, Search, RefreshCw } from 'lucide-react';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

const actionBadge = (action) => {
  const map = {
    impersonate: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    login: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    create: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
    delete: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  };
  return map[action] || 'bg-secondary text-muted-foreground';
};

const formatTime = (iso) => {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
};

const AuditLogPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/platform/audit-log');
      setItems(data);
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const filtered = items.filter((i) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (i.actor_name || '').toLowerCase().includes(q)
      || (i.action || '').toLowerCase().includes(q)
      || (i.target_user_id || '').toLowerCase().includes(q);
  });

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-foreground">Audit Log</h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">Platform-wide security and admin actions</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filter by actor, action…" className="w-full h-11 rounded-xl border border-border bg-card pl-10 pr-4 text-[13px]" data-testid="audit-search" />
          </div>
          <button onClick={load} className="inline-flex items-center gap-2 h-11 rounded-xl border border-border bg-card px-4 text-[13px] font-semibold hover:bg-secondary" data-testid="audit-refresh-btn">
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900/50 p-4 flex items-start gap-3">
        <Shield className="h-5 w-5 text-amber-600 shrink-0" />
        <div className="text-[12.5px] text-amber-900 dark:text-amber-200">
          Every impersonation, role change, and sensitive admin action is recorded here for compliance. Records are append-only.
        </div>
      </div>

      {loading ? (
        <div className="mt-8 grid place-items-center min-h-[200px]"><Loader2 className="h-6 w-6 text-primary animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-background p-12 text-center">
          <Shield className="h-10 w-10 text-muted-foreground mx-auto" />
          <div className="mt-3 text-[15px] font-semibold text-foreground">No audit entries yet</div>
          <div className="mt-1 text-[13px] text-muted-foreground">Actions will appear here as they happen.</div>
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-border bg-card overflow-x-auto">
          <table className="w-full text-[13px] min-w-[720px]">
            <thead className="border-b border-border bg-secondary/30">
              <tr className="text-left text-muted-foreground">
                <th className="p-4 font-semibold">When</th>
                <th className="p-4 font-semibold">Actor</th>
                <th className="p-4 font-semibold">Action</th>
                <th className="p-4 font-semibold">Target</th>
                <th className="p-4 font-semibold">Tenant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((i) => (
                <tr key={i.id} className="hover:bg-secondary/30" data-testid={'audit-row-' + i.id}>
                  <td className="p-4 text-muted-foreground whitespace-nowrap">{formatTime(i.created_at)}</td>
                  <td className="p-4"><div className="font-semibold text-foreground">{i.actor_name || '—'}</div></td>
                  <td className="p-4"><span className={cn('inline-flex rounded-md px-2.5 py-0.5 text-[10.5px] font-bold uppercase', actionBadge(i.action))}>{i.action}</span></td>
                  <td className="p-4 text-foreground text-[12px] font-mono">{i.target_user_id || '—'}</td>
                  <td className="p-4 text-muted-foreground">{i.target_tenant_id || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AuditLogPage;
