import React, { useState } from 'react';
import { Info, Building2, GitBranch, Briefcase, CalendarDays, Shield, Puzzle, Zap, Lock, Bell, Plus, MoreVertical, Pencil, Trash2, ChevronRight, ArrowLeft, Check, X, Search, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

const TABS = [
  { key: 'company', label: 'Company Info', Icon: Info },
  { key: 'offices', label: 'Offices', Icon: Building2 },
  { key: 'department', label: 'Department', Icon: GitBranch },
  { key: 'jobtitles', label: 'Job Titles', Icon: Briefcase },
  { key: 'schedule', label: 'Work Schedule', Icon: CalendarDays },
  { key: 'permission', label: 'Permission', Icon: Shield },
  { key: 'integration', label: 'Integration', Icon: Puzzle },
  { key: 'subscription', label: 'Subscription', Icon: Zap },
  { key: 'password', label: 'Password', Icon: Lock },
  { key: 'notification', label: 'Notification', Icon: Bell },
];

const Toggle = ({ value, onChange }) => (
  <button
    onClick={() => onChange(!value)}
    className={cn('relative h-6 w-11 rounded-full transition-colors', value ? 'bg-primary' : 'bg-secondary')}
    data-testid="toggle-btn"
  >
    <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform grid place-items-center', value ? 'left-[22px]' : 'left-0.5')}>
      {value && <Check className="h-3 w-3 text-primary" />}
    </span>
  </button>
);

const CompanyInfoTab = () => {
  const [form, setForm] = useState({
    name: 'Unpixel Studio',
    website: 'www.unpixel.co',
    phoneCode: '+62',
    phone: '83843578300',
    email: 'contact@unpixel.com',
    overview: 'Unpixel Studio could be a creative agency that offers a range of services such as branding, graphic design, web development, and digital marketing. With a team of talented and experienced designers, developers, and marketers, Dummy Studio would work closely with clients to develop unique and effective solutions to their branding and marketing needs.',
  });
  return (
    <div>
      <h3 className="text-[18px] font-bold text-foreground">Company Info</h3>
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-[13px] font-medium text-foreground">Company Name <span className="text-rose-500">*</span></span>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2 w-full h-12 rounded-xl border border-border bg-background px-4 text-[14px]" data-testid="company-name-input" />
        </label>
        <label className="block">
          <span className="text-[13px] font-medium text-foreground">Company Website <span className="text-rose-500">*</span></span>
          <div className="mt-2 relative">
            <input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="w-full h-12 rounded-xl border border-border bg-background px-4 pr-10 text-[14px]" />
            <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
          </div>
        </label>
        <div>
          <span className="text-[13px] font-medium text-foreground">Contact Number <span className="text-rose-500">*</span></span>
          <div className="mt-2 grid grid-cols-[96px_1fr] gap-2">
            <select value={form.phoneCode} onChange={(e) => setForm({ ...form, phoneCode: e.target.value })} className="h-12 rounded-xl border border-border bg-background px-3 text-[14px]">
              <option>+62</option><option>+1</option><option>+65</option><option>+91</option>
            </select>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="h-12 rounded-xl border border-border bg-background px-4 text-[14px]" />
          </div>
        </div>
        <label className="block">
          <span className="text-[13px] font-medium text-foreground">Contact Email <span className="text-rose-500">*</span></span>
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-2 w-full h-12 rounded-xl border border-border bg-background px-4 text-[14px]" />
        </label>
      </div>
      <label className="block mt-4">
        <span className="text-[13px] font-medium text-foreground">Company Overview</span>
        <textarea rows={5} value={form.overview} onChange={(e) => setForm({ ...form, overview: e.target.value })} className="mt-2 w-full rounded-xl border border-border bg-background p-4 text-[13.5px] leading-6" />
      </label>
      <button className="mt-5 h-12 rounded-xl bg-[hsl(var(--navy))] text-white px-8 text-[13.5px] font-semibold hover:opacity-90" data-testid="company-save-btn">Save</button>
    </div>
  );
};

const OfficesTab = () => {
  const [offices, setOffices] = useState([
    { id: 1, name: 'Unpixel Studio Jakarta', country: 'Indonesia', hq: true, active: true, employees: 50, timezone: 'GMT +07:00 Bangkok, Ha Noi, Jakarta', phone: '+6283838587171', email: 'hello@unpixel.com' },
    { id: 2, name: 'Unpixel Studio Semarang', country: 'Indonesia', hq: false, active: false, employees: 10, timezone: 'GMT +07:00 Bangkok, Ha Noi, Jakarta', phone: '+6283843578300', email: 'hello@unpixel.com' },
  ]);

  const toggleActive = (id) => setOffices(offices.map((o) => o.id === id ? { ...o, active: !o.active } : o));

  return (
    <div>
      <div className="flex items-start justify-between">
        <h3 className="text-[18px] font-bold text-foreground">Offices</h3>
        <button className="inline-flex items-center gap-1.5 h-10 rounded-xl bg-[hsl(var(--navy))] text-white px-4 text-[12.5px] font-semibold hover:opacity-90">
          <Plus className="h-4 w-4" /> Add Office
        </button>
      </div>
      <div className="mt-5 space-y-4">
        {offices.map((o) => (
          <div key={o.id} className="rounded-2xl border border-border bg-background p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="text-[15px] font-bold text-foreground">{o.name}</div>
                  {o.hq && <span className="inline-flex rounded-md bg-primary px-2 py-0.5 text-[10px] font-bold text-white">HQ</span>}
                </div>
                <div className="mt-0.5 text-[12.5px] text-muted-foreground">{o.country}</div>
              </div>
              <div className="flex items-center gap-2">
                <Toggle value={o.active} onChange={() => toggleActive(o.id)} />
                <button className="h-8 w-8 grid place-items-center rounded-lg hover:bg-secondary text-muted-foreground"><MoreVertical className="h-4 w-4" /></button>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-[13px]">
              <div className="flex justify-between sm:block"><span className="text-muted-foreground">Number Of Employee</span><div className="font-semibold text-foreground sm:mt-0.5">{o.employees}</div></div>
              <div className="flex justify-between sm:block"><span className="text-muted-foreground">Timezone</span><div className="font-semibold text-foreground sm:mt-0.5">{o.timezone}</div></div>
              <div className="flex justify-between sm:block"><span className="text-muted-foreground">Contact Number</span><div className="font-semibold text-foreground sm:mt-0.5">{o.phone}</div></div>
              <div className="flex justify-between sm:block"><span className="text-muted-foreground">Contact Email</span><div className="font-semibold text-foreground sm:mt-0.5">{o.email}</div></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DepartmentTab = () => {
  const DEPTS = [
    { key: 'root', label: 'Unpixel Office', children: ['HR', 'Management', 'Lead Designer', 'Marketing', 'Lead IT', 'Finance'] },
  ];
  const sub1 = { 'Lead Designer': ['UI UX Design'], 'UI UX Design': ['Graphic Design'], 'Lead IT': ['Android Dev'] };
  const all = [...DEPTS[0].children, ...Object.values(sub1).flat()];
  return (
    <div>
      <h3 className="text-[18px] font-bold text-foreground">Department</h3>
      <div className="mt-6 overflow-x-auto">
        <div className="min-w-[720px] flex flex-col items-center py-6">
          <DeptNode label="Unpixel Office" />
          <div className="h-8 w-px bg-border" />
          <div className="flex gap-4 items-start">
            {DEPTS[0].children.map((c) => (
              <div key={c} className="flex flex-col items-center">
                <div className="w-px h-4 bg-border" />
                <DeptNode label={c} />
                {sub1[c] && (
                  <>
                    <div className="h-6 w-px bg-border" />
                    {sub1[c].map((s) => (
                      <div key={s} className="flex flex-col items-center">
                        <DeptNode label={s} />
                        {sub1[s] && (
                          <>
                            <div className="h-6 w-px bg-border" />
                            {sub1[s].map((g) => <DeptNode key={g} label={g} />)}
                          </>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6 text-[12.5px] text-muted-foreground">Total departments: <span className="font-bold text-foreground">{all.length + 1}</span></div>
    </div>
  );
};

const DeptNode = ({ label }) => (
  <div className="relative group">
    <div className="rounded-xl border border-border bg-card px-5 py-2.5 text-[13px] font-semibold text-foreground shadow-sm min-w-[120px] text-center">
      {label}
    </div>
    <button className="absolute -top-2 -right-2 h-6 w-6 grid place-items-center rounded-full bg-foreground text-background text-[11px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
      <Pencil className="h-3 w-3" />
    </button>
    <button className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-6 w-6 grid place-items-center rounded-full bg-primary text-white">
      <Plus className="h-3 w-3" />
    </button>
  </div>
);

const JobTitlesTab = () => {
  const [titles, setTitles] = useState([
    { id: 1, name: 'UI UX Designer', count: 10, active: true },
    { id: 2, name: 'Product Manager', count: 5, active: true },
    { id: 3, name: 'Android Developer', count: 8, active: true },
    { id: 4, name: 'Marketing Lead', count: 3, active: false },
  ]);
  const toggle = (id) => setTitles(titles.map((t) => t.id === id ? { ...t, active: !t.active } : t));
  const remove = (id) => setTitles(titles.filter((t) => t.id !== id));
  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h3 className="text-[18px] font-bold text-foreground">Job Titles</h3>
        <div className="flex items-center gap-3">
          <div className="relative w-64 hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input placeholder="Search job title" className="w-full h-10 rounded-xl border border-border bg-background pl-9 pr-3 text-[13px]" />
          </div>
          <button className="inline-flex items-center gap-1.5 h-10 rounded-xl bg-[hsl(var(--navy))] text-white px-4 text-[12.5px] font-semibold hover:opacity-90">
            <Plus className="h-4 w-4" /> Add New
          </button>
        </div>
      </div>
      <div className="mt-5 rounded-2xl border border-border bg-background overflow-x-auto">
        <table className="w-full text-[13px] min-w-[560px]">
          <thead className="border-b border-border bg-secondary/30">
            <tr className="text-left text-muted-foreground">
              <th className="p-4 font-semibold">Job Title</th>
              <th className="p-4 font-semibold">Number of Employees</th>
              <th className="p-4 font-semibold">Active</th>
              <th className="p-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {titles.map((t) => (
              <tr key={t.id} className="hover:bg-secondary/30">
                <td className="p-4 font-semibold text-foreground">{t.name}</td>
                <td className="p-4 text-foreground">{t.count}</td>
                <td className="p-4"><Toggle value={t.active} onChange={() => toggle(t.id)} /></td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button className="h-8 w-8 grid place-items-center rounded-lg bg-sky-500 text-white hover:bg-sky-600"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => remove(t.id)} className="h-8 w-8 grid place-items-center rounded-lg bg-rose-500 text-white hover:bg-rose-600"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const WorkScheduleTab = () => {
  const [schedules, setSchedules] = useState([
    { id: 1, name: 'Mon-Fri, Duration 40 hours/week', isDefault: true, active: true, standard: '8h 00m', effective: '01 Jan 2023', type: 'Duration-based', total: '40h 00m', days: { Mon: '8h 00m', Tue: '8h 00m', Wed: '8h 00m', Thu: '8h 00m', Fri: '8h 00m' } },
    { id: 2, name: 'Mon-Fri, Duration 35 hours/week', isDefault: false, active: false, standard: '7h 00m', effective: '01 Jan 2023', type: 'Duration-based', total: '35h 00m', days: { Mon: '7h', Tue: '7h', Wed: '7h', Thu: '7h', Fri: '7h' } },
  ]);
  const [expanded, setExpanded] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const toggle = (id) => setSchedules(schedules.map((s) => s.id === id ? { ...s, active: !s.active } : s));

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h3 className="text-[18px] font-bold text-foreground">Work Schedule</h3>
        <div className="flex items-center gap-3">
          <div className="relative w-64 hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input placeholder="Search job title" className="w-full h-10 rounded-xl border border-border bg-background pl-9 pr-3 text-[13px]" />
          </div>
          <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-1.5 h-10 rounded-xl bg-[hsl(var(--navy))] text-white px-4 text-[12.5px] font-semibold hover:opacity-90" data-testid="add-schedule-btn">
            <Plus className="h-4 w-4" /> Add New
          </button>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {schedules.map((s) => (
          <div key={s.id} className="rounded-2xl border border-border bg-background overflow-hidden">
            <button onClick={() => setExpanded(expanded === s.id ? null : s.id)} className="w-full flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-bold text-foreground">{s.name}</span>
                {s.isDefault && <span className="inline-flex rounded-md bg-secondary px-2 py-0.5 text-[9.5px] font-bold uppercase text-muted-foreground">Default</span>}
              </div>
              <div className="flex items-center gap-2">
                <Toggle value={s.active} onChange={() => toggle(s.id)} />
                <ChevronRight className={cn('h-5 w-5 text-muted-foreground transition-transform', expanded === s.id && 'rotate-90')} />
              </div>
            </button>
            {expanded === s.id && (
              <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-4 text-[13px]">
                <div className="space-y-2">
                  <InfoRow label="Standard working hours/day" value={s.standard} />
                  <InfoRow label="Effective from" value={s.effective} />
                  <InfoRow label="Schedule type" value={s.type} />
                  <InfoRow label="Total working hours/week" value={s.total} />
                </div>
                <div>
                  <div className="text-muted-foreground mb-2">Daily working hours</div>
                  <div className="space-y-1">
                    {Object.entries(s.days).map(([d, v]) => (
                      <div key={d} className="flex justify-between"><span className="text-muted-foreground">{d === 'Mon' ? 'Monday' : d === 'Tue' ? 'Tuesday' : d === 'Wed' ? 'Wednesday' : d === 'Thu' ? 'Thursday' : 'Friday'}</span><span className="font-semibold text-foreground">{v}</span></div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && <AddScheduleModal onClose={() => setShowModal(false)} onAdd={(s) => { setSchedules([...schedules, { ...s, id: Date.now() }]); setShowModal(false); }} />}
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between"><span className="text-muted-foreground">{label}</span><span className="font-semibold text-foreground">{value}</span></div>
);

const AddScheduleModal = ({ onClose, onAdd }) => {
  const [name, setName] = useState('Remote Work');
  const [effective, setEffective] = useState('2023-03-09');
  const [hours, setHours] = useState('8h 00m');
  const [type, setType] = useState('duration');
  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [days, setDays] = useState(DAYS.map((d) => ({ day: d, on: ['Saturday', 'Sunday'].indexOf(d) === -1, time: '8h 00' })));
  const total = days.filter((d) => d.on).reduce((s) => s + 8, 0);

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="ml-auto relative w-full max-w-lg bg-card h-full overflow-y-auto shadow-2xl" data-testid="add-schedule-modal">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="text-[20px] font-bold text-foreground">Add New Work Schedule</h3>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-secondary"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-6 space-y-4">
          <label className="block"><span className="text-[13px] font-medium text-foreground">Schedule Name <span className="text-rose-500">*</span></span>
            <input value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full h-12 rounded-xl border border-border bg-background px-4 text-[14px]" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block"><span className="text-[13px] font-medium text-foreground">Effective from <span className="text-rose-500">*</span></span>
              <input type="date" value={effective} onChange={(e) => setEffective(e.target.value)} className="mt-2 w-full h-12 rounded-xl border border-border bg-background px-4 text-[14px]" />
            </label>
            <label className="block"><span className="text-[13px] font-medium text-foreground">Standard working hours/day</span>
              <input value={hours} onChange={(e) => setHours(e.target.value)} className="mt-2 w-full h-12 rounded-xl border border-border bg-background px-4 text-[14px]" />
            </label>
          </div>
          <div>
            <div className="text-[13px] font-semibold text-foreground mb-2">Schedule type</div>
            <div className="grid grid-cols-2 gap-3">
              {[{ k: 'duration', l: 'Duration-based', d: 'Schedule based on a duration without a start and end time.' }, { k: 'clock', l: 'Clock-based', d: 'Schedule with a fixed start and end time.' }].map((t) => (
                <button key={t.k} onClick={() => setType(t.k)} className={cn('text-left rounded-xl border-2 p-3', type === t.k ? 'border-primary bg-primary/5' : 'border-border')}>
                  <div className="flex items-center justify-between">
                    <div className="text-[13px] font-bold text-foreground">{t.l}</div>
                    <span className={cn('h-4 w-4 rounded-full border-2 grid place-items-center', type === t.k ? 'border-primary' : 'border-border')}>{type === t.k && <span className="h-2 w-2 rounded-full bg-primary" />}</span>
                  </div>
                  <div className="mt-1 text-[11px] text-muted-foreground">{t.d}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[13px] font-semibold text-foreground mb-2">Working Time</div>
            <div className="space-y-2">
              {days.map((d, i) => (
                <div key={d.day} className="flex items-center gap-3">
                  <button onClick={() => setDays(days.map((x, j) => j === i ? { ...x, on: !x.on } : x))} className="flex items-center gap-2 w-32">
                    <Toggle value={d.on} onChange={() => {}} />
                    <span className="text-[13px] font-semibold text-foreground">{d.day}</span>
                  </button>
                  <input value={d.time} onChange={(e) => setDays(days.map((x, j) => j === i ? { ...x, time: e.target.value } : x))} disabled={!d.on} className="flex-1 h-11 rounded-xl border border-border bg-background px-3 text-[13px] disabled:opacity-50" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-border flex items-center justify-between sticky bottom-0 bg-card">
          <div className="text-[12.5px] text-muted-foreground">Total Working Time : <span className="font-bold text-primary">{total}h 00m</span></div>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="h-11 rounded-xl border border-border bg-card px-5 text-[13px] font-semibold hover:bg-secondary">Cancel</button>
            <button onClick={() => onAdd({ name, standard: hours, effective, type: type === 'duration' ? 'Duration-based' : 'Clock-based', total: `${total}h 00m`, days: {}, active: true })} className="h-11 rounded-xl bg-[hsl(var(--navy))] text-white px-5 text-[13px] font-semibold">Create</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PermissionTab = () => {
  const [role, setRole] = useState(null);
  const [subtab, setSubtab] = useState('permission');
  const roles = [
    { id: 'admin', name: 'Admin', isDefault: true, desc: 'Admin can see all fields, edit all fields, and do everything the system offers.', members: 5 },
    { id: 'manager', name: 'Manager', isDefault: false, desc: 'Manager can view team data and approve requests.', members: 12 },
    { id: 'employee', name: 'Employee', isDefault: true, desc: 'Default role for all employees.', members: 48 },
  ];

  if (role) {
    const r = roles.find((x) => x.id === role);
    return (
      <div>
        <button onClick={() => setRole(null)} className="inline-flex items-center gap-1 text-[13px] font-semibold text-foreground hover:text-primary mb-3"><ArrowLeft className="h-4 w-4" /> Back</button>
        <div className="flex items-center gap-2">
          <h3 className="text-[18px] font-bold text-foreground">{r.name}</h3>
          {r.isDefault && <span className="inline-flex rounded-md bg-secondary px-2 py-0.5 text-[9.5px] font-bold uppercase text-muted-foreground">Default</span>}
        </div>
        <p className="mt-1 text-[13px] text-muted-foreground">{r.desc}</p>
        <div className="mt-5 flex items-center gap-6 border-b border-border">
          {['permission', 'member'].map((t) => (
            <button key={t} onClick={() => setSubtab(t)} className={cn('relative pb-3 text-[13px] font-semibold capitalize', subtab === t ? 'text-primary' : 'text-muted-foreground')}>
              {t}
              {subtab === t && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-primary" />}
            </button>
          ))}
        </div>
        {subtab === 'permission' ? <PermissionSettings /> : <MemberList role={r} />}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-[18px] font-bold text-foreground">Permission</h3>
        <button className="inline-flex items-center gap-1.5 h-10 rounded-xl bg-[hsl(var(--navy))] text-white px-4 text-[12.5px] font-semibold hover:opacity-90">
          <Plus className="h-4 w-4" /> Add Role
        </button>
      </div>
      <div className="mt-5 space-y-3">
        {roles.map((r) => (
          <button key={r.id} onClick={() => setRole(r.id)} className="w-full text-left rounded-2xl border border-border bg-background p-5 hover:border-primary/40 transition-colors" data-testid={`role-row-${r.id}`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <div className="text-[15px] font-bold text-foreground">{r.name}</div>
                  {r.isDefault && <span className="inline-flex rounded-md bg-secondary px-2 py-0.5 text-[9.5px] font-bold uppercase text-muted-foreground">Default</span>}
                </div>
                <div className="mt-1 text-[12.5px] text-muted-foreground">{r.desc}</div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right hidden sm:block">
                  <div className="text-[11px] text-muted-foreground">Members</div>
                  <div className="text-[14px] font-bold text-foreground">{r.members}</div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const PermissionSettings = () => {
  const SECTIONS = ['Profile Picture', 'Personal Info', 'Address', 'Emergency Contact', 'Offboarding Details', 'Bank Info', 'Job Information', 'Work Schedule'];
  return (
    <div className="mt-5">
      <div className="rounded-2xl border border-border bg-background p-5">
        <div className="text-[14px] font-semibold text-foreground">Users with this role can access the information of</div>
        <div className="mt-3 flex items-center gap-3">
          <select className="h-11 rounded-xl border border-border bg-background px-4 text-[13.5px] font-semibold flex-1 max-w-[260px]"><option>All employees</option><option>Their team only</option><option>Themselves only</option></select>
          <span className="h-9 w-9 grid place-items-center rounded-full bg-amber-100 text-amber-600"><Lock className="h-4 w-4" /></span>
        </div>
      </div>
      <div className="mt-5 rounded-2xl border border-border bg-background overflow-hidden">
        <div className="grid grid-cols-[1fr_180px] px-5 py-3 bg-secondary/30 text-[12.5px] font-semibold text-muted-foreground border-b border-border">
          <div>Section</div><div>Permission</div>
        </div>
        {SECTIONS.map((s) => (
          <div key={s} className="grid grid-cols-[1fr_180px] px-5 py-3 text-[13.5px] border-b border-border last:border-0">
            <div className="font-semibold text-foreground">{s}</div>
            <div className="inline-flex items-center gap-1 text-primary font-semibold">
              <Pencil className="h-3.5 w-3.5" /> View & Edit
              <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground rotate-90" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MemberList = ({ role }) => {
  const [members, setMembers] = useState([
    { id: 1, name: 'Pristia Candra', email: 'lincoln@unpixel.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face' },
    { id: 2, name: 'Hanna Baptista', email: 'hanna@unpixel.com', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face' },
    { id: 3, name: 'Miracle Geidt', email: 'miracle@unpixel.com', avatar: null, initials: 'MG' },
    { id: 4, name: 'Rayna Torff', email: 'rayna@unpixel.com', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face' },
    { id: 5, name: 'Giana Lipshutz', email: 'giana@unpixel.com', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face' },
  ]);
  return (
    <div className="mt-5">
      <div className="rounded-2xl border border-border bg-background p-5">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="text-[14px] font-semibold text-foreground">Add {role.name} Member</div>
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input placeholder="Search Member" className="w-full h-11 rounded-xl border border-border bg-background pl-9 pr-3 text-[13px]" />
          </div>
        </div>
      </div>
      <div className="mt-5 rounded-2xl border border-border bg-background overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_80px] px-5 py-3 bg-secondary/30 text-[12.5px] font-semibold text-muted-foreground border-b border-border">
          <div>Member</div><div>Email</div><div className="text-right">Action</div>
        </div>
        {members.map((m) => (
          <div key={m.id} className="grid grid-cols-[1fr_1fr_80px] px-5 py-3 items-center text-[13px] border-b border-border last:border-0">
            <div className="flex items-center gap-3">
              {m.avatar ? <img src={m.avatar} alt="" className="h-9 w-9 rounded-full object-cover" /> : <div className="h-9 w-9 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center text-[11px] font-bold">{m.initials}</div>}
              <div className="font-semibold text-foreground truncate">{m.name}</div>
            </div>
            <div className="text-muted-foreground truncate">{m.email}</div>
            <div className="text-right">
              <button onClick={() => setMembers(members.filter((x) => x.id !== m.id))} className="h-8 w-8 grid place-items-center rounded-lg bg-rose-500 text-white hover:bg-rose-600 ml-auto"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
        <div className="flex items-center justify-center gap-2 py-4">
          <button className="h-8 w-8 grid place-items-center rounded-lg border border-border bg-card text-muted-foreground"><ChevronRight className="h-4 w-4 rotate-180" /></button>
          <button className="h-8 w-8 grid place-items-center rounded-lg bg-primary text-white text-[12px] font-bold">1</button>
          <button className="h-8 w-8 grid place-items-center rounded-lg border border-border bg-card text-muted-foreground"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>
    </div>
  );
};

const IntegrationTab = () => {
  const INTS = [
    { name: 'Slack', desc: 'Send notifications to Slack channels', connected: true, color: 'bg-purple-500' },
    { name: 'Google Calendar', desc: 'Sync time-off and meetings', connected: true, color: 'bg-sky-500' },
    { name: 'Zapier', desc: '5,000+ apps via automations', connected: false, color: 'bg-orange-500' },
    { name: 'GitHub', desc: 'Sync engineering team members', connected: false, color: 'bg-slate-900' },
    { name: 'Stripe', desc: 'Billing and subscription payments', connected: true, color: 'bg-indigo-600' },
    { name: 'Jira', desc: 'Link performance goals to tickets', connected: false, color: 'bg-blue-600' },
  ];
  return (
    <div>
      <h3 className="text-[18px] font-bold text-foreground">Integration</h3>
      <p className="mt-1 text-[13px] text-muted-foreground">Connect HRDashboard with your favorite tools.</p>
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {INTS.map((i) => (
          <div key={i.name} className="rounded-2xl border border-border bg-background p-5 flex items-start gap-4">
            <div className={cn('h-12 w-12 rounded-xl text-white grid place-items-center font-bold text-[18px]', i.color)}>{i.name[0]}</div>
            <div className="flex-1">
              <div className="text-[14.5px] font-bold text-foreground">{i.name}</div>
              <div className="text-[12.5px] text-muted-foreground">{i.desc}</div>
              <button className={cn('mt-3 h-9 rounded-lg px-4 text-[12.5px] font-semibold', i.connected ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'border border-border bg-card text-foreground hover:bg-secondary')}>
                {i.connected ? 'Connected' : 'Connect'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SubscriptionTab = () => (
  <div>
    <h3 className="text-[18px] font-bold text-foreground">Subscription</h3>
    <p className="mt-1 text-[13px] text-muted-foreground">Manage your plan, billing and invoices.</p>
    <div className="mt-5 rounded-2xl border border-border bg-primary/5 p-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <span className="inline-flex rounded-md bg-primary text-white px-2 py-0.5 text-[10px] font-bold uppercase">Current Plan</span>
          <div className="mt-2 text-[22px] font-bold text-foreground">Engage — Annual</div>
          <div className="text-[12.5px] text-muted-foreground">US$72.00 / year · Next billing 01 Apr 2025</div>
        </div>
        <Link to="/billing" className="h-11 rounded-xl bg-[hsl(var(--navy))] text-white px-5 text-[13px] font-semibold grid place-items-center hover:opacity-90">Manage Plan</Link>
      </div>
    </div>
    <div className="mt-5 rounded-2xl border border-border bg-background p-5">
      <div className="text-[15px] font-bold text-foreground">Recent invoices</div>
      <div className="mt-3 divide-y divide-border">
        {[{ id: 'INV-001', d: '01 Apr 2025', a: '$72.00' }, { id: 'INV-002', d: '01 Apr 2024', a: '$72.00' }].map((i) => (
          <Link key={i.id} to={`/billing/invoice/${i.id}`} className="flex items-center justify-between py-3 hover:bg-secondary/30 px-2 rounded-lg">
            <div><div className="text-[13.5px] font-semibold text-foreground">{i.id}</div><div className="text-[11.5px] text-muted-foreground">{i.d}</div></div>
            <div className="text-[13px] font-semibold text-foreground">{i.a}</div>
            <span className="text-primary text-[12px] font-semibold">View</span>
          </Link>
        ))}
      </div>
    </div>
  </div>
);

const PasswordTab = () => {
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const [saved, setSaved] = useState(false);
  const strength = form.next.length >= 8 ? (/[A-Z]/.test(form.next) && /\d/.test(form.next) ? 'strong' : 'medium') : 'weak';

  const save = (e) => {
    e.preventDefault();
    if (!form.current || !form.next || form.next !== form.confirm) { alert('Please fill all fields and confirm new password.'); return; }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    setForm({ current: '', next: '', confirm: '' });
  };

  return (
    <div className="max-w-lg">
      <h3 className="text-[18px] font-bold text-foreground">Change Password</h3>
      <p className="mt-1 text-[13px] text-muted-foreground">Use a strong password with at least 8 characters, mixed case, and numbers.</p>
      <form onSubmit={save} className="mt-5 space-y-4">
        {[{ k: 'current', l: 'Current Password' }, { k: 'next', l: 'New Password' }, { k: 'confirm', l: 'Confirm New Password' }].map((f) => (
          <label key={f.k} className="block">
            <span className="text-[13px] font-medium text-foreground">{f.l} <span className="text-rose-500">*</span></span>
            <div className="mt-2 relative">
              <input
                type={show[f.k] ? 'text' : 'password'}
                value={form[f.k]}
                onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}
                className="w-full h-12 rounded-xl border border-border bg-background px-4 pr-11 text-[14px]"
                data-testid={`password-${f.k}-input`}
              />
              <button type="button" onClick={() => setShow({ ...show, [f.k]: !show[f.k] })} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {show[f.k] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>
        ))}
        {form.next && (
          <div className="flex items-center gap-2 text-[12px]">
            <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
              <div className={cn('h-full rounded-full transition-all', strength === 'weak' ? 'bg-rose-500 w-1/3' : strength === 'medium' ? 'bg-amber-500 w-2/3' : 'bg-emerald-500 w-full')} />
            </div>
            <span className={cn('font-semibold capitalize', strength === 'weak' ? 'text-rose-500' : strength === 'medium' ? 'text-amber-500' : 'text-emerald-600')}>{strength}</span>
          </div>
        )}
        <button type="submit" className="h-12 rounded-xl bg-[hsl(var(--navy))] text-white px-8 text-[13.5px] font-semibold hover:opacity-90" data-testid="password-save-btn">Update Password</button>
        {saved && <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 text-[13px] font-semibold"><Check className="h-4 w-4" /> Password updated successfully.</div>}
      </form>
    </div>
  );
};

const NotificationTab = () => {
  const [prefs, setPrefs] = useState([
    { key: 'email-digest', label: 'Email digest', desc: 'Weekly summary of activity on your workspace.', email: true, push: false },
    { key: 'timeoff', label: 'Time-off requests', desc: 'Approvals, denials, and new requests.', email: true, push: true },
    { key: 'newhires', label: 'New hires', desc: 'When someone joins your organization.', email: true, push: true },
    { key: 'perf', label: 'Performance reviews', desc: 'Review cycles and goals updates.', email: false, push: true },
    { key: 'payroll', label: 'Payroll runs', desc: 'When payroll is processed.', email: true, push: false },
    { key: 'documents', label: 'Document signatures', desc: 'Pending signatures and completions.', email: false, push: true },
  ]);
  return (
    <div>
      <h3 className="text-[18px] font-bold text-foreground">Notification</h3>
      <p className="mt-1 text-[13px] text-muted-foreground">Choose how you want to be notified.</p>
      <div className="mt-5 rounded-2xl border border-border bg-background overflow-hidden">
        <div className="grid grid-cols-[1fr_90px_90px] px-5 py-3 bg-secondary/30 text-[12.5px] font-semibold text-muted-foreground border-b border-border">
          <div>Category</div><div className="text-center">Email</div><div className="text-center">Push</div>
        </div>
        {prefs.map((p, i) => (
          <div key={p.key} className="grid grid-cols-[1fr_90px_90px] px-5 py-4 items-center border-b border-border last:border-0">
            <div>
              <div className="text-[13.5px] font-semibold text-foreground">{p.label}</div>
              <div className="text-[12px] text-muted-foreground">{p.desc}</div>
            </div>
            <div className="grid place-items-center"><Toggle value={p.email} onChange={(v) => setPrefs(prefs.map((x, j) => j === i ? { ...x, email: v } : x))} /></div>
            <div className="grid place-items-center"><Toggle value={p.push} onChange={(v) => setPrefs(prefs.map((x, j) => j === i ? { ...x, push: v } : x))} /></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SettingsPage = () => {
  const [tab, setTab] = useState('company');

  return (
    <div>
      <h1 className="text-[26px] sm:text-[30px] font-bold text-foreground">Settings</h1>
      <p className="mt-1 text-[13.5px] text-muted-foreground">Manage your dashboard here</p>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5">
        <nav className="rounded-2xl border border-border bg-card p-3 self-start" data-testid="settings-sidebar">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn('w-full flex items-center gap-3 text-left rounded-xl px-3 py-3 text-[13.5px] font-semibold transition-colors mb-1 last:mb-0', tab === t.key ? 'bg-primary/10 text-primary border border-primary/20' : 'text-foreground hover:bg-secondary')}
              data-testid={`settings-tab-${t.key}`}
            >
              <t.Icon className="h-[18px] w-[18px]" /> {t.label}
            </button>
          ))}
        </nav>

        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 lg:p-8 min-h-[480px]">
          {tab === 'company' && <CompanyInfoTab />}
          {tab === 'offices' && <OfficesTab />}
          {tab === 'department' && <DepartmentTab />}
          {tab === 'jobtitles' && <JobTitlesTab />}
          {tab === 'schedule' && <WorkScheduleTab />}
          {tab === 'permission' && <PermissionTab />}
          {tab === 'integration' && <IntegrationTab />}
          {tab === 'subscription' && <SubscriptionTab />}
          {tab === 'password' && <PasswordTab />}
          {tab === 'notification' && <NotificationTab />}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
