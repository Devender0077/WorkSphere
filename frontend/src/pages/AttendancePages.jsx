import React, { useMemo, useState } from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Clock, LogIn, LogOut, Calendar as CalIcon, Check, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const DAILY = [
  { emp: 'Pristia Candra', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face', in: '08:05', out: '17:30', hours: 9.4, status: 'On Time' },
  { emp: 'Hanna Baptista', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face', in: '09:22', out: '18:10', hours: 8.8, status: 'Late' },
  { emp: 'Rayna Torff', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face', in: '08:00', out: '17:00', hours: 9.0, status: 'On Time' },
  { emp: 'James George', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', in: '—', out: '—', hours: 0, status: 'Absent' },
  { emp: 'Alena Saris', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face', in: '08:30', out: '17:45', hours: 9.25, status: 'On Time' },
];

const MONTH = [
  { day: 'Mon', hours: 8.4, overtime: 0.5 },
  { day: 'Tue', hours: 9.1, overtime: 1.0 },
  { day: 'Wed', hours: 8.7, overtime: 0.2 },
  { day: 'Thu', hours: 9.3, overtime: 1.2 },
  { day: 'Fri', hours: 8.5, overtime: 0 },
  { day: 'Sat', hours: 2.0, overtime: 0 },
  { day: 'Sun', hours: 0, overtime: 0 },
];

const STATUS_COLOR = {
  'On Time': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'Late': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'Absent': 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
};

export const AttendanceDailyPage = () => {
  const [clocked, setClocked] = useState(false);
  const total = DAILY.length;
  const onTime = DAILY.filter((d) => d.status === 'On Time').length;
  const late = DAILY.filter((d) => d.status === 'Late').length;
  const absent = DAILY.filter((d) => d.status === 'Absent').length;
  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[30px] font-bold text-foreground">Daily Attendance</h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">Today, {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <button onClick={() => setClocked(!clocked)} className={cn('inline-flex items-center gap-2 h-11 rounded-xl px-5 text-[13.5px] font-semibold text-white', clocked ? 'bg-rose-500' : 'bg-primary hover:bg-primary/90')}>
          {clocked ? <><LogOut className="h-4 w-4" /> Clock Out</> : <><LogIn className="h-4 w-4" /> Clock In</>}
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { l: 'Total', v: total, Icon: Clock, cls: 'text-foreground' },
          { l: 'On Time', v: onTime, Icon: Check, cls: 'text-emerald-600' },
          { l: 'Late', v: late, Icon: AlertCircle, cls: 'text-amber-600' },
          { l: 'Absent', v: absent, Icon: X, cls: 'text-rose-600' },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-muted-foreground"><s.Icon className="h-4 w-4" /><span className="text-[12px]">{s.l}</span></div>
            <div className={cn('mt-2 text-[28px] font-bold', s.cls)}>{s.v}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-[13px] min-w-[780px]">
          <thead className="border-b border-border">
            <tr className="text-left text-primary">
              <th className="p-4 font-semibold">Employee</th>
              <th className="p-4 font-semibold">Clock In</th>
              <th className="p-4 font-semibold">Clock Out</th>
              <th className="p-4 font-semibold">Hours</th>
              <th className="p-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {DAILY.map((d) => (
              <tr key={d.emp} className="hover:bg-secondary/40">
                <td className="p-4"><div className="flex items-center gap-3"><img src={d.avatar} alt="" className="h-8 w-8 rounded-full object-cover" /><div className="font-semibold text-foreground">{d.emp}</div></div></td>
                <td className="p-4 text-foreground">{d.in}</td>
                <td className="p-4 text-foreground">{d.out}</td>
                <td className="p-4 text-foreground">{d.hours > 0 ? `${d.hours}h` : '—'}</td>
                <td className="p-4"><span className={cn('inline-flex rounded-md px-2.5 py-1 text-[10.5px] font-bold uppercase', STATUS_COLOR[d.status])}>{d.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AttendanceReportsPage = () => {
  const totalHours = useMemo(() => MONTH.reduce((s, d) => s + d.hours + d.overtime, 0).toFixed(1), []);
  return (
    <div>
      <h1 className="text-[30px] font-bold text-foreground">Attendance Reports</h1>
      <p className="mt-1 text-[13.5px] text-muted-foreground">This week overview.</p>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-5">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[17px] font-bold text-foreground">Hours This Week</h3>
            <span className="text-[12.5px] text-muted-foreground">Total: <span className="font-bold text-foreground">{totalHours}h</span></span>
          </div>
          <div className="h-[280px] mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTH} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="hours" stackId="a" fill="hsl(var(--primary))" radius={[0, 0, 0, 0]} />
                <Bar dataKey="overtime" stackId="a" fill="#F5B500" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex items-center gap-5 text-[12px] text-muted-foreground">
            <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-primary" />Regular hours</span>
            <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-400" />Overtime</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 min-w-[260px]">
          <div className="text-[13px] text-muted-foreground">Avg. arrival time</div>
          <div className="mt-1 text-[28px] font-bold text-foreground">08:24 AM</div>
          <div className="mt-4 text-[13px] text-muted-foreground">Punctuality</div>
          <div className="mt-1 flex items-end gap-2"><div className="text-[28px] font-bold text-foreground">92%</div><span className="text-emerald-600 text-[12px] font-semibold mb-1">+3%</span></div>
          <div className="mt-4 text-[13px] text-muted-foreground">Absent rate</div>
          <div className="mt-1 text-[28px] font-bold text-foreground">4.5%</div>
        </div>
      </div>
    </div>
  );
};
