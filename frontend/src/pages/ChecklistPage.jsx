import React, { useState } from 'react';
import { Plus, CheckSquare, Square, Clock, CalendarDays, Flag, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

const SEED = [
  { id: 1, title: 'Finalize onboarding docs for new hires', due: 'Today', priority: 'High', done: false, tag: 'Onboarding' },
  { id: 2, title: 'Review Q2 performance goals', due: 'Tomorrow', priority: 'Medium', done: false, tag: 'Performance' },
  { id: 3, title: 'Approve pending time-off requests', due: 'Fri 25 Apr', priority: 'High', done: true, tag: 'Time Off' },
  { id: 4, title: 'Update employee handbook v2.1', due: 'Next week', priority: 'Low', done: false, tag: 'Policy' },
  { id: 5, title: 'Send birthday greetings', due: 'Today', priority: 'Low', done: true, tag: 'Culture' },
];

const PRIO_COLOR = {
  High: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Low: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
};

const ChecklistPage = ({ title = 'My Tasks', description = 'Track your personal HR tasks.' }) => {
  const [list, setList] = useState(SEED);
  const [filter, setFilter] = useState('All');
  const [newTitle, setNewTitle] = useState('');

  const toggle = (id) => setList(list.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const add = () => {
    if (!newTitle.trim()) return;
    setList([{ id: Date.now(), title: newTitle, due: 'Today', priority: 'Medium', done: false, tag: 'General' }, ...list]);
    setNewTitle('');
  };

  const visible = list.filter((t) => filter === 'All' ? true : filter === 'Active' ? !t.done : t.done);
  const done = list.filter((t) => t.done).length;

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[30px] font-bold text-foreground">{title}</h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">{description}</p>
        </div>
        <div className="inline-flex rounded-xl bg-secondary p-1">
          {['All', 'Active', 'Done'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={cn('px-4 py-1.5 rounded-lg text-[13px] font-semibold', filter === f ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground')}>{f}</button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total', value: list.length, color: 'text-foreground' },
          { label: 'In Progress', value: list.filter((t) => !t.done).length, color: 'text-amber-600' },
          { label: 'Completed', value: done, color: 'text-primary' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
            <div className="text-[12px] text-muted-foreground">{s.label}</div>
            <div className={cn('mt-2 text-[28px] font-bold', s.color)}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} placeholder="Add a new task…" className="flex-1 h-12 rounded-xl border border-border bg-card px-4 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        <button onClick={add} className="inline-flex items-center gap-2 h-12 rounded-xl bg-[hsl(var(--navy))] px-5 text-[13.5px] font-semibold text-white hover:opacity-90"><Plus className="h-4 w-4" /> Add Task</button>
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-card divide-y divide-border">
        {visible.map((t) => (
          <div key={t.id} className="flex items-center gap-4 p-4 hover:bg-secondary/40">
            <button onClick={() => toggle(t.id)} className="text-primary">
              {t.done ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5 text-muted-foreground" />}
            </button>
            <div className="flex-1 min-w-0">
              <div className={cn('text-[14px] font-semibold truncate', t.done ? 'line-through text-muted-foreground' : 'text-foreground')}>{t.title}</div>
              <div className="mt-1 flex items-center gap-3 text-[11.5px] text-muted-foreground">
                <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> {t.due}</span>
                <span className="inline-flex items-center gap-1"><Flag className="h-3.5 w-3.5" /> {t.tag}</span>
              </div>
            </div>
            <span className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-[10.5px] font-bold uppercase', PRIO_COLOR[t.priority])}>{t.priority}</span>
            <button className="h-8 w-8 grid place-items-center rounded-lg hover:bg-secondary text-muted-foreground"><MoreHorizontal className="h-4 w-4" /></button>
          </div>
        ))}
        {visible.length === 0 && <div className="p-10 text-center text-muted-foreground">No tasks.</div>}
      </div>
    </div>
  );
};

export default ChecklistPage;
