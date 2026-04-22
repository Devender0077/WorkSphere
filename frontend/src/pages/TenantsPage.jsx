import React, { useEffect, useState } from 'react';
import { Building2, Plus, Trash2, Users, Loader2, X, Search } from 'lucide-react';
import api from '@/lib/api';
import { STATUS_COLORS } from '@/data/mock';
import { cn } from '@/lib/utils';

const TenantsPage = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [plan, setPlan] = useState('Pro');

  const fetchTenants = async () => {
    setLoading(true);
    try { const { data } = await api.get('/tenants'); setTenants(data); } catch (e) {}
    finally { setLoading(false); }
  };
  useEffect(() => { fetchTenants(); }, []);

  const create = async () => {
    if (!name || !slug) return;
    try {
      await api.post('/tenants', { name, slug, plan });
      setOpen(false); setName(''); setSlug(''); setPlan('Pro');
      fetchTenants();
    } catch (e) { alert(e?.response?.data?.detail || 'Failed'); }
  };

  const del = async (id) => {
    if (!window.confirm('Delete this tenant and all its data?')) return;
    try { await api.delete(`/tenants/${id}`); fetchTenants(); } catch (e) {}
  };

  const filtered = tenants.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[30px] font-bold text-foreground">Tenants</h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">Manage customer workspaces in your multi-tenant platform.</p>
        </div>
        <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 h-11 rounded-xl bg-[hsl(var(--navy))] px-4 text-[13.5px] font-semibold text-white hover:opacity-90">
          <Plus className="h-4 w-4" /> Add Tenant
        </button>
      </div>

      <div className="mt-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tenants" className="w-full h-11 rounded-xl border border-border bg-card pl-10 pr-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
      </div>

      {loading ? (
        <div className="min-h-[40vh] grid place-items-center"><Loader2 className="h-6 w-6 text-primary animate-spin" /></div>
      ) : (
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((t) => (
            <div key={t.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary grid place-items-center"><Building2 className="h-6 w-6" /></div>
                  <div>
                    <div className="text-[16px] font-bold text-foreground">{t.name}</div>
                    <div className="text-[12px] text-muted-foreground">/{t.slug}</div>
                  </div>
                </div>
                <span className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-[10.5px] font-bold uppercase', STATUS_COLORS[t.status] || 'bg-secondary text-foreground')}>{t.status}</span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-secondary/60 px-3 py-2">
                  <div className="text-[11px] text-muted-foreground">Plan</div>
                  <div className="text-[14px] font-semibold text-foreground">{t.plan}</div>
                </div>
                <div className="rounded-xl bg-secondary/60 px-3 py-2">
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" /> Employees</div>
                  <div className="text-[14px] font-semibold text-foreground">{t.employees_count}</div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <button className="flex-1 h-10 rounded-xl border border-border bg-card hover:bg-secondary text-[13px] font-semibold">Manage</button>
                <button onClick={() => del(t.id)} className="h-10 w-10 grid place-items-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/30 dark:border-rose-900/50"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-full sm:w-[480px] bg-card border-l border-border shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-7 pt-7 pb-4">
              <h2 className="text-[20px] font-bold text-foreground">Create Tenant</h2>
              <button onClick={() => setOpen(false)} className="h-9 w-9 grid place-items-center rounded-lg hover:bg-secondary text-muted-foreground"><X className="h-4 w-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-7 pb-6 space-y-5">
              <label className="block">
                <span className="text-[13px] font-medium text-foreground">Company Name <span className="text-rose-500">*</span></span>
                <input value={name} onChange={(e) => { setName(e.target.value); setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-')); }} className="mt-2 w-full h-12 rounded-xl border border-border bg-background px-4 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
              </label>
              <label className="block">
                <span className="text-[13px] font-medium text-foreground">Slug <span className="text-rose-500">*</span></span>
                <input value={slug} onChange={(e) => setSlug(e.target.value)} className="mt-2 w-full h-12 rounded-xl border border-border bg-background px-4 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
              </label>
              <label className="block">
                <span className="text-[13px] font-medium text-foreground">Plan</span>
                <select value={plan} onChange={(e) => setPlan(e.target.value)} className="mt-2 w-full h-12 rounded-xl border border-border bg-background px-4 text-[14px]">
                  {['Starter', 'Growth', 'Pro', 'Enterprise'].map((p) => <option key={p}>{p}</option>)}
                </select>
              </label>
            </div>
            <div className="px-7 pb-7 pt-4 border-t border-border flex items-center gap-3">
              <button onClick={() => setOpen(false)} className="flex-1 h-12 rounded-xl border border-border bg-card text-[13.5px] font-semibold hover:bg-secondary">Cancel</button>
              <button onClick={create} className="flex-1 h-12 rounded-xl bg-[hsl(var(--navy))] text-white text-[13.5px] font-semibold hover:opacity-90">Create</button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default TenantsPage;
