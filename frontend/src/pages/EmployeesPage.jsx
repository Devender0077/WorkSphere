import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronDown, Download, Plus, Search, Target, ChevronLeft, ChevronRight, MoreHorizontal, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { STATUS_COLORS } from '@/data/mock';
import { cn } from '@/lib/utils';
import AddEmployeeSheet from '@/components/employees/AddEmployeeSheet';

const OFFICES = ['All Offices', 'Unpixel Office', 'Unpixel Studio', 'Main Office'];
const JOB_TITLES = ['All Job Titles', 'UI UX Designer', 'Graphic Designer', 'Finance', 'Project Manager', 'Creative Director', 'Lead Designer', 'IT Support', '3D Designer', 'Backend Engineer', 'Product Manager'];
const STATUSES = ['All Status', 'Active', 'On Boarding', 'Probation', 'On Leave'];

const Dropdown = ({ options, value, onChange }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'h-11 min-w-[170px] w-full rounded-xl border border-border bg-card px-4 text-[13px] text-foreground flex items-center justify-between gap-3 hover:bg-secondary/60',
          open && 'ring-2 ring-primary/20 border-primary/40'
        )}
      >
        <span className="truncate">{value || options[0]}</span>
        <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-[220px] rounded-2xl border border-border bg-card shadow-lg py-2 max-h-72 overflow-auto">
            {options.map((opt) => {
              const selected = value === opt;
              return (
                <button
                  key={opt}
                  onClick={() => { onChange(opt); setOpen(false); }}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-[13.5px] text-foreground hover:bg-secondary text-left"
                >
                  {opt}
                  {selected && <Check className="h-4 w-4 text-primary" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

const StatusBadge = ({ status }) => (
  <span className={cn('inline-flex items-center rounded-md px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide', STATUS_COLORS[status] || '')}>{status}</span>
);

const EmployeesPage = () => {
  const { user, can } = useAuth();
  const [search, setSearch] = useState('');
  const [office, setOffice] = useState(OFFICES[0]);
  const [job, setJob] = useState(JOB_TITLES[0]);
  const [status, setStatus] = useState(STATUSES[0]);
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const canCreate = can('employees.create');
  const canDelete = can('employees.delete');

  const fetchList = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (office && office !== OFFICES[0]) params.office = office;
      if (job && job !== JOB_TITLES[0]) params.title = job;
      if (status && status !== STATUSES[0]) params.status = status;
      const { data } = await api.get('/employees', { params });
      setList(data);
    } catch (e) { /* noop */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchList(); /* eslint-disable-next-line */ }, [office, job, status]);

  // debounce search
  useEffect(() => {
    const t = setTimeout(fetchList, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [search]);

  const filtered = list;

  const toggleAll = () => {
    if (selected.length === filtered.length) setSelected([]);
    else setSelected(filtered.map((e) => e.id));
  };
  const toggleOne = (id) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const handleCreate = async (data) => {
    try {
      await api.post('/employees', {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        title: data.title || 'UI UX Designer',
        join_date: data.joinDate,
      });
      setAddOpen(false);
      fetchList();
    } catch (e) {
      alert(e?.response?.data?.detail || 'Failed to create');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    try { await api.delete(`/employees/${id}`); fetchList(); } catch (e) {}
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[30px] font-bold text-foreground">Employees</h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">
            {user?.tenant_name ? `Manage employees of ${user.tenant_name}` : 'All employees across tenants'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 h-11 rounded-xl border border-border bg-card px-4 text-[13.5px] font-semibold text-foreground hover:bg-secondary">
            <Download className="h-4 w-4" /> Download
          </button>
          {canCreate && (
            <button onClick={() => setAddOpen(true)} className="inline-flex items-center gap-2 h-11 rounded-xl bg-[hsl(var(--navy))] px-4 text-[13.5px] font-semibold text-white hover:opacity-90">
              <Plus className="h-4 w-4" /> Add New
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_auto_auto_auto] gap-3">
        <div className="relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employee"
            className="w-full h-11 rounded-xl border border-border bg-card pl-4 pr-11 text-[13px] text-foreground placeholder:text-muted-foreground/80 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 grid place-items-center rounded-lg hover:bg-secondary text-muted-foreground">
            <Search className="h-4 w-4" />
          </button>
        </div>
        <Dropdown options={OFFICES} value={office} onChange={setOffice} />
        <Dropdown options={JOB_TITLES} value={job} onChange={setJob} />
        <Dropdown options={STATUSES} value={status} onChange={setStatus} />
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-[13px] min-w-[1050px]">
          <thead>
            <tr className="text-primary text-left border-b border-border">
              <th className="p-4 w-10">
                <input type="checkbox" className="h-4 w-4 rounded border-border accent-primary" checked={filtered.length > 0 && selected.length === filtered.length} onChange={toggleAll} />
              </th>
              <th className="p-4 font-semibold">Employee Name</th>
              <th className="p-4 font-semibold">Job Title</th>
              <th className="p-4 font-semibold">Line Manager</th>
              <th className="p-4 font-semibold">Department</th>
              <th className="p-4 font-semibold">Office</th>
              <th className="p-4 font-semibold">Employee Status</th>
              <th className="p-4 font-semibold">Account</th>
              <th className="p-4 font-semibold w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr><td colSpan={9} className="p-10 text-center text-muted-foreground">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={9} className="p-10 text-center text-muted-foreground">No employees match your filters.</td></tr>
            ) : filtered.map((e) => (
              <tr key={e.id} className="hover:bg-secondary/40">
                <td className="p-4">
                  <input type="checkbox" className="h-4 w-4 rounded border-border accent-primary" checked={selected.includes(e.id)} onChange={() => toggleOne(e.id)} />
                </td>
                <td className="p-4">
                  <Link to={`/employees/${e.id}`} className="flex items-center gap-3 group">
                    {e.avatar ? (
                      <img src={e.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 grid place-items-center text-[12px] font-bold">{(e.first_name?.[0]||'')+(e.last_name?.[0]||'')}</div>
                    )}
                    <div>
                      <div className="font-semibold text-foreground group-hover:text-primary">{e.first_name} {e.last_name}</div>
                      <div className="text-[12px] text-muted-foreground">{e.email}</div>
                    </div>
                  </Link>
                </td>
                <td className="p-4 text-foreground">{e.title}</td>
                <td className="p-4 text-foreground">{e.line_manager || e.handle}</td>
                <td className="p-4 text-foreground">{e.department}</td>
                <td className="p-4 text-foreground">{e.office}</td>
                <td className="p-4"><div className="inline-flex items-center gap-1"><StatusBadge status={e.status} /><ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /></div></td>
                <td className="p-4 text-foreground">{e.account}</td>
                <td className="p-4">
                  <div className="flex items-center gap-1.5">
                    <Link to={`/employees/${e.id}`} className="h-8 w-8 grid place-items-center rounded-lg bg-primary text-white hover:opacity-90"><Target className="h-4 w-4" /></Link>
                    {canDelete && <button onClick={() => handleDelete(e.id)} className="h-8 w-8 grid place-items-center rounded-lg bg-rose-500 text-white hover:opacity-90"><Trash2 className="h-4 w-4" /></button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="h-9 w-9 rounded-lg border border-border bg-card grid place-items-center text-muted-foreground hover:bg-secondary"><ChevronLeft className="h-4 w-4" /></button>
        {[1, 2, 3].map((p) => (
          <button key={p} onClick={() => setPage(p)} className={cn('h-9 w-9 rounded-lg text-[13px] font-semibold', page === p ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary')}>{p}</button>
        ))}
        <span className="px-1 text-muted-foreground"><MoreHorizontal className="h-4 w-4" /></span>
        <button onClick={() => setPage(10)} className={cn('h-9 w-9 rounded-lg text-[13px] font-semibold', page === 10 ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary')}>10</button>
        <button onClick={() => setPage((p) => p + 1)} className="h-9 w-9 rounded-lg border border-border bg-card grid place-items-center text-muted-foreground hover:bg-secondary"><ChevronRight className="h-4 w-4" /></button>
      </div>

      <AddEmployeeSheet open={addOpen} onClose={() => setAddOpen(false)} onCreate={handleCreate} />
    </div>
  );
};

export default EmployeesPage;
