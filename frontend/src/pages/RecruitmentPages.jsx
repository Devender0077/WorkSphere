import React, { useState, useEffect } from 'react';
import { Plus, MoreHorizontal, Star, Search, Mail, Phone, ChevronDown, Pencil, Trash2, X, Loader2, Briefcase, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

const STATUS_COLOR = {
  Active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  Closed: 'bg-secondary text-muted-foreground',
  Unactive: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
};

const STAGES = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];

// ========== JOB MODAL ==========
const JobModal = ({ initial, onClose, onSave }) => {
  const [form, setForm] = useState(initial || { title: '', team: '', location: '', type: 'Full-Time', status: 'Active', description: '', salary_range: '' });
  const [saving, setSaving] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden" data-testid="job-modal">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h3 className="text-[17px] font-bold text-foreground">{initial ? 'Edit Job' : 'New Job'}</h3>
          <button type="button" onClick={onClose} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-secondary"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-5 space-y-3">
          <label className="block"><span className="text-[12.5px] font-semibold">Title *</span>
            <input autoFocus required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-[13.5px]" data-testid="job-title-input" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block"><span className="text-[12.5px] font-semibold">Team</span>
              <input value={form.team || ''} onChange={(e) => setForm({ ...form, team: e.target.value })} className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-[13.5px]" />
            </label>
            <label className="block"><span className="text-[12.5px] font-semibold">Location</span>
              <input value={form.location || ''} onChange={(e) => setForm({ ...form, location: e.target.value })} className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-[13.5px]" />
            </label>
            <label className="block"><span className="text-[12.5px] font-semibold">Type</span>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-[13.5px]">
                <option>Full-Time</option><option>Part-Time</option><option>Contract</option><option>Intern</option>
              </select>
            </label>
            <label className="block"><span className="text-[12.5px] font-semibold">Status</span>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-[13.5px]">
                <option>Active</option><option>Closed</option><option>Unactive</option>
              </select>
            </label>
          </div>
          <label className="block"><span className="text-[12.5px] font-semibold">Salary range</span>
            <input value={form.salary_range || ''} onChange={(e) => setForm({ ...form, salary_range: e.target.value })} placeholder="$80k – $120k" className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-[13.5px]" />
          </label>
          <label className="block"><span className="text-[12.5px] font-semibold">Description</span>
            <textarea rows={3} value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1 w-full rounded-xl border border-border bg-background p-3 text-[13px]" />
          </label>
        </div>
        <div className="p-5 border-t border-border flex items-center justify-end gap-2">
          <button type="button" onClick={onClose} className="h-10 rounded-xl border border-border bg-card px-4 text-[12.5px] font-semibold">Cancel</button>
          <button type="submit" disabled={saving} className="h-10 rounded-xl bg-[hsl(var(--navy))] text-white px-5 text-[12.5px] font-semibold disabled:opacity-50" data-testid="job-submit-btn">{saving ? 'Saving…' : initial ? 'Update' : 'Create'}</button>
        </div>
      </form>
    </div>
  );
};

// ========== JOB ROW ==========
const JobRow = ({ j, onEdit, onDelete, onStatus }) => (
  <div className="rounded-2xl border border-border bg-card p-5 hover:border-primary/30 transition-colors" data-testid={'job-card-' + j.id}>
    <div className="flex items-start justify-between gap-3 flex-wrap">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="text-[17px] font-bold text-foreground">{j.title}</div>
          <span className={cn('inline-flex rounded-md px-2.5 py-0.5 text-[10.5px] font-bold uppercase', STATUS_COLOR[j.status])}>{j.status}</span>
        </div>
        <div className="mt-1 text-[12.5px] text-muted-foreground">{j.team || '—'} · {j.location || '—'} · {j.type}</div>
        {j.salary_range && <div className="mt-1 text-[12.5px] text-primary font-semibold">{j.salary_range}</div>}
        <div className="mt-3 flex items-center gap-2">
          <Users className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-[13px] text-muted-foreground">{j.applicants || 0} candidate{j.applicants === 1 ? '' : 's'}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <div className="relative">
          <select value={j.status} onChange={(e) => onStatus(j, e.target.value)} className="h-10 rounded-xl border border-border bg-background pl-3 pr-8 text-[12.5px] font-semibold appearance-none cursor-pointer" data-testid={'job-status-' + j.id}>
            <option>Active</option><option>Closed</option><option>Unactive</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
        <button onClick={() => onEdit(j)} className="h-10 w-10 grid place-items-center rounded-xl bg-sky-500 text-white" data-testid={'job-edit-' + j.id}><Pencil className="h-4 w-4" /></button>
        <button onClick={() => onDelete(j)} className="h-10 w-10 grid place-items-center rounded-xl bg-rose-500 text-white" data-testid={'job-delete-' + j.id}><Trash2 className="h-4 w-4" /></button>
      </div>
    </div>
  </div>
);

