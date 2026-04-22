import React, { useState } from 'react';
import { Search, BookOpen, MessageCircle, LifeBuoy, ChevronRight, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

const ARTICLES = [
  { c: 'Getting Started', t: 'Set up your HR workspace', time: '4 min read' },
  { c: 'Employees', t: 'Invite employees & manage roles', time: '3 min read' },
  { c: 'Payroll', t: 'Run your first payroll cycle', time: '8 min read' },
  { c: 'Time Off', t: 'Configure leave policies', time: '5 min read' },
  { c: 'Performance', t: 'Run a quarterly review cycle', time: '6 min read' },
  { c: 'Recruitment', t: 'Publish a job posting', time: '4 min read' },
];

const FAQS = [
  { q: 'How do I add a new employee?', a: 'Go to Employees → Add New, fill in the basic profile and click Create. An invitation email will be sent to them.' },
  { q: 'Can I customize permissions per role?', a: 'Yes — visit Roles & Permissions. You can create custom roles with granular permission toggles grouped by module.' },
  { q: 'How does payroll work for multiple countries?', a: 'You can set country-specific pay components. Visit Settings → Payroll to configure local tax and statutory contributions.' },
  { q: 'Is data exported automatically?', a: 'We keep rolling exports. You can also trigger manual CSV exports from the Download button on most pages.' },
];

export const HelpCenterPage = () => {
  const [q, setQ] = useState('');
  const [expanded, setExpanded] = useState(null);
  const filtered = ARTICLES.filter((a) => a.t.toLowerCase().includes(q.toLowerCase()) || a.c.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <div className="rounded-3xl bg-primary/10 dark:bg-primary/15 p-10 text-center">
        <h1 className="text-[34px] font-bold text-foreground">How can we help you?</h1>
        <p className="mt-2 text-[14px] text-muted-foreground">Search articles, tutorials, and common questions.</p>
        <div className="mt-5 max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search help articles…" className="w-full h-14 rounded-2xl border border-border bg-card pl-12 pr-4 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { Icon: BookOpen, t: 'Documentation', d: 'Browse full product docs', color: 'text-primary bg-primary/10' },
          { Icon: MessageCircle, t: 'Chat with us', d: 'Average reply in under 5 min', color: 'text-sky-600 bg-sky-500/10' },
          { Icon: LifeBuoy, t: 'Contact support', d: 'support@hrdashboard.com', color: 'text-amber-600 bg-amber-500/10' },
        ].map((s) => (
          <div key={s.t} className="rounded-2xl border border-border bg-card p-5 flex items-start gap-4">
            <div className={cn('h-11 w-11 rounded-xl grid place-items-center', s.color)}><s.Icon className="h-5 w-5" /></div>
            <div className="min-w-0">
              <div className="text-[14px] font-bold text-foreground">{s.t}</div>
              <div className="text-[12.5px] text-muted-foreground">{s.d}</div>
              <button className="mt-2 inline-flex items-center gap-1 text-[12.5px] font-semibold text-primary">Learn more <ExternalLink className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-[16px] font-bold text-foreground mb-3">Popular articles</h3>
          <div className="divide-y divide-border">
            {filtered.map((a, i) => (
              <button key={i} className="w-full flex items-center justify-between py-3 text-left hover:text-primary">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{a.c}</div>
                  <div className="text-[14px] font-semibold text-foreground">{a.t}</div>
                </div>
                <div className="flex items-center gap-2 text-[12px] text-muted-foreground">{a.time} <ChevronRight className="h-4 w-4" /></div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-[16px] font-bold text-foreground mb-3">FAQ</h3>
          <div className="divide-y divide-border">
            {FAQS.map((f, i) => (
              <div key={i} className="py-3">
                <button onClick={() => setExpanded(expanded === i ? null : i)} className="w-full flex items-center justify-between text-left">
                  <span className="text-[13.5px] font-semibold text-foreground">{f.q}</span>
                  <ChevronRight className={cn('h-4 w-4 text-muted-foreground transition-transform', expanded === i && 'rotate-90')} />
                </button>
                {expanded === i && <div className="mt-2 text-[13px] text-muted-foreground">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const SettingsPage = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [tab, setTab] = useState('Profile');
  const TABS = ['Profile', 'Company', 'Notifications', 'Security', 'Appearance'];
  return (
    <div>
      <h1 className="text-[30px] font-bold text-foreground">Settings</h1>
      <p className="mt-1 text-[13.5px] text-muted-foreground">Configure your HR workspace preferences.</p>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-5">
        <nav className="rounded-2xl border border-border bg-card p-2 self-start">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={cn('w-full text-left rounded-xl px-3 py-2.5 text-[13.5px] font-semibold', tab === t ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-secondary')}>{t}</button>
          ))}
        </nav>

        <div className="rounded-2xl border border-border bg-card p-6">
          {tab === 'Profile' && (
            <div>
              <h3 className="text-[17px] font-bold text-foreground">Profile</h3>
              <div className="mt-5 flex items-center gap-4">
                <img src={user?.avatar} alt="" className="h-16 w-16 rounded-full object-cover" />
                <div>
                  <div className="text-[14px] font-bold text-foreground">{user?.name}</div>
                  <div className="text-[12.5px] text-muted-foreground">{user?.email}</div>
                </div>
                <button className="ml-auto h-10 rounded-lg border border-border bg-card hover:bg-secondary px-4 text-[12.5px] font-semibold">Change photo</button>
              </div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block"><span className="text-[13px] font-medium text-foreground">Display Name</span><input defaultValue={user?.name} className="mt-2 w-full h-11 rounded-xl border border-border bg-background px-4 text-[14px]" /></label>
                <label className="block"><span className="text-[13px] font-medium text-foreground">Email</span><input defaultValue={user?.email} className="mt-2 w-full h-11 rounded-xl border border-border bg-background px-4 text-[14px]" /></label>
                <label className="block"><span className="text-[13px] font-medium text-foreground">Title</span><input defaultValue={user?.title} className="mt-2 w-full h-11 rounded-xl border border-border bg-background px-4 text-[14px]" /></label>
                <label className="block"><span className="text-[13px] font-medium text-foreground">Timezone</span><select className="mt-2 w-full h-11 rounded-xl border border-border bg-background px-4 text-[14px]"><option>GMT +07:00</option><option>GMT +08:00</option><option>GMT -05:00</option></select></label>
              </div>
              <button className="mt-5 h-11 rounded-xl bg-primary text-white px-5 text-[13.5px] font-semibold hover:bg-primary/90">Save changes</button>
            </div>
          )}

          {tab === 'Company' && (
            <div>
              <h3 className="text-[17px] font-bold text-foreground">Company</h3>
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block"><span className="text-[13px] font-medium text-foreground">Company Name</span><input defaultValue={user?.tenant_name || 'Acme Corp'} className="mt-2 w-full h-11 rounded-xl border border-border bg-background px-4 text-[14px]" /></label>
                <label className="block"><span className="text-[13px] font-medium text-foreground">Domain</span><input defaultValue="acme" className="mt-2 w-full h-11 rounded-xl border border-border bg-background px-4 text-[14px]" /></label>
                <label className="block"><span className="text-[13px] font-medium text-foreground">Industry</span><input defaultValue="Technology" className="mt-2 w-full h-11 rounded-xl border border-border bg-background px-4 text-[14px]" /></label>
                <label className="block"><span className="text-[13px] font-medium text-foreground">Size</span><select className="mt-2 w-full h-11 rounded-xl border border-border bg-background px-4 text-[14px]"><option>11-50</option><option>51-100</option><option>101-500</option></select></label>
              </div>
            </div>
          )}

          {tab === 'Notifications' && (
            <div>
              <h3 className="text-[17px] font-bold text-foreground">Notifications</h3>
              <div className="mt-5 space-y-4">
                {['Email digest', 'Time-off requests', 'New hires', 'Performance reviews', 'Payroll runs'].map((n, i) => (
                  <label key={n} className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
                    <div>
                      <div className="text-[13.5px] font-semibold text-foreground">{n}</div>
                      <div className="text-[12px] text-muted-foreground">Receive emails for {n.toLowerCase()} events.</div>
                    </div>
                    <input defaultChecked={i < 3} type="checkbox" className="h-5 w-5 rounded border-border accent-primary" />
                  </label>
                ))}
              </div>
            </div>
          )}

          {tab === 'Security' && (
            <div>
              <h3 className="text-[17px] font-bold text-foreground">Security</h3>
              <div className="mt-5 space-y-4">
                <div className="rounded-xl border border-border p-4">
                  <div className="text-[13.5px] font-semibold text-foreground">Two-Factor Authentication</div>
                  <div className="text-[12.5px] text-muted-foreground">Add an extra layer of security to your account.</div>
                  <button className="mt-3 h-10 rounded-lg border border-border bg-card hover:bg-secondary px-4 text-[12.5px] font-semibold">Enable 2FA</button>
                </div>
                <div className="rounded-xl border border-border p-4">
                  <div className="text-[13.5px] font-semibold text-foreground">Active Sessions</div>
                  <div className="text-[12.5px] text-muted-foreground">Chrome on Mac — Active now</div>
                  <button className="mt-3 h-10 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 px-4 text-[12.5px] font-semibold dark:bg-rose-950/30 dark:border-rose-900/50">Sign out all sessions</button>
                </div>
              </div>
            </div>
          )}

          {tab === 'Appearance' && (
            <div>
              <h3 className="text-[17px] font-bold text-foreground">Appearance</h3>
              <p className="mt-2 text-[13px] text-muted-foreground">Choose how HRDashboard looks to you.</p>
              <div className="mt-5 grid grid-cols-2 gap-4">
                {[{ k: 'light', l: 'Light' }, { k: 'dark', l: 'Dark' }].map((m) => (
                  <button key={m.k} onClick={() => setTheme(m.k)} className={cn('rounded-2xl border p-4 text-left transition-colors', theme === m.k ? 'border-primary bg-primary/5' : 'border-border hover:bg-secondary')}>
                    <div className={cn('h-24 rounded-xl border border-border', m.k === 'dark' ? 'bg-slate-900' : 'bg-white')} />
                    <div className="mt-2 text-[13.5px] font-semibold text-foreground">{m.l}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const ReportsPage = () => (
  <div>
    <h1 className="text-[30px] font-bold text-foreground">Platform Reports</h1>
    <p className="mt-1 text-[13.5px] text-muted-foreground">Cross-tenant analytics and insights.</p>
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { l: 'Active Tenants', v: '3', cls: 'text-primary' },
        { l: 'Monthly Recurring Revenue', v: '$14.6k', cls: 'text-foreground' },
        { l: 'Churn Rate (30d)', v: '1.4%', cls: 'text-foreground' },
      ].map((s) => (
        <div key={s.l} className="rounded-2xl border border-border bg-card p-5">
          <div className="text-[12px] text-muted-foreground">{s.l}</div>
          <div className={cn('mt-2 text-[28px] font-bold', s.cls)}>{s.v}</div>
        </div>
      ))}
    </div>
    <div className="mt-6 rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
      More detailed platform analytics coming with your next milestone.
    </div>
  </div>
);
