import React, { useState, useEffect } from 'react';
import { Building2, Plus, Pencil, Trash2, X, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { Toggle, Empty } from './common';

const OfficeModal = ({ initial, onClose, onSave }) => {
  const [form, setForm] = useState(initial || { name: '', country: '', hq: false, active: true, employees: 0, timezone: '', phone: '', email: '' });
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <form onClick={(e) => e.stopPropagation()} onSubmit={submit} className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden" data-testid="office-modal">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h3 className="text-[17px] font-bold text-foreground">{initial ? 'Edit Office' : 'New Office'}</h3>
          <button type="button" onClick={onClose} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-secondary">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5 space-y-3">
          <label className="block">
            <span className="text-[12.5px] font-semibold">Name *</span>
            <input autoFocus required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-[13.5px]" data-testid="office-name-input" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[12.5px] font-semibold">Country</span>
              <input value={form.country || ''} onChange={(e) => setForm({ ...form, country: e.target.value })} className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-[13.5px]" />
            </label>
            <label className="block">
              <span className="text-[12.5px] font-semibold">Timezone</span>
              <input value={form.timezone || ''} onChange={(e) => setForm({ ...form, timezone: e.target.value })} className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-[13.5px]" />
            </label>
            <label className="block">
              <span className="text-[12.5px] font-semibold">Phone</span>
              <input value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-[13.5px]" />
            </label>
            <label className="block">
              <span className="text-[12.5px] font-semibold">Email</span>
              <input type="email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-[13.5px]" />
            </label>
            <label className="block">
              <span className="text-[12.5px] font-semibold">Employees</span>
              <input type="number" min="0" value={form.employees || 0} onChange={(e) => setForm({ ...form, employees: Number(e.target.value) })} className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-[13.5px]" />
            </label>
            <label className="flex items-center gap-2 mt-6">
              <input type="checkbox" checked={!!form.hq} onChange={(e) => setForm({ ...form, hq: e.target.checked })} className="h-4 w-4 accent-primary" />
              <span className="text-[12.5px] font-semibold">Mark as HQ</span>
            </label>
          </div>
        </div>
        <div className="p-5 border-t border-border flex items-center justify-end gap-2">
          <button type="button" onClick={onClose} className="h-10 rounded-xl border border-border bg-card px-4 text-[12.5px] font-semibold">Cancel</button>
          <button type="submit" disabled={saving} className="h-10 rounded-xl bg-[hsl(var(--navy))] text-white px-5 text-[12.5px] font-semibold disabled:opacity-50" data-testid="office-submit-btn">
            {saving ? 'Saving...' : initial ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

export const OfficesTab = () => {
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/offices');
      setOffices(data);
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const toggleActive = async (o) => {
    const patched = { ...o, active: !o.active };
    setOffices((prev) => prev.map((x) => x.id === o.id ? patched : x));
    try { await api.patch('/offices/' + o.id, patched); } catch { load(); }
  };

  const save = async (form) => {
    if (form.id) {
      const { data } = await api.patch('/offices/' + form.id, form);
      setOffices((prev) => prev.map((x) => x.id === form.id ? data : x));
    } else {
      const { data } = await api.post('/offices', form);
      setOffices((prev) => [...prev, data]);
    }
    setModal(null);
  };

  const remove = async (o) => {
    if (!window.confirm('Delete office "' + o.name + '"?')) return;
    await api.delete('/offices/' + o.id);
    setOffices((prev) => prev.filter((x) => x.id !== o.id));
  };

  return (
    <div>
      <div className="flex items-start justify-between">
        <h3 className="text-[18px] font-bold text-foreground">Offices</h3>
        <button onClick={() => setModal({})} className="inline-flex items-center gap-1.5 h-10 rounded-xl bg-[hsl(var(--navy))] text-white px-4 text-[12.5px] font-semibold" data-testid="add-office-btn">
          <Plus className="h-4 w-4" /> Add Office
        </button>
      </div>
      {loading ? (
        <div className="min-h-[200px] grid place-items-center"><Loader2 className="h-6 w-6 text-primary animate-spin" /></div>
      ) : offices.length === 0 ? (
        <Empty Icon={Building2} title="No offices yet" hint="Click Add Office to create your first location." />
      ) : (
        <div className="mt-5 space-y-4">
          {offices.map((o) => <OfficeRow key={o.id} o={o} onEdit={setModal} onToggle={toggleActive} onRemove={remove} />)}
        </div>
      )}
      {modal !== null && <OfficeModal initial={modal && modal.id ? modal : null} onClose={() => setModal(null)} onSave={save} />}
    </div>
  );
};

const OfficeRow = ({ o, onEdit, onToggle, onRemove }) => (
  <div className="rounded-2xl border border-border bg-background p-5" data-testid={'office-card-' + o.id}>
    <div className="flex items-start justify-between gap-3 flex-wrap">
      <div>
        <div className="flex items-center gap-2">
          <div className="text-[15px] font-bold text-foreground">{o.name}</div>
          {o.hq && <span className="inline-flex rounded-md bg-primary px-2 py-0.5 text-[10px] font-bold text-white">HQ</span>}
        </div>
        {o.country && <div className="mt-0.5 text-[12.5px] text-muted-foreground">{o.country}</div>}
      </div>
      <div className="flex items-center gap-2">
        <Toggle value={!!o.active} onChange={() => onToggle(o)} />
        <button onClick={() => onEdit(o)} className="h-8 w-8 grid place-items-center rounded-lg bg-sky-500 text-white" data-testid={'office-edit-' + o.id}><Pencil className="h-4 w-4" /></button>
        <button onClick={() => onRemove(o)} className="h-8 w-8 grid place-items-center rounded-lg bg-rose-500 text-white" data-testid={'office-delete-' + o.id}><Trash2 className="h-4 w-4" /></button>
      </div>
    </div>
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-[13px]">
      <Field label="Employees" value={String(o.employees ?? 0)} />
      <Field label="Timezone" value={o.timezone || '—'} />
      <Field label="Phone" value={o.phone || '—'} />
      <Field label="Email" value={o.email || '—'} />
    </div>
  </div>
);

const Field = ({ label, value }) => (
  <div className="flex justify-between sm:block">
    <span className="text-muted-foreground">{label}</span>
    <div className="font-semibold text-foreground sm:mt-0.5">{value}</div>
  </div>
);
