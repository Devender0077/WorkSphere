import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Check, AlertCircle, X, Clock, Calendar as CalIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Generate mock attendance entries for current month
const generateEntries = (year, month) => {
  const days = new Date(year, month + 1, 0).getDate();
  const entries = {};
  for (let d = 1; d <= days; d++) {
    const date = new Date(year, month, d);
    const dow = date.getDay();
    if (dow === 0 || dow === 6) { entries[d] = { status: 'weekend' }; continue; }
    if (d > new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) { entries[d] = { status: 'upcoming' }; continue; }
    const rand = (d * 17 + month * 3) % 10;
    if (rand < 7) entries[d] = { status: 'ontime', in: '08:0' + (rand % 9), out: '17:3' + (rand % 9), hours: 9 + (rand / 10) };
    else if (rand < 9) entries[d] = { status: 'late', in: '09:2' + rand, out: '18:1' + rand, hours: 8.5 };
    else entries[d] = { status: 'absent' };
  }
  return entries;
};

const STATUS_META = {
  ontime: { color: 'bg-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-700 dark:text-emerald-300', label: 'On Time', Icon: Check },
  late: { color: 'bg-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-700 dark:text-amber-300', label: 'Late', Icon: AlertCircle },
  absent: { color: 'bg-rose-500', bg: 'bg-rose-50 dark:bg-rose-950/30', text: 'text-rose-700 dark:text-rose-300', label: 'Absent', Icon: X },
  weekend: { color: 'bg-slate-300 dark:bg-slate-700', bg: 'bg-secondary/50', text: 'text-muted-foreground', label: 'Weekend', Icon: null },
  upcoming: { color: 'bg-slate-200 dark:bg-slate-800', bg: 'bg-background', text: 'text-muted-foreground', label: 'Upcoming', Icon: null },
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const MonthView = ({ year, month, entries, onSelect }) => {
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7; // Mon=0
  const days = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      <div className="grid grid-cols-7 gap-2 mb-2">
        {DOW.map((d) => <div key={d} className="text-[11px] font-bold uppercase text-muted-foreground text-center">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {cells.map((c, i) => {
          if (!c) return <div key={i} />;
          const e = entries[c];
          const meta = e ? STATUS_META[e.status] : null;
          const isToday = new Date().getFullYear() === year && new Date().getMonth() === month && new Date().getDate() === c;
          return (
            <button
              key={i}
              onClick={() => e && e.status !== 'weekend' && e.status !== 'upcoming' && onSelect({ day: c, ...e })}
              className={cn(
                'relative rounded-xl border p-2 sm:p-3 min-h-[60px] sm:min-h-[88px] text-left transition-colors',
                isToday ? 'border-primary shadow-sm shadow-primary/20' : 'border-border',
                meta ? meta.bg : 'bg-background',
                e && e.status !== 'weekend' && e.status !== 'upcoming' ? 'hover:border-primary/50 cursor-pointer' : 'cursor-default'
              )}
              data-testid={`cal-day-${c}`}
            >
              <div className={cn('text-[13px] font-bold', isToday ? 'text-primary' : meta?.text || 'text-foreground')}>{c}</div>
              {e && e.in && (
                <div className="hidden sm:block mt-2 space-y-0.5 text-[10.5px] text-muted-foreground">
                  <div>In: <span className="font-semibold text-foreground">{e.in}</span></div>
                  <div>Out: <span className="font-semibold text-foreground">{e.out}</span></div>
                </div>
              )}
              {meta && e.status !== 'upcoming' && (
                <span className={cn('absolute bottom-1.5 right-1.5 h-1.5 w-1.5 rounded-full', meta.color)} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const WeekView = ({ year, month, weekStart, entries, onSelect }) => {
  const week = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(year, month, weekStart + i);
    week.push(d);
  }
  const hours = Array.from({ length: 12 }, (_, i) => i + 7); // 07:00-18:00

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[720px] grid grid-cols-[60px_repeat(7,1fr)] gap-px bg-border rounded-xl overflow-hidden">
        <div className="bg-card p-2 text-[11px] font-bold uppercase text-muted-foreground">Time</div>
        {week.map((d, i) => {
          const isToday = new Date().toDateString() === d.toDateString();
          return (
            <div key={i} className={cn('bg-card p-2 text-center', isToday && 'bg-primary/5')}>
              <div className="text-[11px] uppercase font-bold text-muted-foreground">{DOW[i]}</div>
              <div className={cn('text-[16px] font-bold mt-0.5', isToday ? 'text-primary' : 'text-foreground')}>{d.getDate()}</div>
            </div>
          );
        })}
        {hours.map((h) => (
          <React.Fragment key={h}>
            <div className="bg-card p-2 text-[11px] font-semibold text-muted-foreground">{String(h).padStart(2, '0')}:00</div>
            {week.map((d, i) => {
              const dayNum = d.getMonth() === month ? d.getDate() : null;
              const e = dayNum ? entries[dayNum] : null;
              const inH = e?.in ? parseInt(e.in.split(':')[0]) : null;
              const outH = e?.out ? parseInt(e.out.split(':')[0]) : null;
              const active = e && e.in && h >= inH && h < outH;
              const meta = e ? STATUS_META[e.status] : null;
              return (
                <button
                  key={i}
                  onClick={() => e && e.in && onSelect({ day: dayNum, ...e })}
                  className={cn('bg-card min-h-[40px] border-0 relative', active && meta && meta.bg, active && 'hover:opacity-80')}
                >
                  {active && <span className={cn('absolute inset-1 rounded-md', meta.color, 'opacity-80')} />}
                  {active && h === inH && (
                    <span className="relative z-10 text-[10px] font-bold text-white">{e.in}</span>
                  )}
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const AttendanceCalendarPage = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [view, setView] = useState('month');
  const [weekStart, setWeekStart] = useState(today.getDate() - ((today.getDay() + 6) % 7));
  const [selected, setSelected] = useState(null);

  const entries = useMemo(() => generateEntries(year, month), [year, month]);
  const stats = useMemo(() => {
    const s = { ontime: 0, late: 0, absent: 0, total: 0 };
    Object.values(entries).forEach((e) => {
      if (e.status === 'ontime') s.ontime++;
      else if (e.status === 'late') s.late++;
      else if (e.status === 'absent') s.absent++;
      if (['ontime', 'late', 'absent'].includes(e.status)) s.total++;
    });
    return s;
  }, [entries]);

  const prevMonth = () => {
    if (month === 0) { setYear(year - 1); setMonth(11); } else setMonth(month - 1);
    setWeekStart(1);
  };
  const nextMonth = () => {
    if (month === 11) { setYear(year + 1); setMonth(0); } else setMonth(month + 1);
    setWeekStart(1);
  };

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-foreground">Attendance Calendar</h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">Track your attendance across days and weeks</p>
        </div>
        <div className="inline-flex rounded-xl bg-secondary p-1">
          <button onClick={() => setView('month')} className={cn('px-4 py-1.5 rounded-lg text-[12.5px] font-semibold', view === 'month' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground')} data-testid="attendance-view-month">Month</button>
          <button onClick={() => setView('week')} className={cn('px-4 py-1.5 rounded-lg text-[12.5px] font-semibold', view === 'week' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground')} data-testid="attendance-view-week">Week</button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {[
          { l: 'Working days', v: stats.total, cls: 'text-foreground' },
          { l: 'On Time', v: stats.ontime, cls: 'text-emerald-600' },
          { l: 'Late', v: stats.late, cls: 'text-amber-600' },
          { l: 'Absent', v: stats.absent, cls: 'text-rose-600' },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl border border-border bg-card p-4 sm:p-5">
            <div className="text-[11.5px] sm:text-[12px] text-muted-foreground">{s.l}</div>
            <div className={cn('mt-1 text-[22px] sm:text-[28px] font-bold', s.cls)}>{s.v}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-card p-4 sm:p-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button onClick={prevMonth} className="h-9 w-9 grid place-items-center rounded-lg border border-border bg-card hover:bg-secondary" data-testid="cal-prev-btn"><ChevronLeft className="h-4 w-4" /></button>
            <div className="text-[17px] font-bold text-foreground min-w-[180px] text-center">{MONTHS[month]} {year}</div>
            <button onClick={nextMonth} className="h-9 w-9 grid place-items-center rounded-lg border border-border bg-card hover:bg-secondary" data-testid="cal-next-btn"><ChevronRight className="h-4 w-4" /></button>
            <button onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth()); }} className="ml-2 h-9 rounded-lg border border-border bg-card hover:bg-secondary px-3 text-[12.5px] font-semibold">Today</button>
          </div>
          <div className="flex items-center gap-4 flex-wrap text-[11.5px]">
            {[['On Time', STATUS_META.ontime.color], ['Late', STATUS_META.late.color], ['Absent', STATUS_META.absent.color]].map(([l, c]) => (
              <span key={l} className="inline-flex items-center gap-1.5 text-muted-foreground"><span className={cn('h-2 w-2 rounded-full', c)} />{l}</span>
            ))}
          </div>
        </div>
        <div className="mt-5">
          {view === 'month'
            ? <MonthView year={year} month={month} entries={entries} onSelect={setSelected} />
            : <WeekView year={year} month={month} weekStart={weekStart} entries={entries} onSelect={setSelected} />
          }
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-bold text-foreground">{MONTHS[month]} {selected.day}, {year}</h3>
              <button onClick={() => setSelected(null)} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-secondary"><X className="h-4 w-4" /></button>
            </div>
            <div className={cn('mt-3 inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold uppercase', STATUS_META[selected.status].bg, STATUS_META[selected.status].text)}>{STATUS_META[selected.status].label}</div>
            {selected.in && (
              <div className="mt-5 grid grid-cols-3 gap-3">
                <Stat label="Clock In" value={selected.in} />
                <Stat label="Clock Out" value={selected.out} />
                <Stat label="Hours" value={`${selected.hours?.toFixed?.(1) ?? selected.hours}h`} />
              </div>
            )}
            <div className="mt-5 text-[12.5px] text-muted-foreground">Notes: Standard 9-hour shift with 1 hour break.</div>
          </div>
        </div>
      )}
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div className="rounded-xl border border-border bg-background p-3">
    <div className="text-[11px] text-muted-foreground">{label}</div>
    <div className="mt-0.5 text-[15px] font-bold text-foreground">{value}</div>
  </div>
);

export default AttendanceCalendarPage;
