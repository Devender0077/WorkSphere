import React, { useState } from 'react';
import { ChevronDown, Pencil, Trash2, Check, Calendar, Target, Search, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const EMPLOYEES = [
  { id: 'e1', name: 'Jennifer Law', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face', join: '23 Feb, 2023', pct: 10, done: 1, total: 10, color: 'rose' },
  { id: 'e2', name: 'Gustavo Lubin', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', join: '23 Feb, 2023', pct: 50, done: 5, total: 10, color: 'amber' },
  { id: 'e3', name: 'Miracle Kenter', avatar: null, initials: 'MK', join: '23 Feb, 2023', pct: 70, done: 7, total: 10, color: 'emerald' },
];

const TASKS = [
  { title: 'Welcome and introduce new employee to the team', due: '24 Mar 2023', assignee: 'Jennifer Law', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face', done: true },
  { title: 'Prepare company welcome kit', due: '21 Jan 2023', assignee: 'Dulce Philips', initials: 'DP', done: false },
  { title: 'Upload signed work contract', due: '10 Apr 2023', assignee: 'Miracle Franci', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face', done: false },
  { title: 'Prepare Workstation', due: '10 Apr 2023', assignee: 'Davis Curtis', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', done: false },
  { title: 'Submit Document - Soft copy of ID card', due: '10 Apr 2023', assignee: 'Gretchen Philips', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face', done: false },
  { title: 'Collect Documents - Hard Copies', due: '10 Apr 2023', assignee: 'Charlie Torff', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop&crop=face', done: false },
  { title: 'Be on time and ready for your first day', due: '10 Apr 2023', assignee: 'Justin Calzoni', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face', done: false },
  { title: 'Enjoy lunch with your team', due: '10 Apr 2023', assignee: 'Marcus Geidt', initials: 'MG', done: false },
  { title: 'Provide your Home Address', due: '10 Apr 2023', assignee: 'Ann Bator', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face', done: false },
  { title: 'Provide your Emergency Contact', due: '10 Apr 2023', assignee: 'Madelyn Lipshutz', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face', done: false },
];

const COLOR = { rose: 'bg-rose-500', amber: 'bg-amber-500', emerald: 'bg-emerald-500' };

export const OnboardingChecklistPage = ({ title = 'Checklist - To Dos', description = 'These are some of the tasks that must be completed' }) => {
  const [expanded, setExpanded] = useState('e1');
  const [tasks, setTasks] = useState(TASKS);
  const toggle = (i) => setTasks(tasks.map((t, idx) => idx === i ? { ...t, done: !t.done } : t));
  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[30px] font-bold text-foreground">{title}</h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="h-11 rounded-xl border border-border bg-card px-4 text-[13px]"><option>Unpixel Office</option><option>Unpixel Studio</option></select>
          <select className="h-11 rounded-xl border border-border bg-card px-4 text-[13px]"><option>In Progress</option><option>Completed</option></select>
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><input placeholder="Search what you need" className="w-60 h-11 rounded-xl border border-border bg-card pl-10 pr-3 text-[13px]" /></div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {EMPLOYEES.map((e) => {
          const open = expanded === e.id;
          return (
            <div key={e.id} className="rounded-2xl border border-border bg-card overflow-hidden">
              <button onClick={() => setExpanded(open ? null : e.id)} className="w-full px-5 py-4 flex items-center gap-4 hover:bg-secondary/40">
                <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform', open && 'rotate-180')} />
                {e.avatar ? <img src={e.avatar} alt="" className="h-10 w-10 rounded-full object-cover" /> : <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center text-[12px] font-bold">{e.initials}</div>}
                <div className="flex-1 text-left">
                  <div className="text-[15px] font-bold text-foreground">{e.name}</div>
                  <div className="text-[12.5px] text-muted-foreground">Join Date : {e.join}</div>
                </div>
                <div className="hidden md:flex items-center gap-3">
                  <div className="h-1.5 w-28 bg-secondary rounded-full overflow-hidden"><div className={cn('h-full', COLOR[e.color])} style={{ width: `${e.pct}%` }} /></div>
                  <div className="text-[13px] font-semibold text-foreground">{e.pct}%</div>
                  <div className="text-[12.5px] text-muted-foreground">{e.done}/{e.total} Completed</div>
                </div>
                <span className="h-9 w-9 grid place-items-center rounded-lg bg-sky-500 text-white"><Pencil className="h-4 w-4" /></span>
              </button>
              {open && (
                <div className="border-t border-border">
                  <div className="grid grid-cols-[1fr_140px_200px_120px] gap-3 px-5 py-3 text-[12px] font-semibold text-muted-foreground border-b border-border">
                    <span>Task</span><span>Due Date</span><span>Assignee</span><span className="text-right">Action</span>
                  </div>
                  {tasks.map((t, i) => (
                    <div key={i} className="grid grid-cols-[1fr_140px_200px_120px] gap-3 items-center px-5 py-3 border-b border-border last:border-0 hover:bg-secondary/30">
                      <button onClick={() => toggle(i)} className="flex items-center gap-3 text-left">
                        <span className={cn('h-5 w-5 rounded-md grid place-items-center border-2 transition-colors', t.done ? 'bg-primary border-primary text-white' : 'border-border')}>
                          {t.done && <Check className="h-3 w-3" />}
                        </span>
                        <span className={cn('text-[13.5px]', t.done ? 'line-through text-muted-foreground' : 'text-foreground')}>{t.title}</span>
                      </button>
                      <span className="inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground"><Calendar className="h-3.5 w-3.5" /> {t.due}</span>
                      <span className="inline-flex items-center gap-2 text-[12.5px] text-foreground">
                        {t.avatar ? <img src={t.avatar} alt="" className="h-6 w-6 rounded-full object-cover" /> : <span className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center text-[10px] font-bold">{t.initials}</span>}
                        {t.assignee}
                      </span>
                      <div className="flex items-center justify-end gap-1.5">
                        <button className={cn('h-8 w-8 grid place-items-center rounded-lg text-white', t.done ? 'bg-emerald-500' : 'bg-sky-500')}>{t.done ? <Target className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}</button>
                        <button className="h-8 w-8 grid place-items-center rounded-lg bg-rose-500 text-white"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const TodosPage = () => <OnboardingChecklistPage title="Checklist - To Dos" description="Tasks assigned to you across the team." />;
export const OffboardingChecklistPage = () => <OnboardingChecklistPage title="Checklist - Offboarding" description="Manage offboarding tasks for leaving employees." />;

export const ChecklistSettingPage = () => {
  const templates = [
    { name: 'Standard Onboarding', tasks: 10, color: 'bg-primary' },
    { name: 'Fast-track Engineer Onboarding', tasks: 7, color: 'bg-sky-500' },
    { name: 'Offboarding - Voluntary', tasks: 8, color: 'bg-amber-500' },
    { name: 'Offboarding - Involuntary', tasks: 6, color: 'bg-rose-500' },
  ];
  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[30px] font-bold text-foreground">Checklist Templates</h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">Define reusable onboarding & offboarding checklists.</p>
        </div>
        <button className="inline-flex items-center gap-2 h-11 rounded-xl bg-[hsl(var(--navy))] px-4 text-[13.5px] font-semibold text-white hover:opacity-90"><Plus className="h-4 w-4" /> New Template</button>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {templates.map((t) => (
          <div key={t.name} className="rounded-2xl border border-border bg-card p-5">
            <div className={cn('h-10 w-10 rounded-xl grid place-items-center text-white', t.color)}><Target className="h-5 w-5" /></div>
            <div className="mt-3 text-[15px] font-bold text-foreground">{t.name}</div>
            <div className="text-[12.5px] text-muted-foreground">{t.tasks} tasks</div>
            <div className="mt-4 flex items-center gap-2">
              <button className="flex-1 h-10 rounded-xl border border-border bg-card hover:bg-secondary text-[12.5px] font-semibold">Edit</button>
              <button className="h-10 rounded-xl bg-primary text-white px-3 text-[12.5px] font-semibold">Assign</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
