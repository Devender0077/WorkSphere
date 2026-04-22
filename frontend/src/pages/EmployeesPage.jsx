import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronDown, Download, Plus, Search, Target, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { EMPLOYEES, OFFICES, JOB_TITLES, STATUSES, STATUS_COLORS } from '@/data/mock';
import { cn } from '@/lib/utils';
import AddEmployeeSheet from '@/components/employees/AddEmployeeSheet';

const Dropdown = ({ label, options, value, onChange }) => {
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
        <span className="truncate">{value || label}</span>
        <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-[220px] rounded-2xl border border-border bg-card shadow-lg py-2">
            {options.map((opt) => {
              const selected = value === opt || (!value && opt === options[0]);
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
  <span className={cn('inline-flex items-center rounded-md px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide', STATUS_COLORS[status])}>{status}</span>
);

const EmployeesPage = () => {
  const [search, setSearch] = useState('');
  const [office, setOffice] = useState(OFFICES[0]);
  const [job, setJob] = useState(JOB_TITLES[0]);
  const [status, setStatus] = useState(STATUSES[0]);
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [localList, setLocalList] = useState(EMPLOYEES);

  const filtered = useMemo(() => {
    return localList.filter((e) => {
      if (search && !e.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (office !== OFFICES[0] && e.office !== office) return false;
      if (job !== JOB_TITLES[0] && e.title !== job) return false;
      if (status !== STATUSES[0] && e.status !== status) return false;
      return true;
    });
  }, [localList, search, office, job, status]);

  const toggleAll = () => {
    if (selected.length === filtered.length) setSelected([]);
    else setSelected(filtered.map((e) => e.id));
  };
  const toggleOne = (id) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const handleCreate = (data) => {
    const newEmp = {
      id: `E${Math.floor(Math.random() * 9000 + 1000)}`,
      firstName: data.firstName,
      lastName: data.lastName,
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      handle: '@Pristiacandra',
      title: data.title || 'UI UX Designer',
      department: 'Team Product',
      office: 'Unpixel Office',
      status: 'On Boarding',
      account: 'Need Invitation',
      avatar: '',
      joinDate: data.joinDate,
    };
    setLocalList([newEmp, ...localList]);
    setAddOpen(false);
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[30px] font-bold text-foreground">Employees</h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">Manage your Employee</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 h-11 rounded-xl border border-border bg-card px-4 text-[13.5px] font-semibold text-foreground hover:bg-secondary">
            <Download className="h-4 w-4" /> Download
          </button>
          <button onClick={() => setAddOpen(true)} className="inline-flex items-center gap-2 h-11 rounded-xl bg-[hsl(var(--navy))] px-4 text-[13.5px] font-semibold text-white hover:opacity-90">
            <Plus className="h-4 w-4" /> Add New
          </button>
        </div>
      </div>

      {/* Filters */}
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
        <Dropdown label="All Offices" options={OFFICES} value={office} onChange={setOffice} />
        <Dropdown label="All Job Titles" options={JOB_TITLES} value={job} onChange={setJob} />
        <Dropdown label="All Status" options={STATUSES} value={status} onChange={setStatus} />
      </div>

      {/* Table */}
      <div className="mt-5 rounded-2xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-[13px] min-w-[980px]">
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
            {filtered.map((e) => (
              <tr key={e.id} className="hover:bg-secondary/40">
                <td className="p-4">
                  <input type="checkbox" className="h-4 w-4 rounded border-border accent-primary" checked={selected.includes(e.id)} onChange={() => toggleOne(e.id)} />
                </td>
                <td className="p-4">
                  <Link to={`/employees/${e.id}`} className="flex items-center gap-3 group">
                    {e.avatar ? (
                      <img src={e.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 grid place-items-center text-[12px] font-bold">{e.firstName[0]}{e.lastName[0]}</div>
                    )}
                    <div>
                      <div className="font-semibold text-foreground group-hover:text-primary">{e.name}</div>
                      <div className="text-[12px] text-muted-foreground">{e.email}</div>
                    </div>
                  </Link>
                </td>
                <td className="p-4 text-foreground">{e.title}</td>
                <td className="p-4 text-foreground">{e.handle}</td>
                <td className="p-4 text-foreground">{e.department}</td>
                <td className="p-4 text-foreground">{e.office}</td>
                <td className="p-4">
                  <div className="inline-flex items-center gap-1">
                    <StatusBadge status={e.status} />
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                </td>
                <td className="p-4 text-foreground">{e.account}</td>
                <td className="p-4">
                  <div className="flex items-center gap-1.5">
                    <button className="h-8 w-8 grid place-items-center rounded-lg bg-primary text-white hover:opacity-90"><Target className="h-4 w-4" /></button>
                    <button className="h-8 w-1.5 rounded bg-blue-500" />
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={9} className="p-10 text-center text-muted-foreground text-[13px]">No employees match your filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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
