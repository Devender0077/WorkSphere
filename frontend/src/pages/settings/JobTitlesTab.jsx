import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Pencil, Trash2, X, Loader2, Search } from 'lucide-react';
import api from '@/lib/api';
import { Toggle, Empty } from './common';

const JobTitleModal = ({ initial, onClose, onSave }) => {
  const [form, setForm] = useState(initial || { name: '', count: 0, active: true });
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
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden" data-testid="job-title-modal">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h3 className="text-[17px] font-bold text-foreground">{initial ? 'Edit Job Title' : 'New Job Title'}</h3>
          <button type="button" onClick={onClose} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-secondary"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-5 space-y-3">
          <label className="block">
            <span className="text-[12.5px] font-semibold">Title *</span>
            <input autoFocus required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-[13.5px]" data-testid="job-title-name-input" />
          </label>
          <label className="block">
            <span className="text-[12.5px] font-semibold">Employees holding this title</span>
            <input type="number" min="0" value={form.count || 0} onChange={(e) => setForm({ ...form, count: Number(e.target.value) })} className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-[13.5px]" />
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={!!form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="h-4 w-4 accent-primary" />
            <span className="text-[12.5px] font-semibold">Active</span>
          </label>
        </div>
        <div className="p-5 border-t border-border flex items-center justify-end gap-2">
          <button type="button" onClick={onClose} className="h-10 rounded-xl border border-border bg-card px-4 text-[12.5px] font-semibold">Cancel</button>
          <button type="submit" disabled={saving} className="h-10 rounded-xl bg-[hsl(var(--navy))] text-white px-5 text-[12.5px] font-semibold disabled:opacity-50" data-testid="job-title-submit-btn">
            {saving ? 'Saving...' : initial ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

const JobTitleRow = ({ t, onEdit, onToggle, onRemove }) => (
  <tr className="hover:bg-secondary/30" data-testid={'job-title-row-' + t.id}>
    <td className="p-4 font-semibold text-foreground">{t.name}</td>
    <td className="p-4 text-foreground">{t.count ?? 0}</td>
    <td className="p-4"><Toggle value={!!t.active} onChange={() => onToggle(t)} /></td>
    <td className="p-4">
      <div className="flex items-center gap-2">
        <button onClick={() => onEdit(t)} className="h-8 w-8 grid place-items-center rounded-lg bg-sky-500 text-white" data-testid={'job-title-edit-' + t.id}><Pencil className="h-4 w-4" /></button>
        <button onClick={() => onRemove(t)} className="h-8 w-8 grid place-items-center rounded-lg bg-rose-500 text-white" data-testid={'job-title-delete-' + t.id}><Trash2 className="h-4 w-4" /></button>
      </div>
    </td>
  </tr>
);

export const JobTitlesTab = () => {
  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/job-titles');
      setTitles(data);
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const save = async (form) => {
    if (form.id) {
      const { data } = await api.patch('/job-titles/' + form.id, form);
      setTitles((p) => p.map((x) => x.id === form.id ? data : x));
    } else {
      const { data } = await api.post('/job-titles', form);
      setTitles((p) => [...p, data]);
    }
    setModal(null);
  };

  const toggle = async (t) => {
    const patched = { ...t, active: !t.active };
    setTitles((p) => p.map((x) => x.id === t.id ? patched : x));
    try { await api.patch('/job-titles/' + t.id, patched); } catch { load(); }
  };

  const remove = async (t) => {
    if (!window.confirm('Delete job title "' + t.name + '"?')) return;
    await api.delete('/job-titles/' + t.id);
    setTitles((p) => p.filter((x) => x.id !== t.id));
  };

  const filtered = titles.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h3 className="text-[18px] font-bold text-foreground">Job Titles</h3>
        <div className="flex items-center gap-3">
          <div className="relative w-64 hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search job title" className="w-full h-10 rounded-xl border border-border bg-background pl-9 pr-3 text-[13px]" />
          </div>
          <button onClick={() => setModal({})} className="inline-flex items-center gap-1.5 h-10 rounded-xl bg-[hsl(var(--navy))] text-white px-4 text-[12.5px] font-semibold" data-testid="add-job-title-btn">
            <Plus className="h-4 w-4" /> Add New
          </button>
        </div>
      </div>
      {loading && <div className="min-h-[150px] grid place-items-center"><Loader2 className="h-6 w-6 text-primary animate-spin" /></div>}
      {!loading && filtered.length === 0 && <Empty Icon={Briefcase} title="No job titles yet" hint="Click Add New to create your first." />}
      {!loading && filtered.length > 0 && (
        <div className="mt-5 rounded-2xl border border-border bg-background overflow-x-auto">
          <table className="w-full text-[13px] min-w-[560px]">
            <thead className="border-b border-border bg-secondary/30">
              <tr className="text-left text-muted-foreground">
                <th className="p-4 font-semibold">Job Title</th>
                <th className="p-4 font-semibold">Employees</th>
                <th className="p-4 font-semibold">Active</th>
                <th className="p-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((t) => <JobTitleRow key={t.id} t={t} onEdit={setModal} onToggle={toggle} onRemove={remove} />)}
            </tbody>
          </table>
        </div>
      )}
      {modal !== null && <JobTitleModal initial={modal && modal.id ? modal : null} onClose={() => setModal(null)} onSave={save} />}
    </div>
  );
};
