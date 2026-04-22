import React, { useState, useEffect } from 'react';
import { GitBranch, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { Empty } from './common';

// Iterative depth-first flattening avoids a self-referencing JSX component,
// which can trigger babel traversal overflows.
const flatten = (depts) => {
  const byId = {};
  depts.forEach((d) => { byId[d.id] = { ...d, kids: [] }; });
  depts.forEach((d) => { if (d.parent_id && byId[d.parent_id]) byId[d.parent_id].kids.push(byId[d.id]); });
  const roots = depts.filter((d) => !d.parent_id).map((d) => byId[d.id]);
  const list = [];
  const stack = roots.map((r) => ({ node: r, depth: 0 }));
  while (stack.length) {
    const { node, depth } = stack.shift();
    list.push({ id: node.id, name: node.name, depth, kids: node.kids.length });
    for (let i = node.kids.length - 1; i >= 0; i--) stack.unshift({ node: node.kids[i], depth: depth + 1 });
  }
  return list;
};

const DeptRow = ({ d, onAddSub, onEdit, onRemove }) => (
  <div className="pl-3" style={{ marginLeft: d.depth * 18 }}>
    <div className="flex items-center gap-2 group py-1 border-l border-border pl-3">
      <span className="text-[13px] font-semibold text-foreground">{d.name}</span>
      <span className="text-[11px] text-muted-foreground">({d.kids} sub)</span>
      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
        <button onClick={() => onAddSub(d.id)} className="h-6 w-6 grid place-items-center rounded-md bg-primary text-white" data-testid={'dept-add-sub-' + d.id}>
          <Plus className="h-3 w-3" />
        </button>
        <button onClick={() => onEdit(d)} className="h-6 w-6 grid place-items-center rounded-md bg-sky-500 text-white" data-testid={'dept-edit-' + d.id}>
          <Pencil className="h-3 w-3" />
        </button>
        <button onClick={() => onRemove(d)} className="h-6 w-6 grid place-items-center rounded-md bg-rose-500 text-white" data-testid={'dept-delete-' + d.id}>
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  </div>
);

export const DepartmentTab = () => {
  const [depts, setDepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [parent, setParent] = useState(null);
  const [newName, setNewName] = useState('');
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/departments');
      setDepts(data);
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!newName.trim()) return;
    const { data } = await api.post('/departments', { name: newName.trim(), parent_id: parent });
    setDepts((p) => [...p, data]);
    setNewName('');
    setParent(null);
  };

  const saveEdit = async () => {
    if (!editing || !editing.name || !editing.name.trim()) return;
    const { data } = await api.patch('/departments/' + editing.id, { name: editing.name.trim(), parent_id: editing.parent_id });
    setDepts((p) => p.map((x) => x.id === data.id ? data : x));
    setEditing(null);
  };

  const remove = async (d) => {
    if (!window.confirm('Delete department "' + d.name + '"?')) return;
    await api.delete('/departments/' + d.id);
    setDepts((p) => p.filter((x) => x.id !== d.id));
  };

  const rows = flatten(depts);
  const parentDept = parent ? depts.find((d) => d.id === parent) : null;
  const placeholder = parent
    ? 'New sub-department under "' + (parentDept ? parentDept.name : '') + '"'
    : 'New department name';

  return (
    <div>
      <h3 className="text-[18px] font-bold text-foreground">Department</h3>
      <div className="mt-4 rounded-2xl border border-border bg-background p-4">
        <div className="flex items-center gap-2 flex-wrap">
          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder={placeholder} className="flex-1 min-w-[240px] h-10 rounded-xl border border-border bg-background px-3 text-[13px]" data-testid="dept-new-input" />
          {parent && <button onClick={() => setParent(null)} className="h-10 rounded-xl border border-border bg-card px-3 text-[12.5px] font-semibold">Reset to top-level</button>}
          <button onClick={add} disabled={!newName.trim()} className="inline-flex items-center gap-1.5 h-10 rounded-xl bg-[hsl(var(--navy))] text-white px-4 text-[12.5px] font-semibold disabled:opacity-50" data-testid="dept-add-btn">
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
      </div>

      {loading && <div className="min-h-[120px] grid place-items-center"><Loader2 className="h-6 w-6 text-primary animate-spin" /></div>}
      {!loading && depts.length === 0 && <Empty Icon={GitBranch} title="No departments yet" hint="Use the form above to add your first." />}
      {!loading && depts.length > 0 && (
        <div className="mt-5 rounded-2xl border border-border bg-background p-4">
          {rows.map((r) => (
            <DeptRow key={r.id} d={r} onAddSub={setParent} onEdit={(d) => setEditing(depts.find((x) => x.id === d.id))} onRemove={(d) => remove(depts.find((x) => x.id === d.id) || d)} />
          ))}
        </div>
      )}

      <div className="mt-3 text-[12.5px] text-muted-foreground">
        Total: <span className="font-bold text-foreground">{depts.length}</span>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="absolute inset-0 bg-black/50" />
          <div onClick={(e) => e.stopPropagation()} className="relative bg-card border border-border rounded-2xl w-full max-w-sm p-5 shadow-2xl">
            <h4 className="text-[15px] font-bold text-foreground">Rename department</h4>
            <input autoFocus value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="mt-3 w-full h-11 rounded-xl border border-border bg-background px-3 text-[13.5px]" data-testid="dept-edit-input" />
            <div className="mt-4 flex items-center justify-end gap-2">
              <button onClick={() => setEditing(null)} className="h-10 rounded-xl border border-border bg-card px-4 text-[12.5px] font-semibold">Cancel</button>
              <button onClick={saveEdit} className="h-10 rounded-xl bg-[hsl(var(--navy))] text-white px-4 text-[12.5px] font-semibold" data-testid="dept-edit-save-btn">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
