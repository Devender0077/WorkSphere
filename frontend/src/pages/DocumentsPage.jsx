import React, { useState, useEffect } from 'react';
import { Plus, FileText, Search, Folder, Pencil, Trash2, X, Loader2, Download, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

const KINDS = ['file', 'policy', 'contract', 'other'];
const DEFAULT_FOLDERS = ['General', 'Onboarding', 'Offboarding', 'Policies', 'Contracts'];

const DocModal = ({ initial, folders, onClose, onSave }) => {
  const [form, setForm] = useState(initial || { name: '', url: '', folder: 'General', kind: 'file', size: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [newFolder, setNewFolder] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try { await onSave({ ...form, folder: newFolder.trim() || form.folder }); } finally { setSaving(false); }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden" data-testid="doc-modal">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h3 className="text-[17px] font-bold text-foreground">{initial ? 'Edit Document' : 'New Document'}</h3>
          <button type="button" onClick={onClose} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-secondary"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-5 space-y-3">
          <label className="block"><span className="text-[12.5px] font-semibold">Name *</span>
            <input autoFocus required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-[13.5px]" data-testid="doc-name-input" />
          </label>
          <label className="block"><span className="text-[12.5px] font-semibold">URL (link to PDF / doc)</span>
            <input value={form.url || ''} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://…/file.pdf" className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-[13.5px]" data-testid="doc-url-input" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block"><span className="text-[12.5px] font-semibold">Folder</span>
              <select value={newFolder ? '' : form.folder} onChange={(e) => { setForm({ ...form, folder: e.target.value }); setNewFolder(''); }} className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-[13.5px]">
                {[...new Set([...DEFAULT_FOLDERS, ...folders.map((f) => f.name), form.folder])].filter(Boolean).map((f) => <option key={f}>{f}</option>)}
              </select>
            </label>
            <label className="block"><span className="text-[12.5px] font-semibold">Or create new folder</span>
              <input value={newFolder} onChange={(e) => setNewFolder(e.target.value)} placeholder="New folder name" className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-[13.5px]" />
            </label>
            <label className="block"><span className="text-[12.5px] font-semibold">Kind</span>
              <select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })} className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-[13.5px]">
                {KINDS.map((k) => <option key={k}>{k}</option>)}
              </select>
            </label>
            <label className="block"><span className="text-[12.5px] font-semibold">Size</span>
              <input value={form.size || ''} onChange={(e) => setForm({ ...form, size: e.target.value })} placeholder="2.3 MB" className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-[13.5px]" />
            </label>
          </div>
          <label className="block"><span className="text-[12.5px] font-semibold">Description</span>
            <textarea rows={2} value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1 w-full rounded-xl border border-border bg-background p-3 text-[13px]" />
          </label>
        </div>
        <div className="p-5 border-t border-border flex items-center justify-end gap-2">
          <button type="button" onClick={onClose} className="h-10 rounded-xl border border-border bg-card px-4 text-[12.5px] font-semibold">Cancel</button>
          <button type="submit" disabled={saving} className="h-10 rounded-xl bg-[hsl(var(--navy))] text-white px-5 text-[12.5px] font-semibold disabled:opacity-50" data-testid="doc-submit-btn">{saving ? 'Saving…' : initial ? 'Update' : 'Create'}</button>
        </div>
      </form>
    </div>
  );
};

const KindBadge = ({ kind }) => {
  const cls = {
    file: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
    policy: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    contract: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    other: 'bg-secondary text-muted-foreground',
  }[kind] || 'bg-secondary text-muted-foreground';
  return <span className={cn('inline-flex rounded-md px-2 py-0.5 text-[10.5px] font-bold uppercase', cls)}>{kind}</span>;
};