export const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);

  const load = async () => {
    setLoading(true);
    try { const { data } = await api.get('/jobs'); setJobs(data); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const save = async (form) => {
    if (form.id) {
      const { data } = await api.patch('/jobs/' + form.id, form);
      setJobs((p) => p.map((x) => x.id === form.id ? data : x));
    } else {
      const { data } = await api.post('/jobs', form);
      setJobs((p) => [data, ...p]);
    }
    setModal(null);
  };
  const remove = async (j) => {
    if (!window.confirm('Delete "' + j.title + '"? This will also delete its candidates.')) return;
    await api.delete('/jobs/' + j.id);
    setJobs((p) => p.filter((x) => x.id !== j.id));
  };
  const setStatus = async (j, status) => {
    const patched = { ...j, status };
    setJobs((p) => p.map((x) => x.id === j.id ? patched : x));
    try { await api.patch('/jobs/' + j.id, { title: j.title, status }); } catch { load(); }
  };

  const filtered = jobs.filter((j) => j.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-foreground">Recruitment</h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">Manage job postings</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search jobs" className="w-full h-11 rounded-xl border border-border bg-card pl-10 pr-4 text-[13px]" data-testid="jobs-search" />
          </div>
          <button onClick={() => setModal({})} className="inline-flex items-center gap-2 h-11 rounded-xl bg-[hsl(var(--navy))] px-4 text-[13.5px] font-semibold text-white" data-testid="add-job-btn">
            <Plus className="h-4 w-4" /> Add New
          </button>
        </div>
      </div>

      {loading && <div className="mt-8 grid place-items-center min-h-[200px]"><Loader2 className="h-6 w-6 text-primary animate-spin" /></div>}
      {!loading && filtered.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-background p-12 text-center">
          <Briefcase className="h-10 w-10 text-muted-foreground mx-auto" />
          <div className="mt-3 text-[15px] font-semibold text-foreground">No jobs yet</div>
          <div className="mt-1 text-[13px] text-muted-foreground">Click Add New to post your first job.</div>
        </div>
      )}
      {!loading && filtered.length > 0 && (
        <div className="mt-5 space-y-3">
          {filtered.map((j) => <JobRow key={j.id} j={j} onEdit={setModal} onDelete={remove} onStatus={setStatus} />)}
        </div>
      )}

      {modal !== null && <JobModal initial={modal && modal.id ? modal : null} onClose={() => setModal(null)} onSave={save} />}
    </div>
  );
};

// ========== CANDIDATE MODAL ==========
const CandidateModal = ({ initial, jobs, onClose, onSave }) => {
  const [form, setForm] = useState(initial || { name: '', title: '', email: '', phone: '', stage: 'Applied', rating: 3, job_id: '', notes: '' });
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
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden" data-testid="candidate-modal">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h3 className="text-[17px] font-bold text-foreground">{initial ? 'Edit Candidate' : 'New Candidate'}</h3>
          <button type="button" onClick={onClose} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-secondary"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-5 space-y-3">
          <label className="block"><span className="text-[12.5px] font-semibold">Name *</span>
            <input autoFocus required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-[13.5px]" data-testid="candidate-name-input" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block"><span className="text-[12.5px] font-semibold">Email</span>
              <input type="email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-[13.5px]" />
            </label>
            <label className="block"><span className="text-[12.5px] font-semibold">Phone</span>
              <input value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-[13.5px]" />
            </label>
            <label className="block"><span className="text-[12.5px] font-semibold">Title</span>
              <input value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-[13.5px]" />
            </label>
            <label className="block"><span className="text-[12.5px] font-semibold">Rating (0-5)</span>
              <input type="number" min="0" max="5" step="0.1" value={form.rating || 0} onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) })} className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-[13.5px]" />
            </label>
            <label className="block"><span className="text-[12.5px] font-semibold">Stage</span>
              <select value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })} className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-[13.5px]">
                {STAGES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
            <label className="block"><span className="text-[12.5px] font-semibold">Job</span>
              <select value={form.job_id || ''} onChange={(e) => setForm({ ...form, job_id: e.target.value })} className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-[13.5px]">
                <option value="">— Unassigned —</option>
                {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
              </select>
            </label>
          </div>
        </div>
        <div className="p-5 border-t border-border flex items-center justify-end gap-2">
          <button type="button" onClick={onClose} className="h-10 rounded-xl border border-border bg-card px-4 text-[12.5px] font-semibold">Cancel</button>
          <button type="submit" disabled={saving} className="h-10 rounded-xl bg-[hsl(var(--navy))] text-white px-5 text-[12.5px] font-semibold disabled:opacity-50" data-testid="candidate-submit-btn">{saving ? 'Saving…' : initial ? 'Update' : 'Create'}</button>
        </div>
      </form>
    </div>
  );
};

