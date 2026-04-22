import React, { useState, useEffect } from 'react';
import { Info, Building2, GitBranch, Briefcase, CalendarDays, Shield, Puzzle, Zap, Lock, Bell, Plus, Pencil, Trash2, ArrowLeft, Check, X, Eye, EyeOff, Loader2, ChevronRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { Toggle } from './settings/common';
import { OfficesTab } from './settings/OfficesTab';
import { DepartmentTab } from './settings/DepartmentTab';
import { JobTitlesTab } from './settings/JobTitlesTab';
import { WorkScheduleTab } from './settings/WorkScheduleTab';

const TENANT_TABS = [
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

const SUPER_TABS = [
  { key: 'platform', label: 'Platform Info', Icon: Info },
  { key: 'password', label: 'Password', Icon: Lock },
  { key: 'notification', label: 'Notification', Icon: Bell },
];

const EMPLOYEE_TABS = [
  { key: 'password', label: 'Password', Icon: Lock },
  { key: 'notification', label: 'Notification', Icon: Bell },
];

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between"><span className="text-muted-foreground">{label}</span><span className="font-semibold text-foreground">{value}</span></div>
);

const CompanyInfoTab = () => {
  const { refreshBranding } = useAuth();
  const [form, setForm] = useState({ name: '', website: '', contact_phone: '', contact_email: '', address: '', logo_url: '', primary_color: '#10B981' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/tenant/branding');
        setForm({
          name: data.name || '', website: data.website || '', contact_phone: data.contact_phone || '',
          contact_email: data.contact_email || '', address: data.address || '',
          logo_url: data.logo_url || '', primary_color: data.primary_color || '#10B981',
        });
      } finally { setLoading(false); }
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await api.patch('/tenant/branding', form);
      await refreshBranding();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      alert(e?.response?.data?.detail || 'Failed to save');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="min-h-[200px] grid place-items-center"><Loader2 className="h-6 w-6 text-primary animate-spin" /></div>;

  return (
    <div>
      <h3 className="text-[18px] font-bold text-foreground">Company Info</h3>
      <p className="mt-1 text-[13px] text-muted-foreground">This info appears on your sidebar, payslips, and reports.</p>
      <div className="mt-5 flex items-center gap-5 p-5 rounded-2xl border border-border bg-background">
        {form.logo_url ? (
          <img src={form.logo_url} alt="" className="h-20 w-20 rounded-2xl object-cover border border-border" />
        ) : (
          <div className="h-20 w-20 rounded-2xl grid place-items-center text-white text-[28px] font-extrabold" style={{ backgroundColor: form.primary_color }}>
            {(form.name[0] || 'C').toUpperCase()}
          </div>
        )}
        <div className="flex-1">
          <div className="text-[13px] font-semibold text-foreground">Logo & Brand</div>
          <div className="text-[12px] text-muted-foreground">Paste a logo URL (square 200×200 recommended).</div>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-[1fr_140px] gap-2">
            <input value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} placeholder="https://…/logo.png" className="h-11 rounded-xl border border-border bg-background px-3 text-[13px]" data-testid="branding-logo-input" />
            <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 h-11">
              <input type="color" value={form.primary_color} onChange={(e) => setForm({ ...form, primary_color: e.target.value })} className="h-7 w-7 rounded-lg cursor-pointer" />
              <input value={form.primary_color} onChange={(e) => setForm({ ...form, primary_color: e.target.value })} className="flex-1 bg-transparent text-[12px] font-mono focus:outline-none" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block"><span className="text-[13px] font-medium text-foreground">Company Name *</span>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2 w-full h-12 rounded-xl border border-border bg-background px-4 text-[14px]" data-testid="company-name-input" />
        </label>
        <label className="block"><span className="text-[13px] font-medium text-foreground">Company Website</span>
          <input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="mt-2 w-full h-12 rounded-xl border border-border bg-background px-4 text-[14px]" />
        </label>
        <label className="block"><span className="text-[13px] font-medium text-foreground">Contact Phone</span>
          <input value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} className="mt-2 w-full h-12 rounded-xl border border-border bg-background px-4 text-[14px]" />
        </label>
        <label className="block"><span className="text-[13px] font-medium text-foreground">Contact Email</span>
          <input value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} className="mt-2 w-full h-12 rounded-xl border border-border bg-background px-4 text-[14px]" />
        </label>
      </div>
      <label className="block mt-4"><span className="text-[13px] font-medium text-foreground">Address</span>
        <textarea rows={3} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="mt-2 w-full rounded-xl border border-border bg-background p-4 text-[13.5px] leading-6" />
      </label>
      <div className="mt-5 flex items-center gap-3">
        <button onClick={save} disabled={saving} className="h-12 rounded-xl bg-[hsl(var(--navy))] text-white px-8 text-[13.5px] font-semibold hover:opacity-90 disabled:opacity-50" data-testid="company-save-btn">
          {saving ? 'Saving…' : 'Save'}
        </button>
        {saved && <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 text-emerald-700 px-4 py-2 text-[13px] font-semibold dark:bg-emerald-950/30 dark:text-emerald-300"><Check className="h-4 w-4" /> Saved — branding updated live.</div>}
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
          <select className="h-11 rounded-xl border border-border bg-background px-4 text-[13.5px] font-semibold flex-1 max-w-[260px]">
            <option>All employees</option><option>Their team only</option><option>Themselves only</option>
          </select>
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
            <div className="inline-flex items-center gap-1 text-primary font-semibold"><Pencil className="h-3.5 w-3.5" /> View & Edit</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MemberList = ({ role }) => {
  const members = [
    { id: 1, name: 'Pristia Candra', email: 'lincoln@unpixel.com', initials: 'PC' },
    { id: 2, name: 'Hanna Baptista', email: 'hanna@unpixel.com', initials: 'HB' },
    { id: 3, name: 'Miracle Geidt', email: 'miracle@unpixel.com', initials: 'MG' },
  ];
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
              <div className="h-9 w-9 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center text-[11px] font-bold">{m.initials}</div>
              <div className="font-semibold text-foreground truncate">{m.name}</div>
            </div>
            <div className="text-muted-foreground truncate">{m.email}</div>
            <div className="text-right">
              <button className="h-8 w-8 grid place-items-center rounded-lg bg-rose-500 text-white ml-auto"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PermissionTab = () => {
  const [role, setRole] = useState(null);
  const [subtab, setSubtab] = useState('permission');
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/roles');
        setRoles(data.map((r) => ({
          id: r.id, key: r.key, name: r.name || r.key,
          desc: r.description || '—', isDefault: !!r.system, members: r.users_count || 0,
        })));
      } catch { /* noop */ }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div className="min-h-[200px] grid place-items-center"><Loader2 className="h-6 w-6 text-primary animate-spin" /></div>;

  if (role) {
    const r = roles.find((x) => x.id === role);
    if (!r) return <div className="text-muted-foreground">Role not found.</div>;
    return (
      <div>
        <button onClick={() => setRole(null)} className="inline-flex items-center gap-1 text-[13px] font-semibold text-foreground mb-3"><ArrowLeft className="h-4 w-4" /> Back</button>
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
        <button className="inline-flex items-center gap-1.5 h-10 rounded-xl bg-[hsl(var(--navy))] text-white px-4 text-[12.5px] font-semibold" data-testid="add-role-btn">
          <Plus className="h-4 w-4" /> Add Role
        </button>
      </div>
      <div className="mt-5 space-y-3">
        {roles.map((r) => (
          <button key={r.id} onClick={() => setRole(r.id)} className="w-full text-left rounded-2xl border border-border bg-background p-5 hover:border-primary/40" data-testid={`role-row-${r.id}`}>
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

const IntegrationTab = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(null);

  useEffect(() => {
    (async () => {
      try { const { data } = await api.get('/integrations'); setItems(data); }
      catch { /* noop */ }
      finally { setLoading(false); }
    })();
  }, []);

  const toggle = async (it) => {
    if (!it.available) { alert(`Upgrade plan to unlock ${it.name}`); return; }
    setPending(it.key);
    try {
      const { data } = await api.put(`/integrations/${it.key}`, { enabled: !it.enabled, config: it.config || {} });
      setItems((prev) => prev.map((x) => x.key === it.key ? { ...x, ...data } : x));
    } catch (e) {
      alert(e?.response?.data?.detail || 'Failed to update');
    } finally { setPending(null); }
  };

  if (loading) return <div className="min-h-[200px] grid place-items-center"><Loader2 className="h-6 w-6 text-primary animate-spin" /></div>;

  return (
    <div>
      <h3 className="text-[18px] font-bold text-foreground">Integration</h3>
      <p className="mt-1 text-[13px] text-muted-foreground">Availability depends on your plan.</p>
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((i) => (
          <div key={i.key} className={cn('rounded-2xl border border-border bg-background p-5 flex items-start gap-4', !i.available && 'opacity-70')} data-testid={`integration-${i.key}`}>
            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary grid place-items-center font-bold text-[18px]">{i.name[0]}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="text-[14.5px] font-bold text-foreground">{i.name}</div>
                <span className="text-[10.5px] font-bold uppercase text-muted-foreground">{i.category}</span>
                {!i.available && <span className="text-[10.5px] font-bold uppercase text-amber-700 bg-amber-100 rounded-md px-1.5 py-0.5 dark:bg-amber-900/40 dark:text-amber-300">Upgrade plan</span>}
              </div>
              <div className="text-[12.5px] text-muted-foreground mt-0.5">Available: {i.plans.map((p) => p[0].toUpperCase() + p.slice(1)).join(', ')}</div>
              <button
                onClick={() => toggle(i)}
                disabled={pending === i.key || !i.available}
                className={cn('mt-3 h-9 rounded-lg px-4 text-[12.5px] font-semibold disabled:opacity-50', i.enabled ? 'bg-emerald-500 text-white' : 'border border-border bg-card text-foreground hover:bg-secondary')}
                data-testid={`integration-toggle-${i.key}`}
              >
                {pending === i.key ? '…' : (i.enabled ? 'Connected' : 'Connect')}
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
    <p className="mt-1 text-[13px] text-muted-foreground">Manage your plan and invoices.</p>
    <div className="mt-5 rounded-2xl border border-border bg-primary/5 p-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <span className="inline-flex rounded-md bg-primary text-white px-2 py-0.5 text-[10px] font-bold uppercase">Current Plan</span>
          <div className="mt-2 text-[22px] font-bold text-foreground">Engage — Annual</div>
          <div className="text-[12.5px] text-muted-foreground">US$72.00 / year</div>
        </div>
        <Link to="/billing" className="h-11 rounded-xl bg-[hsl(var(--navy))] text-white px-5 text-[13px] font-semibold grid place-items-center">Manage Plan</Link>
      </div>
    </div>
  </div>
);

const PasswordTab = () => {
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const strength = form.next.length >= 8 ? (/[A-Z]/.test(form.next) && /\d/.test(form.next) ? 'strong' : 'medium') : 'weak';

  const save = (e) => {
    e.preventDefault();
    setError(''); setSaved(false);
    if (!form.current || !form.next || !form.confirm) { setError('Please fill in all three fields.'); return; }
    if (form.next.length < 8) { setError('New password must be at least 8 characters.'); return; }
    if (form.next !== form.confirm) { setError('New password and confirmation do not match.'); return; }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    setForm({ current: '', next: '', confirm: '' });
  };

  return (
    <div className="max-w-lg">
      <h3 className="text-[18px] font-bold text-foreground">Change Password</h3>
      <p className="mt-1 text-[13px] text-muted-foreground">Min 8 chars, mixed case and numbers.</p>
      <form onSubmit={save} className="mt-5 space-y-4" data-testid="password-form">
        {[{ k: 'current', l: 'Current Password' }, { k: 'next', l: 'New Password' }, { k: 'confirm', l: 'Confirm New Password' }].map((f) => (
          <label key={f.k} className="block">
            <span className="text-[13px] font-medium text-foreground">{f.l} *</span>
            <div className="mt-2 relative">
              <input
                type={show[f.k] ? 'text' : 'password'}
                value={form[f.k]}
                onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}
                className="w-full h-12 rounded-xl border border-border bg-background px-4 pr-11 text-[14px]"
                data-testid={`password-${f.k}-input`}
              />
              <button type="button" onClick={() => setShow({ ...show, [f.k]: !show[f.k] })} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {show[f.k] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>
        ))}
        {form.next && (
          <div className="flex items-center gap-2 text-[12px]">
            <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
              <div className={cn('h-full rounded-full', strength === 'weak' ? 'bg-rose-500 w-1/3' : strength === 'medium' ? 'bg-amber-500 w-2/3' : 'bg-emerald-500 w-full')} />
            </div>
            <span className={cn('font-semibold capitalize', strength === 'weak' ? 'text-rose-500' : strength === 'medium' ? 'text-amber-500' : 'text-emerald-600')}>{strength}</span>
          </div>
        )}
        {error && (
          <div role="alert" className="inline-flex items-center gap-2 rounded-xl bg-rose-50 text-rose-700 px-4 py-2 text-[13px] font-semibold dark:bg-rose-950/30 dark:text-rose-300" data-testid="password-error">
            <X className="h-4 w-4" /> {error}
          </div>
        )}
        <button type="submit" className="h-12 rounded-xl bg-[hsl(var(--navy))] text-white px-8 text-[13.5px] font-semibold block" data-testid="password-save-btn">Update Password</button>
        {saved && <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 text-emerald-700 px-4 py-2 text-[13px] font-semibold dark:bg-emerald-950/30 dark:text-emerald-300" data-testid="password-success"><Check className="h-4 w-4" /> Password updated successfully.</div>}
      </form>
    </div>
  );
};

const NotificationTab = () => {
  const [prefs, setPrefs] = useState([
    { key: 'email-digest', label: 'Email digest', desc: 'Weekly summary of activity.', email: true, push: false },
    { key: 'timeoff', label: 'Time-off requests', desc: 'Approvals, denials, new requests.', email: true, push: true },
    { key: 'newhires', label: 'New hires', desc: 'When someone joins.', email: true, push: true },
    { key: 'perf', label: 'Performance reviews', desc: 'Review cycles.', email: false, push: true },
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

const PlatformInfoTab = () => {
  const { user } = useAuth();
  return (
    <div>
      <h3 className="text-[18px] font-bold text-foreground">Platform Info</h3>
      <p className="mt-1 text-[13px] text-muted-foreground">You're signed in as the platform owner. Tenants manage their own company info.</p>
      <div className="mt-5 rounded-2xl border border-border bg-background p-5 grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-[13px]">
        <InfoRow label="Name" value={user?.name || '—'} />
        <InfoRow label="Email" value={user?.email || '—'} />
        <InfoRow label="Role" value="Super Admin" />
        <InfoRow label="User ID" value={user?.id || '—'} />
      </div>
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
        <Link to="/tenants" className="rounded-2xl border border-border bg-background p-5 hover:border-primary/40"><div className="text-[13px] font-semibold text-foreground">Manage Tenants</div><div className="mt-1 text-[12px] text-muted-foreground">Create, suspend, or upgrade tenants.</div></Link>
        <Link to="/platform/payments" className="rounded-2xl border border-border bg-background p-5 hover:border-primary/40"><div className="text-[13px] font-semibold text-foreground">Payment Providers</div><div className="mt-1 text-[12px] text-muted-foreground">Configure Stripe and Razorpay.</div></Link>
        <Link to="/platform/impersonate" className="rounded-2xl border border-border bg-background p-5 hover:border-primary/40"><div className="text-[13px] font-semibold text-foreground">Impersonate Users</div><div className="mt-1 text-[12px] text-muted-foreground">Sign in as any tenant admin.</div></Link>
      </div>
    </div>
  );
};

const SettingsPage = () => {
  const { user } = useAuth();
  const role = user?.role;
  const tabs = role === 'super_admin' ? SUPER_TABS : role === 'employee' ? EMPLOYEE_TABS : TENANT_TABS;
  const [tab, setTab] = useState(tabs[0]?.key);

  useEffect(() => { setTab(tabs[0]?.key); }, [role]); // eslint-disable-line

  return (
    <div>
      <h1 className="text-[26px] sm:text-[30px] font-bold text-foreground">Settings</h1>
      <p className="mt-1 text-[13.5px] text-muted-foreground">
        {role === 'super_admin' ? 'Platform-level preferences.' : 'Manage your workspace here.'}
      </p>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5">
        <nav className="rounded-2xl border border-border bg-card p-3 self-start" data-testid="settings-sidebar">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn('w-full flex items-center gap-3 text-left rounded-xl px-3 py-3 text-[13.5px] font-semibold mb-1 last:mb-0', tab === t.key ? 'bg-primary/10 text-primary border border-primary/20' : 'text-foreground hover:bg-secondary')}
              data-testid={`settings-tab-${t.key}`}
            >
              <t.Icon className="h-[18px] w-[18px]" /> {t.label}
            </button>
          ))}
        </nav>

        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 lg:p-8 min-h-[480px]">
          {tab === 'platform' && <PlatformInfoTab />}
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