const DocumentsPage = () => {
  const [docs, setDocs] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [folder, setFolder] = useState('All');
  const [modal, setModal] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [d, f] = await Promise.all([api.get('/documents'), api.get('/documents/folders')]);
      setDocs(d.data);
      setFolders(f.data);
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const save = async (form) => {
    if (form.id) {
      const { data } = await api.patch('/documents/' + form.id, form);
      setDocs((p) => p.map((x) => x.id === form.id ? data : x));
    } else {
      const { data } = await api.post('/documents', form);
      setDocs((p) => [data, ...p]);
    }
    const { data: f } = await api.get('/documents/folders');
    setFolders(f);
    setModal(null);
  };
  const remove = async (d) => {
    if (!window.confirm('Delete document "' + d.name + '"?')) return;
    await api.delete('/documents/' + d.id);
    setDocs((p) => p.filter((x) => x.id !== d.id));
  };

  const filtered = docs.filter((d) => {
    const s = (!search || d.name.toLowerCase().includes(search.toLowerCase()));
    const f = folder === 'All' || d.folder === folder;
    return s && f;
  });

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-foreground">Documents</h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">Central library — organize in folders, share links with your team</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search documents" className="w-full h-11 rounded-xl border border-border bg-card pl-10 pr-4 text-[13px]" data-testid="docs-search" />
          </div>
          <button onClick={() => setModal({})} className="inline-flex items-center gap-2 h-11 rounded-xl bg-[hsl(var(--navy))] px-4 text-[13.5px] font-semibold text-white" data-testid="add-doc-btn">
            <Plus className="h-4 w-4" /> New Document
          </button>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 flex-wrap">
        {['All', ...new Set([...DEFAULT_FOLDERS, ...folders.map((f) => f.name)])].map((f) => {
          const count = f === 'All' ? docs.length : docs.filter((d) => d.folder === f).length;
          return (
            <button key={f} onClick={() => setFolder(f)} className={cn('inline-flex items-center gap-1.5 h-9 rounded-lg px-3 text-[12.5px] font-semibold', folder === f ? 'bg-primary text-white' : 'bg-card border border-border text-foreground hover:bg-secondary')} data-testid={'docs-folder-' + f}>
              <Folder className="h-3.5 w-3.5" /> {f}
              <span className={cn('text-[11px]', folder === f ? 'text-white/80' : 'text-muted-foreground')}>{count}</span>
            </button>
          );
        })}
      </div>

      {loading && <div className="mt-8 grid place-items-center min-h-[200px]"><Loader2 className="h-6 w-6 text-primary animate-spin" /></div>}
      {!loading && filtered.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-background p-12 text-center">
          <FileText className="h-10 w-10 text-muted-foreground mx-auto" />
          <div className="mt-3 text-[15px] font-semibold text-foreground">No documents here</div>
          <div className="mt-1 text-[13px] text-muted-foreground">Click New Document to add a file link.</div>
        </div>
      )}
      {!loading && filtered.length > 0 && (
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((d) => (
            <div key={d.id} className="rounded-2xl border border-border bg-card p-5" data-testid={'doc-card-' + d.id}>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center"><FileText className="h-5 w-5" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="text-[14.5px] font-bold text-foreground truncate">{d.name}</div>
                    <KindBadge kind={d.kind || 'file'} />
                  </div>
                  <div className="text-[11.5px] text-muted-foreground mt-0.5">{d.folder} · {d.size || '—'}</div>
                </div>
              </div>
              {d.description && <div className="mt-3 text-[12.5px] text-muted-foreground line-clamp-2">{d.description}</div>}
              <div className="mt-3 flex items-center justify-between">
                <div className="text-[11px] text-muted-foreground">by {d.uploaded_by || '—'}</div>
                <div className="flex items-center gap-1">
                  {d.url && <a href={d.url} target="_blank" rel="noreferrer" className="h-8 w-8 grid place-items-center rounded-lg bg-primary/10 text-primary" data-testid={'doc-view-' + d.id}><ExternalLink className="h-3.5 w-3.5" /></a>}
                  {d.url && <a href={d.url} download className="h-8 w-8 grid place-items-center rounded-lg bg-secondary" title="Download"><Download className="h-3.5 w-3.5 text-muted-foreground" /></a>}
                  <button onClick={() => setModal(d)} className="h-8 w-8 grid place-items-center rounded-lg bg-sky-500 text-white" data-testid={'doc-edit-' + d.id}><Pencil className="h-3.5 w-3.5" /></button>
                  <button onClick={() => remove(d)} className="h-8 w-8 grid place-items-center rounded-lg bg-rose-500 text-white" data-testid={'doc-delete-' + d.id}><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal !== null && <DocModal initial={modal && modal.id ? modal : null} folders={folders} onClose={() => setModal(null)} onSave={save} />}
    </div>
  );
};

export default DocumentsPage;
