import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Users, Briefcase, Plus, Minus, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { STATS, TEAM_PERFORMANCE, DEPARTMENT_BREAKDOWN, EMPLOYEES, OFFICES, JOB_TITLES, STATUSES, STATUS_COLORS } from '@/data/mock';
import { Link } from 'react-router-dom';

const iconMap = { users: Users, briefcase: Briefcase, plus: Plus, minus: Minus };

const StatCard = ({ stat }) => {
  const Icon = iconMap[stat.icon];
  const Up = stat.trend === 'up';
  return (
    <div className="flex flex-col gap-3">
      <div className="h-11 w-11 rounded-full bg-secondary grid place-items-center text-muted-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex items-center gap-3">
        <div className="text-[28px] font-bold tracking-tight text-foreground">{stat.value}</div>
        <span
          className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${
            Up ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
          }`}
        >
          {Up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {stat.change}
        </span>
      </div>
      <div className="text-[13px] text-muted-foreground">{stat.label}</div>
    </div>
  );
};

const DonutChart = ({ data }) => {
  const total = data.reduce((s, d) => s + d.value, 0);
  const size = 180;
  const stroke = 22;
  const radius = (size - stroke) / 2;
  const cx = size / 2, cy = size / 2;
  let offset = 0;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={cx} cy={cy} r={radius} stroke="hsl(var(--secondary))" strokeWidth={stroke} fill="none" />
        {data.map((d, i) => {
          const len = (d.value / total) * circumference;
          const dash = `${len} ${circumference - len}`;
          const el = (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={radius}
              stroke={d.color}
              strokeWidth={stroke}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={dash}
              strokeDashoffset={-offset}
            />
          );
          offset += len + 6;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-[22px] font-bold text-foreground">121</div>
          <div className="text-[11px] text-muted-foreground">Total Emp.</div>
        </div>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-[26px] font-bold text-foreground">Hi, {user?.firstName || 'Pristia'}</h1>
        <p className="text-[13.5px] text-muted-foreground mt-1">This is your HR report so far</p>
      </div>

      {/* Top row: stats + chart */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <div className="xl:col-span-2 rounded-2xl border border-border bg-card p-6">
          <div className="grid grid-cols-2 gap-x-4 gap-y-6">
            {STATS.map((s) => (
              <StatCard key={s.label} stat={s} />
            ))}
          </div>
        </div>

        <div className="xl:col-span-3 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-[17px] font-bold text-foreground">Team Performance</h3>
              <div className="mt-3 flex items-center gap-5 text-[12px]">
                <span className="inline-flex items-center gap-2 text-muted-foreground"><span className="h-2 w-2 rounded-full bg-primary" />Project Team</span>
                <span className="inline-flex items-center gap-2 text-muted-foreground"><span className="h-2 w-2 rounded-full bg-amber-400" />Product Team</span>
              </div>
            </div>
            <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-1.5 text-[12.5px] text-foreground hover:bg-secondary">
              Last 7 month <Calendar className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TEAM_PERFORMANCE} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v/1000}k`} domain={[30000, 60000]} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="project" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="product" stroke="#F5B500" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Second row: employee list + donut */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <div className="xl:col-span-3 rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h3 className="text-[17px] font-bold text-foreground">Employees</h3>
            <div className="relative">
              <input placeholder="Search employee" className="h-10 w-64 rounded-xl bg-background border border-border pl-4 pr-10 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {[OFFICES, JOB_TITLES, STATUSES].map((arr, idx) => (
              <select key={idx} className="h-10 w-full rounded-xl border border-border bg-background px-3 text-[13px] text-foreground">
                {arr.map((o) => <option key={o}>{o}</option>)}
              </select>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead className="text-primary">
                <tr className="text-left">
                  <th className="py-2 font-medium">Employee Name</th>
                  <th className="py-2 font-medium">Job Title</th>
                  <th className="py-2 font-medium">Line Manager</th>
                  <th className="py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {EMPLOYEES.slice(0, 5).map((e) => (
                  <tr key={e.id}>
                    <td className="py-3">
                      <Link to={`/employees/${e.id}`} className="flex items-center gap-3 hover:text-primary">
                        {e.avatar ? (
                          <img src={e.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center text-[11px] font-semibold">{e.firstName[0]}{e.lastName[0]}</div>
                        )}
                        <div>
                          <div className="font-semibold text-foreground">{e.name}</div>
                          <div className="text-[12px] text-muted-foreground">{e.email}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="py-3 text-foreground">{e.title}</td>
                    <td className="py-3 text-foreground">{e.handle}</td>
                    <td className="py-3"><span className={`inline-flex items-center rounded-md px-2 py-1 text-[10.5px] font-semibold uppercase ${STATUS_COLORS[e.status]}`}>{e.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="xl:col-span-2 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[17px] font-bold text-foreground">Total Employee</h3>
            <select className="h-8 rounded-lg bg-transparent border-0 text-[12px] text-muted-foreground focus:outline-none"><option>All Time</option><option>This Year</option></select>
          </div>
          <div className="flex items-center justify-center py-4">
            <DonutChart data={DEPARTMENT_BREAKDOWN} />
          </div>
          <div className="mt-4 space-y-3">
            {DEPARTMENT_BREAKDOWN.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-2 text-foreground">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  {d.name}
                </div>
                <div className="font-semibold text-foreground">{d.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