const CandidateCard = ({ c, onEdit, onDelete, onMove }) => {
  const initials = c.name.split(' ').map((x) => x[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div className="rounded-xl border border-border bg-background p-3 hover:border-primary/30 transition-colors" data-testid={'candidate-card-' + c.id}>
      <div className="flex items-center gap-2">
        {c.avatar
          ? <img src={c.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
          : <div className="h-8 w-8 rounded-full bg-primary/10 text-primary grid place-items-center text-[11px] font-bold">{initials}</div>
        }
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold text-foreground truncate">{c.name}</div>
          <div className="text-[11.5px] text-muted-foreground truncate">{c.title || c.email || '—'}</div>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-1 text-[11.5px]">
          <Star className="h-3.5 w-3.5 text-amber-500" fill="currentColor" />
          <span className="font-semibold text-foreground">{(c.rating || 0).toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-1">
          <select value={c.stage} onChange={(e) => onMove(c, e.target.value)} className="h-7 rounded-md border border-border bg-background px-1.5 text-[11px] font-semibold" data-testid={'candidate-stage-' + c.id}>
            {STAGES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <button onClick={() => onEdit(c)} className="h-7 w-7 grid place-items-center rounded-md bg-sky-500 text-white" data-testid={'candidate-edit-' + c.id}><Pencil className="h-3 w-3" /></button>
          <button onClick={() => onDelete(c)} className="h-7 w-7 grid place-items-center rounded-md bg-rose-500 text-white" data-testid={'candidate-delete-' + c.id}><Trash2 className="h-3 w-3" /></button>
        </div>
      </div>
    </div>
  );
};

export const CandidatesPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('kanban');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [c, j] = await Promise.all([api.get('/candidates'), api.get('/jobs')]);
      setCandidates(c.data);
      setJobs(j.data);
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const save = async (form) => {
    if (form.id) {
      const { data } = await api.patch('/candidates/' + form.id, form);
      setCandidates((p) => p.map((x) => x.id === form.id ? data : x));
    } else {
      const { data } = await api.post('/candidates', form);
      setCandidates((p) => [data, ...p]);
    }
    setModal(null);
  };
  const remove = async (c) => {
    if (!window.confirm('Delete candidate "' + c.name + '"?')) return;
    await api.delete('/candidates/' + c.id);
    setCandidates((p) => p.filter((x) => x.id !== c.id));
  };
  const move = async (c, stage) => {
    const patched = { ...c, stage };
    setCandidates((p) => p.map((x) => x.id === c.id ? patched : x));
    try { await api.patch('/candidates/' + c.id, { name: c.name, stage }); } catch { load(); }
  };

  const filtered = candidates.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
  const byStage = (s) => filtered.filter((c) => c.stage === s);

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-foreground">Candidates</h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">Track applicants across hiring stages</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" className="w-full h-11 rounded-xl border border-border bg-card pl-10 pr-4 text-[13px]" />
          </div>
          <div className="inline-flex rounded-xl bg-secondary p-1">
            <button onClick={() => setView('kanban')} className={cn('px-3 py-1.5 rounded-lg text-[12px] font-semibold', view === 'kanban' ? 'bg-card shadow-sm' : 'text-muted-foreground')} data-testid="view-kanban-btn">Kanban</button>
            <button onClick={() => setView('list')} className={cn('px-3 py-1.5 rounded-lg text-[12px] font-semibold', view === 'list' ? 'bg-card shadow-sm' : 'text-muted-foreground')} data-testid="view-list-btn">List</button>
          </div>
          <button onClick={() => setModal({})} className="inline-flex items-center gap-2 h-11 rounded-xl bg-[hsl(var(--navy))] px-4 text-[13.5px] font-semibold text-white" data-testid="add-candidate-btn">
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
      </div>

      {loading && <div className="mt-8 grid place-items-center min-h-[200px]"><Loader2 className="h-6 w-6 text-primary animate-spin" /></div>}

      {!loading && view === 'kanban' && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 overflow-x-auto">
          {STAGES.map((stage) => {
            const list = byStage(stage);
            return (
              <div key={stage} className="rounded-2xl border border-border bg-card p-3 min-w-[220px]">
                <div className="px-2 pb-3 pt-1 flex items-center justify-between">
                  <span className="text-[13px] font-bold text-foreground">{stage}</span>
                  <span className="text-[11.5px] font-semibold text-muted-foreground h-5 min-w-[20px] px-1.5 grid place-items-center rounded-full bg-secondary">{list.length}</span>
                </div>
                <div className="space-y-2">
                  {list.map((c) => <CandidateCard key={c.id} c={c} onEdit={setModal} onDelete={remove} onMove={move} />)}
                  {list.length === 0 && <div className="text-[11.5px] text-muted-foreground px-2 py-3">—</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && view === 'list' && (
        <div className="mt-6 rounded-2xl border border-border bg-card overflow-x-auto">
          <table className="w-full text-[13px] min-w-[720px]">
            <thead className="border-b border-border bg-secondary/30">
              <tr className="text-left text-muted-foreground">
                <th className="p-4 font-semibold">Candidate</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Stage</th>
                <th className="p-4 font-semibold">Rating</th>
                <th className="p-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-secondary/30" data-testid={'candidate-row-' + c.id}>
                  <td className="p-4"><div className="font-semibold text-foreground">{c.name}</div><div className="text-[11.5px] text-muted-foreground">{c.title || '—'}</div></td>
                  <td className="p-4 text-muted-foreground">{c.email || '—'}</td>
                  <td className="p-4"><span className="inline-flex rounded-md bg-primary/10 text-primary px-2.5 py-0.5 text-[10.5px] font-bold uppercase">{c.stage}</span></td>
                  <td className="p-4"><div className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 text-amber-500" fill="currentColor" /><span className="font-semibold text-foreground">{(c.rating || 0).toFixed(1)}</span></div></td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {c.email && <a href={'mailto:' + c.email} className="h-8 w-8 grid place-items-center rounded-lg bg-secondary hover:bg-secondary/80"><Mail className="h-4 w-4 text-muted-foreground" /></a>}
                      {c.phone && <a href={'tel:' + c.phone} className="h-8 w-8 grid place-items-center rounded-lg bg-secondary hover:bg-secondary/80"><Phone className="h-4 w-4 text-muted-foreground" /></a>}
                      <button onClick={() => setModal(c)} className="h-8 w-8 grid place-items-center rounded-lg bg-sky-500 text-white"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => remove(c)} className="h-8 w-8 grid place-items-center rounded-lg bg-rose-500 text-white"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">No candidates yet</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {modal !== null && <CandidateModal initial={modal && modal.id ? modal : null} jobs={jobs} onClose={() => setModal(null)} onSave={save} />}
    </div>
  );
};

// ========== RECRUITMENT SETTINGS (unchanged — pipelines are visual only for now) ==========
export const RecruitmentSettingsPage = () => {
  const pipelines = [
    { id: 1, name: 'Default Pipeline', stages: STAGES },
    { id: 2, name: 'Engineering Pipeline', stages: ['Applied', 'Take-home', 'Tech Interview', 'Final', 'Offer', 'Hired'] },
  ];
  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-foreground">Recruitment Settings</h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">Pipelines used to move candidates</p>
        </div>
      </div>
      <div className="mt-6 space-y-4">
        {pipelines.map((p) => (
          <div key={p.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="text-[15px] font-bold text-foreground">{p.name}</div>
            <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2">
              {p.stages.map((s, i) => (
                <React.Fragment key={s}>
                  <div className="rounded-xl border border-border bg-background px-4 py-2 text-[12.5px] font-semibold text-foreground whitespace-nowrap">{s}</div>
                  {i < p.stages.length - 1 && <div className="w-6 h-px bg-border shrink-0" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ApplicantsPage = CandidatesPage;
