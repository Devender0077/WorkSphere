import React, { useEffect, useState } from 'react';
import { Shield, Plus, Search, Users, Check, X, Trash2, Pencil, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { ROLE_CONFIG } from '@/data/mock';
import { cn } from '@/lib/utils';

const RolesPage = () => {
  const { can } = useAuth();
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(false);
  const [localPerms, setLocalPerms] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPerms, setNewPerms] = useState([]);

  const canCreate = can('roles.create');
  const canUpdate = can('roles.update');
  const canDelete = can('roles.delete');

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [r, p] = await Promise.all([api.get('/roles'), api.get('/permissions')]);
      setRoles(r.data);
      setPermissions(p.data);
      if (r.data.length && !selected) setSelected(r.data[0]);
    } catch (e) { /* noop */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); /* eslint-disable-next-line */ }, []);

  useEffect(() => { if (selected) setLocalPerms(selected.permissions || []); }, [selected?.id]);

  const grouped = permissions.reduce((acc, p) => { (acc[p.group] ||= []).push(p); return acc; }, {});
  const filteredRoles = roles.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));

  const togglePerm = (key, list, setList) => {
    setList(list.includes(key) ? list.filter((k) => k !== key) : [...list, key]);
  };

  const savePerms = async () => {
    try {
      const { data } = await api.patch(`/roles/${selected.id}`, { permissions: localPerms });
      setRoles((rs) => rs.map((r) => r.id === data.id ? { ...r, permissions: data.permissions } : r));
      setSelected((s) => ({ ...s, permissions: data.permissions }));
      setEditing(false);
    } catch (e) { alert(e?.response?.data?.detail || 'Failed to save'); }
  };

  const deleteRole = async (r) => {
    if (!window.confirm(`Delete role ${r.name}?`)) return;
    try {
      await api.delete(`/roles/${r.id}`);
      setRoles((rs) => rs.filter((x) => x.id !== r.id));
      if (selected?.id === r.id) setSelected(roles[0] || null);
    } catch (e) { alert(e?.response?.data?.detail || 'Failed'); }
  };

  const createRole = async () => {
    if (!newName) return;
    try {
      const { data } = await api.post('/roles', { name: newName, description: newDesc, permissions: newPerms });
      setRoles((rs) => [...rs, data]);
      setSelected(data);
      setCreateOpen(false); setNewName(''); setNewDesc(''); setNewPerms([]);
    } catch (e) { alert(e?.response?.data?.detail || 'Failed'); }
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[30px] font-bold text-foreground">Roles &amp; Permissions</h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">Define what members can see and do across the platform.</p>
        </div>
        {canCreate && (
          <button onClick={() => setCreateOpen(true)} className="inline-flex items-center gap-2 h-11 rounded-xl bg-[hsl(var(--navy))] px-4 text-[13.5px] font-semibold text-white hover:opacity-90">
            <Plus className="h-4 w-4" /> Create Role
          </button>
        )}
      </div>

      {loading ? (
        <div className="min-h-[40vh] grid place-items-center"><Loader2 className="h-6 w-6 text-primary animate-spin" /></div>
      ) : (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-5">
          {/* Roles list */}
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search roles" className="w-full h-10 rounded-xl border border-border bg-background pl-10 pr-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
            </div>
            <div className="space-y-1">
              {filteredRoles.map((r) => {
                const cfg = ROLE_CONFIG[r.key] || { label: r.name, badgeClass: 'bg-secondary text-foreground' };
                const active = selected?.id === r.id;
                return (
                  <button key={r.id} onClick={() => { setSelected(r); setEditing(false); }} className={cn('w-full text-left rounded-xl px-3 py-3 border transition-colors', active ? 'border-primary/40 bg-primary/5' : 'border-transparent hover:bg-secondary')}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Shield className={cn('h-4 w-4', active ? 'text-primary' : 'text-muted-foreground')} />
                          <span className="text-[13.5px] font-semibold text-foreground truncate">{r.name}</span>
                          {r.system && <span className="text-[9.5px] font-bold uppercase px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">System</span>}
                        </div>
                        <div className="mt-1 text-[12px] text-muted-foreground line-clamp-1">{r.description || '—'}</div>
                      </div>
                      <div className="flex items-center gap-1 text-[12px] text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />{r.users_count}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Role detail */}
          <div className="rounded-2xl border border-border bg-card p-6">
            {!selected ? (
              <div className="py-16 text-center text-muted-foreground">Select a role to view permissions</div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center"><Shield className="h-5 w-5" /></div>
                      <div>
                        <h2 className="text-[20px] font-bold text-foreground">{selected.name}</h2>
                        <p className="text-[12.5px] text-muted-foreground">{selected.description || 'No description'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!editing && canUpdate && (
                      <button onClick={() => setEditing(true)} className="inline-flex items-center gap-2 h-10 rounded-xl border border-border bg-card px-3 text-[13px] font-semibold hover:bg-secondary"><Pencil className="h-4 w-4" /> Edit permissions</button>
                    )}
                    {!selected.system && canDelete && (
                      <button onClick={() => deleteRole(selected)} className="inline-flex items-center gap-2 h-10 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 px-3 text-[13px] font-semibold hover:bg-rose-100 dark:bg-rose-950/30 dark:border-rose-900/50"><Trash2 className="h-4 w-4" /></button>
                    )}
                  </div>
                </div>

                <div className="mt-4 inline-flex items-center gap-3 rounded-xl bg-secondary/60 px-3 py-2 text-[12.5px]">
                  <span className="text-muted-foreground">Members assigned</span>
                  <span className="font-bold text-foreground">{selected.users_count}</span>
                </div>

                <div className="mt-6 space-y-5">
                  {Object.entries(grouped).map(([group, perms]) => (
                    <div key={group} className="rounded-xl border border-border overflow-hidden">
                      <div className="px-4 py-3 bg-secondary/60 text-[13px] font-bold text-foreground">{group}</div>
                      <div className="divide-y divide-border">
                        {perms.map((p) => {
                          const checked = (editing ? localPerms : selected.permissions).includes(p.key);
                          return (
                            <label key={p.key} className="flex items-center justify-between px-4 py-3 text-[13px] text-foreground hover:bg-secondary/40 cursor-pointer">
                              <span>{p.label} <span className="text-muted-foreground text-[12px] ml-1">({p.key})</span></span>
                              <span className={cn('inline-flex items-center gap-2')}>
                                {editing ? (
                                  <input type="checkbox" checked={checked} onChange={() => togglePerm(p.key, localPerms, setLocalPerms)} className="h-4 w-4 rounded border-border accent-primary" />
                                ) : (
                                  checked ? <Check className="h-4 w-4 text-primary" /> : <X className="h-4 w-4 text-muted-foreground/60" />
                                )}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {editing && (
                  <div className="mt-6 flex items-center gap-3">
                    <button onClick={() => { setEditing(false); setLocalPerms(selected.permissions); }} className="h-11 rounded-xl border border-border bg-card px-5 text-[13.5px] font-semibold hover:bg-secondary">Cancel</button>
                    <button onClick={savePerms} className="h-11 rounded-xl bg-primary text-white px-5 text-[13.5px] font-semibold hover:bg-primary/90">Save changes</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Create Role Drawer */}
      {createOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setCreateOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-full sm:w-[520px] bg-card border-l border-border shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-7 pt-7 pb-4">
              <h2 className="text-[20px] font-bold text-foreground">Create New Role</h2>
              <button onClick={() => setCreateOpen(false)} className="h-9 w-9 grid place-items-center rounded-lg hover:bg-secondary text-muted-foreground"><X className="h-4 w-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-7 pb-6 space-y-5">
              <label className="block">
                <span className="text-[13px] font-medium text-foreground">Role Name <span className="text-rose-500">*</span></span>
                <input value={newName} onChange={(e) => setNewName(e.target.value)} className="mt-2 w-full h-12 rounded-xl border border-border bg-background px-4 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" placeholder="e.g. HR Manager" />
              </label>
              <label className="block">
                <span className="text-[13px] font-medium text-foreground">Description</span>
                <input value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="mt-2 w-full h-12 rounded-xl border border-border bg-background px-4 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" placeholder="Describe this role" />
              </label>
              <div>
                <div className="text-[13px] font-medium text-foreground mb-2">Permissions</div>
                <div className="space-y-4">
                  {Object.entries(grouped).map(([group, perms]) => (
                    <div key={group} className="rounded-xl border border-border overflow-hidden">
                      <div className="px-4 py-2 bg-secondary/60 text-[12.5px] font-bold text-foreground">{group}</div>
                      <div className="divide-y divide-border">
                        {perms.map((p) => (
                          <label key={p.key} className="flex items-center justify-between px-4 py-2.5 text-[13px] cursor-pointer hover:bg-secondary/40">
                            <span className="text-foreground">{p.label}</span>
                            <input type="checkbox" checked={newPerms.includes(p.key)} onChange={() => togglePerm(p.key, newPerms, setNewPerms)} className="h-4 w-4 rounded border-border accent-primary" />
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-7 pb-7 pt-4 border-t border-border flex items-center gap-3">
              <button onClick={() => setCreateOpen(false)} className="flex-1 h-12 rounded-xl border border-border bg-card text-[13.5px] font-semibold hover:bg-secondary">Cancel</button>
              <button onClick={createRole} className="flex-1 h-12 rounded-xl bg-[hsl(var(--navy))] text-white text-[13.5px] font-semibold hover:opacity-90">Create</button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default RolesPage;
