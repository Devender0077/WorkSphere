import React, { useState } from 'react';
import { Download, FileText, Plus, CheckCircle2, Clock, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const RUNS = [
  { id: 'PR-2025-04', period: 'April 2025', employees: 42, gross: '$186,420', status: 'Processing', date: '25 Apr 2025' },
  { id: 'PR-2025-03', period: 'March 2025', employees: 40, gross: '$178,290', status: 'Paid', date: '25 Mar 2025' },
  { id: 'PR-2025-02', period: 'February 2025', employees: 39, gross: '$172,110', status: 'Paid', date: '25 Feb 2025' },
  { id: 'PR-2025-01', period: 'January 2025', employees: 38, gross: '$168,900', status: 'Paid', date: '25 Jan 2025' },
];

const SLIPS = [
  { id: 'PS-04-2025', period: 'April 2025', gross: '$4,500', net: '$3,780', status: 'Available', date: '25 Apr 2025' },
  { id: 'PS-03-2025', period: 'March 2025', gross: '$4,500', net: '$3,780', status: 'Available', date: '25 Mar 2025' },
  { id: 'PS-02-2025', period: 'February 2025', gross: '$4,500', net: '$3,780', status: 'Available', date: '25 Feb 2025' },
  { id: 'PS-01-2025', period: 'January 2025', gross: '$4,500', net: '$3,780', status: 'Available', date: '25 Jan 2025' },
];

const STATUS_COLOR = {
  Paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  Processing: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Draft: 'bg-secondary text-muted-foreground',
  Available: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
};

export const PayrollRunsPage = () => {
  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[30px] font-bold text-foreground">Payroll Runs</h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">Process and track every pay period.</p>
        </div>
        <button className="inline-flex items-center gap-2 h-11 rounded-xl bg-[hsl(var(--navy))] px-4 text-[13.5px] font-semibold text-white hover:opacity-90"><Plus className="h-4 w-4" /> New Run</button>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { l: 'This month gross', v: '$186,420', sub: '+4.6%', cls: 'text-foreground' },
          { l: 'Net payroll', v: '$155,360', sub: '42 employees', cls: 'text-foreground' },
          { l: 'Taxes & dues', v: '$31,060', sub: '16.6%', cls: 'text-foreground' },
          { l: 'Next pay date', v: '25 Apr', sub: 'in 3 days', cls: 'text-primary' },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl border border-border bg-card p-5">
            <div className="text-[12px] text-muted-foreground">{s.l}</div>
            <div className={cn('mt-2 text-[24px] font-bold', s.cls)}>{s.v}</div>
            <div className="mt-1 text-[11.5px] text-muted-foreground">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-[13px] min-w-[780px]">
          <thead className="border-b border-border">
            <tr className="text-left text-primary">
              <th className="p-4 font-semibold">Run ID</th>
              <th className="p-4 font-semibold">Period</th>
              <th className="p-4 font-semibold">Employees</th>
              <th className="p-4 font-semibold">Gross</th>
              <th className="p-4 font-semibold">Pay Date</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {RUNS.map((r) => (
              <tr key={r.id} className="hover:bg-secondary/40">
                <td className="p-4 font-semibold text-foreground">{r.id}</td>
                <td className="p-4 text-foreground">{r.period}</td>
                <td className="p-4 text-foreground">{r.employees}</td>
                <td className="p-4 text-foreground">{r.gross}</td>
                <td className="p-4 text-muted-foreground">{r.date}</td>
                <td className="p-4"><span className={cn('inline-flex rounded-md px-2.5 py-1 text-[10.5px] font-bold uppercase', STATUS_COLOR[r.status])}>{r.status}</span></td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button className="h-8 w-8 grid place-items-center rounded-lg bg-secondary hover:bg-secondary/70"><Play className="h-4 w-4" /></button>
                    <button className="h-8 w-8 grid place-items-center rounded-lg bg-secondary hover:bg-secondary/70"><Download className="h-4 w-4" /></button>
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

export const PayslipsPage = () => {
  const { user } = useAuth();
  const isEmployee = user?.role === 'employee';
  return (
    <div>
      <h1 className="text-[30px] font-bold text-foreground">{isEmployee ? 'My Payslips' : 'Payslips'}</h1>
      <p className="mt-1 text-[13.5px] text-muted-foreground">{isEmployee ? 'Download your monthly payslips.' : 'Generated payslips across the organization.'}</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="text-[12px] text-muted-foreground">Latest Gross</div>
          <div className="mt-1 text-[26px] font-bold text-foreground">$4,500.00</div>
          <div className="text-[11.5px] text-muted-foreground">April 2025</div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="text-[12px] text-muted-foreground">Deductions</div>
          <div className="mt-1 text-[26px] font-bold text-foreground">$720.00</div>
          <div className="text-[11.5px] text-muted-foreground">Tax + Insurance</div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="text-[12px] text-muted-foreground">Net Pay</div>
          <div className="mt-1 text-[26px] font-bold text-primary">$3,780.00</div>
          <div className="text-[11.5px] text-muted-foreground">Deposited to BCA • •1234</div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-card divide-y divide-border">
        {SLIPS.map((s) => (
          <div key={s.id} className="flex items-center gap-4 p-4 hover:bg-secondary/40">
            <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary grid place-items-center"><FileText className="h-5 w-5" /></div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-semibold text-foreground">{s.period}</div>
              <div className="text-[12px] text-muted-foreground">{s.id} • Issued {s.date}</div>
            </div>
            <div className="hidden sm:block text-right">
              <div className="text-[12.5px] text-muted-foreground">Net</div>
              <div className="text-[14px] font-bold text-foreground">{s.net}</div>
            </div>
            <span className={cn('inline-flex rounded-md px-2.5 py-1 text-[10.5px] font-bold uppercase', STATUS_COLOR[s.status])}>{s.status}</span>
            <button className="inline-flex items-center gap-2 h-9 rounded-lg border border-border bg-card hover:bg-secondary px-3 text-[12.5px] font-semibold"><Download className="h-4 w-4" /> Download</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const TimeOffBalancePage = () => (
  <div>
    <h1 className="text-[30px] font-bold text-foreground">Leave Balance</h1>
    <p className="mt-1 text-[13.5px] text-muted-foreground">Your available time-off balances for this year.</p>

    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { l: 'Annual Leave', used: 4, total: 20, color: '#0DA56E' },
        { l: 'Sick Leave', used: 2, total: 14, color: '#F5B500' },
        { l: 'Personal', used: 0, total: 6, color: '#3B82F6' },
        { l: 'Unpaid', used: 0, total: 30, color: '#64748B' },
      ].map((b) => {
        const pct = Math.min(100, (b.used / b.total) * 100);
        return (
          <div key={b.l} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[12px] text-muted-foreground">{b.l}</div>
                <div className="mt-1 text-[26px] font-bold text-foreground">{b.total - b.used}<span className="text-[13px] text-muted-foreground font-medium"> / {b.total}</span></div>
              </div>
              <div className="h-10 w-10 rounded-xl grid place-items-center" style={{ backgroundColor: `${b.color}22`, color: b.color }}><Clock className="h-5 w-5" /></div>
            </div>
            <div className="mt-4 h-2 rounded-full bg-secondary overflow-hidden">
              <div className="h-full" style={{ width: `${pct}%`, backgroundColor: b.color }} />
            </div>
            <div className="mt-2 text-[11.5px] text-muted-foreground">{b.used} used / {b.total} days</div>
          </div>
        );
      })}
    </div>

    <div className="mt-6 rounded-2xl border border-border bg-card p-6">
      <h3 className="text-[16px] font-bold text-foreground">Upcoming</h3>
      <div className="mt-4 space-y-3">
        {[
          { t: 'Annual Leave', d: '03 May — 07 May', days: 5, approved: true },
          { t: 'Sick Leave', d: '12 Jun', days: 1, approved: false },
        ].map((u, i) => (
          <div key={i} className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
            <div>
              <div className="text-[13.5px] font-semibold text-foreground">{u.t}</div>
              <div className="text-[12px] text-muted-foreground">{u.d} • {u.days} days</div>
            </div>
            <span className={cn('inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[10.5px] font-bold uppercase', u.approved ? STATUS_COLOR.Paid : STATUS_COLOR.Processing)}>
              {u.approved ? <><CheckCircle2 className="h-3 w-3" /> Approved</> : <><Clock className="h-3 w-3" /> Pending</>}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);
