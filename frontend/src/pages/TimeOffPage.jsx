import React, { useEffect, useState } from 'react';
import { Plus, Loader2, Calendar, Check, X, Clock } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { STATUS_COLORS } from '@/data/mock';
import { cn } from '@/lib/utils';

const TimeOffPage = () => {
  const { user, can } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('Annual Leave');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [days, setDays] = useState(1);
  const [reason, setReason] = useState('');

  const isEmployee = user?.role === 'employee';
  const canManage = can('payroll.manage') || user?.role === 'tenant_admin' || user?.role === 'super_admin';

  const fetchItems = async () => {
    setLoading(true);
    try { const { data } = await api.get('/time-off'); setItems(data); } catch (e) {}
    finally { setLoading(false); }
  };
  useEffect(() => { fetchItems(); }, []);

  const submit = async () => {
    if (!start || !end) return;
    try {
      await api.post('/time-off', { type, start_date: start, end_date: end, days: Number(days), reason });
      setOpen(false); setStart(''); setEnd(''); setReason(''); setDays(1);
      fetchItems();
    } catch (e) { alert(e?.response?.data?.detail || 'Failed to submit'); }
  };

  const updateStatus = async (id, status) => {
    try { await api.patch(`/time-off/${id}?status=${status}`); fetchItems(); } catch (e) {}
  };

  const stats = {
    pending: items.filter((i) => i.status === 'Pending').length,
    approved: items.filter((i) => i.status === 'Approved').length,
    rejected: items.filter((i) => i.status === 'Rejected').length,
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[30px] font-bold text-foreground">Time Off Requests</h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">{isEmployee ? 'Request and track your leave.' : 'Review and approve time-off requests.'}</p>
        </div>
        {isEmployee && (
          <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 h-11 rounded-xl bg-[hsl(var(--navy))] px-4 text-[13.5px] font-semibold text-white hover:opacity-90">
            <Plus className="h-4 w-4" /> New Request
          </button>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Pending', value: stats.pending, cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
          { label: 'Approved', value: stats.approved, cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
          { label: 'Rejected', value: stats.rejected, cls: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
            <div className="text-[12px] text-muted-foreground">{s.label}</div>
            <div className="mt-2 flex items-center gap-3">
              <div className="text-[28px] font-bold text-foreground">{s.value}</div>
              <span className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-[10.5px] font-bold uppercase', s.cls)}>{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-card overflow-x-auto">
        {loading ? (
          <div className="p-10 grid place-items-center"><Loader2 className="h-5 w-5 text-primary animate-spin" /></div>
        ) : (
          <table className="w-full text-[13px] min-w-[780px]">
            <thead>
              <tr className="text-primary text-left border-b border-border">
                <th className="p-4 font-semibold">Employee</th>
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold">Start</th>
                <th className="p-4 font-semibold">End</th>
                <th className="p-4 font-semibold">Days</th>
                <th className="p-4 font-semibold">Reason</th>
                <th className="p-4 font-semibold">Status</th>
                {canManage && <th className="p-4 font-semibold">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.length === 0 && (
                <tr><td colSpan={canManage ? 8 : 7} className="p-10 text-center text-muted-foreground">No requests yet.</td></tr>
              )}
              {items.map((r) => (
                <tr key={r.id} className="hover:bg-secondary/40">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {r.avatar ? <img src={r.avatar} alt="" className="h-8 w-8 rounded-full object-cover" /> : <div className="h-8 w-8 rounded-full bg-primary/10 text-primary grid place-items-center"><Clock className="h-4 w-4" /></div>}
                      <div className="font-semibold text-foreground">{r.employee_name}</div>
                    </div>
                  </td>
                  <td className="p-4 text-foreground">{r.type}</td>
                  <td className="p-4 text-foreground">{r.start_date}</td>
                  <td className="p-4 text-foreground">{r.end_date}</td>
                  <td className="p-4 text-foreground">{r.days}</td>
                  <td className="p-4 text-muted-foreground max-w-[220px] truncate">{r.reason || '-'}</td>
                  <td className="p-4"><span className={cn('inline-flex items-center rounded-md px-2.5 py-1 text-[10.5px] font-bold uppercase', STATUS_COLORS[r.status] || '')}>{r.status}</span></td>
                  {canManage && (
                    <td className="p-4">
                      {r.status === 'Pending' ? (
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => updateStatus(r.id, 'Approved')} className="h-8 w-8 grid place-items-center rounded-lg bg-emerald-500 text-white hover:opacity-90"><Check className="h-4 w-4" /></button>
                          <button onClick={() => updateStatus(r.id, 'Rejected')} className="h-8 w-8 grid place-items-center rounded-lg bg-rose-500 text-white hover:opacity-90"><X className="h-4 w-4" /></button>
                        </div>
                      ) : <span className="text-muted-foreground">—</span>}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-full sm:w-[480px] bg-card border-l border-border shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-7 pt-7 pb-4">
              <h2 className="text-[20px] font-bold text-foreground">New Time Off Request</h2>
              <button onClick={() => setOpen(false)} className="h-9 w-9 grid place-items-center rounded-lg hover:bg-secondary text-muted-foreground"><X className="h-4 w-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-7 pb-6 space-y-5">
              <label className="block">
                <span className="text-[13px] font-medium text-foreground">Type</span>
                <select value={type} onChange={(e) => setType(e.target.value)} className="mt-2 w-full h-12 rounded-xl border border-border bg-background px-4 text-[14px]">
                  {['Annual Leave', 'Sick Leave', 'Personal', 'Unpaid'].map((t) => <option key={t}>{t}</option>)}
                </select>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-[13px] font-medium text-foreground">Start Date</span>
                  <div className="relative mt-2"><input value={start} onChange={(e) => setStart(e.target.value)} placeholder="DD Mon YYYY" className="w-full h-12 rounded-xl border border-border bg-background pl-4 pr-10 text-[14px]" /><Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /></div>
                </label>
                <label className="block">
                  <span className="text-[13px] font-medium text-foreground">End Date</span>
                  <div className="relative mt-2"><input value={end} onChange={(e) => setEnd(e.target.value)} placeholder="DD Mon YYYY" className="w-full h-12 rounded-xl border border-border bg-background pl-4 pr-10 text-[14px]" /><Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /></div>
                </label>
              </div>
              <label className="block">
                <span className="text-[13px] font-medium text-foreground">Days</span>
                <input type="number" value={days} onChange={(e) => setDays(e.target.value)} className="mt-2 w-full h-12 rounded-xl border border-border bg-background px-4 text-[14px]" />
              </label>
              <label className="block">
                <span className="text-[13px] font-medium text-foreground">Reason</span>
                <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} className="mt-2 w-full rounded-xl border border-border bg-background p-4 text-[14px]" />
              </label>
            </div>
            <div className="px-7 pb-7 pt-4 border-t border-border flex items-center gap-3">
              <button onClick={() => setOpen(false)} className="flex-1 h-12 rounded-xl border border-border bg-card text-[13.5px] font-semibold hover:bg-secondary">Cancel</button>
              <button onClick={submit} className="flex-1 h-12 rounded-xl bg-[hsl(var(--navy))] text-white text-[13.5px] font-semibold hover:opacity-90">Submit</button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default TimeOffPage;
